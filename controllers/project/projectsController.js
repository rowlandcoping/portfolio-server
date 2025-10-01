import fs from 'fs';
import path from 'path';
import { query } from '../../config/db.js';
import pool from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//PROJECT ROUTES

//@desc Get all projects
//@route GET /projects
//@access Private

const getAllProjects =async (req, res) => {
    const result = await query('SELECT * FROM "Project"');
    const projects = result.rows;
    if (!projects.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No projects found'})
    }
    res.json(projects);
}

//@desc Get all projects for user's portfolio
//@route GET /projects/provider
//@access Public

const getAllPortfolioProjects =async (req, res, next) => {
    const publicId = req.headers['x-user-uuid'];
    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }

    const result = await query('SELECT "id" FROM "User" WHERE "publicId"=$1 LIMIT 1', [publicId]);
    const user = result.rows[0];
    
    try {
        const result = await query(`
            SELECT
                pr."id",
                pr."name",
                pr."overview",
                pr."url",
                pr."repo",
                pr."imageOrg",
                pr."imageGrn",
                pr."imageAlt",
                pr."live",
                pr."dateMvp",
                pr."dateProd",
                pr."userId",
                pr."typeId",
                (
                    SELECT COALESCE(json_agg(json_build_object(
                        'id', f."id",
                        'description', f."description",
                        'projectId', f."projectId"
                    ) ORDER BY f."id"), '[]'::json)
                    FROM "Feature" f
                    WHERE f."projectId" = pr."id"
                ) AS "features",
                (
                    SELECT COALESCE(json_agg(json_build_object(
                        'id', i."id",
                        'description', i."description",
                        'projectId', i."projectId"
                    ) ORDER BY i."id"), '[]'::json)
                    FROM "Issue" i
                    WHERE i."projectId" = pr."id"
                ) AS "issues",
                (
                    SELECT COALESCE(json_agg(
                        json_build_object(
                            'id', pe."id",
                            'name', pe."name",
                            'ecosystem', row_to_json(e),
                            'tech', (
                                SELECT COALESCE(json_agg(json_build_object(
                                    'id', t."id",
                                    'name', t."name",
                                    'ecoId', t."ecoId",
                                    'typeId', t."typeId"
                                ) ORDER BY t."name"), '[]'::json)
                                FROM "_ProjectTech" pt
                                JOIN "Tech" t ON t."id" = pt."B"
                                WHERE pt."A" = pe."id"
                            )
                        ) ORDER BY pe."name"
                    ), '[]'::json)
                    FROM "ProjectEcosystem" pe
                    JOIN "Ecosystem" e ON e."id" = pe."ecoId"
                    WHERE pe."projectId" = pr."id"
                ) AS "projectEcosystem"
            FROM "Project" pr
            WHERE pr."userId" = $1
            ORDER BY pr."dateMvp" DESC;
        `, [Number(user.id)]);
        const projects = result.rows;

        if (!projects.length) {
            //NB any errors not handled here will be handled by our error handline middleware
            return res.status(404).json({message: 'No data found'})
        }
        res.json(projects); 
    } catch (err) {
        next(err);
    }
}

//@desc Get a project
//@route GET /projects/:id
//@access Private
const getProjectById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project ID required' });
    const result = await query('SELECT * FROM "Project" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const project = result.rows[0];
    if (!project) return res.status(404).json({ message: 'No project found' });
    res.json(project);
}

//@desc Get a project
//@route GET /projects/features/:id
//@access Private
const getFeaturesByProjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project ID required' });
    const result = await query('SELECT * FROM "Feature" WHERE "projectId"=$1', [Number(id)]);
    const features = result.rows;
    if (!features.length) return res.status(404).json({ message: 'No features found' });
    res.json(features);
}

//@desc Get a project
//@route GET /projects/issues/:id
//@access Private
const getIssuesByProjectId = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Project ID required' });
    const result = await query('SELECT * FROM "Issue" WHERE "projectId"=$1', [Number(id)]);
    const issues = result.rows;
    if (!issues.length) return res.status(404).json({ message: 'No issues found' });
    res.json(issues);
}

//@desc Create new feature
//@route POST /projects
//@access Private
const addProject = async (req, res, next) => {
    //NB features = [] defaults to empty array if there is no value.
    const { name, overview, url, repo, imageAlt, features=[], issues=[], type, dateMvp, dateProd, user } = req.body;
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

    const result = await query('SELECT "id" FROM "Personal" WHERE "userId"=$1 LIMIT 1', [Number(userId)]);
    const personal = result.rows[0].id;

    if (!result) {
        return res.status(404).json({ message: 'Profile not found for user' });
    }

    //NB validate before making db query
    if (!name || !overview || !type || !url ||!repo) {
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

    const client = await pool.connect();
    try {
        //package all the updates into a single transaction
        await client.query('BEGIN');

        //create project
        const columnsArray = [
            'name', 
            'overview', 
            'url', 
            'repo',
            'imageAlt',
            'imageOrg',
            'imageGrn',
            'typeId',
            'userId',
            'personId',
            'dateMvp',
            'dateProd',
        ];
        const values = [
            name,
            overview,
            url,
            repo,
            imageAlt,
            imageOrg, 
            imageGrn,
            type,
            userId,
            personal,
            dateMvp ? new Date(dateMvp) : null,
            dateProd ? new Date(dateProd) : null
        ];
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');

        const result = await client.query(
            `INSERT INTO "Project" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        const project = result.rows[0];

        //Add Features
        if (featureArray.length) {
            //creates flat array of values (ie the description from the features array, followed by the project id)
            const featureValues = featureArray.flatMap((feature, i) => [feature, project.id]);
            //creates placeholders for these values in tuples so that SQL can use it
            const featurePlaceholders = featureArray
                .map((_, i) => `($${i*2+1}, $${i*2+2})`)
                .join(', ');
            //do query
            await client.query(
                `INSERT INTO "Feature" ("description", "projectId")
                VALUES ${featurePlaceholders}`,
                featureValues
            );
        }
        //Add Issues
        if (issueArray.length) {            
            const issueValues = issueArray.flatMap((issue, i) => [issue, project.id]);
            const issuePlaceholders = issueArray
                .map((_, i) => `($${i*2+1}, $${i*2+2})`)
                .join(', ');
            //do query
            await client.query(
                `INSERT INTO "Issue" ("description", "projectId")
                VALUES ${issuePlaceholders}`,
                issueValues
            );
        }
        await client.query('COMMIT');
        res.status(201).json({ message: "project created", project});      
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Project already exists' });
        }                
        next(err);
    } finally {
        client.release(); // always release the client
    }  
};

//@desc Update a project
//@route PATCH /projects/projects
//@access Private
const updateProject = async (req, res, next) => {
    const { id, user, name, url, repo, imageAlt, overview, features, issues, type, dateMvp, dateProd, oldOriginal, oldTransformed } = req.body;

    if (!id || !name || !overview || !type || !url ||!repo) {
        return res.status(400).json({ message: "Missing required fields" });
    }


    const result = await query('SELECT "id" FROM "Personal" WHERE "userId"=$1 LIMIT 1', [Number(user)]);
    if (!result && user) {
        return res.status(404).json({ message: 'Profile not found for selected user.  Create a profile first.' });
    }

    const personal = Number(result.rows[0].id);
    const featureArray = JSON.parse(features);
    const issueArray = JSON.parse(issues);

    if (!Array.isArray(featureArray) || !Array.isArray(issueArray)) {
        return res.status(400).json({ message: 'Features and issues must be arrays' });
    }

    const uploadDir = path.join(process.cwd(), 'images');
    const imageOrg = req.files?.original?.[0]
        ? `/images/${req.files.original[0].filename}`
        : undefined;
    const imageGrn = req.files?.transformed?.[0]
        ? `/images/${req.files.transformed[0].filename}`
        : undefined;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        //create project
        const columnsArray = [
            'name', 
            'overview', 
            'url', 
            'repo',
            'imageAlt',
            'typeId',
            'userId',
            'personId',
            'dateMvp',
            'dateProd',
        ];
        const values = [
            name,
            overview,
            url,
            repo,
            imageAlt,
            type,
            user,
            personal,
            dateMvp ? new Date(dateMvp) : null,
            dateProd ? new Date(dateProd) : null
        ];

        if (imageOrg !== undefined) {
            columnsArray.push('imageOrg', 'imageGrn');
            values.push(imageOrg, imageGrn);
        }
        const columnsQuery = columnsArray.map((col, i) => `"${col}"=$${i + 1}`).join(', ');

        const result = await client.query(
            `UPDATE "Project" SET ${columnsQuery} WHERE "id"=$${columnsArray.length+1} RETURNING *`,
                [...values, Number(id)]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Project with id ${id} not found` });
        }
        
        await client.query(`DELETE FROM "Feature" WHERE "projectId" = $1`, [Number(id)]);
        await client.query(`DELETE FROM "Issue" WHERE "projectId" = $1`, [Number(id)]);

        //Add Features
        if (featureArray.length) {
            //creates flat array of values (ie the description from the features array, followed by the project id)
            const featureValues = featureArray.flatMap((feature, i) => [feature, Number(id)]);
            //creates placeholders for these values in tuples so that SQL can use it
            const featurePlaceholders = featureArray
                .map((_, i) => `($${i*2+1}, $${i*2+2})`)
                .join(', ');
            //do query
            await client.query(
                `INSERT INTO "Feature" ("description", "projectId")
                VALUES ${featurePlaceholders}`,
                featureValues
            );
        }
        //Add Issues
        if (issueArray.length) {            
            const issueValues = issueArray.flatMap((issue, i) => [issue, Number(id)]);
            const issuePlaceholders = issueArray
                .map((_, i) => `($${i*2+1}, $${i*2+2})`)
                .join(', ');
            //do query
            await client.query(
                `INSERT INTO "Issue" ("description", "projectId")
                VALUES ${issuePlaceholders}`,
                issueValues
            );
        }
        await client.query('COMMIT');
        try {
            if (imageOrg && oldOriginal) {
                await fs.promises.unlink(path.join(uploadDir, oldOriginal));
            }
            if (imageGrn && oldTransformed) {
                await fs.promises.unlink(path.join(uploadDir, oldTransformed));
            }
        } catch (err) {
            logEvents(`Failed to delete transformed file: ${oldTransformed}. Error: ${err.message}`, 'fileErrors.log');
            next(err);
        }

        const updatedProject = result.rows[0];
        res.json({ message: "Project updated", project: updatedProject });
    } catch (err) {
        await client.query('ROLLBACK');
        if (err.code === '23505') {
            logEvents(`Duplicate field error: ${err.constraint}: ${err.detail}`, 'dbError.log');
            return res.status(409).json({ message: 'Project title already in use' });
        }
        next(err)
    } finally {
        client.release(); // always release the client
    }
};

//@desc Delete a project
//@route DELETE /projects
//@access Private
const deleteProject = async (req, res, next) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Project ID required' });

    //retrieve image links
    const result = await query('SELECT "imageGrn", "imageOrg" FROM "Project" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: `Project with id ${id} not found` });
    }
    const project = result.rows[0];
    const imagePath = path.join(process.cwd(), project.imageGrn);
    const originalPath = path.join(process.cwd(), project.imageOrg);

    try {
        const result = await query(
            `DELETE FROM "Project" WHERE "id" = $1 RETURNING "id"`,
            [Number(id)]
        );
        //remove images
        try {
            await fs.promises.unlink(path.resolve(imagePath));
            await fs.promises.unlink(path.resolve(originalPath));
        } catch (err) {
            logEvents(`File deletion error: ${err.message}`, 'fileErrors.log');
            next(err);
        }
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