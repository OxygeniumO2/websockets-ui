import { loggedUsersMap, winners } from '../db';
import { MessageTypes } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import broadcast from '../utils/broadcast';
import winnersResponseHelper from '../utils/winnersResponseHelper';

const handleWinner = async (currentPlayer: string, playerToHit: string) => {
  const data = {
    type: MessageTypes.finish,
    data: {
      winPlayer: currentPlayer,
    },
    id: 0,
  };

  winners[currentPlayer] = winners[currentPlayer] ? winners[currentPlayer] + 1 : 1;

  loggedUsersMap.get(playerToHit)?.ws.send(messageStringify(data));
  loggedUsersMap.get(currentPlayer)?.ws.send(messageStringify(data));

  const winnersData = winnersResponseHelper();

  await broadcast(winnersData);
};

export default handleWinner;