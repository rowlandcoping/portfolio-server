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

    const skill = await prisma.skill.findUnique({ where: { id: Number(id) } });
    if (!skill) return res.status(404).json({ message: 'No skill found' });
    res.json(skill);
}

//@desc Create new skill
//@route POST /skills
//@access Private
const addSkill = async (req, res, next) => {
    console.log('req.body:', req.body);

    const { ecosystem, tech, competency, personal } = req.body;
    
    //NB validate before making db query
    if (!ecosystem || !competency || !personal) {
        return res.status(400).json({ message: "Missing required fields" });
    }    

    try {
        //set data outside of db call
        const data = {            
            ecosystem: { connect: { id: ecosystem } },
            personal: { connect: { id: personal } },
            competency
        }
        if (tech) {
            data.tech = { connect: { id: Number(tech) } }
        }        
        const newSkill = await prisma.skill.create({ data });
        res.status(201).json(newSkill);
    } catch (err) {
        if (err.code === 'P2002' && Array.isArray(err.meta?.target) && err.meta.target.includes('techId') && err.meta.target.includes('personId')) {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Skill already exists for this person and tech combination.' });
        }
        next(err);
    }
};

//@desc Update skill
//@route PATCH /personal/skills
//@access Private
const updateSkill = async (req, res, next) => {
    console.log('req.body:', req.body);

    const { id, ecosystem, tech, competency } = req.body;
    
    //NB validate before making db query
    if (!id || !ecosystem || !competency) {
        return res.status(400).json({ message: "Missing required fields" });
    }    

    try {
        const updatedSkill = await prisma.skill.update({ 
            where: { id: Number(id) }, 
            data: {
                ecosystem: { connect: { id: ecosystem } },
                tech: tech ? { connect: { id: Number(tech) } } : undefined,
                competency
            }   
        });
        res.json({ message: "Skill updated", skill: updatedSkill });
    } catch (err) {
        if (err.code === 'P2002' && Array.isArray(err.meta?.target) && err.meta.target.includes('techId') && err.meta.target.includes('personId')) {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Skill already exists for this person and tech combination.' });
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
    addSkill, 
    updateSkill,
    deleteSkill
}