import fs from 'fs';
import path from 'path';
import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//PROJECT ROUTES

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

//@desc Get all projects for user's portfolio
//@route GET /projects/provider
//@access Public

const getAllPortfolioProjects =async (req, res) => {
    const publicId = req.headers['x-user-uuid'];
    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const user = await prisma.user.findUnique({
        where: { publicId }
    })

    const projects = await prisma.project.findMany({
        where: { userId: user.id },
        include: {
            features: true,
            issues: true,
            projectEcosystem: {
                select: {
                    ecosystem: true,
                    tech: true,
                }
            }
        }
    });
    if (!projects.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No projects found'})
    }
    res.json(projects);
}

//@desc Get a project
//@route GET /projects/:id
//@access Private
const getProjectById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project ID required' });

    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!project) return res.status(404).json({ message: 'No project found' });

    res.json(project);
}

//@desc Get a project
//@route GET /projects/features/:id
//@access Private
const getFeaturesByProjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project ID required' });

    const features = await prisma.feature.findMany({ where: { projectId: Number(id) } });
    if (!features) return res.status(404).json({ message: 'No features found' });

    res.json(features);
}

//@desc Get a project
//@route GET /projects/issues/:id
//@access Private
const getIssuesByProjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project ID required' });

    const issues = await prisma.issue.findMany({ where: { projectId: Number(id) } });
    if (!issues) return res.status(404).json({ message: 'No issues found' });

    res.json(issues);
}

//@desc Create new feature
//@route POST /projects
//@access Private
const addProject = async (req, res, next) => {
    //NB features = [] defaults to empty array if there is no value.
    const { name, overview, url, imageAlt, features=[], issues=[], type, dateMvp, dateProd, user } = req.body;
    const id = req.session?.userId;
    const featureArray = JSON.parse(features);    
    const issueArray = JSON.parse(issues);

    let userId
    if (!user) {
        userId = id
    } else {
        userId = user;
    }
    if (!userId) {
        return res.status(401).json({ message: 'User not found'});
    }

    const result = await prisma.personal.findUnique({ 
        where: { userId: Number(userId) },
        select: { id: true }   
    });
    const personal = Number(result.id);

    if (!result) {
        return res.status(404).json({ message: 'Profile not found for user' });
    }

    //NB validate before making db query
    if (!name || !overview || !type || !url) {
        return res.status(400).json({ message: "Missing required fields" });
    }
     
    if (!Array.isArray(featureArray) || !Array.isArray(issueArray)) {
        return res.status(400).json({ message: 'Features and issues must be arrays' });
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
        //set data outside of db call 
        const data = {
            name,
            overview,
            url,
            imageAlt,
            imageOrg,
            imageGrn,
            type: { connect: { id: Number(type) } },
            user: { connect: { id: Number(userId) } },
            personal: { connect: { id: Number(personal) } },
            dateMvp: dateMvp ? new Date(dateMvp) : null,
            dateProd: dateProd ? new Date(dateProd) : null,
            features: {
                create: featureArray.map(f => ({ description: f }))
            },
            issues: {
                create: issueArray.map(i => ({ description: i }))
            }
        }
        const newProject = await prisma.project.create({ data });
        res.status(201).json({ message: "project created", project: newProject});
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Project already exists' });
        }
        console.log(err.stack);
        next(err);
    }
};

//@desc Update a project project
//@route PATCH /projects/projects
//@access Private
const updateProject = async (req, res, next) => {
    const { id, user, name, url, imageAlt, overview, features, issues, type, dateMvp, dateProd, oldOriginal, oldTransformed } = req.body;

    if (!id || !name || !overview || !type || !url) {
        return res.status(400).json({ message: "Missing required fields" });
    }


    const result = await prisma.personal.findUnique({ 
        where: { userId: Number(user) },
        select: { id: true }   
    });
    if (!result && user) {
        return res.status(404).json({ message: 'Profile not found for selected user.  Create a profile first.' });
    }

    const personal = Number(result.id);
    const featuresArray = JSON.parse(features);
    const issuesArray = JSON.parse(issues);

    if (!Array.isArray(featuresArray) || !Array.isArray(issuesArray)) {
        return res.status(400).json({ message: 'Features and issues must be arrays' });
    }

    const uploadDir = path.join(process.cwd(), 'images');
    const imageOrg = req.files?.original?.[0]
        ? `/images/${req.files.original[0].filename}`
        : undefined;
    const imageGrn = req.files?.transformed?.[0]
        ? `/images/${req.files.transformed[0].filename}`
        : undefined;

    try {        
        const updatedProject = await prisma.project.update({
            where: { id: Number(id) },
            data: {
                user: { connect: { id: Number(user) } },
                personal: { connect: { id: Number(personal) } },
                name,
                overview,
                url,
                imageAlt,
                imageOrg,
                imageGrn,
                type: { connect: { id: Number(type) } },                
                dateMvp: dateMvp ? new Date(dateMvp) : null,
                dateProd: dateProd ? new Date(dateProd) : null,
                features: {
                    deleteMany: {}, // deletes existing features first
                    create: featuresArray.map(f => ({ description: f }))
                },
                issues: {
                    deleteMany: {}, // deletes existing issues first
                    create: issuesArray.map(i => ({ description: i }))
                }
            }
        });
        if (req.files.original && oldOriginal) {
            fs.unlink(path.join(uploadDir, oldOriginal), (err) => {
                if (err) console.error('Failed to delete old original file:', err);
            });
        }
        if (req.files.transformed && oldTransformed) {
            fs.unlink(path.join(uploadDir, oldTransformed), (err) => {
                if (err) console.error('Failed to delete old transformed file:', err);
            });
        }
        res.json({ message: "Project updated", project: updatedProject });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Project with id ${id} not found` });
        }
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Project title already in use' });
        }
        console.log(err.message)
        next(err)
    }
};

//@desc Delete a project
//@route DELETE /projects
//@access Private
const deleteProject = async (req, res, next) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Project ID required' });

    //retrieve image links
    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    const imagePath = path.join(process.cwd(), '.' + project.imageGrn);
    const originalPath = path.join(process.cwd(), '.' + project.imageOrg);

    try {
        await prisma.project.delete({ where: { id: Number(id) } });
        //remove images
        await fs.unlink(path.resolve(imagePath), (err) => {
            if (err) console.error('Failed to delete old transformed file:', err);
        });
        await fs.unlink(path.resolve(originalPath), (err) => {
            if (err) console.error('Failed to delete old original file:', err);
        });
        res.json({ message: `Project with id ${id} deleted.` });
    } catch (err) {
        if (err.code === 'P2025') {
            logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
            return res.status(404).json({ message: `Project with id ${id} not found` });
        }
        next(err);
    }
};

export default {
    getAllProjects,
    getAllPortfolioProjects,
    getProjectById,
    getFeaturesByProjectId,
    getIssuesByProjectId,
    addProject, 
    updateProject,
    deleteProject
}