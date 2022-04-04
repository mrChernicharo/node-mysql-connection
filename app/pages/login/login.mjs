// import { io } from "https://cdn.socket.io/4.4.1/socket.io.min.js";
import {
	setGlobalUser,
	createUser,
	fetchUserByNick,
	createRoom,
} from '../../utils/functions.mjs';

const nickInput = document.querySelector('#nick-input');
const form = document.querySelector('#nick-form');


form.addEventListener('submit', async e => {
	e.preventDefault();
	if (!nickInput.value) throw Error('We need your nickname');

	let user = await fetchUserByNick(nickInput.value);
	console.log(user ? 'known user' : 'new user');

	if (!user) {
		user = await createUser(nickInput.value);
		console.log('created user', { user });

		const roomName = user.nickname + ' space';
		const room = await createRoom(user.id, roomName, null);
		console.log('created room', { room });
	}

	setGlobalUser(user);

	console.log('...redirecting', user);
	const url = `/app/pages/main/?nickname=${encodeURIComponent(user.nickname)}`;
	console.log(url);
	setTimeout(
		() => { window.location.href = url },
		2000
	);
});

feather.replace();
