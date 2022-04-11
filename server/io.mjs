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
	// console.log('a user connected', socket.id);

	socket.on('user:connect', async data => {
		const { user } = data;
		console.log('user:connect ', user);
		connectedUsers[socket.id] = { ...user, socketId: socket.id };

		const userRooms = await userRoomController.getUserRooms({
			userId: user.id,
		});

		// console.log('userRooms', userRooms);

		for (const room of userRooms) {
			socket.join(`${room.name}:${room.id}`);
		}

		// logStatus();
		console.log(socket.rooms);
	});

	socket.on('user:send:message', data => {
		// console.log('user:send:message', { data });

		const { room_name, room_id } = data;
		console.log(`${room_name}:${room_id}`);

		io.to(`${room_name}:${room_id}`).emit('server:broadcast:message', data);
	});

	socket.on('private:room:created', data => {
		console.log('private:room:created', data);

		const { room, contactData } = data;

		const contactSocket = Object.keys(connectedUsers).find(
			key => connectedUsers[key].nickname === contactData.nickname
		);

		if (contactSocket) {
			// notify contact in case it's connected
			io.sockets.sockets
				.get(contactSocket)
				.join(`${room.name}:${room.id}`);
		}

		socket.join(`${room.name}:${room.id}`);

		io.to(`${room.name}:${room.id}`).emit(
			'server:private:room:created',
			room
		);
	});

	socket.on('message:typing', (room, user) => {
		socket.broadcast
			.to(`${room.name}:${room.id}`)
			.emit('server:message:typing', {
				user: user.nickname,
				room,
			});
	});

	socket.on('message:stopped:typing', (room, user) => {
		socket.broadcast
			.to(`${room.name}:${room.id}`)
			.emit('server:message:stopped:typing', {
				user: user.nickname,
				room,
			});
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
