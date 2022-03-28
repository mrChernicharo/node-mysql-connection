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
let socket;
const user = JSON.parse(localStorage.getItem('@user'));
let currentRoom = null;
const newRoomContacts = [];

// Landing
const headerNick = document.querySelector('#nick-display');
const roomsList = document.querySelector('#rooms-list');
const contactsList = document.querySelector('#contacts-list');
// ContactModal
const contactModal = document.querySelector('#add-contact-modal');
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
const createNewRoomCloseBtn = document.querySelector('#create-room-close');
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

	socket = io.connect('http://localhost:3334');

	console.log({ socket });
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
	createNewRoomCloseBtn.addEventListener('click', e => {
		createRoomModal.classList.add('closed');
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
		handleCreateNewRoom();
	});
}

async function enterRoom(room) {
	console.log('grabbing room data', { room });
	currentRoom?.id === room.id
		? roomArea.classList.toggle('closed')
		: roomArea.classList.remove('closed');

	refreshRoomParticipants(room);
	refreshMessagesArea();
}

async function refreshRoomParticipants(room) {
	currentRoom = { ...room };
	const { id, name } = room;

	const users = await fetchUsersByRoom(id);

	roomTitle.textContent = name;
	roomUsersList.innerHTML = '';
	users.forEach(user => {
		const li = document.createElement('li');
		li.textContent = user.user;
		roomUsersList.appendChild(li);
	});
}

async function refreshMessagesArea() {
	const messages = await fetchRoomMessages(currentRoom.id);

	messagesArea.innerHTML = '';
	messages
		// .sort((a, b) => a.create_at - b.created_at)
		.forEach(msg => {
			const li = document.createElement('li');
			// prettier-ignore
			const messageComponentClasses = ['author-div', 'text-div', 'date-div'];
			const authorDiv = document.createElement('div');
			const textDiv = document.createElement('div');
			const dateDiv = document.createElement('div');

			authorDiv.textContent = msg.user;
			textDiv.textContent = msg.text;
			dateDiv.textContent = new Date(msg.sent_at).toLocaleString();

			[authorDiv, textDiv, dateDiv].forEach((el, i) => {
				console.log({ el });
				el.setAttribute('class', messageComponentClasses[i]);
				li.appendChild(el);
			});

			msg.user === user.nickname
				? li.classList.add('user')
				: li.classList.add('contact');
			li.classList.add('message');

			messagesArea.appendChild(li);
		});
}

async function handleCreateNewRoom() {
	createRoomModal.classList.toggle('closed');
	populateContactsSelect();

	createRoomForm.addEventListener('submit', handleCreateRoomSubmit);
}

async function populateContactsSelect() {
	Array.from(contactsSelect.childNodes).forEach(node =>
		node.removeEventListener('click', null)
	);
	contactsSelect.innerHTML = '';

	const contacts = await fetchUserContacts(user.id);

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
	if (!roomNameInput.value) throw Error('A room needs a name');
	if (!newRoomContacts.length) throw Error('A room needs contacts');

	const createdRoom = await createRoom(
		user.id,
		roomNameInput.value,
		newRoomContacts
	);
	newRoomContacts.splice(0, newRoomContacts.length);
	console.log('created new room!', createdRoom);

	refreshRoomsList();
	createRoomModal.classList.toggle('closed');
}

async function refreshRoomsList() {
	const rooms = await fetchRoomsByUser(user.id);

	roomsList.innerHTML = '';
	rooms.forEach(room => {
		const li = document.createElement('li');
		li.textContent = room.name;
		li.addEventListener('click', () => enterRoom(room));
		roomsList.appendChild(li);
	});
}

feather.replace();
