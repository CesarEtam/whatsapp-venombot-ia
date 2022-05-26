// Supports ES6
import { create, Whatsapp } from 'venom-bot';

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['pt'], forceNER: true });
// Adds the utterances and intents for the NLP

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

// Treinar e salvar no modelo
(async () => {
    await manager.train();
    manager.save();

    create('BOT')
      .then((client) => {
        //Evento
        client.onMessage(async (message) => {
          if (message.isGroupMsg === false) {
            const response = await manager.process(
              'pt',
              message.body.toLowerCase()
            );
            console.log(`Mensagem recebida: ${response.utterance} indentificada como ${response.intent} com score de ${response.score}`);
            client.sendText(message.from, response.answer);
          }
        });
      })
      .catch((erro) => {
        console.log(erro);
      });
})();