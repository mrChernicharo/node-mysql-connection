// import { io } from "https://cdn.socket.io/4.4.1/socket.io.min.js";
import {
	setGlobalUser,
	createUser,
	fetchUserByNick,
	createRoom,
} from './assets/utils/functions.mjs';

const nickInput = document.querySelector('#nick-input');
const form = document.querySelector('#nick-form');

console.log(io, nickInput);

form.addEventListener('submit', async e => {
	e.preventDefault();
	console.log(nickInput.value);

	let user = await fetchUserByNick(nickInput.value);

	if (!user) {
		user = await createUser(nickInput.value);
		console.log('created user', { user });

		const roomName = user.nickname + ' space';
		const room = await createRoom(user.id, roomName);
		console.log('created room', { room });
	} else {
		console.log('known user logging in...', { user });
	}

	setGlobalUser(user);

	console.log('...redirecting');
	setTimeout(() => location.assign('/app/app.html'), 2500);
});

feather.replace();
