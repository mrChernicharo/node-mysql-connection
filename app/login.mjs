// import { io } from "https://cdn.socket.io/4.4.1/socket.io.min.js";

import { setGlobalUser, createUser, getUserByNick, createRoom } from "./assets/utils/functions.mjs";

const nickInput = document.querySelector('#nick-input');
const form = document.querySelector('#nick-form');

console.log(io, nickInput);

form.addEventListener('submit', async e => {
	e.preventDefault();
	console.log(nickInput.value);

	let user = await getUserByNick(nickInput.value);

	if (!user) {
		user = await createUser(nickInput.value);

		const roomName = nickInput.value + " space"
		const room = await createRoom(roomName);
		console.log('room', room);
	};

	setGlobalUser(user);

	location.assign('/app/app.html');
});


feather.replace();
