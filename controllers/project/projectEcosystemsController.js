import { query } from '../../config/db.js';
import pool from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//PROJECT ECOSYSTEM ROUTES

//@desc Get all projectEcosystems
//@route GET /personal/projectEcosystems
//@access Private

const getAllProjectEcosystems =async (req, res) => {
    const result = await query('SELECT * FROM "ProjectEcosystem"');
    const projectEcosystems= result.rows;
    if (!projectEcosystems.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No projectEcosystems found'})
    }
    res.json(projectEcosystems);
}

//@desc Get projectEcosystems by ID
//@route GET /personal/projectEcosystems/:id
//@access Private

const getProjectEcosystemById =async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project Ecosystem ID required' });

    const result = await query(`
        SELECT
            json_build_object(
                'id', pe."id",
                'name', pe."name",
                'ecoId', pe."ecoId",
                'projectId', pe."projectId",
                'aboutId', pe."aboutId",
                'tech', COALESCE(tech.tech_array, '[]'::json)
            ) AS pe_json
        FROM "ProjectEcosystem" pe
        LEFT JOIN (
            SELECT 
                ecotech."A" AS ecotechId,
                json_agg(
                    json_build_object(
                        'id', tech."id",
                        'name', tech."name",
                        'ecoId', tech."ecoId",
                        'typeId', tech."typeId"
                    )
                ) AS tech_array
            FROM "_ProjectTech" ecotech
            JOIN "Tech" tech ON tech."id" = ecotech."B"
            GROUP BY ecotech."A"
        ) tech ON tech.ecotechId = pe."id"            
        WHERE pe."id" = $1
        LIMIT 1;
    `, [Number(id)]);
    
    const projEcosystem = result.rows[0]?.pe_json;
    if (!projEcosystem) return res.status(404).json({ message: 'Project Ecosystem not found' });
    res.json(projEcosystem);
}

//@desc Get skills for the project
//@route GET /projects/projectecosystems/projects/:id
//@access Private
const getProjectEcosystemsByProjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Skill ID required' });
    const result = await query('SELECT * FROM "ProjectEcosystem" WHERE "projectId"=$1', [Number(id)]);
    const projEcosystems = result.rows;
    if (!projEcosystems) return res.status(404).json({ message: 'No project ecosystems found' });
    res.json(projEcosystems);
}

//@desc Get skills for the about page
//@route GET /projects/projectecosystems/projects/:id
//@access Private
const getProjectEcosystemsByAboutId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Skill ID required' });

    const result = await query('SELECT * FROM "ProjectEcosystem" WHERE "aboutId"=$1', [Number(id)]);
    const projEcosystems = result.rows;
    if (!projEcosystems) return res.status(404).json({ message: 'No project ecosystems found' });
    res.json(projEcosystems);
}

//@desc Create new project ecosystem
//@route POST /projects/projectecosystems
//@access Private
const addProjectEcosystem = async (req, res, next) => {
    const { name, ecosystem, tech, project } = req.body;
    if (!name || !ecosystem || !project) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            `INSERT INTO "ProjectEcosystem" ("name", "projectId", "ecoId") VALUES ($1, $2, $3) RETURNING *`, 
            [name, Number(project), Number(ecosystem)]
        );

        const newEntry = result.rows[0]

        if (Array.isArray(tech) && tech.length > 0) {
            //map over tech array to create placeholders
            const placeholders = tech.map((_, i) => `($1, $${i + 2})`).join(', ')
            await client.query(
                `INSERT INTO "_ProjectTech" ("A", "B") VALUES ${placeholders}`,
                [Number(newEntry.id), ...tech.map(Number)]
            );
        }
        await client.query('COMMIT');
        res.status(201).json({ message: "New Project Ecosystem Created", projEcosystem: newEntry });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'This Project Ecosystem already exists.' });
        }
        next(err);
    } finally {
        client.release(); // always release the client
    }
};

//@desc Create new about project ecosystem
//@route POST /projects/projectecosystems/about
//@access Private
const addAboutProjectEcosystem = async (req, res, next) => {
    const { name, ecosystem, tech, about } = req.body;
    if (!name || !ecosystem || !about) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            `INSERT INTO "ProjectEcosystem" ("name", "aboutId", "ecoId") VALUES ($1, $2, $3) RETURNING *`, 
            [name, Number(about), Number(ecosystem)]
        );

        const newEntry = result.rows[0]

        if (Array.isArray(tech) && tech.length > 0) {
            //map over tech array to create placeholders
            const placeholders = tech.map((_, i) => `($1, $${i + 2})`).join(', ')
            await client.query(
                `INSERT INTO "_ProjectTech" ("A", "B") VALUES ${placeholders}`,
                [Number(newEntry.id), ...tech.map(Number)]
            );
        }
        await client.query('COMMIT');
        res.status(201).json({ message: "New Project Ecosystem Created", projEcosystem: newEntry });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'This Project Ecosystem already exists.' });
        }
        next(err);
    } finally {
        client.release(); // always release the client
    }
};

//@desc Update Project Ecosystem
//@route PATCH /projects/projectecosystems
//@access Private
const updateProjectEcosystem = async (req, res, next) => {

    const { id, name, ecosystem, tech  } = req.body;    
    //NB validate before making db query
    if (!id || !ecosystem || !name) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            `Update "ProjectEcosystem" SET "name"=$1, "ecoId"=$2 WHERE id=$3 RETURNING *`, 
            [name, Number(ecosystem), Number(id)]
        );

        const updatedProjecosystem = result.rows[0]

        if (Array.isArray(tech)) {
        // 1️⃣ Remove old connections not in the new array
            if (tech.length > 0) {
                await client.query(
                    `DELETE FROM "_ProjectTech"
                    WHERE "A" = $1 AND "B" NOT IN (${tech.map((_, i) => `$${i + 2}`).join(', ')})`,
                    [Number(id), ...tech.map(Number)]
                );
                const placeholders = tech.map((_, i) => `($1, $${i + 2})`).join(', ');
                await client.query(
                    `INSERT INTO "_ProjectTech" ("A", "B") VALUES ${placeholders} ON CONFLICT DO NOTHING`,
                    [Number(id), ...tech.map(Number)]
                );
            } else {
                // If the new array is empty, remove all connections
                await client.query(`DELETE FROM "_ProjectTech" WHERE "A" = $1`, [Number(id)]);
            }
        }
        await client.query('COMMIT');
        res.json({ message: "Project Ecosystem updated", projEcosystem: updatedProjecosystem });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'This Project Ecosystem already exists.' });
        }
        next(err);
    } finally {
        client.release(); // always release the client
    }
};

//@desc Delete a project ecosystem
//@route DELETE /projects/projectEcosystems
//@access Private
const deleteProjectEcosystem = async (req, res, next) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Project Ecosystems ID required' });
    try {
        const result = await query(
            `DELETE FROM "ProjectEcosystem" WHERE "id" = $1 RETURNING "id"`,
            [Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Project Ecosystem with id ${id} not found` });
        }
        res.json({ message: `Project Ecosystem with id ${id} deleted.` });
    } catch (err) {
        next(err);
    }
};

export default {
    getAllProjectEcosystems,
    getProjectEcosystemById,
    getProjectEcosystemsByProjectId,
    getProjectEcosystemsByAboutId,
    addProjectEcosystem,
    addAboutProjectEcosystem,
    updateProjectEcosystem,
    deleteProjectEcosystem
}