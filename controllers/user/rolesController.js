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

//@desc Create new role
//@route POST /users/roles
//@access Private
const addRole = async (req, res) => {
    const { role } = req.body;
    //NB validate before making db query
    if (!role) {
        return res.status(400).json({ message: 'All fields Required'});
    }
    try {
        const newRole = await prisma.role.create({
            data: {
                role: role.toLowerCase()
            }
        });
        res.status(201).json(newRole);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Role already exists' });
        }
    }
};

//@desc Update a role
//@route PATCH /roles
//@access Private
const updateRole = async (req, res) => { 
    const { id, role } = req.body;

    if (!id || !role) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const updatedRole =await prisma.role.update({
            where: { id },
            data: {
                role: role.toLowerCase()
            }
        });
        res.json({ message: "Role updated", role: updatedRole });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: `Role with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "Role already exists" });
        }
    }
}

export default {
    getAllRoles,
    addRole, 
    updateRole
}