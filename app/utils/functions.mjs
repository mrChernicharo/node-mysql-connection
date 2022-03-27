const appUser = {};

async function fetchUsers() {
	const res = await fetch('http://localhost:3333/user');
	const data = await res.json();

	return data;
}

async function fetchUserById(id) {
	const res = await fetch(`http://localhost:3333/user/${id}`);
	const data = await res.json();

	return data;
}

async function fetchUserByNick(nickname) {
	const res = await fetch(
		`http://localhost:3333/user/nick?nickname=${nickname}`
	);
	const data = await res.json();
	console.log({ data });

	return data;
}

async function createUser(nickname) {
	const res = await fetch('http://localhost:3333/user', {
		method: 'POST',
		body: JSON.stringify({
			nickname,
		}),
		headers: [['Content-Type', 'application/json']],
	});

	const data = await res.json();

	return data;
}

async function createRoom(userId, roomName) {
	const res = await fetch('http://localhost:3333/room', {
		method: 'POST',
		body: JSON.stringify({
			roomName,
			userId,
		}),
		headers: [['Content-Type', 'application/json']],
	});

	const data = await res.json();

	return data;
}

async function fetchRoomsByUser(userId) {
	const res = await fetch(`http://localhost:3333/user-room/rooms/${userId}`);
	const data = await res.json();
	return data;
}

async function fetchUsersByRoom(roomId) {
	const res = await fetch(`http://localhost:3333/user-room/users/${roomId}`);
	const data = await res.json();
	return data;
}

async function fetchUserContacts(userId) {
	const res = await fetch(`http://localhost:3333/contact?userId=${userId}`);
	const data = await res.json();
	console.log('contacts', { data });
	return data;
}

async function createContact(userId, contactId) {
	const res = await fetch(`http://localhost:3333/contact`, {
		method: 'POST',
		body: JSON.stringify({
			userId,
			contactId,
		}),
		headers: [['Content-Type', 'application/json']],
	});
	const data = await res.json();
	return data;
}

async function fetchRoomMessages(roomId) {
	console.log({ roomId });
	const res = await fetch(`http://localhost:3333/message/${roomId}`);
	const data = await res.json();

	return data;
}

/**
 *   Room {
 * 		id,
 * 		name,
 *  	users: [
 * 			{ id, nickname }, { id, nickname }
 * 		],
 * 		messages: [
 * 			{ id, user, text }
 * 		]
 *   }
 *
 * 	room: id, name
 * 	user_room: user_id
 *  messages: *
 */

function setGlobalUser(userData) {
	console.log(userData);

	Object.keys(userData).forEach(key => {
		appUser[key] = userData[key];
	});

	localStorage.setItem('@user', JSON.stringify(userData));

	console.log({ appUser, userData });
}

export {
	fetchUsers,
	fetchUserById,
	fetchUserByNick,
	fetchRoomsByUser,
	fetchUsersByRoom,
	fetchUserContacts,
	fetchRoomMessages,
	createUser,
	createRoom,
	createContact,
	setGlobalUser,
};
