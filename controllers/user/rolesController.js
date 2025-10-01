import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//ROLES ROUTES

//@desc Get all roles
//@route GET /users/roles
//@access Private

const getAllRoles =async (req, res) => {
    const result = await query('SELECT * FROM "Role"');
    const roles = result.rows;

    if (!roles.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No roles found'})
    }
    res.json(roles);
}

//@desc Get a role
//@route GET /users/roles/:id
//@access Private
const getRoleById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Role ID required' });

    const result = await query('SELECT * FROM "Role" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const role = result.rows[0];
    if (!role) return res.status(404).json({ message: 'No role found' });
    res.json(role);
}

//@desc Create new role
//@route POST /users/roles
//@access Private
const addRole = async (req, res, next) => {
    const { name } = req.body;
    //NB validate before making db query
    if (!name) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {        
        const result = await query(
            `INSERT INTO "Role" ("name") VALUES ($1) RETURNING *`, [name.toLowerCase()]
        );
        const newRole = result.rows[0]        
        res.status(201).json({ message: 'Role added successfully', role: newRole });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Role already exists' });
        }
        next(err);
    }
};

//@desc Update a role
//@route PATCH /roles
//@access Private
const updateRole = async (req, res, next) => { 
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const result = await query(
            `UPDATE "Role" SET "name"=$1 WHERE "id"=$2 RETURNING *`,
                [name.toLowerCase(), Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Role with id ${id} not found` });
        }
        const updatedRole=result.rows[0];
        res.json({ message: "Role updated", role: updatedRole });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: "Role already exists" });
        }
        next(err);
    }
}

export default {
    getAllRoles,
    getRoleById,
    addRole, 
    updateRole
}