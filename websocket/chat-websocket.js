const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    const file = fs.readFileSync("./websocket/chat-websocket.html", "utf8");
    res.end(file);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Cliente conectado.");

    ws.on("message", (msg) => {
        console.log("Mensagem recebida: " + msg);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });

    ws.on("close", () => {
        console.log("Conexão fechada.");
    });
});

server.listen(3000, () => {
    console.log("Servidor WebSocket rodando na porta 3000");
});
