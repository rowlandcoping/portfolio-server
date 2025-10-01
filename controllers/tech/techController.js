import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//TECH ROUTES

//@desc Get all tech
//@route GET /tech
//@access Private

const getAllTech =async (req, res) => {
    const result = await query('SELECT * FROM "Tech"');
    const tech = result.rows;
    if (!tech.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No tech found'})
    }
    res.json(tech);
}

//@desc Get selected tech
//@route GET /tech/:id
//@access Private
const getTechById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech ID required' });
    const result = await query('SELECT * FROM "Tech" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const tech = result.rows[0];
    if (!tech) return res.status(404).json({ message: 'Tech not found' });
    res.json(tech);
}

//@desc Get all tech by associated ecosystem
//@route GET /tech/associated/:id
//@access Private
const getTechByEcoId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Tech ID required' });
    const result = await query('SELECT * FROM "Tech" WHERE "ecoId"=$1', [Number(id)]);
    const tech = result.rows;
    if (!tech.length) return res.status(404).json({ message: 'No tech found' });
    res.json(tech);
}

//@desc Create new tech type
//@route POST /tech/tech
//@access Private
const addTech = async (req, res, next) => {
    const { name, type, ecosystem } = req.body;
    //NB validate before making db query
    if (!name || !type || !ecosystem) {
        return res.status(400).json({ message: 'All fields Required'});
    }

    try {
        const result = await query(
            `SELECT * FROM "Tech" WHERE "name" ILIKE $1 LIMIT 1`,
            [name]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Tech already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        const columnsArray = ['typeId', 'ecoId', 'name'];
        const values = [Number(type), Number(ecosystem), name];
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');        
        const result = await query(
            `INSERT INTO "Tech" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        const newTech = result.rows[0]
        res.status(201).json(newTech);
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Type of tech already exists' });
        }
        next(err);
    }
};

//@desc Update a tech type
//@route PATCH /tech/tech
//@access Private
const updateTech = async (req, res, next) => { 
    const { id, name, type, ecosystem } = req.body;

    if (!id || !name || !type || !ecosystem ) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const result = await query(
            `SELECT * FROM "Tech" WHERE "name" ILIKE $1 AND "id" <> $2 LIMIT 1`,
            [name, Number(id)]
        );
        const duplicate = result.rows[0];
        if (duplicate) {
            return res.status(409).json({ message: 'Tech already exists with this name'});
        }
    } catch(err) {
        return res.status(500).json({ message: 'server error'});
    }

    try {
        //values to be inserted only
        const columnsArray = ['typeId', 'ecoId', 'name'];
        const values = [Number(type), Number(ecosystem), name];
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');
        const result = await query(
            `UPDATE "Tech" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        } 
        const updatedTech=result.rows[0];
        res.json({ 
            message: `Tech updated.`,
            tech: updatedTech
        });
    } catch (err) {
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: "Tech already exists" });
        }
        next(err);
    }
}

//@desc Delete a tech type
//@route DELETE /tech/tech
//@access Private
const deleteTech = async (req, res, next) => { 
    const { id } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Tech ID Required'});
    }

    try {
        const result = await query(
            `DELETE FROM "Tech" WHERE "id" = $1`,
            [Number(id)]
        );
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Tech with id ${id} not found` });
        }
        res.json({ message: 'Tech (and associated skills) deleted successfully' });
    } catch (err) {
        next(err);
    }
}

export default {
    getAllTech,
    getTechById,
    getTechByEcoId,
    addTech, 
    updateTech,
    deleteTech
}