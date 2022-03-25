const appUser = {};

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

async function getUserRooms(id) {
	const res = await fetch(`http://localhost:3333/users/rooms/${id}`);
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
	console.log(userData);

	Object.keys(userData).forEach(key => {
		appUser[key] = userData[key];
	});

	localStorage.setItem('@user', JSON.stringify(userData));

	console.log({ appUser, userData });
}

export { getUsers, getUserById, getUserByNick, createUser, setGlobalUser, createRoom, getUserRooms }