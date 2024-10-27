import { currentGames, loggedUsersMap } from '../db';
import { AddShips } from '../utils/interfaces';
import startGame from './startGame';
import sendTurn from './sendTurn';

const handleAddShips = async (request: AddShips) => {
  const { gameId, ships, indexPlayer } = request.data;

  if (!currentGames.has(gameId)) return;

  if (indexPlayer === currentGames.get(gameId)?.indexPlayerWhoCreated) {
    currentGames.get(gameId)?.shipsPlayerWhoCreated?.push(...ships);
  } else {
    currentGames.get(gameId)?.shipsPlayer2?.push(...ships);
  }

  if (
    currentGames.get(gameId)!.shipsPlayerWhoCreated.length > 0 &&
    currentGames.get(gameId)!.shipsPlayer2.length > 0
  ) {
    const playerWhoCreated = currentGames.get(gameId)!.indexPlayerWhoCreated;
    const player2 = currentGames.get(gameId)!.indexPlayer2;

    await startGame(playerWhoCreated, player2);

    await sendTurn(playerWhoCreated, player2, gameId);
  }
};

export default handleAddShips;
