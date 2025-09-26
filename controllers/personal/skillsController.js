import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//SKILL ROUTES

//@desc Get all skills
//@route GET /personal/skills
//@access Private
const getAllSkills =async (req, res) => {

    const result = await query('SELECT * FROM "Skill"');
    const skills = result.rows;
    
    if (!skills.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(404).json({message: 'No skills found'})
    }
    res.json(skills);
}

//@desc Get a skill
//@route GET /personal/skills/:id
//@access Private
const getSkillById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Skill ID required' });

    const result = await query(`
            SELECT
                json_build_object(
                    'id', skill."id",
                    'name', skill."name",
                    'ecoId', skill."ecoId",
                    'personId', skill."personId",
                    'userId', skill."userId",
                    'tech', COALESCE(tech.tech_array, '[]'::json)
                ) AS skill_json
            FROM "Skill" skill
            LEFT JOIN (
                SELECT 
                    skilltech."A" AS skillId,
                    json_agg(
                        json_build_object(
                            'id', tech."id",
                            'name', tech."name",
                            'ecoId', tech."ecoId",
                            'typeId', tech."typeId"
                        )
                    ) AS tech_array
                FROM "_SkillTech" skilltech
                JOIN "Tech" tech ON tech."id" = skilltech."B"
                GROUP BY skilltech."A"
            ) tech ON tech.skillId = skill."id"
            
            WHERE skill."id" = $1
            LIMIT 1;
        `, [Number(id)]);

    const skill = result.rows[0]?.skill_json;

    if (!skill) return res.status(404).json({ message: 'No skill found' });
    res.json(skill);
}

//@desc Get skills for logged in user
//@route GET /personal/profileskills
//@access Private
const getSkillsByProfileId = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(401).json({ message: 'ID not found' });

    const result = await query('SELECT * FROM "Skill" WHERE "personId"=$1', [Number(id)]);
    const skills = result.rows;

    if (!skills) return res.status(404).json({ message: 'No skills found for logged in user' });
    res.json(skills);
}


//@desc Create new skill
//@route POST /skills
//@access Private
const addSkill = async (req, res, next) => {
    const { name, ecosystem, tech, personal } = req.body;
    if (!name || !ecosystem || !personal) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await query('SELECT "userId" FROM "Personal" WHERE "id"=$1', [Number(personal)]);
    const userId = result.rows[0]?.userId;
    if (!userId) return res.status(404).json({ message: 'No user found' });

    try {

        const columnsArray = ['personId', 'userId', 'ecoId', 'name'];
        const values = [Number(personal), Number(userId), Number(ecosystem), name];
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');
       
        const result = await query(
            `INSERT INTO "Skill" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        const newSkill = result.rows[0];

        if (Array.isArray(tech) && tech.length > 0) {
            //map over tech array to create placeholders
            const placeholders = tech.map((_, i) => `($1, $${i + 2})`).join(', ')
            await query(
                //values of A and B in the table columns map to the placeholder tuples.
                `INSERT INTO "_SkillTech" ("A", "B") VALUES ${placeholders}`,
                //NB this array will assign the skill ID to $1 (which is re-used)
                //It will then assign subsequent values in the array to the other placeholders (in the tuples)
                //EG skill id is 3 and tech is 1, 2 (ie array is [3,2,1] then ($1, $2), ($1, $3) maps to (3, 1), (3, 2)- i+2 ensures no conflict with $1
                [Number(newSkill.id), ...tech.map(Number)]
            );
        }
        res.status(201).json({ message: "New Skill Created", skill: newSkill });

    } catch (err) {
        if (err.code === '23505') { 
            logEvents(`Duplicate field error: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'This Skill already exists.' });
        }
        next(err);
    }
};

//@desc Update skill
//@route PATCH /personal/skills
//@access Private
const updateSkill = async (req, res, next) => {
    console.log('req.body:', req.body);

    const { id, ecosystem, tech, name } = req.body;
    
    //NB validate before making db query
    if (!id || !ecosystem || !name) {
        return res.status(400).json({ message: "Missing required fields" });
    }    

    try {
        const columnsArray = ['ecoId', 'name'];
        const values = [ Number(ecosystem), name];
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');

        const result = await query(
            `UPDATE "Skill" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Skill with id ${id} not found` });
        }
        const updatedSkill=result.rows[0];
              
        if (Array.isArray(tech)) {
        // 1️⃣ Remove old connections not in the new array
            if (tech.length > 0) {
                await query(
                    `DELETE FROM "_SkillTech"
                    WHERE "A" = $1 AND "B" NOT IN (${tech.map((_, i) => `$${i + 2}`).join(', ')})`,
                    [Number(id), ...tech.map(Number)]
                );
                const placeholders = tech.map((_, i) => `($1, $${i + 2})`).join(', ');
                await query(
                    `INSERT INTO "_SkillTech" ("A", "B") VALUES ${placeholders} ON CONFLICT DO NOTHING`,
                    [Number(id), ...tech.map(Number)]
                );
            } else {
                // If the new array is empty, remove all connections
                await query(`DELETE FROM "_SkillTech" WHERE "A" = $1`, [Number(id)]);
            }
        }        
        res.json({ message: "Skill updated", skill: updatedSkill });
    } catch (err) {
        if (err.code === '23505') { 
            logEvents(`Duplicate field error: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'This Skill already exists.' });
        }
        next(err);
    }
};

//@desc Delete a skill
//@route DELETE /personal/skills
//@access Private
const deleteSkill = async (req, res, next) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Skill ID required' });
    try {
        const result = await query(
            `DELETE FROM "Skill" WHERE "id" = $1 RETURNING "id"`,
            [Number(id)]
        );
        //check it's worked
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Skill with id ${id} not found` });
        }
        res.json({ message: `Skill with id ${id} deleted.` });
    } catch (err) {
        next(err);
    }
};

export default {
    getAllSkills,
    getSkillById,
    getSkillsByProfileId,
    addSkill, 
    updateSkill,
    deleteSkill
}