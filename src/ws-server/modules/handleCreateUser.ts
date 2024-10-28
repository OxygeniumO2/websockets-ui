import ws from 'ws';
import { RequestReg, ResponseReg } from '../utils/interfaces';
import { loggedUsersMap, winners } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import updateRoom from './updateRoom';
import winnersResponseHelper from '../utils/winnersResponseHelper';
import broadcast from '../utils/broadcast';

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
    console.log(`Command: ${msg.type} Response: User ${msg.data.name} is already logged in.`);
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
    console.log(`Command: ${msg.type} Response: Incorrect password for user ${msg.data.name}.`);
    return;
  }

  loggedUsersMap.set(msg.data.name, {
    password: msg.data.password,
    ws,
    logged: true,
    partner: '',
  });

  const successResponse = createResponseReg(msg.data.name, false);

  ws.send(messageStringify(successResponse));

  console.log(
    `Command: ${msg.type} Response: User ${msg.data.name} logged in and added to in memory database.`
  );

  await updateRoom(ws);

  const winnersResp = winnersResponseHelper();

  ws.send(winnersResp);

  ws.on('close', async () => {
    if (loggedUsersMap.get(msg.data.name)?.partner) {
      const partner = loggedUsersMap.get(msg.data.name)!.partner;

      loggedUsersMap.get(partner)?.ws.send(
        messageStringify({
          type: MessageTypes.finish,
          data: {
            winPlayer: partner,
          },
          id: 0,
        })
      );

      loggedUsersMap.get(partner)!.partner = '';

      winners[partner] = winners[partner] ? winners[partner] + 1 : 1;

      await updateRoom(loggedUsersMap.get(partner)!.ws);

      broadcast(winnersResponseHelper());
    }

    loggedUsersMap.set(msg.data.name, {
      password: msg.data.password,
      ws,
      logged: false,
      partner: '',
    });

    console.log(`User ${msg.data.name} disconnected from logged-in users.`);
  });
};

export default handleCreateUser;
