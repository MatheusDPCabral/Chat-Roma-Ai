const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, '..')));

io.on("connection", (socket) => {
    console.log("Usuário conectado " + socket.id);

    socket.on("message", (msg) => {
        console.log(`Mensagem de ${msg.username}: ${msg.message}`);
        io.emit("message", msg);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "chat-login.html"));
});

app.get("/chat", (req, res) => {
    let username = req.query.user || "user-chat";
    let chat = fs.readFileSync(path.join(__dirname, "chat-socketio.html"), "utf8");
    chat = chat.replace("user-chat", username);
    res.end(chat);
});

server.listen(4001, () => {
    console.log("Servidor Socket.IO rodando na porta 4001");
});
