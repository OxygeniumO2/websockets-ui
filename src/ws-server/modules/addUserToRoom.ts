import { MessageTypes } from '../utils/types';
import ws from 'ws';
import { messageStringify } from '../utils/messagesHelpers';
import { availableRooms } from '../db';
import broadcast from '../utils/broadcast';

const addUserToRoom = async (index: string, user: string, ws: ws) => {
  if (index === user) return;

  if (availableRooms.has(index) && availableRooms.get(index)!.roomUsers.length < 2) {
    availableRooms.get(index)?.roomUsers.push({ name: user, index: 2 });
  }

  if (availableRooms.get(index)?.roomUsers.length === 2) {
    availableRooms.delete(index);
    // extra logic to create game
  }

  const updateRooms = {
    type: MessageTypes.updateRoom,
    data: Array.from(availableRooms.values()),
    id: 0,
  };

  await broadcast(messageStringify(updateRooms));
};

export default addUserToRoom;
