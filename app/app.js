const user = JSON.parse(localStorage.getItem("@user"));

const headerNick = document.querySelector("#nick-display");

headerNick.textContent = user.name;

console.log(user);
