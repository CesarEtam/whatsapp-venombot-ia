// Supports ES6
import { create } from 'venom-bot';

const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['pt'], forceNER: true });

const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';

// Treino de saudação
manager.addDocument('pt', 'ola', 'SAUDAÇÃO');
manager.addDocument('pt', 'oi', 'SAUDAÇÃO');
manager.addDocument('pt', 'bom dia', 'SAUDAÇÃO');
manager.addDocument('pt', 'boa tarde', 'SAUDAÇÃO');
manager.addDocument('pt', 'boa noite', 'SAUDAÇÃO');
manager.addDocument('pt', 'coe viado', 'SAUDAÇÃO');
manager.addDocument('pt', 'coe', 'SAUDAÇÃO');
manager.addDocument('pt', 'fala tu', 'SAUDAÇÃO');
manager.addDocument('pt', 'e ae', 'SAUDAÇÃO');
manager.addDocument('pt', 'tudo bom', 'SAUDAÇÃO');

// Redes Sociais
manager.addDocument('pt', 'seu email', 'EMAIL');
manager.addDocument('pt', 'seu github', 'GITHUB');
manager.addDocument('pt', 'seu instagram', 'INSTAGRAM');
manager.addDocument('pt', 'seu linkedin', 'LINKEDIN');

// Fun Thinks
manager.addDocument('pt', '!sticker', 'STICKER');

// Treino de resposta
manager.addAnswer(
  'pt',
  'SAUDAÇÃO',
  'Oi! Estou trabalhando em um *assistente virtual*.\nJá te respondo! 😉'
);
manager.addAnswer(
  'pt',
  'EMAIL', 'Oi, meu *E-mail* é este\ncesar.etam@hotmail.com'
);
manager.addAnswer(
  'pt',
  'GITHUB',
  'Oi, meu repositório no *GitHub* é este\nhttps://github.com/CesarEtam'
);
manager.addAnswer(
  'pt',
  'INSTAGRAM',
  'Oi, meu *Instagram* é este\nhttps://www.instagram.com/0uroborusoficial/'
);
manager.addAnswer(
  'pt',
  'LINKEDIN',
  'Oi, meu *Linkedin* é este\nhttps://www.linkedin.com/in/c%C3%A9sar-et%C3%A3-cardoso-de-almeida-9968b878/'
);
manager.addAnswer(
  'pt',
  'STICKER',
  'Estou preparando o seu *sticker*.\n😉'
);

// Treinar e salvar no modelo
(async () => {
    await manager.train();
    manager.save();

    create('BOT')
      .then((client) => {
        //Evento
        client.onMessage(async (message) => {

          console.log(`
            ${green}Remetente:${reset}          ${message.chat.contact.name}
            ${green}Tipo:${reset} ${message.type}
          `);

          await client.sendSeen(message.from)
          await client.startTyping(message.from)
          if (message.isGroupMsg === false && message.type === 'chat') {
            
            const response = await manager.process(
              'pt',
              message.body.toLowerCase()
            );
            
            console.log(`
              ${green}Score de:${reset}           ${response.score}
            `);
            
            //Linha de comando para utilizar o module Nlp
            (response.intent === 'None') ? client.sendText(message.from, 'Desculpa, estou off mais tarde respondo.') : client.sendText(message.from, response.answer);
          
          }

          if (message.body === '!sticker' && message.isGroupMsg === false && message.type === 'video') {
            await client
              .sendImageAsStickerGif(message.from, './image.gif')
              .then((result) => {
                console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
          }

          if (message.isGroupMsg === false && message.type === 'ptt') {
            client.sendText(message.from, 'Já escuto seu audio. 😉');
          }
          await client.stopTyping(message.from)
        });
      })
      .catch((erro) => {
        console.log(erro);
      });
})();