import ws from 'ws';
import { RequestReg, ResponseReg } from '../utils/interfaces';
import { loggedUsersMap } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';

const handleCreateUser = (msg: RequestReg, ws: ws) => {
  if (loggedUsersMap.has(msg.data.name)) {
    const objTest: ResponseReg = {
      type: MessageTypes.reg,
      data: {
        name: msg.data.name,
        index: 1,
        error: true,
        errorText: 'BLAH BLAH',
      },
      id: 0,
    };

    ws.send(messageStringify(objTest));
    return;
  }

  loggedUsersMap.set(msg.data.name, ws);

  const objTest: ResponseReg = {
    type: MessageTypes.reg,
    data: {
      name: msg.data.name,
      index: 1,
      error: false,
      errorText: '',
    },
    id: 0,
  };

  ws.send(messageStringify(objTest));

  ws.on('close', () => {
    loggedUsersMap.delete(msg.data.name);
    console.log(`User ${msg.data.name} disconnected and removed from logged-in users.`);
  });
};
export default handleCreateUser;
