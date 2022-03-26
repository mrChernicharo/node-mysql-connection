// import { io } from "https://cdn.socket.io/4.4.1/socket.io.min.js";
import {
	setGlobalUser,
	createUser,
	fetchUserByNick,
	createRoom,
} from './utils/functions.mjs';

const nickInput = document.querySelector('#nick-input');
const form = document.querySelector('#nick-form');

console.log(io, nickInput);

form.addEventListener('submit', async e => {
	e.preventDefault();
	console.log(nickInput.value);

	let user = await fetchUserByNick(nickInput.value);
	console.log(user ? 'known user' : 'new user');

	if (!user) {
		user = await createUser(nickInput.value);
		console.log('created user', { user });

		const roomName = user.nickname + ' space';
		const room = await createRoom(user.id, roomName);
		console.log('created room', { room });
	}

	setGlobalUser(user);

	console.log('...redirecting');
	setTimeout(() => location.assign('/app/app.html'), 3200);
});

feather.replace();
