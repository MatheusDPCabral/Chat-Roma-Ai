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

            // Verifica se a mensagem começa com /gato
            if (msg.message.startsWith("/gato")) {
                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    // Requisição à API de gatos
                    const response = await axios.get(
                        "https://api.thecatapi.com/v1/images/search",
                    );
                    const catImageUrl = response.data[0].url; // Obtém a URL da imagem do gato

                    // Envia a resposta da API (imagem) para o chat
                    io.emit("message", {
                        username: "Gato API",
                        message: catImageUrl, // A URL da imagem do gato
                    });
                } catch (error) {
                    console.error("Erro ao buscar imagem de gato:", error);
                    io.emit("message", {
                        username: "Erro",
                        message:
                            "Desculpe, não consegui trazer uma imagem de gato.",
                    });
                }
            }
            // Verifica se a mensagem começa com /dog
            else if (msg.message.startsWith("/dog")) {
                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    // Faz uma solicitação para a API de cães
                    const response = await axios.get(
                        "https://dog.ceo/api/breeds/image/random",
                    );
                    const dogImageUrl = response.data.message; // Obtém a URL da imagem de cachorro

                    // Envia a imagem de cachorro para o chat
                    io.emit("message", {
                        username: "Dog API", // Nome para a resposta da API
                        message: dogImageUrl, // A URL da imagem gerada
                    });
                } catch (error) {
                    console.error(
                        "Erro ao se comunicar com a API de cães:",
                        error,
                    );
                    io.emit("message", {
                        username: "Erro",
                        message:
                            "Desculpe, não consegui trazer uma imagem de cachorro.",
                    });
                }
            }
            // Verifica se a mensagem começa com /fox
            else if (msg.message.startsWith("/fox")) {
                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    // Faz uma solicitação para a API de raposas
                    const response = await axios.get(
                        "https://randomfox.ca/floof/",
                    );
                    const foxImageUrl = response.data.image; // Obtém a URL da imagem de raposa

                    // Envia a imagem de raposa para o chat
                    io.emit("message", {
                        username: "Fox API", // Nome para a resposta da API
                        message: foxImageUrl, // A URL da imagem gerada
                    });
                } catch (error) {
                    console.error(
                        "Erro ao se comunicar com a API de raposas:",
                        error,
                    );
                    io.emit("message", {
                        username: "Erro",
                        message:
                            "Desculpe, não consegui trazer uma imagem de raposa.",
                    });
                }
            }
            // Verifica se a mensagem começa com /pokemon
            else if (msg.message.startsWith("/pokemon")) {
                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                try {
                    // Primeiro, obtém o total de Pokémon
                    const totalResponse = await axios.get(
                        "https://pokeapi.co/api/v2/pokemon?limit=1",
                    );
                    const totalPokemon = totalResponse.data.count; // Número total de Pokémon

                    // Seleciona um Pokémon aleatório
                    const randomId =
                        Math.floor(Math.random() * totalPokemon) + 1; // ID aleatório

                    // Requisição à PokéAPI para obter o Pokémon aleatório
                    const pokemonResponse = await axios.get(
                        `https://pokeapi.co/api/v2/pokemon/${randomId}`,
                    );
                    const pokemonImageUrl =
                        pokemonResponse.data.sprites.front_default; // Obtém a URL da imagem

                    // Envia a imagem para o chat
                    io.emit("message", {
                        username: "PokéAPI",
                        message: pokemonImageUrl,
                    });
                } catch (error) {
                    console.error("Erro ao buscar imagem do Pokémon:", error);
                    io.emit("message", {
                        username: "Erro",
                        message:
                            "Desculpe, não consegui trazer uma imagem do Pokémon.",
                    });
                }
            }
            // Lógica existente para /image e /text
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
                        },
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
                        },
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
            } else {
                io.emit("message", msg); // Apenas retransmite a mensagem
            }
        });

        socket.on("playSound", (command) => {
            let sound;
            switch (command) {
                case "/miau":
                    sound = new Audio("/sounds/gato-miando.mp3");
                    break;
                case "/risada":
                    sound = new Audio("/sounds/gato-rindo.mp3");
                    break;
                case "/mario":
                    sound = new Audio("/sounds/super-mario-death.mp3");
                    break;
                case "/aplausos":
                    sound = new Audio("/sounds/aplausos.mp3");
                    break;
                case "/neymar":
                    sound = new Audio("/sounds/boa-tarde-neymar.mp3");
                    break;
            }

            if (sound) {
                sound.play();
            }
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado " + socket.id);
            users = users.filter((user) => user !== socket.username);
            io.emit("userList", users);
        });
    });
};
