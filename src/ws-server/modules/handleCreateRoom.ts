import { availableRooms } from '../db';
import ws from 'ws';
import broadcast from '../utils/broadcast';
import responseRooms from '../utils/roomsHelper';

const handleCreateRoom = async (user: string, ws: ws) => {
  if (availableRooms.has(user)) return;

  availableRooms.set(user, {
    roomId: user,
    roomUsers: [
      {
        name: user,
        index: 1,
      },
    ],
  });

  const response = responseRooms();

  await broadcast(response);
};

export default handleCreateRoom;
