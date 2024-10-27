import { loggedUsersMap } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';

const handleCreateGame = async (currentUser: string, userWhoCreatedRoom: string) => {
  const user1Game = {
    type: MessageTypes.createGame,
    data: {
      idGame: userWhoCreatedRoom,
      idPlayer: userWhoCreatedRoom,
    },
    id: 0,
  };

  const user2Game = {
    type: MessageTypes.createGame,
    data: {
      idGame: userWhoCreatedRoom,
      idPlayer: currentUser,
    },
    id: 0,
  };

  loggedUsersMap.get(userWhoCreatedRoom)?.ws.send(messageStringify(user1Game));
  loggedUsersMap.get(currentUser)?.ws.send(messageStringify(user2Game));
};

export default handleCreateGame;
