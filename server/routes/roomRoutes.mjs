import { Router } from 'express';
import { roomsController } from '../controllers/roomsController.mjs';

const roomsRoutes = new Router();

roomsRoutes.get('/', async (req, res) => {
	const response = await roomsController.listAllRooms();
	// const data = await response.json();

	console.log(response);
	res.json(response);
});

roomsRoutes.post('/', async (req, res) => {
	const { roomName } = req.body;

	const response = await roomsController.createRoom({ roomName });
	// const data = await response.json();

	console.log(response);
	res.json(response);
});

export { roomsRoutes };
