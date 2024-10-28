import { availableRooms } from '../db';
import broadcast from '../utils/broadcast';
import responseRooms from '../utils/roomsHelper';
import handleCreateGame from './handleCreateGame';

const addUserToRoom = async (currentUser: string, userWhoCreatedRoom: string) => {
  if (currentUser === userWhoCreatedRoom) return;

  if (
    availableRooms.has(userWhoCreatedRoom) &&
    availableRooms.get(userWhoCreatedRoom)!.roomUsers.length < 2
  ) {
    availableRooms.get(userWhoCreatedRoom)?.roomUsers.push({ name: currentUser, index: 2 });
  }

  if (availableRooms.get(userWhoCreatedRoom)?.roomUsers.length === 2) {
    availableRooms.delete(userWhoCreatedRoom);
    await handleCreateGame(currentUser, userWhoCreatedRoom);
  }

  const response = responseRooms();

  await broadcast(response);
};

export default addUserToRoom;
