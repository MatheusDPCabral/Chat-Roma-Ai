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

    let users = [];

    io.on("connection", (socket) => {
        console.log("Usuário conectado " + socket.id);

        // Listen for new users
        socket.on("newUser", (username) => {
            socket.username = username; // Store username in socket
            users.push(username);
            io.emit("userList", users);
        });

        socket.on("message", (msg) => {
            console.log(`Mensagem de ${msg.username}: ${msg.message}`);
            io.emit("message", msg);
        });

        // When a user disconnects
        socket.on("disconnect", () => {
            console.log("Usuário desconectado " + socket.id);
            users = users.filter(user => user !== socket.username); // Remove user from list
            io.emit("userList", users); // Emit updated list
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
