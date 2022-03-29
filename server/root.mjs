import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { userRoutes } from './routes/userRoutes.mjs';
import { roomRoutes } from './routes/roomRoutes.mjs';
import { userRoomRoutes } from './routes/userRoomRoutes.mjs';
import { messageRoutes } from './routes/messageRoutes.mjs';
import { contactRoutes } from './routes/contactRoutes.mjs';
dotenv.config();

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: '*',
	})
);

app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/user-room', userRoomRoutes);
app.use('/message', messageRoutes);
app.use('/contact', contactRoutes);
const server = http.createServer(app);

export { app, server };
