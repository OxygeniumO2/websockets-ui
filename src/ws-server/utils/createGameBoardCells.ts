import { Position } from './interfaces';

const createGameBoardCells = () => {
  const cells: Position[] = [];
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      cells.push({ x: i, y: j, isHit: false });
    }
  }
  return cells;
};

export default createGameBoardCells;
