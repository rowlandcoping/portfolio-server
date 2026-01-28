import { query } from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//CONTACT ROUTES

//@desc Get all contacts
//@route GET /personal/contacts
//@access Private
const getAllContacts =async (req, res) => {
    const result = await query('SELECT * FROM "Contact"');
    const contacts = result.rows;
    if (!contacts.length) {
        return res.status(404).json({message: 'No messages found'})
    }
    res.json(contacts);
}

//@desc Get a contact
//@route GET /personal/contacts/:id
//@access Private
const getContactById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Contact ID required' });

    const result = await query('SELECT * FROM "Contact" WHERE "id"=$1 LIMIT 1', [Number(id)]);
    const contact = result.rows[0];

    if (!contact) return res.status(404).json({ message: 'No messages found' });

    res.json(contact);
}

//@desc Return contacts by loggedin userId
//@route GET /personal/usercontacts
//@access Private
const getContactByUserId = async (req, res) => {
    const user = req.session?.userId;
    if (!user) return res.status(400).json({ message: 'User ID required' });
    
    try {
        const result = await query(`
            SELECT DISTINCT c.* 
            FROM "Contact" c
            LEFT JOIN "Personal" p ON c."personId" = p."id"
            WHERE p."userId" = $1
        `, [Number(user)]);
        
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No messages found' });
        }
        
        res.json(result.rows);

    } catch(err) {
        next(err);
    }
}

//@desc Create new contact
//@route POST /personal/contacts
//@access Private
const addContact = async (req, res, next) => {

    const publicId = req.headers['x-user-uuid'];
    const { projectId, email, name, message } = req.body;
    if (!publicId) {
        return res.status(400).json({ message: 'Missing user UUID header' });
    }
    const resultUser = await query('SELECT id FROM "User" WHERE "publicId"=$1 LIMIT 1', [publicId]);
    const user = resultUser.rows[0];


    const resultPersonal = await query('SELECT id FROM "Personal" WHERE "userId"=$1 LIMIT 1', [Number(user.id)]);
    const personal = resultPersonal.rows[0].id;

    //NB validate before making db query
    if (!email || !name || !message) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    

    try {
        const columnsArray = ['projectId', 'personId', 'email', 'name', 'message'];
        const values = [projectId ? Number(projectId) : null, Number(personal), email, name, message];
        //add quotes to preserve case for columns.
        const columnsQuery = columnsArray.map(col => `"${col}"`).join(', ');
        const placeholders = columnsArray.map((_, i) => `$${i + 1}`).join(', ');
        //NB the '_' ignores the values in the columns array, since the result is based on the indices and the order doesn't matter
        //This code avoids all the annoying counting and also separates the values from the query.
        

        //pass into query
        const result = await query(
            `INSERT INTO "Contact" (${columnsQuery}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        const newContact = result.rows[0]
        res.status(201).json(newContact);
    } catch (err) {
        if (err.code === '23505') {
            // 23505 = unique_violation
            return res.status(409).json({ message: "Contact already exists" });
        }
        next(err);
    }
};

//@desc Delete a contact
//@route DELETE /personal/contacts/:id
//@access Private
const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const { userId, roles } = req.session;
    if (!id || !userId || !roles.length) return res.status(400).json({ message: 'Missing Data' });

    try {
        const contactCheck = await query(`
            SELECT c.*, p."userId" 
            FROM "Contact" c
            JOIN "Personal" p ON c."personId" = p."id"
            WHERE c."id" = $1
        `, [Number(id)]);
        
        if (contactCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        const contact = contactCheck.rows[0];
        if (!roles.includes("admin") && !roles.includes("owner") && Number(contact.userId) !== Number(userId)) {
            logEvents('Unauthorised access attmpt', 'errLog.log');
            return res.status(403).json({ message: 'Permission Denied.' });
        }
    } catch(err) {
        next(err);
    }

    try {
        const result = await query(
        `DELETE FROM "Contact" WHERE "id" = $1 RETURNING *`,
        [Number(id)]
        );

        if (!result.rows.length) {
        logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`, 'dbError.log');
        return res.status(404).json({ message: `Contact with id ${id} not found` });
        }

        res.json({ message: `Message with id ${id} deleted.`, contact: result.rows[0] });

    } catch (err) {
        next(err);
    }
};

export default {
    getAllContacts,
    getContactById,
    getContactByUserId,
    addContact,
    deleteContact
}