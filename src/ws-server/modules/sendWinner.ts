import { loggedUsersMap } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';

const handleWinner = async (currentPlayer: string, playerToHit: string) => {
  const data = {
    type: MessageTypes.finish,
    data: {
      winPlayer: currentPlayer,
    },
    id: 0,
  };

  loggedUsersMap.get(playerToHit)?.ws.send(messageStringify(data));
  loggedUsersMap.get(currentPlayer)?.ws.send(messageStringify(data));
};

export default handleWinner;
