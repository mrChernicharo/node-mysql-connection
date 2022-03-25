import { Router } from 'express';
import { roomsController } from '../controllers/roomsController.mjs';

const roomsRoutes = new Router();

roomsRoutes.get('/:id', async (req, res) => {
	const { id } = req.params;

	const response = await roomsController.getRoomById({ id });
	res.json(response);
});

roomsRoutes.get('/', async (req, res) => {
	const response = await roomsController.listAllRooms();

	res.json(response);
});

roomsRoutes.get('/users/:roomId', async (req, res) => {
	const { roomId } = req.params;

	const response = await roomsController.getRoomUsers({ roomId });

	res.json(response);
});

roomsRoutes.post('/', async (req, res) => {
	const { roomName, userId } = req.body;

	console.log('received roomName:', roomName, ' and userId: ', userId);

	const response = await roomsController.createRoom({ roomName, userId });

	console.log('created room', response);
	res.json(response);
});

roomsRoutes.delete('/:id', async (req, res) => {
	const { id } = req.params;

	const response = await roomsController.deleteRoom({ id });
	res.json(response);
});

export { roomsRoutes };
