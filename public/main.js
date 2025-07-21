const messageBox = document.querySelector("#messages");
const textBox = document.querySelector("input");
const sendButton = document.querySelector("button");

function createMessage(text, ownMessage = false) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    const subMessageElement = document.createElement("div");
    subMessageElement.className ="px-4 py-4 rounded-lg inline-block rounded-bl-none bg-gray-300 text-black-600";
    if (ownMessage) {
        subMessageElement.className += " float-right bg-orange-800 text-white";
    }
    subMessageElement.innerText = text;
    messageElement.appendChild(subMessageElement);

    messageBox.appendChild(messageElement);
}

const socket = io();

socket.on("connection", (socket) => {
    console.log(socket.id);
});

socket.on("receive-message", (message) =>{
    createMessage(message);
});

sendButton.addEventListener("click", () => {
    if (textBox.value != "") {
        socket.emit("send-message", textBox.value);
        createMessage(textBox.value, true);
        textBox.value = "";
    }
});

