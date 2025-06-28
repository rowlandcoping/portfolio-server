import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';
import bcrypt from 'bcrypt';


//USER ROUTES

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers =async (req, res) => {

    const users = await prisma.user.findMany();

    if (!users.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No users found'})
    }

    const cleanUsers = users.map(({ password, ...user }) => user);
    res.json(cleanUsers);
}

//@desc Get a user
//@route GET /users/:id
//@access Private
const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'User ID required' });

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ message: 'No user found' });

    res.json(user);
}

//@desc Create new user
//@route POST /users
//@access Private
const addUser = async (req, res) => {

    const { name, email, password, roles } = req.body;

    //NB validate before making db query
    if (!name || !email || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields Required"});
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name, 
                email : email.toLowerCase(), 
                password: hashedPwd,
                roles: {
                    connect: roles.map((roleId) => ({ id: roleId }))
                }
            }
        });
        res.status(201).json(user);
    } catch (err) {
        //Use DB constraints and try/catch to handle unique and similar (we make the db call anyway)
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "e-mail address in use" });
        }
    }
};

//@desc Update a user
//@route PATCH /users 
//@access Private
const updateUser = async (req, res) => { 
    const { id, email, name, roles } = req.body;
    //confirm data
    if (!id || !email || !name || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required"});
    }
    try {
        const updatedUser = await prisma.user.update({
            
            where: { id },
            data: {
                email,
                name,
                roles: {
                    set: roles.map(roleId => ({ id: roleId }))
                }
            }
        });
        res.json({ message: "User updated", user: updatedUser});
    } catch (err) {
        //err code for not found (ie id doesn't match or isn't found in DB)
        if (err.code === 'P2025') { // Record to update not found
            const target = err.meta?.cause || err.meta?.target?.join(', ') || '';
            if (target.includes('Role')) {
                return res
                .status(404)
                .json({ message: `Role with id ${target} not found` });
            }
            // otherwise assume it was the user lookup
            return res
                .status(404)
                .json({ message: `User with id ${idNum} not found` });
        }
        //This covers eventuality user tries to change e-mail to one that already exists.
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: "e-mail address in use" });
        }
    }
}

const deleteUser = async (req, res) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'User ID Required'});
    }
    
    try {
        const userCount = await prisma.user.count();
        if (userCount <= 1) {
            return res.status(403).json({ message: 'Cannot delete the last remaining user' });
        }

        // Optionally: prevent self-deletion (requires auth system and current user id)
        // const currentUserId = req.user.id;
        // if (parseInt(id) === currentUserId) {
        //     return res.status(403).json({ message: 'Users cannot delete their own account' });
        // }

        const deleteUser = await prisma.user.delete({ 
            where: { id: parseInt(id) } 
        
        })
        res.json({ message: `User '${deletedUser.name}' deleted.` });        
    } catch(err) {
        if (err.code === 'P2025') { // Record to update not found
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    }
}

export default {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
}