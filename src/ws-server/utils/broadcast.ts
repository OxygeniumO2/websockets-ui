import { loggedUsersMap } from '../db';

const broadcast = (data: string) => {
  loggedUsersMap.forEach((client) => client.send(data));
};

export default broadcast;
