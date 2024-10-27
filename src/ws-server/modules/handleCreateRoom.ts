import { availableRooms } from '../db';
import ws from 'ws';
import updateRoom from './updateRoom';
import broadcast from '../utils/broadcast';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import addUserToRoom from './addUserToRoom';

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

  const updateRooms = {
    type: MessageTypes.updateRoom,
    data: Array.from(availableRooms.values()),
    id: 0,
  };

  await broadcast(messageStringify(updateRooms));
};

export default handleCreateRoom;
