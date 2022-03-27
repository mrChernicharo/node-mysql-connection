import { Router } from 'express';
import { messageController } from '../controllers/messageController.mjs';
const messageRoutes = Router();

messageRoutes.get('/:roomId', async (req, res) => {
	const { roomId } = req.params;

	const data = await messageController.getRoomMessages({ roomId });

	res.json(data).status(200);
});

export { messageRoutes };
