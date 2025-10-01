import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//@desc get about page by logged in user
//@route GET /personal/about
//@access Private
const getAboutByCurrentUser = async (req, res) => {
    const user = req.session?.userId;
    if (!user) {
        return res.status(401).json({ message: 'Session not found'});
    }

    const result = await query('SELECT * FROM "About" WHERE "userId"=$1 LIMIT 1', [Number(user)]);
    const about = result.rows[0];
    if (!about) return res.status(404).json({ message: 'No about page found for logged in user' });
    res.json(about);
}


//@desc Create new about page
//@route POST /personal/about
//@access Private
const addAbout = async (req, res, next) => {
    const { overview, type, repo, copyYear, copyName } = req.body;
    const user = req.session?.userId;

    if (!user) {
        return res.status(401).json({ message: 'Session not found'});
    }
    if (!overview || !type || !repo || !copyYear || !copyName) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        //set data outside of db call
        const columnsArray = ['userId', 'typeId', 'overview', 'repo', 'copyYear', 'copyName'];
        const values = [Number(user), Number(type), overview, repo, Number(copyYear), copyName];

        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');
        //NB the '_' ignores the values in the columns array, since the result is based on the indices and the order doesn't matter
        //This code avoids all the annoying counting and also separates the values from the query.
        

        //pass into query
        const result = await query(
            `INSERT INTO "About" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );

               
        res.status(201).json( { message: "About Page Created", about: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            // 23505 = unique_violation
            return res.status(409).json({ message: "An About Page already exists for this user's portfolio." });
        }
        next(err);
    }
}

//@desc Update about page
//@route PATCH /personal/about
//@access Private
const updateAbout = async (req, res, next) => {
    const { id, overview, type, repo, copyYear, copyName } = req.body;

    if (!id || !overview || !type || !repo || !copyYear || !copyName) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {

        //values to be inserted only
        const columnsArray = ['overview', 'repo', 'copyYear', 'copyName', 'typeId'];
        const values = [overview, repo, Number(copyYear), copyName, Number(type)];
        
        //with update the columns are tied to specific placeholders (ie overview = $1, etc), but we can dynamiclaly create this
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');

        //NB the query is the last placeholder so we add it on to the number of columns and dynamically crete that too
        //we then spread the values array and add id on the end.
        const result = await query(
            `UPDATE "About" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `About Page with id ${id} not found` });
        } 
        res.json({ message: "About Page Updated", about: result.rows[0] });
    } catch (err) {
        next(err);
    }
}

//@desc Provide about page for submitted userID to client
//@route GET /personal/about/provider
//@access Public
const getAboutByPublicId = async (req, res, next) => {
    const publicId = req.headers['x-user-uuid'];

    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const result = await query('SELECT id FROM "User" WHERE "publicId"=$1 LIMIT 1', [publicId]);
    const user = result.rows[0];

    try {
        const result = await query(`
            SELECT
                a."id",
                a."userId",
                a."overview",
                a."repo",
                a."copyYear",
                a."copyName",
                (
                    SELECT COALESCE(json_agg(
                        json_build_object(
                            'id', pe."id",
                            'name', pe."name",
                            'ecosystem', row_to_json(e),
                            'tech', (
                                SELECT COALESCE(json_agg(json_build_object(
                                    'id', t."id",
                                    'name', t."name",
                                    'ecoId', t."ecoId",
                                    'typeId', t."typeId"
                                ) ORDER BY t."name"), '[]'::json)
                                FROM "_ProjectTech" pt
                                JOIN "Tech" t ON t."id" = pt."B"
                                WHERE pt."A" = pe."id"
                            )
                        ) ORDER BY pe."name"
                    ), '[]'::json)
                    FROM "ProjectEcosystem" pe
                    JOIN "Ecosystem" e ON e."id" = pe."ecoId"
                    WHERE pe."aboutId" = a."id"
                ) AS "projectEcosystem"
            FROM "About" a
            WHERE a."userId" = $1
            LIMIT 1;
        `, [Number(user.id)]);
        const about = result.rows[0];

        if (!about) {
            //NB any errors not handled here will be handled by our error handline middleware
            return res.status(404).json({message: 'No data found'})
        }
        res.json(about); 
    } catch (err) {
        next(err);
    }
}

export default {
    getAboutByCurrentUser,   
    addAbout,
    updateAbout,
    getAboutByPublicId,
}