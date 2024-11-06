# Chat-Roma-Ai

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)

**Integrantes:**  
- [Carlos Camilo](https://www.linkedin.com/in/carlosscamilo)
- [Carlos Holanda](https://www.linkedin.com/in/carlos-holanda-8792a3289)
- [David Alexandre](https://www.linkedin.com/in/david-alexandre-lima/)
- [Jose Luís](https://www.linkedin.com/in/josé-luiz-henrique/)
- [Matheus Cabral](https://www.linkedin.com/in/matheus-cabral-440934268)
- [Mateus Santana](https://www.linkedin.com/in/mateus-santana-113797233)

---

## Descrição

**Chat-Roma-Ai** é uma aplicação de chat interativa com suporte a WebSocket, integrada com a API do ChatGPT para troca de mensagens e geração de imagens em tempo real. Inspirado na interface do WhatsApp, o Chat-Roma-Ai permite que os usuários enviem comandos específicos (como "gere uma imagem de gato"), e a aplicação faz o pedido à API do ChatGPT para gerar imagens conforme solicitado.

## Funcionalidades

### Imagens de Animais e Pokémon
O chat pode gerar imagens aleatórias dos seguintes animais e personagens quando o usuário envia os comandos específicos:

- **/cat**: Gera uma imagem aleatória de um **gato**.
- **/dog**: Gera uma imagem aleatória de um **cachorro**.
- **/fox**: Gera uma imagem aleatória de uma **raposa**.
- **/pokemon**: Gera uma imagem aleatória de um **Pokémon**.

### Sons Divertidos
O chat também pode gerar sons divertidos em resposta a comandos do usuário:

- **/miau**: Gera o som de um **gato miando**.
- **/risada**: Gera o som de uma **risada**.
- **/mario**: Gera o som do **Super Mario**.
- **/aplausos**: Gera o som de **aplausos**.
- **/neymar**: Gera o som do **Neymar dizendo "Boa tarde"**.

Essas funcionalidades tornam a interação com o chatbot ainda mais divertida e imersiva, proporcionando uma experiência tanto visual quanto auditiva.

## Como Funciona

Ao interagir com o chat, o usuário pode digitar qualquer um dos seguintes comandos para gerar uma imagem ou som:

1. **Imagens**:
   - `/cat` - Exibe uma imagem aleatória de um gato.
   - `/dog` - Exibe uma imagem aleatória de um cachorro.
   - `/fox` - Exibe uma imagem aleatória de uma raposa.
   - `/pokemon` - Exibe uma imagem aleatória de um Pokémon.

2. **Sons**:
   - `/miau` - Toca o som de um gato miando.
   - `/risada` - Toca o som de uma risada.
   - `/mario` - Toca o som clássico do Super Mario.
   - `/aplausos` - Toca o som de aplausos.
   - `/neymar` - Toca o som do Neymar dando "Boa tarde".

Esses comandos são reconhecidos pelo chatbot, que chama as APIs correspondentes para obter a imagem ou o som e responde diretamente no chat. O fluxo de interação é simples e intuitivo, com o usuário digitando os comandos e o sistema respondendo com a mídia solicitada.

## Tecnologias Utilizadas

- **API do ChatGPT**: Para interagir de maneira inteligente com o usuário.
- **APIs de Imagens**: Para fornecer imagens aleatórias de gatos, cachorros, raposas e Pokémon.
- **APIs de Áudio**: Para gerar e tocar sons divertidos como o miado de um gato, risadas, sons de Mario, entre outros.
- **Node.js / Express**: Para implementar o servidor que gerencia as interações e as chamadas às APIs externas.


