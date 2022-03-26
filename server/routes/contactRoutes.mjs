import { Router } from 'express';
import { contactController } from '../controllers/contactController.mjs';
const contactRoutes = Router();

contactRoutes.get('/', async (req, res) => {
	const { userId } = req.query;

	const contacts = await contactController.getUserContacts({ userId });

	res.json(contacts).status(200);
});

export { contactRoutes };
