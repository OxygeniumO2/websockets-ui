import ws from 'ws';
import { messageParser } from './utils/messagesHelpers';
import { MessageTypes } from './utils/types';
import handleCreateUser from './modules/handleCreateUser';
import broadcast from './utils/broadcast';
import handleCreateRoom from './modules/handleCreateRoom';
import updateRoom from './modules/updateRoom';
import { loggedUsersMap } from './db';
import addUserToRoom from './modules/addUserToRoom';

const port = 3000;

const server = new ws.Server({ port });

server.on('connection', (ws) => {
  let currentUser = '';

  ws.on('message', async (message) => {
    const msg = messageParser(message);

    console.log(msg);

    switch (msg.type) {
      case MessageTypes.reg:
        await handleCreateUser(msg, ws);
        currentUser = msg?.data?.name || 'Guest';
        break;
      case MessageTypes.createRoom:
        await handleCreateRoom(currentUser, ws);
        break;
      case MessageTypes.addUserToRoom:
        await addUserToRoom(msg.data.indexRoom, currentUser, ws);
        console.log(msg);
        break;
      case MessageTypes.addShips:
        console.log(msg);
        break;
      case MessageTypes.attack:
        console.log(msg);
        break;
      case MessageTypes.randomAttack:
        console.log(msg);
        break;
      default:
        console.log('Unknown message type');
    }
  });

  console.log('New connection was created');
});
