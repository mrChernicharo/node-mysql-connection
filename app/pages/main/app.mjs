import { fetchRoomsByUser } from '../../utils/functions.mjs';

const user = JSON.parse(localStorage.getItem('@user'));

const headerNick = document.querySelector('#nick-display');
const roomsList = document.querySelector('#rooms-list');
const contactsList = document.querySelector('#contacts-list');

headerNick.textContent = user.nickname;

const rooms = await fetchRoomsByUser(user.id);
const contacts = await fetchUserContacts(user.id);

console.log('user', user);
console.log('rooms', rooms);
console.log('contacts', contacts);

rooms.forEach(room => {
	const li = document.createElement('li');
	li.textContent = room.room;
	roomsList.appendChild(li);
});

contactsList.forEach(contact => {
	const li = document.createElement('li');
	li.textContent = 'contact';
	roomsList.appendChild(li);
});

feather.replace();
