import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { userRoutes } from './routes/userRoutes.mjs';
import { roomRoutes } from './routes/roomRoutes.mjs';
import { userRoomRoutes } from './routes/userRoomRoutes.mjs';
import { messageRoutes } from './routes/messageRoutes.mjs';
import { contactRoutes } from './routes/contactRoutes.mjs';
import { Server } from 'socket.io';
dotenv.config();

const app = express();


app.use(
	cors({
		origin: '*',
	})
);

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

io.listen('3334')

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

});

console.log(io._path)


const PORT = process.env.PORT || 3333;

app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/user-room', userRoomRoutes);
app.use('/message', messageRoutes);
app.use('/contact', contactRoutes);

app.listen(PORT, () => {
	console.log(`server listening at port:${PORT}`);
});
