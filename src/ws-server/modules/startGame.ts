import { currentGames, loggedUsersMap } from '../db';
import { Ship, StartGame } from '../utils/interfaces';
import { messageStringify } from '../utils/messagesHelpers';
import { MessageTypes } from '../utils/types';

const createResponseCreateGame = (currentPlayerIndex: string, ships: Ship[]): StartGame => {
  return {
    type: MessageTypes.startGame,
    data: {
      ships,
      currentPlayerIndex,
    },
    id: 0,
  };
};

const startGame = async (playerWhoCreated: string, player2: string) => {
  const { shipsPlayerWhoCreated, shipsPlayer2 } = currentGames.get(playerWhoCreated)!;

  const respPlayer1 = createResponseCreateGame(playerWhoCreated, shipsPlayerWhoCreated);
  const respPlayer2 = createResponseCreateGame(player2, shipsPlayer2);

  loggedUsersMap.get(playerWhoCreated)?.ws.send(messageStringify(respPlayer1));
  loggedUsersMap.get(player2)?.ws.send(messageStringify(respPlayer2));
};

export default startGame;
