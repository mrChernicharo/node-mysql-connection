import { Router } from 'express';
import { usersController } from '../controllers/usersController.mjs';

const usersRoutes = new Router();

usersRoutes.get('/', async (req, res) => {
	try {
		const data = await usersController.listAllUsers();
		res.json(data).status(200);
	} catch (err) {
		console.error(err);
	}
});

usersRoutes.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await usersController.getUserById({ id });

		res.json(data).status(200);
	} catch (err) {
		console.error(err);
	}
});

usersRoutes.post('/', async (req, res) => {
	try {
		const { name, email } = req.body;
		const data = await usersController.createUser({ name, email });
		res.status(203);
	} catch (err) {
		console.error(err);
	}
});

usersRoutes.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await usersController.deleteUser({ id });

		res.json(data).status(201);
	} catch (err) {
		console.error(err);
	}
});

usersRoutes.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { user } = req.body;
		const data = await usersController.updateUser({ id });

		res.json(data).status();
	} catch (err) {
		console.error(err);
	}
});

export { usersRoutes };
