import { loggedUsersMap } from '../db';
import { Position } from '../utils/interfaces';
import { MessageTypes, Statuses } from '../utils/types';
import { messageStringify } from '../utils/messagesHelpers';
import sendTurn from './sendTurn';
import handleWinner from './handleWinner';

const generateAttackResponse = (isHit: Statuses, x: number, y: number, currentPlayer: string) => {
  return messageStringify({
    type: MessageTypes.attack,
    data: {
      position: {
        x,
        y,
      },
      currentPlayer,
      status: isHit,
    },
    id: 0,
  });
};

const attackFeedback = (
  isHit: Statuses,
  currentPlayer: string,
  playerToHit: string,
  x: number,
  y: number,
  gameId: string,
  shipPositions: Position[] | undefined,
  missAround: Position[] | undefined,
  leftShips: number | undefined
) => {
  const responseAttack = generateAttackResponse(isHit, x, y, currentPlayer);

  if (isHit === Statuses.killed) {
    shipPositions?.forEach((pos) => {
      const responseAttack = generateAttackResponse(isHit, pos.x, pos.y, currentPlayer);

      loggedUsersMap.get(playerToHit)?.ws.send(responseAttack);
      loggedUsersMap.get(currentPlayer)?.ws.send(responseAttack);
    });

    missAround?.forEach((pos) => {
      const responseAttack = generateAttackResponse(Statuses.miss, pos.x, pos.y, currentPlayer);

      loggedUsersMap.get(playerToHit)?.ws.send(responseAttack);
      loggedUsersMap.get(currentPlayer)?.ws.send(responseAttack);
    });
  } else {
    loggedUsersMap.get(playerToHit)?.ws.send(responseAttack);
    loggedUsersMap.get(currentPlayer)?.ws.send(responseAttack);
  }

  if (isHit === Statuses.killed && leftShips === 0) {
    handleWinner(currentPlayer, playerToHit);
    return;
  }

  if (isHit === Statuses.miss) {
    sendTurn(playerToHit, currentPlayer, gameId);
  } else {
    sendTurn(currentPlayer, playerToHit, gameId);
  }
};

export default attackFeedback;
