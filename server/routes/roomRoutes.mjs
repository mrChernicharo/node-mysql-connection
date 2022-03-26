import { Router } from 'express';
import { roomController } from '../controllers/roomController.mjs';

const roomRoutes = new Router();

roomRoutes.get('/:id', async (req, res) => {
	const { id } = req.params;

	const response = await roomController.getRoomById({ id });
	res.json(response);
});

roomRoutes.get('/', async (req, res) => {
	const response = await roomController.listAllRooms();

	res.json(response);
});

// roomRoutes.get('/users/:roomId', async (req, res) => {
// 	const { roomId } = req.params;

// 	const response = await roomController.getRoomUsers({ roomId });

// 	res.json(response);
// });

roomRoutes.post('/', async (req, res) => {
	const { roomName, userId } = req.body;

	console.log('received roomName:', roomName, ' and userId: ', userId);

	const response = await roomController.createRoom({ roomName, userId });

	console.log('created room', response);
	res.json(response);
});

roomRoutes.delete('/:id', async (req, res) => {
	const { id } = req.params;

	const response = await roomController.deleteRoom({ id });
	res.json(response);
});

export { roomRoutes };
