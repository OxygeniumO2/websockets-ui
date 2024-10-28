import { currentGames } from '../db';
import { Attack, GameDB, Position, ShipDB } from '../utils/interfaces';
import { Ship } from '../utils/interfaces';
import ws from 'ws';
import attackFeedback from './attackFeedback';
import sendTurn from './sendTurn';
import handleAttackOnShip from '../utils/handleAttackOnShip';

const handleAttack = async (request: Attack, ws: ws) => {
  const { gameId, x, y, indexPlayer } = request.data;

  let playerToHit: string;
  let shipsPosition: ShipDB[] = [];
  let isHitCell = false;

  if (indexPlayer !== currentGames.get(gameId)?.indexPlayerWhoCreated) {
    playerToHit = currentGames.get(gameId)!.indexPlayerWhoCreated;

    isHitCell = currentGames
      .get(gameId)!
      .cellsPlayer2.some((cell) => cell.x === x && cell.y === y && cell.isHit);

    if (isHitCell) {
      await sendTurn(indexPlayer, playerToHit, gameId);
      return;
    }

    const cell = currentGames
      .get(gameId)!
      .cellsPlayer2.find((cell) => cell.x === x && cell.y === y);

    cell && (cell.isHit = true);

    shipsPosition = currentGames.get(gameId)!.shipsPositionPlayerWhoCreated;
  } else {
    playerToHit = currentGames.get(gameId)!.indexPlayer2;

    isHitCell = currentGames
      .get(gameId)!
      .cellsPlayerWhoCreated.some((cell) => cell.x === x && cell.y === y && cell.isHit);

    if (isHitCell) {
      await sendTurn(indexPlayer, playerToHit, gameId);
      return;
    }

    const cell = currentGames
      .get(gameId)!
      .cellsPlayerWhoCreated.find((cell) => cell.x === x && cell.y === y);

    cell && (cell.isHit = true);

    shipsPosition = currentGames.get(gameId)!.shipsPositionPlayer2;
  }

  const { status, missAround, shipPositions, leftShips } = handleAttackOnShip(shipsPosition, x, y);

  await attackFeedback(
    status,
    indexPlayer,
    playerToHit,
    x,
    y,
    gameId,
    shipPositions,
    missAround,
    leftShips
  );
};

export default handleAttack;
