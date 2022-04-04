import dotenv from 'dotenv';
import { server } from './root.mjs';
import { Server } from 'socket.io';
import { userRoomController } from './controllers/userRoomController.mjs';
import { roomController } from './controllers/roomController.mjs';
dotenv.config();

const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

const connectedUsers = {};
// const rooms = {}
// console.log(allRooms);

io.on('connection', async socket => {
	console.log('a user connected', socket.id);

	socket.on('user:connect', async data => {
		const { user } = data;
		console.log('user:connect ', user);
		connectedUsers[socket.id] = { ...user, socketId: socket.id };

		const userRooms = await userRoomController.getUserRooms({
			userId: user.id,
		});

		console.log('userRooms', userRooms);

		for (const room of userRooms) {
			socket.join(`${room.name}:${room.id}`);
		}

		logStatus();
	});

	socket.on('user:send:message', data => {
		console.log('user:send:message', { data });
		console.log({ socketRooms: socket.rooms });

		// const { message_id, text, created_at, user, room_id } = data;
		// socket.emit('server:broadcast:message', data);
		socket
			// broadcast
			// .in(`${data.room_name}:${data.room_id}`)
			.emit('server:broadcast:message', data);
	});

	socket.on('disconnect', () => {
		console.log('disconnecting user', connectedUsers[socket.id]);

		delete connectedUsers[socket.id];
		logStatus();
	});
});

const logStatus = () => {
	console.log(
		`connections count: ${Object.keys(connectedUsers).length}`
		//  { connectedUsers }
	);
};

export { io };
