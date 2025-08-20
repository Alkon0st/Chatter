// Redirect to login if user is not logged in
if (!localStorage.getItem("chatUsername")) {
    window.location.href = "login.html";
}
// Example static rooms. Replace with dynamic fetch if needed.
const rooms = [
    { id: "room1", name: "Room 1" },
    { id: "room2", name: "Room 2" },
    { id: "room3", name: "Room 3" }
];

const roomList = document.getElementById("roomList");

// Track user counts
let roomUserCounts = {};

function renderRooms() {
    roomList.innerHTML = "";
    rooms.forEach(room => {
        const count = roomUserCounts[room.id] || 0;
        const li = document.createElement("li");
        li.innerHTML = `<button class='w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition flex justify-between items-center px-4' data-room='${room.id}'>
            <span>${room.name}</span>
            <span class='bg-white text-indigo-500 rounded px-2 py-1 text-xs ml-2 '>${count} online</span>
        </button>`;
        roomList.appendChild(li);
    });
}

renderRooms();

roomList.addEventListener("click", function(e) {
    if (e.target.closest("button")) {
        const roomId = e.target.closest("button").getAttribute("data-room");
        localStorage.setItem("chatRoomId", roomId);
        window.location.href = "index.html";
    }
});

document.getElementById("logoutBtn").onclick = function() {
    localStorage.removeItem("chatUsername");
    localStorage.removeItem("chatRoomId");
    window.location.href = "login.html";
};

// Socket.io for realtime room user counts
const socket = io();

// Request initial counts
socket.emit("get-room-user-counts");

socket.on("room-user-counts", counts => {
    roomUserCounts = counts;
    renderRooms();
});
