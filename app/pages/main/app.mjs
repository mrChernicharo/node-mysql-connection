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
import { socket } from '../../utils/socket.mjs';

// Globals
let user;
let currentRoom = null;
const newRoomContacts = [];
let isTyping = false;

// Header
const headerNick = document.querySelector('#nick-display');
const roomsList = document.querySelector('#rooms-list');
const contactsList = document.querySelector('#contacts-list');

// Nav-tabs
const tabs = document.querySelector('#tabs');

// ContactModal
const contactsSection = document.querySelector('section#contacts');
const contactModal = document.querySelector('#add-contact-modal');
const contactDetailBtn = document.querySelector('#add-new-contact-btn');
const contactForm = document.querySelector('#add-contact-form');
const contactSearchInput = document.querySelector('#add-contact-input');
// RoomArea
const roomsSection = document.querySelector('section#rooms');
const roomArea = document.querySelector('#room-area');
const roomTitle = document.querySelector('#room-title');
const roomUsersList = document.querySelector('#room-users');
const roomCloseBtn = document.querySelector('#room-close');
const contactModalCloseBtn = document.querySelector('#contact-modal-close');
const messagesArea = document.querySelector('#messages-area');
const messagesList = document.querySelector('#messages-list');
const sendMessageForm = document.querySelector('#send-message-form');
const messageInput = document.querySelector('#message-input');
const typingIndicatorDiv = document.querySelector('#typing-indicator');
const typingIndicator = document.createElement('img');
typingIndicator.setAttribute('id', 'typing-indicator');
typingIndicator.src = '../../assets/827.svg';

// prettier-ignore
const selectedContactsList = document.querySelector('#create-room-selected-contacts');
const createRoomModal = document.querySelector('#create-room-modal');
const createNewRoomBtn = document.querySelector('#add-new-chat-btn');
const createNewRoomCloseBtn = document.querySelector('#create-room-close');
const contactsSelect = document.querySelector('#create-room-contacts-select');
const createRoomForm = document.querySelector('#create-room-form');
const roomNameInput = document.querySelector('#room-name');

// Landing
await initPage();

await appendListeners();

async function initPage() {
	const nickname = location.search.split('nickname=')[1];
	user = await fetchUserByNick(nickname);
	headerNick.textContent = user.nickname;

	const rooms = await fetchRoomsByUser(user.id);
	const contacts = await fetchUserContacts(user.id);
	console.log({ rooms });

	rooms.forEach(room => {
		appendRoom(room)
	});

	contacts.forEach(contact => {
		appendContact(contact)
	});

	socket.emit('user:connect', { user });

	socket.on('server:broadcast:message', data => {
		// console.log('server:broadcast:message', data);

		const {
			text,
			message_id: id,
			created_at: sent_at,
			user,
			user_id,
			room_id,
			room_name,
		} = data;

		const msg = {
			id,
			text,
			sent_at,
			user,
		};
		appendMessage(msg);
	});

	socket.on('server:private:room:created', room => {
		console.log('server:private:room:created', room);

		const { name } = room;

		const contactNick = name
			.split(':&:')
			.find(str => str !== user.nickname);

		refreshRoomsList();
		const li = document.createElement('li');
		li.textContent = contactNick;
		contactsList.appendChild(li);
	});

	socket.on('server:message:typing', data => {
		typingIndicatorDiv.appendChild(typingIndicator);
	});

	socket.on('server:message:stopped:typing', data => {
		typingIndicatorDiv.removeChild(typingIndicator);
	});

	socket.on('disconnect', () => {
		console.log('disconnected', socket.id);
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

	createNewRoomBtn.addEventListener('click', async e => {
		handleCreateNewRoom();
	});

	createNewRoomCloseBtn.addEventListener('click', e => {
		createRoomModal.classList.add('closed');
	});

	contactForm.addEventListener('submit', handleContactFormSubmit);

	sendMessageForm.addEventListener('submit', handleMessageSubmit);

	messageInput.addEventListener('input', handleTyping);

	Array.from(tabs.children).forEach(tab =>
		tab.addEventListener('click', handleTabClick)
	);

	Array.from(contactsList.children).forEach(li => {
		li.addEventListener('click', handleContactClick);
	});
}

function handleTyping(e) {
	if (messageInput.value && !isTyping) {
		isTyping = true;
		socket.emit('message:typing', currentRoom, user);
	} else if (!messageInput.value && isTyping) {
		isTyping = false;
		socket.emit('message:stopped:typing', currentRoom, user);
	}
}

async function handleMessageSubmit(e) {
	e.preventDefault();

	const data = await createMessage(
		user.id,
		currentRoom.id,
		messageInput.value
	);
	// console.log('created message!', data);
	socket.emit('user:send:message', data);
	socket.emit('message:stopped:typing', currentRoom, user);
	messageInput.value = '';
}

async function handleContactFormSubmit(e) {
	e.preventDefault();

	const contactExists = (await fetchUserContacts(user.id)).find(
		contact => contact.nickname === contactSearchInput.value
	);

	if (contactExists) {
		return alert('contact already added');
	}

	const contactData = await fetchUserByNick(contactSearchInput.value);

	if (contactData) {
		// create contact
		const contact = await createContact(user.id, contactData.id);

		// create private room between user and contact
		const room = await createRoom(
			user.id,
			`${user.nickname}:&:${contactData.nickname}`,
			[{ id: contactData.id, nickname: contactData.nickname }]
		);

		// notify peer about contact and room creation
		socket.emit('private:room:created', {
			room,
			contactData,
		});

		// TODO send invitation logic...
	} else {
		alert('user not found');
	}
}


async function handleCreateNewRoom() {
	createRoomModal.classList.toggle('closed');
	populateContactsSelect();

	createRoomForm.addEventListener('submit', handleCreateRoomSubmit);
}


function handleContactClick(e) {
	console.log(e);
}

function handleTabClick(e) {
	if (e.target.id === 'contacts-tab') {
		document.querySelector('#contacts-tab').classList.add('active');
		document.querySelector('#chats-tab').classList.remove('active');
		contactsSection.classList.remove('hide-content');
		roomsSection.classList.add('hide-content');
	} else if (e.target.id === 'chats-tab') {
		document.querySelector('#chats-tab').classList.add('active');
		document.querySelector('#contacts-tab').classList.remove('active');
		roomsSection.classList.remove('hide-content');
		contactsSection.classList.add('hide-content');
	}
}

async function enterRoom(room) {
	console.log('grabbing room data', { room });
	currentRoom?.id === room.id
		? roomArea.classList.toggle('closed')
		: roomArea.classList.remove('closed');

	refreshRoomParticipants(room);
	loadMessages();
}

async function loadMessages() {
	const messages = await fetchRoomMessages(currentRoom.id);

	messagesList.innerHTML = '';
	messages
		// .sort((a, b) => a.create_at - b.created_at)
		.forEach(msg => {
			appendMessage(msg);
		});
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
	// console.log('created new room!', createdRoom);

	refreshRoomsList();
	createRoomModal.classList.toggle('closed');
}

async function refreshRoomsList() {
	const rooms = await fetchRoomsByUser(user.id);

	roomsList.innerHTML = '';
	rooms.forEach(room => {
		appendRoom(room)
	});
}

async function refreshRoomParticipants(room) {
	currentRoom = { ...room };
	// const { id, name } = room;

	const users = await fetchUsersByRoom(room.id);

	roomTitle.textContent = getRoomName(room);
	roomUsersList.innerHTML = '';

	users.forEach(user => {
		const li = document.createElement('li');
		li.textContent = user.user;
		roomUsersList.appendChild(li);
	});
}

function appendMessage(msg) {
	const li = document.createElement('li');
	// prettier-ignore
	const messageContainers = ['author-div', 'text-div', 'date-div'];
	const authorDiv = document.createElement('div');
	const textDiv = document.createElement('div');
	const dateDiv = document.createElement('div');

	authorDiv.textContent = msg.user;
	textDiv.textContent = msg.text;
	dateDiv.textContent = new Date(msg.sent_at).toLocaleString();

	[authorDiv, textDiv, dateDiv].forEach((el, i) => {
		el.setAttribute('class', messageContainers[i]);
		li.appendChild(el);
	});

	msg.user === user.nickname
		? li.classList.add('user')
		: li.classList.add('contact');
	li.classList.add('message');

	messagesList.appendChild(li);
}


function appendRoom(room) {
	console.log(room)

	const li = document.createElement('li');
	const avatarDiv = document.createElement('div');
	const avatarImg = document.createElement('img');
	const mainContentDiv = document.createElement('div');
	const roomNameDiv = document.createElement('div');
	const lastMessage = document.createElement('div');
	const timeSentDiv = document.createElement('div');

	avatarDiv.classList.add('avatar')
	avatarImg.src = 'https://th.bing.com/th/id/OIP.mvS0zUzAKGbdr3HgttTqRwHaFk?pid=ImgDet&w=185&h=139.3404255319149&c=7';
	avatarImg.width = 42;
	avatarImg.height = 42;
	mainContentDiv.classList.add('room-main')
	roomNameDiv.textContent = getRoomName(room);
	timeSentDiv.classList.add('time-sent')
	timeSentDiv.textContent = '11:59'


	avatarDiv.appendChild(avatarImg)
	mainContentDiv.appendChild(roomNameDiv)
	mainContentDiv.appendChild(lastMessage)
	li.appendChild(avatarDiv)
	li.appendChild(mainContentDiv)
	li.appendChild(timeSentDiv)


	roomsList.appendChild(li);
	li.addEventListener('click', () => enterRoom(room));

}

function appendContact(contact) {
	const li = document.createElement('li');
	li.textContent = contact.nickname;
	contactsList.appendChild(li);
}

function getRoomName(room) {
	if (room.name.includes(':&:')) {
		const names = room.name.split(':&:');
		const roomName = names[0] === user.nickname ? names[1] : names[0];
		console.log({ names, roomName, user });
		return roomName;
	} else {
		return room.name;
	}
}


feather.replace();
