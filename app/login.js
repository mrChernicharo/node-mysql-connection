// import { io } from "https://cdn.socket.io/4.4.1/socket.io.min.js";

const appUser = {};
const nickInput = document.querySelector('#nick-input');
const form = document.querySelector('#nick-form');

console.log(io, nickInput);

form.addEventListener('submit', async e => {
	e.preventDefault();
	console.log(nickInput.value);

	let user = await getUserByNick(nickInput.value);

	if (!user) user = await createUser(nickInput.value);

	setGlobalUser(user);

	location.assign('/app/app.html');
});

async function getUsers() {
	const res = await fetch('http://127.0.0.1:3333/users');
	const data = await res.json();

	return data;
}

async function getUserById(id) {
	const res = await fetch(`http://127.0.0.1:3333/users/${id}`);
	const data = await res.json();

	return data;
}

async function getUserByNick(nick) {
	const res = await fetch(
		`http://127.0.0.1:3333/users/nick?nickname=${nick}`
	);
	const data = await res.json();
	console.log({ data });

	return data;
}

async function createUser(nickname) {
	const res = await fetch('http://localhost:3333/users', {
		method: 'POST',
		body: JSON.stringify({
			nickname,
		}),
		headers: [['Content-Type', 'application/json']],
	});

	const data = await res.json();

	return data;
}

async function createRoom(roomName) {
	const res = await fetch('http://localhost:3333/rooms', {
		method: 'POST',
		body: JSON.stringify({
			roomName,
		}),
		headers: [['Content-Type', 'application/json']],
	});

	const data = await res.json();

	return data;
}

function setGlobalUser(userData) {
	Object.keys(userData).forEach(key => {
		appUser[key] = userData[key];
	});

	localStorage.setItem('@user', JSON.stringify(userData));

	console.log({ appUser, user });
}

feather.replace();
