// Redirect to login if not logged in
if (!localStorage.getItem("chatUsername")) {
    window.location.href = "login.html";
}
// Redirect to rooms if no room selected
if (!localStorage.getItem("chatRoomId")) {
    window.location.href = "rooms.html";
}

const messageBox = document.querySelector("#messages");
const textBox = document.querySelector("input");
const sendButton = document.querySelector("button");

function createMessage(text, ownMessage = false) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    const subMessageElement = document.createElement("div");
    subMessageElement.className ="px-4 py-4 rounded-lg inline-block rounded-bl-none bg-indigo-800 text-white";
    if (ownMessage) {
        subMessageElement.className = "px-4 py-4 rounded-lg float-right rounded-br-none bg-gray-300 text-black-600"

    }
    subMessageElement.innerText = text;
    messageElement.appendChild(subMessageElement);

    messageBox.appendChild(messageElement);
}


const roomId = localStorage.getItem("chatRoomId");
const username = localStorage.getItem("chatUsername");
const socket = io();

// Join selected room with username
socket.emit("join-room", { roomId, username });


socket.on("receive-message", (message) =>{
    createMessage(message);
});

// Notification for user joined
socket.on("user-joined", (joinedUsername) => {
    if (joinedUsername !== username) {
        createMessage(`${joinedUsername} has joined the chat!`, false);
    }
});

sendButton.addEventListener("click", () => {
    if (textBox.value != "") {
        socket.emit("send-message", textBox.value);
        createMessage(textBox.value, true);
        textBox.value = "";
    }
});

