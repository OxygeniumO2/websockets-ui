import { httpServer } from './src/http_server/index';
import ws from 'ws';
import { activeSockets, availableRooms, currentGames } from './src/ws-server/db';
import { messageParser } from './src/ws-server/utils/messagesHelpers';
import { MessageTypes } from './src/ws-server/utils/types';
import handleCreateUser from './src/ws-server/modules/handleCreateUser';
import handleCreateRoom from './src/ws-server/modules/handleCreateRoom';
import addUserToRoom from './src/ws-server/modules/addUserToRoom';
import handleAddShips from './src/ws-server/modules/handleAddShips';
import handleAttack from './src/ws-server/modules/handleAttack';
import responseRooms from './src/ws-server/utils/roomsHelper';
import broadcast from './src/ws-server/utils/broadcast';

const HTTP_PORT = 8181;

const port = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

export const server = new ws.Server({ port });

if (server) console.log(`Websocket server has been started on port ${port}`);

server.on('connection', (ws) => {
  let currentUser = '';

  activeSockets.add(ws);

  ws.on('message', async (message) => {
    const msg = messageParser(message);

    switch (msg.type) {
      case MessageTypes.reg:
        await handleCreateUser(msg, ws);
        currentUser = msg?.data?.name || 'Guest';
        break;
      case MessageTypes.createRoom:
        await handleCreateRoom(currentUser);
        console.log(`Command: ${msg.type} Response: User ${currentUser} created a room`);
        break;
      case MessageTypes.addUserToRoom:
        await addUserToRoom(currentUser, msg.data.indexRoom);
        console.log(
          `Command: ${msg.type} Response: User ${currentUser} added to room ${msg.data.indexRoom}`
        );
        break;
      case MessageTypes.addShips:
        await handleAddShips(msg);
        console.log(
          `Command: ${msg.type} Response: User ${currentUser} added ships to room ${msg.data.gameId}`
        );
        break;
      case MessageTypes.attack:
        currentUser === currentGames.get(msg.data.gameId)?.indexPlayerTurn &&
          (await handleAttack(msg));
        console.log(`Command: ${msg.type} Response: User ${currentUser} attack`);
        break;
      case MessageTypes.randomAttack:
        currentUser === currentGames.get(msg.data.gameId)?.indexPlayerTurn &&
          (await handleAttack(msg, true));
        console.log(`Command: ${msg.type} Response: User ${currentUser} random attack`);
        break;
      default:
        console.log('Unknown message type');
    }
  });

  ws.on('close', () => {
    activeSockets.delete(ws);

    console.log('Connection was closed');

    if (!availableRooms.has(currentUser)) return;

    availableRooms.delete(currentUser);

    const responseRoomsMsg = responseRooms();

    broadcast(responseRoomsMsg);
  });

  console.log('New connection was created');
});

const notifyAndCloseSockets = () => {
  activeSockets.forEach((socket) => {
    if (socket.readyState === ws.OPEN) {
      socket.send(JSON.stringify({ type: 'serverShutdown', message: 'Server is shutting down' }));
      socket.close();
    }
  });
};

const closeServer = () => {
  notifyAndCloseSockets();
  server.close(() => {
    console.log('Server has been shut down.');
  });
};

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
