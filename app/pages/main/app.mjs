import {
	fetchRoomsByUser,
	fetchUserContacts,
	fetchUserByNick,
	fetchUsersByRoom,
	fetchRoomMessages,
	createContact,
	createMessage,
} from '../../utils/functions.mjs';

// Global
const user = JSON.parse(localStorage.getItem('@user'));
let currentRoom = null;
// Landing
const headerNick = document.querySelector('#nick-display');
const roomsList = document.querySelector('#rooms-list');
const contactsList = document.querySelector('#contacts-list');
// ContactModal
const contactModal = document.querySelector('#contact-modal');
const contactDetailBtn = document.querySelector('#contacts-detail-btn');
const contactForm = document.querySelector('#contact-form');
const contactSearchInput = document.querySelector('#contact-input');
// RoomArea
const roomArea = document.querySelector('#room-area');
const roomTitle = document.querySelector('#room-title');
const roomUsersList = document.querySelector('#room-users');
const roomCloseBtn = document.querySelector('#room-close');
const contactModalCloseBtn = document.querySelector('#contact-modal-close');
const messagesArea = document.querySelector('#messages-area');
const sendMessageForm = document.querySelector('#send-message-form');
const messageInput = document.querySelector('#message-input');

// Landing
await initPage();

await appendListeners();

async function initPage() {
	headerNick.textContent = user.nickname;

	const rooms = await fetchRoomsByUser(user.id);
	const contacts = await fetchUserContacts(user.id);

	rooms.forEach(room => {
		const li = document.createElement('li');
		li.textContent = room.name;
		li.addEventListener('click', () => enterRoom(room));
		roomsList.appendChild(li);
	});
	contacts.forEach(contact => {
		const li = document.createElement('li');
		li.textContent = [contact.A, contact.B].filter(
			c => c !== user.nickname
		);
		contactsList.appendChild(li);
	});
}

async function appendListeners() {
	contactDetailBtn.addEventListener('click', e => {
		contactModal.classList.toggle('closed');
	});
	contactModalCloseBtn.addEventListener('click', e => {
		contactModal.classList.add('closed');
	});
	roomCloseBtn.addEventListener('click', e => {
		roomArea.classList.add('closed');
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
	sendMessageForm.addEventListener('submit', async e => {
		e.preventDefault();

		const data = await createMessage(
			user.id,
			currentRoom.id,
			messageInput.value
		);
		console.log('created message!', data);
		await refreshMessagesArea();
	});
}

async function enterRoom(room) {
	console.log('grabbing room data', { room });
	currentRoom?.id === room.id
		? roomArea.classList.toggle('closed')
		: roomArea.classList.remove('closed');

	currentRoom = { ...room };
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

	roomTitle.textContent = name;
	roomUsersList.innerHTML = '';
	users.forEach(user => {
		const li = document.createElement('li');
		li.textContent = user.user;
		roomUsersList.appendChild(li);
	});

	messagesArea.innerHTML = '';
	messages.forEach(msg => {
		const li = document.createElement('li');
		li.textContent = `${msg.user}: ${msg.text}`;
		messagesArea.appendChild(li);
	});
}

async function refreshMessagesArea() {
	const messages = await fetchRoomMessages(currentRoom.id);
	messagesArea.innerHTML = '';
	messages.forEach(msg => {
		const li = document.createElement('li');
		li.textContent = `${msg.user}: ${msg.text}`;
		messagesArea.appendChild(li);
	});
}

feather.replace();
