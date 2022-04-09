const socket = io.connect('http://localhost:3334');

// console.log({ socket });

// socket.on('user:send:message', data => {
// 	console.log('userSendMessage', data);
// });

// socket.on('server:broadcast:typing', data => {
// 	console.log(data);
// });

export { socket };
