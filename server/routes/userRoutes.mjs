import { Router } from 'express';
import { userController } from '../controllers/userController.mjs';

const userRoutes = new Router();

userRoutes.get('/nick', async (req, res) => {
	try {
		const { nickname } = req.query;
		const data = await userController.getUserByNick({ nickname });

		res.json(data).status(200);
	} catch (err) {
		console.error(err);
	}
});

userRoutes.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await userController.getUserById({ id });

		res.json(data).status(200);
	} catch (err) {
		console.error(err);
	}
});

userRoutes.get('/', async (req, res) => {
	try {
		const data = await userController.listAllUsers();
		res.json(data).status(200);
	} catch (err) {
		console.error(err);
	}
});

userRoutes.post('/', async (req, res) => {
	try {
		const { nickname } = req.body;
		console.log(req.body);
		const data = await userController.createUser({ nickname });
		console.log(data);

		res.json(data).status(201);
	} catch (err) {
		console.error(err);
	}
});

userRoutes.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const data = await userController.deleteUser({ id });

		res.json(data).status(201);
	} catch (err) {
		console.error(err);
	}
});

userRoutes.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { nickname = '' } = req.body;

		const data = await userController.updateUser({ id, nickname });

		res.json(data).status(201);
	} catch (err) {
		console.error(err);
	}
});

export { userRoutes };
