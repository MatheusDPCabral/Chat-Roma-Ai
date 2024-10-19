const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Adicionando o CORS

const app = express();
const server = http.createServer(app);

// Configurando o CORS
app.use(cors({
    origin: '*', // Permitindo todas as origens para teste
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configuração do Socket.IO com CORS
const io = socketIo(server, {
    cors: {
        origin: '*', // Permitindo todas as origens para teste
        methods: ["GET", "POST"]
    }
});

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..'))); // Corrigido para usar path.join

// Definindo o Socket.IO
io.on("connection", (socket) => {
    console.log("Usuário conectado " + socket.id);

    socket.on("message", (msg) => {
        console.log(`Mensagem de ${msg.username}: ${msg.message}`);
        io.emit("message", msg); // Envia a mensagem para todos, incluindo o nome de quem enviou
    });
});

// Rota para página de login
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "chat-login.html")); // Corrigido para usar path.join
});

// Rota para o chat com substituição do nome de usuário
app.get("/chat", (req, res) => {
    let username = req.query.user || "user-chat";
    let chat = fs.readFileSync(path.join(__dirname, "chat-socketio.html"), "utf8");
    chat = chat.replace("user-chat", username);
    res.end(chat);
});

// Servidor rodando na porta 4001
server.listen(4001, () => {
    console.log("Servidor Socket.IO rodando na porta 4001");
});
