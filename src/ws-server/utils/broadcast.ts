import ws from 'ws';
import { loggedUsersMap } from '../db';

const broadcast = async (data: string) => {
  loggedUsersMap.forEach(
    (client) =>
      client.logged && client.ws.readyState === ws.OPEN && !client.partner && client.ws.send(data)
  );
};

export default broadcast;
