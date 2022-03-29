import dotenv from 'dotenv';
import { server } from './root.mjs';
import { Server } from 'socket.io';
dotenv.config();

const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', socket => {
	console.log('a user connected', socket.id);

	socket.on('sendMessage', msg => {
		socket.emit('messageReceived', msg);
	});

	// socket.on('messageReceived', msg => {
	// 	console.log('messageReceived', msg);
	// });

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

export { io };
