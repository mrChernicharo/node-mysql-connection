import { getUserRooms } from "./assets/utils/functions.mjs";

const user = JSON.parse(localStorage.getItem('@user'));

const headerNick = document.querySelector('#nick-display');

headerNick.textContent = user.nickname;

console.log(user);


const rooms = await getUserRooms();
console.log(rooms);