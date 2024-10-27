import ws from 'ws';
import { RequestReg, ResponseReg } from '../utils/interfaces';
import { availableRooms, loggedUsersMap } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import updateRoom from './updateRoom';

const createResponseReg = (name: string, error: boolean, errorText: string = ''): ResponseReg => {
  return {
    type: MessageTypes.reg,
    data: {
      name,
      index: 1,
      error,
      errorText,
    },
    id: 0,
  };
};

const handleCreateUser = async (msg: RequestReg, ws: ws) => {
  if (loggedUsersMap.has(msg.data.name) && loggedUsersMap.get(msg.data.name)?.logged) {
    const errorResponse = createResponseReg(
      msg.data.name,
      true,
      `User ${msg.data.name} is already logged in.`
    );
    ws.send(messageStringify(errorResponse));
    return;
  }

  if (
    loggedUsersMap.has(msg.data.name) &&
    !loggedUsersMap.get(msg.data.name)?.logged &&
    msg.data.password !== loggedUsersMap.get(msg.data.name)?.password
  ) {
    const errorResponse = createResponseReg(
      msg.data.name,
      true,
      `Incorrect password for user ${msg.data.name}.`
    );
    ws.send(messageStringify(errorResponse));
    return;
  }

  loggedUsersMap.set(msg.data.name, { password: msg.data.password, ws, logged: true });

  const successResponse = createResponseReg(msg.data.name, false);

  ws.send(messageStringify(successResponse));

  console.log(`User ${msg.data.name} logged in and added to in memory database.`);

  await updateRoom(ws);

  ws.on('close', () => {
    loggedUsersMap.set(msg.data.name, { password: msg.data.password, ws, logged: false });
    console.log(`User ${msg.data.name} disconnected from logged-in users.`);
  });
};

export default handleCreateUser;
