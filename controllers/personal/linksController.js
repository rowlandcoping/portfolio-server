import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//LINK ROUTES

//@desc Get all links
//@route GET /personal/links
//@access Private

const getAllLinks =async (req, res) => {
    const links = await prisma.link.findMany();
    if (!links.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No links found'})
    }
    res.json(links);
}

//@desc Get a link by the user's session id
//@route GET /personal//userlinks
//@access Private
const getLinksBySessionId = async (req, res) => {
    const id = req.session?.userId;
    if (!id) return res.status(401).json({ message: 'User not authorized' });

    const links = await prisma.link.find({ 
        where: { userId: Number(id) }
    });
    if (!links) return res.status(404).json({ message: 'No links found for logged in user' });
    res.json(links);
}

//@desc Get a link
//@route GET /personal/links/:id
//@access Private
const getLinkById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Link ID required' });

    const link = await prisma.link.findUnique({ where: { id: Number(id) } });
    if (!link) return res.status(404).json({ message: 'No link found' });

    res.json(link);
}

//@desc Create new link
//@route POST /links
//@access Private
const addLink = async (req, res, next) => {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: 'User not authorized' });
    const { id } = await prisma.personal.findUnique({ 
        where: { userId: Number(userId) }
    });



    const { name, url, imageAlt } = req.body;    
    //NB validate before making db query
    if (!name || !url || !imageAlt || !id) {
        return res.status(400).json({ message: "Missing Data" });
    }

    const originalFile = req.files?.original?.[0];
    const transformedFile = req.files?.transformed?.[0];

    if (!originalFile || !transformedFile) {
        return res.status(400).json({ message: 'Missing uploaded files' });
    }

    const logoOrg = `/images/${originalFile.filename}`;
    const logoGrn = `/images/${transformedFile.filename}`;

    try {
        const newLink = await prisma.link.create({
            data: {                
                name,
                url,
                logoOrg,
                logoGrn,
                logoAlt:imageAlt,
                personal: { connect: { id: id } },
                user: { connect: { id: userId } }
            }
        });        
        res.status(201).json(newLink);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Link already exists' });
        }
        next(err);       
    }
};

//@desc Update link
//@route PATCH /personal/links
//@access Private
const updateLink = async (req, res, next) => {

    const { id, name, url, logo, personal } = req.body;
    
    //NB validate before making db query
    if (!id || !name || !url || !logo || !personal) {
        return res.status(400).json({ message: "Missing required fields" });
    }    

    try {
        const updatedLink = await prisma.link.update({ 
            where: { id: Number(id) }, 
            data: {
                name,
                url,
                logo,
                personal: { connect: { id: personal } },
            } 
        });
        res.json({ message: "Link updated", link: updatedLink });
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Link already exists' });
        }
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Link with id ${id} not found` });
        }
        next(err);
    }
};

//@desc Delete a link
//@route DELETE /personal/links 
//@access Private
const deleteLink = async (req, res, next) => {

    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Link ID required' });
    try {
        await prisma.link.delete({ where: { id: Number(id) } });
        res.json({ message: `Link with id ${id} deleted.` });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Link with id ${id} not found` });
        }
        next(err)
    }
};

export default {
    getAllLinks,
    getLinkById,
    getLinksBySessionId,
    addLink, 
    updateLink,
    deleteLink
}