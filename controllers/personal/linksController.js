import fs from 'fs';
import path from 'path';
import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//LINK ROUTES

//@desc Get all links
//@route GET /personal/links
//@access Private

const getAllLinks =async (req, res) => {
    const result = await query('SELECT * FROM "Link"');
    const links = result.rows;
    if (!links.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No links found'})
    }
    res.json(links);
}

//@desc Get links by the user's session id
//@route POST /personal/profilelinks
//@access Private
const getLinksByProfileId = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(401).json({ message: 'Id not found' });

    const result = await query('SELECT * FROM "Link" WHERE "personId"=$1', [Number(id)]);
    const links = result.rows;

    if (!links.length) return res.status(404).json({ message: 'No links found for logged in user' });
    res.json(links);
}

//@desc Get a link
//@route GET /personal/links/:id
//@access Private
const getLinkById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Link ID required' });

    const result = await query('SELECT * FROM "Link" WHERE "id"=$1', [Number(id)]);
    const link = result.rows[0];
    
    if (!link) return res.status(404).json({ message: 'No link found' });
    res.json(link);
}

//@desc Create new link
//@route POST /links
//@access Private
const addLink = async (req, res, next) => {
    const { profileId, name, url, imageAlt } = req.body;    
    //NB validate before making db query
    if (!profileId || !name || !url || !imageAlt) {
        return res.status(400).json({ message: "Missing Data" });
    }

    const result = await query('SELECT "userId" FROM "Personal" WHERE "profileId"=$1 LIMIT 1', [Number(profileId)]);
    const userId = result.rows[0]?.userId;

    
    if (!userId) return res.status(404).json({ message: 'No user found' });

    const originalFile = req.files?.original?.[0];
    const transformedFile = req.files?.transformed?.[0];

    if (!originalFile || !transformedFile) {
        return res.status(400).json({ message: 'Missing uploaded files' });
    }

    const logoOrg = `/images/${originalFile.filename}`;
    const logoGrn = `/images/${transformedFile.filename}`;

    try {
        const columnsArray = ['personId', 'userId', 'name', 'url', 'logoOrg', 'logoGrn', 'logoAlt'];
        const values = [Number(profileId), Number(userId), name, url, logoOrg, logoGrn, imageAlt];
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');
       
        const result = await query(
            `INSERT INTO "Link" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        const newLink = result.rows[0]
        res.status(201).json(newLink);
    } catch (err) {
        if (err.code === '23505') {
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

    const { id, name, url, imageAlt, oldOriginal, oldTransformed } = req.body;
    
    //NB validate before making db query
    if (!id || !name || !url || !imageAlt) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    const uploadDir = path.join(process.cwd(), 'images');
    const logoOrg = req.files?.original?.[0]
        ? `/images/${req.files.original[0].filename}`
        : undefined;
    const logoGrn = req.files?.transformed?.[0]
        ? `/images/${req.files.transformed[0].filename}`
        : undefined;

    try {
        const columnsArray = ['name', 'url', 'logoAlt'];
        const values = [ name, url, imageAlt];
        if (logoOrg !== undefined) {
            columnsArray.push('logoOrg', 'logoGrn');
            values.push(logoOrg, logoGrn);
        }
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');

        const result = await query(
            `UPDATE "Link" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Link with id ${id} not found` });
        }

        const updatedLink = result.rows[0];
        if (logoOrg && oldOriginal) {
            await fs.promises.unlink(path.join(uploadDir, oldOriginal)).catch(err => console.error(err));
        }
        if (logoGrn && oldTransformed) {
            await fs.promises.unlink(path.join(uploadDir, oldTransformed)).catch(err => console.error(err));
        }
        res.json({ message: "Link updated", link: updatedLink });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Link already exists' });
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

    //retrieve image links
    const result = await query('SELECT "logoGrn", "logoOrg" FROM "Link" WHERE "id"=$1', [Number(id)]);
    const link = result.rows[0];

    const imagePath = path.join(process.cwd(), link.logoGrn);
    const originalPath = path.join(process.cwd(), link.logoOrg);
    
    //delete
    try {
        const result = await query(
            `DELETE FROM "Link" WHERE "id" = $1 RETURNING "id"`,
            [Number(id)]
        );

        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Link with id ${id} not found` });
        }


        //remove images        
        await fs.unlink(path.resolve(imagePath), (err) => {
            if (err) console.error('Failed to delete old transformed file:', err);
        });
        await fs.unlink(path.resolve(originalPath), (err) => {
            if (err) console.error('Failed to delete old original file:', err);
        });
        res.json({ message: `Link with id ${id} deleted.` });
    } catch (err) {
        next(err)
    }
};

export default {
    getAllLinks,
    getLinkById,
    getLinksByProfileId,
    addLink, 
    updateLink,
    deleteLink
}