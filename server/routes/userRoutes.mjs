import { Router } from 'express';
import { usersController } from '../controllers/usersController.mjs';

const usersRoutes = new Router();

usersRoutes.get('/nick', async (req, res) => {
	try {
		const { nickname } = req.query;
		const data = await usersController.getUserByNick({ nickname });

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
		console.log(req.body);
		const data = await usersController.createUser({ nickname });
		console.log(data);

		res.json(data).status(201);
	} catch (err) {
		console.error(err);
	}
});

usersRoutes.get('/rooms/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		console.log('received ', userId);

		const rooms = await usersController.getUserRooms({ userId });

		res.json(rooms).status(200);
	} catch (err) {}
});

export { usersRoutes };

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
