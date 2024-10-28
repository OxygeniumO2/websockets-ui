import { availableRooms } from '../db';
import broadcast from '../utils/broadcast';
import responseRooms from '../utils/roomsHelper';

const handleCreateRoom = async (user: string) => {
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
