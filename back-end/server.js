const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../front-end')));
app.use(express.json()); // Middleware para processar JSON

// Rota para o chat-login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/chat-login.html'));
});

// Rota para o chat
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/chat-socketio.html'));
});

// Rota para integração com a API da OpenAI
app.post('/openai/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('Mensagem recebida:', userMessage); // Log da mensagem recebida

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Resposta da OpenAI:', response.data); // Log da resposta da OpenAI

        if (response.data.choices && response.data.choices.length > 0) {
            res.json({ message: response.data.choices[0].message.content });
        } else {
            console.error("Erro: A resposta da OpenAI não contém escolhas.");
            res.status(500).json({ error: 'Desculpe, não consegui gerar uma resposta.' });
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem para OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao processar a mensagem.' });
    }
});

// Rota para integração com a OpenAI para geração de imagens
app.post('/openai/image', async (req, res) => {
    const imageDescription = req.body.description;

    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            prompt: imageDescription,
            n: 1,
            size: '1024x1024'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        // Retorna a URL da imagem gerada
        res.json({ url: response.data.data[0].url });
    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        res.status(500).json({ error: "Erro ao gerar imagem." });
    }
});

// Passa o objeto io para chat-socketio.js
require('../front-end/js/chat-socketio')(io);

const PORT = 4001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
