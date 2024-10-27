import { loggedUsersMap } from '../db';
import { AttackFeedback } from '../utils/interfaces';
import { MessageTypes, Statuses } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import sendTurn from './sendTurn';

const attackFeedback = async (
  isHit: boolean,
  currentPlayer: string,
  playerToHit: string,
  x: number,
  y: number,
  gameId: string
) => {
  const responseAttack: AttackFeedback = {
    type: MessageTypes.attack,
    data: {
      position: {
        x,
        y,
      },
      currentPlayer,
      status: isHit ? Statuses.shot : Statuses.miss,
    },
    id: 0,
  };

  loggedUsersMap.get(playerToHit)?.ws.send(messageStringify(responseAttack));
  loggedUsersMap.get(currentPlayer)?.ws.send(messageStringify(responseAttack));

  await sendTurn(playerToHit, currentPlayer, gameId);
};

export default attackFeedback;
