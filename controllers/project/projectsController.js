import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//FEATUES ROUTES

//@desc Get all projects
//@route GET /projects
//@access Private

const getAllProjects =async (req, res) => {
    const projects = await prisma.project.findMany();
    if (!projects.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No projects found'})
    }
    res.json(projects);
}

//@desc Create new feature
//@route POST /projects
//@access Private
const addProject = async (req, res) => {
    console.log('req.body:', req.body);
    //NB features = [] defaults to empty array if there is no value.
    const { title, overview, image, features=[], issues=[], type, ecosystem, tech, dateMvp, dateProd } = req.body;
    
    //NB validate before making db query
    if (!title || !overview || !image || !type || !ecosystem || !tech) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (!Array.isArray(features) || !Array.isArray(issues)) {
        return res.status(400).json({ message: 'Features and issues must be arrays' });
    }
    try {
            const newProject = await prisma.project.create({
            data: {
                title,
                overview,
                image,
                type: { connect: { id: Number(type) } },
                ecosystem: { connect: { id: Number(ecosystem) } },
                tech: { connect: { id: Number(tech) } },
                dateMvp: dateMvp ? new Date(dateMvp) : null,
                dateProd: dateProd ? new Date(dateProd) : null,
                features: {
                    create: features.map(f => ({ description: f }))
                },
                //maps over issues (+ features) array to create new issue (description) for each item in array. in issues/features table.
                issues: {
                    create: issues.map(i => ({ description: i }))
                }
            }
        });
        res.status(201).json(newProject);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Project already exists' });
        }
    }
};

//@desc Update a project project
//@route PATCH /projects/projects
//@access Private
const updateProject = async (req, res) => {
    const { id, title, overview, image, features = [], issues = [], type, ecosystem, tech, dateMvp, dateProd } = req.body;

    if (!id || !title || !overview || !image || !type || !ecosystem || !tech) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (!Array.isArray(features) || !Array.isArray(issues)) {
        return res.status(400).json({ message: 'Features and issues must be arrays' });
    }

    try {
        const updatedProject = await prisma.project.update({
            where: { id: Number(id) },
            data: {
                title,
                overview,
                image,
                type: { connect: { id: Number(type) } },
                ecosystem: { connect: { id: Number(ecosystem) } },
                tech: { connect: { id: Number(tech) } },
                dateMvp: dateMvp ? new Date(dateMvp) : null,
                dateProd: dateProd ? new Date(dateProd) : null,
                features: {
                    deleteMany: {}, // deletes existing features first
                    create: features.map(f => ({ description: f }))
                },
                issues: {
                    deleteMany: {}, // deletes existing issues first
                    create: issues.map(i => ({ description: i }))
                }
            }
        });

        res.json({ message: "Project updated", project: updatedProject });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: `Project with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Project title already in use' });
        }
    }
};

//@desc Delete a project
//@route DELETE /projects
//@access Private
const deleteProject = async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: 'Project ID required' });

  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ message: `Project with id ${id} deleted.` });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: `Project with id ${id} not found` });
    }
  }
};




export default {
    getAllProjects,
    addProject, 
    updateProject,
    deleteProject

}