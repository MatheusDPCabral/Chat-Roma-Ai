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

            // Verifica se a mensagem começa com /cat
            if (msg.message.startsWith("/cat")) {
                // Envia a mensagem do usuário para o chat
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                // Envia uma mensagem de "loading" antes da requisição
                io.emit("message", {
                    username: "Sistema",
                    message: "Carregando... aguarde um momento enquanto buscamos a imagem de gato.",
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

                // Envia uma mensagem de "loading" antes da requisição
                io.emit("message", {
                    username: "Sistema",
                    message: "Carregando... aguarde um momento enquanto buscamos a imagem de cachorro.",
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

                // Envia uma mensagem de "loading" antes da requisição
                io.emit("message", {
                    username: "Sistema",
                    message: "Carregando... aguarde um momento enquanto buscamos a imagem de raposa.",
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
            // Lógica existente para /image e /text
            else if (msg.message.startsWith("/image ")) {
                const imageDescription = msg.message.replace("/image ", "");
                io.emit("message", {
                    username: msg.username,
                    message: msg.message,
                });

                // Envia uma mensagem de "loading" antes da requisição
                io.emit("message", {
                    username: "Sistema",
                    message: "Carregando... aguarde um momento enquanto geramos a imagem.",
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

                // Envia uma mensagem de "loading" antes da requisição
                io.emit("message", {
                    username: "Sistema",
                    message: "Carregando... aguarde um momento enquanto geramos uma resposta.",
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
            } else if (msg.message.startsWith("/pokemon")) {
                try {
                    // Envia a mensagem do usuário para o chat
                    io.emit("message", {
                        username: msg.username,
                        message: msg.message,
                    });

                    // Envia uma mensagem de "loading" antes da requisição
                    io.emit("message", {
                        username: "Sistema",
                        message: "Carregando... aguarde um momento enquanto buscamos um Pokémon.",
                    });

                    // Gera um número aleatório para o ID do Pokémon
                    const randomId = Math.floor(Math.random() * 1010) + 1;
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
                    const pokemon = response.data;
                    const pokemonImageUrl = pokemon.sprites.front_default; // URL da imagem do Pokémon

                    if (pokemonImageUrl) {
                        io.emit("message", {
                            username: "PokeAPI",
                            message: pokemonImageUrl // Envia apenas a URL da imagem
                        });
                    } else {
                        io.emit("message", {
                            username: "Erro",
                            message: "Desculpe, não encontrei uma imagem para esse Pokémon."
                        });
                    }
                } catch (error) {
                    console.error("Erro ao se comunicar com a PokeAPI:", error);
                    io.emit("message", {
                        username: "Erro",
                        message: "Desculpe, não consegui obter uma imagem de Pokémon."
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
