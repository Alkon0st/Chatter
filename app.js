const http = require("http");
const {Server} = require("socket.io");
const express = require("express");
const path = require("path");
const Room = require("./room")


const app = express();

// Middleware to check login for chat page
app.use((req, res, next) => {
    // Only check for index.html
    if (req.path === "/index.html" || req.path === "/") {
        // Check for username cookie (client sets localStorage, but for demo, fallback to always allow)
        // For real auth, use sessions or cookies
        // Here, just serve index.html
        // Optionally, you could check req.headers.cookie for a username
    }
    next();
});

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const io = new Server(server)

const room = new Room();

// Track users in rooms
const roomUsers = {};

io.on("connection", async (socket) => {
    let roomID;
    let username;

    socket.on("join-room", ({ roomId, username: user }) => {
        roomID = roomId || room.joinRoom();
        username = user;
        socket.join(roomID);
        // Add user to room
        if (!roomUsers[roomID]) roomUsers[roomID] = new Set();
        roomUsers[roomID].add(username);
        // Notify others in the room
        socket.to(roomID).emit("user-joined", username);
        // Emit updated room user counts to all clients
        emitRoomUserCounts();
    });

    socket.on("send-message", (message) => {
        if (roomID) {
            socket.to(roomID).emit("receive-message", message);
        }
    });

    socket.on("disconnect", () => {
        if (roomID && username && roomUsers[roomID]) {
            roomUsers[roomID].delete(username);
            if (roomUsers[roomID].size === 0) delete roomUsers[roomID];
            emitRoomUserCounts();
        }
        if (roomID) {
            room.leaveRoom(roomID);
        }
    });

    // Send initial room user counts
    socket.on("get-room-user-counts", () => {
        emitRoomUserCounts(socket);
    });
    function emitRoomUserCounts(targetSocket) {
        const counts = {};
        for (const [id, users] of Object.entries(roomUsers)) {
            counts[id] = users.size;
        }
        if (targetSocket) {
            targetSocket.emit("room-user-counts", counts);
        } else {
            io.emit("room-user-counts", counts);
        }
    }
});
server.on("error", (err) => {
    console.log("Error opening server")
});

server.listen(8001, () => {
    console.log("Server working on port 8001")
});