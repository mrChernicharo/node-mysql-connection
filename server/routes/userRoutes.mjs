import { Router } from 'express';
import { usersController } from '../controllers/usersController.mjs';

const usersRoutes = new Router();

usersRoutes.get('/nick', async (req, res) => {
	try {
		const { nick } = req.query;
		console.log(nick);
		const data = await usersController.getUserByNick({ nick });

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

usersRoutes.get('/', async (req, res) => {
	try {
		const data = await usersController.listAllUsers();
		res.json(data).status(200);
	} catch (err) {
		console.error(err);
	}
});

usersRoutes.post('/', async (req, res) => {
	try {
		const { nickname } = req.body;
		const data = await usersController.createUser({ nickname });
		console.log(data);

		res.json(data).status(201);
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
		const { nickname = '' } = req.body;

		const data = await usersController.updateUser({ id, nickname });

		res.json(data).status(201);
	} catch (err) {
		console.error(err);
	}
});

export { usersRoutes };
