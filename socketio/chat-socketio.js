const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

io.on("connection", (socket) => {
    console.log("Usuário conectado " + socket.id);

    socket.on("message", (msg) => {
        console.log(msg);
        io.emit("message", msg);
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/chat-login.html");
});

app.get("/chat", (req, res) => {
    let username = req.query.user || "user-chat";
    let chat = fs.readFileSync("./socketio/chat-socketio.html", "utf8");
    chat = chat.replace("user-chat", username);
    res.end(chat);
});

server.listen(4001, () => {
    console.log("Servidor Socket.IO rodando na porta 4001");
});
    sendButton.addEventListener('click', enviar);
    messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        enviar();
    }
});