import { Router } from 'express';
import { messageController } from '../controllers/messageController.mjs';
const messageRoutes = Router();

messageRoutes.get('/:roomId', async (req, res) => {
	const { roomId } = req.params;

	const data = await messageController.getRoomMessages({ roomId });

	res.json(data).status(200);
});

messageRoutes.post('/', async (req, res) => {
	const { userId, roomId, text } = req.body;
	const data = await messageController.createMessage({
		userId,
		roomId,
		text,
	});

	res.json(data).status(200);
});

export { messageRoutes };
