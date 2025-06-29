import prisma from '../../config/db.js';
import { logEvents } from '../../middleware/logger.js';

//CONTACT ROUTES

//@desc Get all contacts
//@route GET /personal/contacts
//@access Private

const getAllContacts =async (req, res) => {
    const contacts = await prisma.contact.findMany();
    if (!contacts.length) {
        //NB any errors not handled here will be handled by our error handline middleware
        return res.status(400).json({message: 'No messages found'})
    }
    res.json(contacts);
}

//@desc Get a contact
//@route GET /personal/contacts/:id
//@access Private
const getContactById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Contact ID required' });

    const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
    if (!contact) return res.status(404).json({ message: 'No messages found' });

    res.json(contact);
}

//@desc Create new contact
//@route POST /personal/contacts
//@access Private
const addContact = async (req, res, next) => {

    const { email, name, project, personal, message } = req.body;
    
    //NB validate before making db query
    if (!email || !name || !message) {
        return res.status(400).json({ message: "Missing required fields" });
    }    

    try {
        const data = {
            email,
            name,
            message
        }
        if (project) {
            data.project = { connect: { id: Number(project) } }
        }
        if (personal) {
            data.personal = { connect: { id: Number(personal) } }
        };
        const newContact = await prisma.contact.create({ data })   
        res.status(201).json(newContact);
    } catch (err) {
        if (err.code === 'P2002') {
            logEvents(`Duplicate field error: ${err.meta?.target}`, 'dbError.log');
            return res.status(409).json({ message: 'Contact already exists' });
        }
        next(err);      
    }
};

//@desc Delete a contact
//@route DELETE /personal/contacts
//@access Private
const deleteContact = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: 'Contact ID required' });
  try {
    await prisma.contact.delete({ where: { id: Number(id) } });
    res.json({ message: `Contact with id ${id} deleted.` });
  } catch (err) {
    if (err.code === 'P2025') {
        logEvents(`Record not found - ${req.method} ${req.originalUrl} - Target ID: ${id}`,'dbError.log');
        return res.status(404).json({ message: `Contact with id ${id} not found` });
    }
  }
};

export default {
    getAllContacts,
    getContactById,
    addContact,
    deleteContact
}