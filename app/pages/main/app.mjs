import {
	fetchRoomsByUser,
	fetchUserContacts,
	fetchUserByNick,
	fetchUsersByRoom,
	fetchRoomMessages,
	createContact,
	createMessage,
	createRoom,
} from '../../utils/functions.mjs';

// Globals
const user = JSON.parse(localStorage.getItem('@user'));
let currentRoom = null;
const newRoomContacts = [];

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
// prettier-ignore
const selectedContactsList = document.querySelector('#create-room-selected-contacts');
const createRoomModal = document.querySelector('#create-room-modal');
const createNewRoomBtn = document.querySelector('#rooms-detail-btn');
const contactsSelect = document.querySelector('#create-room-contacts-select');
const createRoomForm = document.querySelector('#create-room-form');
const roomNameInput = document.querySelector('#room-name');
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
		li.textContent = contact.nickname;
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
	createNewRoomBtn.addEventListener('click', async e => {
		createRoomModal.classList.toggle('closed');
		populateContactsSelect();

		createRoomForm.addEventListener('submit', handleCreateRoomSubmit);
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
	messages
		// .sort((a, b) => a.create_at - b.created_at)
		.forEach(msg => {
			const li = document.createElement('li');
			li.textContent = `${msg.user}: ${msg.text}`;
			messagesArea.appendChild(li);
		});
}

async function populateContactsSelect() {
	Array.from(contactsSelect.childNodes).forEach(node =>
		node.removeEventListener('click', null)
	);
	contactsSelect.innerHTML = '';
	// get contacts from room
	const contacts = await fetchUserContacts(user.id);
	console.log('populate the select with these contacts ', contacts);
	contacts.forEach(contact => {
		const li = document.createElement('li');
		li.value = contact.id;
		li.textContent = contact.nickname;
		li.addEventListener('click', () => addContactToRoom(contact));

		contactsSelect.appendChild(li);
	});
}

function addContactToRoom(contact) {
	const li = document.createElement('li');
	li.textContent = contact.nickname;
	newRoomContacts.push(contact);
	selectedContactsList.appendChild(li);
}

async function handleCreateRoomSubmit(e) {
	e.preventDefault();
	console.log('submit room', roomNameInput.value, newRoomContacts);
	if (!roomNameInput.value) throw Error('A room needs a name');
	if (!newRoomContacts.length) throw Error('A room needs contacts');

	const createdRoom = await createRoom(
		user.id,
		roomNameInput.value,
		newRoomContacts
	);
	newRoomContacts.splice(0, newRoomContacts.length);
	console.log('created new room!', createdRoom);
}

feather.replace();
