const socket = io.connect('http://localhost:3334');

console.log({ socket });

socket.on('messageReceived', function (msg) {
	console.log('chat message received from server', msg);
	// var item = document.createElement('li');
	// item.textContent = msg;
	// messages.appendChild(item);
	// window.scrollTo(0, document.body.scrollHeight);
});

export { socket };
