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
        const about = await query(`
            SELECT
                json_build_object(
                    'id', about."id",
                    'userId', about."userId",
                    'overview', about."overview",
                    'repo', about."repo",
                    'copyYear', about."copyYear",
                    'copyName', about."copyName",
                    'projectEcosystem', COALESCE(pe_json.pe_array, '[]'::json)
                ) AS about_json
            FROM "About" about
            LEFT JOIN (
                SELECT 
                    pe."aboutId",
                    json_agg(
                        json_build_object(
                            'id', pe."id",
                            'name', pe."name",
                            'ecosystem', json_build_object(
                                'id', eco."id",
                                'name', eco."name",
                                'tech', COALESCE(tech_json.tech_array, '[]'::json)
                            )
                        )
                    ) AS pe_array
                FROM "ProjectEcosystem" pe
                LEFT JOIN "Ecosystem" eco ON eco."id" = pe."ecoId"
                LEFT JOIN (
                    SELECT pt."A" AS "projectEcosystemId", 
                        json_agg(json_build_object('id', t."id", 'name', t."name")) AS tech_array
                    FROM "_ProjectTech" pt
                    JOIN "Tech" t ON t."id" = pt."B"
                    GROUP BY pt."A"
                ) tech_json ON tech_json."projectEcosystemId" = pe."id"
                GROUP BY pe."aboutId"
            ) pe_json ON pe_json."aboutId" = about."id"
            WHERE about."userId" = $1
            LIMIT 1;
        `, [Number(user.id)]);

        if (!about.rows[0] || !about.rows[0].about_json) {
            return res.status(404).json({ message: 'No about page found for logged-in user' });
        }

        res.json(about.rows[0].about_json);
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