import { currentGames, loggedUsersMap } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';

const sendTurn = async (movePlayer: string, afkPlayer: string, gameId: string) => {
  const currentTurn = {
    type: MessageTypes.turn,
    data: {
      currentPlayer: movePlayer,
    },
    id: 0,
  };

  currentGames.get(gameId)!.indexPlayerTurn = movePlayer;

  loggedUsersMap.get(afkPlayer)?.ws.send(messageStringify(currentTurn));
  loggedUsersMap.get(movePlayer)?.ws.send(messageStringify(currentTurn));

  console.log(`User ${movePlayer} is now turn`);
};

export default sendTurn;
