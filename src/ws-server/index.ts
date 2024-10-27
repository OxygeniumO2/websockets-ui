import ws from 'ws';
import { messageParser } from './utils/messagesHelpers';
import { MessageTypes } from './utils/types';
import handleCreateUser from './modules/handleCreateUser';
import broadcast from './utils/broadcast';
import handleCreateRoom from './modules/handleCreateRoom';
import { availableRooms, currentGames } from './db';
import addUserToRoom from './modules/addUserToRoom';
import responseRooms from './utils/roomsHelper';
import handleAddShips from './modules/handleAddShips';
import handleAttack from './modules/handleAttack';

const port = 3000;

const server = new ws.Server({ port });

server.on('connection', (ws) => {
  let currentUser = '';

  ws.on('message', async (message) => {
    const msg = messageParser(message);

    switch (msg.type) {
      case MessageTypes.reg:
        await handleCreateUser(msg, ws);
        currentUser = msg?.data?.name || 'Guest';
        break;
      case MessageTypes.createRoom:
        await handleCreateRoom(currentUser, ws);
        break;
      case MessageTypes.addUserToRoom:
        await addUserToRoom(currentUser, msg.data.indexRoom, ws);
        break;
      case MessageTypes.addShips:
        await handleAddShips(msg);
        break;
      case MessageTypes.attack:
        currentUser === currentGames.get(msg.data.gameId)?.indexPlayerTurn &&
          (await handleAttack(msg, ws));
        break;
      case MessageTypes.randomAttack:
        console.log(msg);
        break;
      default:
        console.log('Unknown message type');
    }
  });

  ws.on('close', () => {
    if (!availableRooms.has(currentUser)) return;

    availableRooms.delete(currentUser);

    const responseRoomsMsg = responseRooms();

    broadcast(responseRoomsMsg);
  });

  console.log('New connection was created');
});
