import {
	fetchRoomsByUser,
	fetchUserContacts,
	fetchUserByNick,
	fetchUsersByRoom,
	fetchRoomMessages,
	createContact,
} from '../../utils/functions.mjs';

const user = JSON.parse(localStorage.getItem('@user'));

const headerNick = document.querySelector('#nick-display');
const roomsList = document.querySelector('#rooms-list');
const contactsList = document.querySelector('#contacts-list');

// Landing

headerNick.textContent = user.nickname;

const rooms = await fetchRoomsByUser(user.id);
const contacts = await fetchUserContacts(user.id);

console.log('user', user);
console.log('rooms', rooms);
console.log('contacts', contacts);

rooms.forEach(room => {
	const li = document.createElement('li');
	li.textContent = room.name;
	li.addEventListener('click', () => enterRoom(room));
	roomsList.appendChild(li);
});

contacts.forEach(contact => {
	const li = document.createElement('li');
	li.textContent = [contact.A, contact.B].filter(c => c !== user.nickname);
	contactsList.appendChild(li);
});

// Modal
const contactModal = document.querySelector('#contacts-modal');
const contactDetailBtn = document.querySelector('#contacts-detail-btn');
const contactForm = document.querySelector('#contact-form');
const contactSearchInput = document.querySelector('#contact-input');

contactDetailBtn.addEventListener('click', e => {
	console.log(e);
	contactModal.classList.toggle('closed');
});

contactForm.addEventListener('submit', async e => {
	e.preventDefault();
	const contactData = await fetchUserByNick(contactSearchInput.value);

	if (contactData) {
		// create contact
		const contact = await createContact(user.id, contactData.id);
		const li = document.createElement('li');

		li.textContent = contact.nickname;
		contactsList.appendChild(li);

		// TODO send invitation logic...
	} else {
		console.log('user not found');
	}
});

async function enterRoom(room) {
	// grab
	console.log('grabbing room data', { room });
	const { id, name } = room;

	const users = await fetchUsersByRoom(id);

	const messages = await fetchRoomMessages(id);

	const roomData = {
		id,
		name,
		users,
		messages,
	};
	console.log(roomData);
}

feather.replace();
