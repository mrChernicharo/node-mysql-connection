// import { io } from "https://cdn.socket.io/4.4.1/socket.io.min.js";

const appUser = {};
const nickInput = document.querySelector('#nick-input');
const form = document.querySelector('#nick-form');

// getUsers();

console.log(io, nickInput);

form.addEventListener('submit', async e => {
	e.preventDefault();
	console.log(nickInput.value);
	const userExists = await getUserByNick(nickInput.value);
	console.log({ userExists });
	const user = await createUser(nickInput.value);
	console.log({ user });
	// location.assign('/app/app.html');
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
	const res = await fetch(`http://127.0.0.1:3333/users?nick=${nick}`);
	const data = await res.json();

	return data;
}

async function createUser(value) {
	// todo check if exists

	// if (!user) {
	// create
	const res = await fetch('http://localhost:3333/users', {
		method: 'POST',
		body: JSON.stringify({
			nickname: value,
		}),
		headers: [['Content-Type', 'application/json']],
	});

	const data = await res.json();
	console.log(data);
	Object.keys(data).forEach(key => {
		appUser[key] = data[key];
	});

	localStorage.setItem('@user', JSON.stringify(data));
	return data;
	// } else {
	// return user;
	// }
}

feather.replace();
