import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//ROLES ROUTES

//@desc Get all roles
//@route GET /users/roles
//@access Private

const getAllRoles =async (req, res) => {
    const roles = await prisma.role.findMany();
    if (!roles.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No users found'})
    }
    res.json(roles);
}

//@desc Get a role
//@route GET /users/roles/:id
//@access Private
const getRoleById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Role ID required' });

    const role = await prisma.role.findUnique({ where: { id: Number(id) } });
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
        const newRole = await prisma.role.create({
            data: {
                name: name.toLowerCase()
            }
        });
        res.status(201).json({ message: 'Role added successfully', role: newRole });
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
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
        const updatedRole =await prisma.role.update({
            where: { id: Number(id) },
            data: {
                name: name.toLowerCase()
            }
        });
        res.json({ message: "Role updated", role: updatedRole });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Role with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
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