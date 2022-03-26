import { Router } from 'express';
import { userRoomController } from '../controllers/userRoomController.mjs';

const userRoomRoutes = Router();

userRoomRoutes.get('/rooms/:userId', async (req, res) => {
	const { userId } = req.params;

	const rooms = await userRoomController.getUserRooms({ userId });

	res.json(rooms);
});

userRoomRoutes.get('/users/:roomId', async (req, res) => {
	const { roomId } = req.params;

	const users = await userRoomController.getRoomUsers({ roomId });

	res.json(users);
});

userRoomRoutes.post('/', (req, res) => {
	const {} = req.body;
});

export { userRoomRoutes };
