import { query } from '../../config/db.js';
import pool from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


//USER ROUTES

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers =async (req, res) => {
    const result = await query(`
        SELECT 
            u.id,
            u.email,
            u.name,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', r.id,
                        'name', r.name
                    )
                ) FILTER (WHERE r.id IS NOT NULL),
                '[]'::json
            ) AS roles
        FROM "User" u
        LEFT JOIN "_UserRoles" ur ON ur."B" = u.id
        LEFT JOIN "Role" r ON r.id = ur."A"
        GROUP BY u.id
        ORDER BY u.id ASC;
    `);

    const users = result.rows

    if (!users.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No users found'})
    }

    res.json(users);
}

//@desc Get a user
//@route GET /users/:id
//@access Private
const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'User ID required' });

    const result = await query(`
        SELECT 
            u.id,
            u.email,
            u.name,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', r.id,
                        'name', r.name
                    )
                ) FILTER (WHERE r.id IS NOT NULL),
                '[]'::json
            ) AS roles
        FROM "User" u        
        LEFT JOIN "_UserRoles" ur ON ur."B" = u.id
        LEFT JOIN "Role" r ON r.id = ur."A"
        WHERE u.id = $1
        GROUP BY u.id
        LIMIT 1;        
    `, [Number(id)]);

    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'No user found' });

    res.json(user);
}

//@desc Get user of requesting website
//@route GET /users/provider
//@access Public

const getPortfolioUser =async (req, res) => {
    const publicId = req.headers['x-user-uuid'];
    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const result = await query('SELECT "id", "name", "email" FROM "User" WHERE "publicId"=$1 LIMIT 1', [publicId]);
    const user = result.rows[0];

    if (!user) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No user found'})
    }
    res.json(user);
}

//@desc Create new user
//@route POST /users
//@access Private
const addUser = async (req, res, next) => {

    const { name, email, password, roles } = req.body;

    //NB validate before making db query
    if (!name || !email || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields Required"});
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const publicId = uuidv4();

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const columnsArray = ['name', 'email', 'password', 'publicId'];
        const values = [name, email.toLowerCase(), hashedPwd, publicId];
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');
       
        const result = await client.query(
            `INSERT INTO "User" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        const user = result.rows[0];
        
        const rolePlaceholders = roles.map((_, i) => `($1, $${i + 2})`).join(', ')
        await client.query(                
            `INSERT INTO "_UserRoles" ("B", "A") VALUES ${rolePlaceholders}`,
            [Number(user.id), ...roles.map(Number)]
        );

        await client.query('COMMIT');
        res.status(201).json({message: "New User Created", user:user});
        
    } catch (err) {
        await client.query('ROLLBACK');
        //Use DB constraints and try/catch to handle unique and similar (we make the db call anyway)
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: "e-mail address in use" });
        }
        next(err);
    } finally {
        client.release(); // always release the client
    }
};

//@desc Update a user
//@route PATCH /users 
//@access Private
const updateUser = async (req, res, next) => { 
    const { id, email, name, roles } = req.body;
    //confirm data
    if (!id || !email || !name || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required"});
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const columnsArray = ['name', 'email'];
        const values = [name, email.toLowerCase()];
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');

        const result = await client.query(
            `UPDATE "User" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
        const updatedUser=result.rows[0];
        
        //remove values not in roles array from ref table
        await client.query(
            `DELETE FROM "_UserRoles"
            WHERE "B" = $1 AND "A" NOT IN (${roles.map((_, i) => `$${i + 2}`).join(', ')})`,
            [Number(id), ...roles.map(Number)]
        );

        //add any new values to ref table
        
        const placeholders = roles.map((_, i) => `($1, $${i + 2})`).join(', ');
        await client.query(
            `INSERT INTO "_UserRoles" ("B", "A") VALUES ${placeholders} ON CONFLICT DO NOTHING`,
            [Number(id), ...roles.map(Number)]
        );
        await client.query('COMMIT');
        res.json({ message: "User updated", user: updatedUser});
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: "e-mail address in use" });
        }
        next(err);
    } finally {
        client.release(); // always release the client
    }
}

const deleteUser = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'User ID Required'});
    }
    const result = await query('SELECT COUNT(*) FROM "User"');
    const userCount = Number(result.rows[0].count);
    if (userCount <= 1) {
        return res.status(403).json({ message: 'Cannot delete the last remaining user' });
    }

    // Optionally: prevent self-deletion (requires auth system and current user id)
        // const currentUserId = req.user.id;
        // if (parseInt(id) === currentUserId) {
        //     return res.status(403).json({ message: 'Users cannot delete their own account' });
        // }
        
    try {
        const result = await query(
            `DELETE FROM "User" WHERE "id" = $1 RETURNING "id", "name"`,
            [Number(id)]
        );
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }

        const deletedUser = result.rows[0];
        
        res.json({ message: `User '${deletedUser.name}' deleted.` });        
    } catch(err) {        
        next(err);
    }
}

export default {
    getAllUsers,
    getUserById,
    getPortfolioUser,
    addUser,
    updateUser,
    deleteUser,
}