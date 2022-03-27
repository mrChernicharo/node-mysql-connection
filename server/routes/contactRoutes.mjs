import { Router } from 'express';
import { contactController } from '../controllers/contactController.mjs';
const contactRoutes = Router();

contactRoutes.get('/', async (req, res) => {
	const { userId } = req.query;

	const contacts = await contactController.getUserContacts({ userId });

	res.json(contacts).status(200);
});

contactRoutes.post('/', async (req, res) => {
	const { userId, contactId } = req.body;
	console.log({ userId, contactId });

	const contact = await contactController.createContact({
		userId,
		contactId,
	});

	res.json(contact).status(200);
});

export { contactRoutes };
