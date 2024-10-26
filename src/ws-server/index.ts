import ws from 'ws';
import { messageParser } from './utils/messagesHelpers';
import { MessageTypes } from './utils/types';
import handleCreateUser from './modules/handleCreateUser';
import broadcast from './utils/broadcast';

const port = 3000;

const server = new ws.Server({ port });

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = messageParser(message);

    switch (msg.type) {
      case MessageTypes.reg:
        handleCreateUser(msg, ws);
        break;
      default:
        console.log('Unknown message type');
    }

    broadcast('sas');
  });
  console.log('New connection was created');
});
