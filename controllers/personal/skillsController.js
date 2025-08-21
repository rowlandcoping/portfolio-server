import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//SKILL ROUTES

//@desc Get all skills
//@route GET /personal/skills
//@access Private

const getAllSkills =async (req, res) => {
    const skills = await prisma.skill.findMany();
    if (!skills.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No skills found'})
    }
    res.json(skills);
}

//@desc Get a skill
//@route GET /personal/skills/:id
//@access Private
const getSkillById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Skill ID required' });

    const skill = await prisma.skill.findUnique({ 
        where: { id: Number(id) },
        include: {
            tech: true
        }
    });
    if (!skill) return res.status(404).json({ message: 'No skill found' });
    res.json(skill);
}

//@desc Get skills for logged in user
//@route GET /personal/profileskills
//@access Private
const getSkillsByProfileId = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(401).json({ message: 'ID not found' });

    const skills = await prisma.skill.findMany({ 
        where: { personId: Number(id) },
    });
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

    const { userId } = await prisma.personal.findUnique({ 
        where: { id: Number(personal) }
    });
    if (!userId) return res.status(404).json({ message: 'No user found' });

    try {
        //set data outside of db call
        const data = {
            name,           
            personal: { connect: { id: Number(personal) } },
            ecosystem: { connect: { id: Number(ecosystem) } },
            user: { connect: { id: userId } }
        }
        if (tech) {
            data.tech = { connect: tech.map((tech) => ({ id: Number(tech) })) }
        }
        const newSkill = await prisma.skill.create({ data });
        res.status(201).json({ message: "New Skill Created", skill: newSkill });
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
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
        const data = {
            name,               
            ecosystem: { connect: { id: Number(ecosystem) } }
        }
        if (tech) {
            data.tech = { connect: tech.map((tech) => ({ id: Number(tech) })) }
        }
        const updatedSkill = await prisma.skill.update({ 
            where: { id: Number(id) }, 
            data
        });       
        res.json({ message: "Skill updated", skill: updatedSkill });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: 'Skill already exists' });
        }
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Skill with id ${id} not found` });
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
        await prisma.skill.delete({ where: { id: Number(id) } });
        res.json({ message: `Skill with id ${id} deleted.` });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Skill with id ${id} not found` });
        }
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