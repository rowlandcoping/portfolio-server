import fs from 'fs';
import path from 'path';
import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//PERSONAL ROUTES

//@desc Get all personal profiles
//@route GET /personal
//@access Private

const getAllPersonal = async (req, res) => {

    const result = await query('SELECT * FROM "Personal"');
    const personal = result.rows;
    if (!personal.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No data found'})
    }
    res.json(personal);
}

//@desc Retrieve data for consumption on front end
//@route GET /personal/provider
//@access Public

const getPersonalByPublicId = async (req, res, next) => {
    const publicId = req.headers['x-user-uuid'];

    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const result = await query('SELECT "id" FROM "User" WHERE "publicId"=$1 LIMIT 1', [publicId]);
    const user = result.rows[0];

    try {
        const result = await query(`
            SELECT
                p.id,
                p."userId",
                p."imageGrn",
                p."imageOrg",
                p."imageAlt",
                p."starSign",
                p."favColor",
                p."description",
                COALESCE(links.links_array, '[]'::json) AS links,
                COALESCE(skills.skills_array, '[]'::json) AS skills
            FROM "Personal" p
            LEFT JOIN (
                SELECT l."personId",
                        json_agg(json_build_object(
                            'id', l.id,
                            'name', l.name,
                            'url', l.url,
                            'imageGrn', l."imageGrn"
                        )) AS links_array
                FROM "Link" l
                GROUP BY l."personId"
            ) links ON links."personId" = p.id
            LEFT JOIN (
                SELECT s."personId",
                        json_agg(json_build_object(
                            'id', s.id,
                            'name', s.name,
                            'ecoId', s."ecoId",
                            'tech', COALESCE(t.tech_array, '[]'::json)
                        )) AS skills_array
                FROM "Skill" s
                LEFT JOIN (
                    SELECT st."A" AS skillId,
                            json_agg(json_build_object(
                                'id', t.id,
                                'name', t.name,
                                'ecoId', t."ecoId",
                                'typeId', t."typeId"
                            )) AS tech_array
                    FROM "_SkillTech" st
                    JOIN "Tech" t ON t.id = st."B"
                    GROUP BY st."A"
                ) t ON t.skillId = s.id
                GROUP BY s."personId"
            ) skills ON skills."personId" = p.id
            WHERE p."userId" = $1
            LIMIT 1;
        `, [Number(user.id)]);

        const personal = result.rows[0];

        if (!personal) {
            //NB any errors not handled here will be handled by our error handline middleware
            return res.status(404).json({message: 'No data found'})
        }
        res.json(personal);
    } catch (err) {
        next(err);
    }
}


//@desc Get a personal profile to edit
//@route GET /personal/profile
//@access Private
const getUserPersonal = async (req, res) => {
    const id = req.session?.userId;
    if (!id) return res.status(401).json({ message: 'User not authorized' });

    const result = await query('SELECT * FROM "Personal" WHERE "userId"=$1 LIMIT 1', [Number(id)]);
    const personal = result.rows[0];

    if (!personal) return res.status(404).json({ message: 'No profile found for logged in user' });
    res.json(personal);
}

//@desc Create new personal profile
//@route POST /personal
//@access Private
const addPersonal = async (req, res, next) => {
    const { description,  starSign, favColor, imageAlt } = req.body;
    //NB validate before making db query
    const user = req.session?.userId;

    if (!user) {
        return res.status(401).json({ message: 'Session not found'});
    }
    if (!description) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    const originalFile = req.files?.original?.[0];
    const transformedFile = req.files?.transformed?.[0];

    let imageOrg = undefined;
    let imageGrn = undefined;
    if (originalFile && transformedFile) {
        imageOrg = `/images/${originalFile.filename}`;
        imageGrn = `/images/${transformedFile.filename}`;
    }

    try {
        const columnsArray = ['userId', 'description', 'starSign', 'favColor', 'imageOrg', 'imageGrn', 'imageAlt'];
        const values = [Number(user), description, starSign, favColor, imageOrg, imageGrn, imageAlt];
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');
       
        const result = await query(
            `INSERT INTO "Personal" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        const newPersonal = result.rows[0]
        res.status(201).json( { message: "Profile Created", personal: newPersonal });
    } catch (err) {
        if (err.code === '23505') { 
            logEvents(`Duplicate field error: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Personal data already exists for this person' });
        }
        next(err);
    }
};

//@desc Update personal profile
//@route PATCH /personal
//@access Private
const updatePersonal = async (req, res, next) => { 
    const { id, description, starSign, favColor, imageAlt, oldOriginal, oldTransformed } = req.body;

    if (!id || !description || !starSign  || !favColor) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    const uploadDir = path.join(process.cwd(), 'images');
        const imageOrg = req.files?.original?.[0]
            ? `/images/${req.files.original[0].filename}`
            : undefined;
        const imageGrn = req.files?.transformed?.[0]
            ? `/images/${req.files.transformed[0].filename}`
            : undefined;

    try {
        const columnsArray = ['description', 'starSign', 'favColor', 'imageAlt'];
        const values = [description, starSign, favColor, imageAlt];
        if (imageOrg !== undefined) {
            columnsArray.push('imageOrg', 'imageGrn');
            values.push(imageOrg, imageGrn);
        }
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');

        const result = await query(
            `UPDATE "Personal" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Profile with id ${id} not found` });
        }

        const updatedPersonal = result.rows[0];
        
        if (imageOrg && oldOriginal) {
            await fs.promises.unlink(path.join(uploadDir, oldOriginal)).catch(err => console.error(err));
        }
        if (imageGrn && oldTransformed) {
            await fs.promises.unlink(path.join(uploadDir, oldTransformed)).catch(err => console.error(err));
        }
        res.json({ message: "Personal Profile Updated", personal: updatedPersonal });
    } catch (err) {
        next(err);
    }
}

export default {
    getAllPersonal,
    getPersonalByPublicId,
    getUserPersonal,
    addPersonal, 
    updatePersonal
}