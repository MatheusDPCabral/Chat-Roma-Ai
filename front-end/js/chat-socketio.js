const axios = require("axios");
require("dotenv").config();

let users = [];

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Usuário conectado " + socket.id);

        socket.on("newUser", (username) => {
            socket.username = username;
            users.push(username);
            io.emit("userList", users);
        });

        socket.on("message", async (msg) => {
            console.log(`Mensagem de ${msg.username}: ${msg.message}`);

            // Comando /help
            if (msg.message.startsWith("/help")) {
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                const helpMessage = `**Comandos disponíveis:**\n/fox\n/dog\n/cat\n/pokemon\n/image\n/text\n/miau\n/risada\n/mario\n/aplausos\n/neymar`;
                io.emit("message", {
                    username: "Comandos",
                    message: helpMessage,
                });
            }
            // Comando /cat
            else if (msg.message.startsWith("/cat")) {
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    const response = await axios.get("https://api.thecatapi.com/v1/images/search");
                    const catImageUrl = response.data[0].url;

                    io.emit("message", {
                        username: "Cat API",
                        message: catImageUrl,
                    });

                    // Emite o comando para o cliente tocar o som de gato
                    io.emit("playSound", "/sounds/gato-miando2.mp3");

                } catch (error) {
                    console.error("Erro ao buscar imagem de gato:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui trazer uma imagem de gato.",
                    });
                }
            }
            // Comando /dog
            else if (msg.message.startsWith("/dog")) {
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
                    const dogImageUrl = response.data.message;

                    io.emit("message", {
                        username: "Dog API",
                        message: dogImageUrl,
                    });

                    // Emite o comando para o cliente tocar o som de cachorro
                    io.emit("playSound", "/sounds/cachorro-latindo.mp3");

                } catch (error) {
                    console.error("Erro ao se comunicar com a API de cães:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui trazer uma imagem de cachorro.",
                    });
                }
            }
            // Comando /fox
            else if (msg.message.startsWith("/fox")) {
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    const response = await axios.get("https://randomfox.ca/floof/");
                    const foxImageUrl = response.data.image;

                    io.emit("message", {
                        username: "Fox API",
                        message: foxImageUrl,
                    });

                    // Emite o comando para o cliente tocar o som de raposa
                    io.emit("playSound", "/sounds/raposa.mp3");

                } catch (error) {
                    console.error("Erro ao se comunicar com a API de raposas:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui trazer uma imagem de raposa.",
                    });
                }
            }
            // Comandos para /image e /text
            else if (msg.message.startsWith("/image ")) {
                const imageDescription = msg.message.replace("/image ", "");
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    const response = await axios.post(
                        "https://api.openai.com/v1/images/generations",
                        {
                            prompt: imageDescription,
                            n: 1,
                            size: "1024x1024",
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                            },
                        }
                    );

                    const imageUrl = response.data.data[0].url;

                    io.emit("message", {
                        username: "OpenAI",
                        message: imageUrl,
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a OpenAI:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui gerar a imagem.",
                    });
                }
            } else if (msg.message.startsWith("/text ")) {
                const userMessage = msg.message.replace("/text ", "");

                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    const response = await axios.post(
                        "https://api.openai.com/v1/chat/completions",
                        {
                            model: "gpt-3.5-turbo",
                            messages: [{ role: "user", content: userMessage }],
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                            },
                        }
                    );

                    const aiMessage = response.data.choices[0].message.content;

                    io.emit("message", {
                        username: "OpenAI",
                        message: aiMessage,
                    });
                } catch (error) {
                    console.error("Erro ao se comunicar com a OpenAI:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui gerar uma resposta.",
                    });
                }
            } else if (msg.message.startsWith("/pokemon")) {
                try {
                    io.emit("message", {
                        username: msg.username,
                        message: msg.message,
                    });

                    const randomId = Math.floor(Math.random() * 1010) + 1;
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                    const pokemon = response.data;
                    const pokemonImageUrl = pokemon.sprites.front_default;

                    if (pokemonImageUrl) {
                        io.emit("message", {
                            username: "PokeAPI",
                            message: pokemonImageUrl,
                        });
                    } else {
                        io.emit("message", {
                            username: "Erro",
                            message: "Desculpe, não encontrei uma imagem para esse Pokémon.",
                        });
                    }
                } catch (error) {
                    console.error("Erro ao se comunicar com a PokeAPI:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui obter uma imagem de Pokémon.",
                    });
                }
            } else {
                io.emit("message", msg); // Apenas retransmite a mensagem
            }
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado " + socket.id);
            users = users.filter((user) => user !== socket.username);
            io.emit("userList", users);
        });

        // Emite o som para o cliente baseado no comando recebido
        socket.on("message", (data) => {
            if (data.message === "/fox") {
                socket.emit("playSound", "/sounds/fox.mp3");
            } else if (data.message === "/dog") {
                socket.emit("playSound", "/sounds/dog.mp3");
            } else if (data.message === "/cat") {
                socket.emit("playSound", "/sounds/cat.mp3");
            }

            // Outros comandos de som podem ser adicionados aqui
            if (data.message === "/miau") {
                socket.emit("playSound", "/sounds/gato-miando.mp3");
            } else if (data.message === "/risada") {
                socket.emit("playSound", "/sounds/gato-rindo.mp3");
            } else if (data.message === "/mario") {
                socket.emit("playSound", "/sounds/super-mario-death.mp3");
            } else if (data.message === "/aplausos") {
                socket.emit("playSound", "/sounds/aplausos.mp3");
            } else if (data.message === "/neymar") {
                socket.emit("playSound", "/sounds/boa-tarde-neymar.mp3");
            }

            // Envia a mensagem
            io.emit("message", data);
        });
    });
};
