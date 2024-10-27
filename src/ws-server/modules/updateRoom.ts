import ws from 'ws';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import { availableRooms } from '../db';

const updateRoom = async (ws: ws) => {
  const updateRooms = {
    type: MessageTypes.updateRoom,
    data: Array.from(availableRooms.values()),
    id: 0,
  };

  ws.send(messageStringify(updateRooms));

  console.log(`Update rooms response was sent`);
};
export default updateRoom;
