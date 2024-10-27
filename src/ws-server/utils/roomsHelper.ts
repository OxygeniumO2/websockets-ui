import { availableRooms } from '../db';
import { messageStringify } from './messagesHelpers';
import { MessageTypes } from './types';

const responseRooms = () => {
  const updateRooms = {
    type: MessageTypes.updateRoom,
    data: Array.from(availableRooms.values()),
    id: 0,
  };

  return messageStringify(updateRooms);
};

export default responseRooms;
