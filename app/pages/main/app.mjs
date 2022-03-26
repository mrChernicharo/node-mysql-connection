import { fetchRoomsByUser } from '../../utils/functions.mjs';

const user = JSON.parse(localStorage.getItem('@user'));

const headerNick = document.querySelector('#nick-display');
const roomsList = document.querySelector('#rooms-list');

headerNick.textContent = user.nickname;

const rooms = await fetchRoomsByUser(user.id);

console.log('user', user);
console.log('rooms', rooms);

rooms.forEach(room => {
	const li = document.createElement('li');
	li.textContent = room.room;
	roomsList.appendChild(li);
});

feather.replace();
