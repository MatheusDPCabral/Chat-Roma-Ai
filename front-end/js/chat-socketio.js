const axios = require("axios"); // Para requisições à OpenAI
require("dotenv").config(); // Carregar variáveis de ambiente

let users = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Usuário conectado " + socket.id);

        socket.on("newUser", (username) => {
            socket.username = username; // Armazena o nome de usuário no socket
            users.push(username);
            io.emit("userList", users); // Atualiza a lista de usuários online
        });

        socket.on("message", async (msg) => {
            console.log(`Mensagem de ${msg.username}: ${msg.message}`);

            if (msg.message.startsWith("/dog")) {
                try {
                    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
                    const dogImageUrl = response.data.message; // URL da imagem de cachorro

                    // Envia a mensagem do usuário para o chat
                    io.emit("message", {
                        username: msg.username, // O nome do usuário que enviou a mensagem
                        message: msg.message     // A mensagem original
                    });

                    io.emit("message", {
                        username: "Dog CEO API",
                        message: dogImageUrl
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a Dog CEO API:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui obter uma imagem de cachorro."
                    });
                }
            } else if (msg.message.startsWith("/fox")) {
                try {
                    const response = await axios.get("https://randomfox.ca/floof/");
                    const foxImageUrl = response.data.image; // URL da imagem de raposa

                    io.emit("message", {
                        username: msg.username,
                        message: msg.message
                    });

                    io.emit("message", {
                        username: "FoxBot",
                        message: foxImageUrl
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a API de raposas:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui obter uma imagem de raposa."
                    });
                }
            } else if (msg.message.startsWith("/cat")) {
                try {
                    const response = await axios.get('https://api.thecatapi.com/v1/images/search'); // Requisição à Cat API
                    const catImageUrl = response.data[0].url; // URL da imagem de gato
        
                    // Envia a mensagem do usuário para o chat
                    io.emit("message", {
                        username: msg.username,
                        message: msg.message
                    });
        
                    io.emit("message", {
                        username: "The Cat API",
                        message: catImageUrl
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a The Cat API:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui obter uma imagem de gato."
                    });
                }
            }
            // Verifica se a mensagem começa com /image
            else if (msg.message.startsWith("/image ")) {
                const imageDescription = msg.message.replace("/image ", "");

                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username, // O nome do usuário que enviou a mensagem
                    message: msg.message     // A mensagem original
                });

                try {
                    const response = await axios.post('https://api.openai.com/v1/images/generations', {
                        prompt: imageDescription,
                        n: 1,
                        size: '1024x1024'
                    }, {
                        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
                    });

                    const imageUrl = response.data.data[0].url; // Obtém a URL da imagem

                    // Envia a resposta da AI (imagem) para o chat
                    io.emit("message", {
                        username: "OpenAI",      // Nome para a resposta da API
                        message: imageUrl        // A URL da imagem gerada
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a OpenAI:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui gerar a imagem."
                    });
                }
            } else if (msg.message.startsWith("/text ")) {
                const userMessage = msg.message.replace("/text ", "");

                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username,  // O nome do usuário que enviou a mensagem
                    message: msg.message      // A mensagem original
                });

                try {
                    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: userMessage }]
                    }, {
                        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
                    });

                    const aiMessage = response.data.choices[0].message.content; // Acessa a mensagem corretamente

                    // Envia a resposta da AI para o chat
                    io.emit("message", {
                        username: "OpenAI",       // Nome para a resposta da API
                        message: aiMessage        // A mensagem da API
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a OpenAI:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui gerar uma resposta."
                    });
                }
            } else {
                // Apenas retransmite a mensagem
                io.emit("message", msg); // Inclui a mensagem original do usuário
            }
        });



        socket.on("disconnect", () => {
            console.log("Usuário desconectado " + socket.id);
            users = users.filter(user => user !== socket.username); // Remove o usuário da lista
            io.emit("userList", users); // Emite a lista atualizada
        });
    });
};
