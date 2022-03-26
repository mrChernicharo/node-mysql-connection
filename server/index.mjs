import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { userRoutes } from './routes/userRoutes.mjs';
import { roomRoutes } from './routes/roomRoutes.mjs';
import { userRoomRoutes } from './routes/userRoomRoutes.mjs';
import { messageRoutes } from './routes/messageRoutes.mjs';
import { contactRoutes } from './routes/contactRoutes.mjs';

const app = express();
app.use(
	cors({
		origin: '*',
	})
);

app.use(express.json());

const PORT = process.env.PORT || 3334;

app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/user-room', userRoomRoutes);
app.use('/message', messageRoutes);
app.use('/contact', contactRoutes);

app.listen(PORT, () => {
	console.log(`server listening at port:${PORT}`);
});
