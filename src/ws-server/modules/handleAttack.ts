import { currentGames } from '../db';
import { Attack } from '../utils/interfaces';
import { Ship } from '../utils/interfaces';
import ws from 'ws';
import attackFeedback from './attackFeedback';
import sendTurn from './sendTurn';

const handleAttack = async (request: Attack, ws: ws) => {
  const { gameId, x, y, indexPlayer } = request.data;

  let playerToHit: string;
  let ships: Ship[] = [];

  if (indexPlayer !== currentGames.get(gameId)?.indexPlayerWhoCreated) {
    playerToHit = currentGames.get(gameId)!.indexPlayerWhoCreated;
    ships = currentGames.get(gameId)!.shipsPlayerWhoCreated;
  } else {
    playerToHit = currentGames.get(gameId)!.indexPlayer2;
    ships = currentGames.get(gameId)!.shipsPlayer2;
  }

  const isHit = ships.some((ship) => ship.position.x === x && ship.position.y === y);

  await attackFeedback(isHit, indexPlayer, playerToHit, x, y, gameId);
};

export default handleAttack;
