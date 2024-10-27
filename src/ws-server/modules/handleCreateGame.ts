import { currentGames, loggedUsersMap } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import { CreateGame } from '../utils/interfaces';

const createResponseCreateGame = (currentUser: string, userWhoCreatedRoom: string): CreateGame => {
  return {
    type: MessageTypes.createGame,
    data: {
      idGame: userWhoCreatedRoom,
      idPlayer: currentUser,
    },
    id: 0,
  };
};

const handleCreateGame = async (currentUser: string, userWhoCreatedRoom: string) => {
  const user1Game = createResponseCreateGame(userWhoCreatedRoom, userWhoCreatedRoom);
  const user2Game = createResponseCreateGame(currentUser, userWhoCreatedRoom);

  currentGames.set(userWhoCreatedRoom, {
    gameId: userWhoCreatedRoom,
    shipsPlayerWhoCreated: [],
    shipsPlayer2: [],
    indexPlayerWhoCreated: userWhoCreatedRoom,
    indexPlayer2: currentUser,
    indexPlayerTurn: userWhoCreatedRoom,
  });

  loggedUsersMap.get(userWhoCreatedRoom)?.ws.send(messageStringify(user1Game));
  loggedUsersMap.get(currentUser)?.ws.send(messageStringify(user2Game));
};

export default handleCreateGame;
