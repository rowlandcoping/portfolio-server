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
        const columnsArray = ['projectId', 'personalId', 'email', 'name', 'message'];
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
//@route DELETE /personal/contacts
//@access Private
const deleteContact = async (req, res, next) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Contact ID required' });

    try {
        const result = await query(
        `DELETE FROM "Contact" WHERE "id" = $1 RETURNING *`,
        [Number(id)]
        );

        if (!result.rows.length) {
        logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`, 'dbError.log');
        return res.status(404).json({ message: `Contact with id ${id} not found` });
        }

        res.json({ message: `Contact with id ${id} deleted.`, contact: result.rows[0] });

    } catch (err) {
        next(err);
    }
};

export default {
    getAllContacts,
    getContactById,
    addContact,
    deleteContact
}