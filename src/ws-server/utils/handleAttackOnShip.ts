import { Position, ShipDB } from './interfaces';
import { Statuses } from './types';

const generateMissAround = (positions: Position[]): Position[] => {
  const missPositions: Position[] = [];

  for (const pos of positions) {
    const surroundingCoords = [
      { x: pos.x - 1, y: pos.y - 1 },
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x + 1, y: pos.y - 1 },
      { x: pos.x - 1, y: pos.y },
      { x: pos.x + 1, y: pos.y },
      { x: pos.x - 1, y: pos.y + 1 },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x + 1, y: pos.y + 1 },
    ];

    for (const coord of surroundingCoords) {
      if (
        !positions.some((p) => p.x === coord.x && p.y === coord.y) &&
        !missPositions.some((m) => m.x === coord.x && m.y === coord.y)
      ) {
        missPositions.push({ x: coord.x, y: coord.y, isHit: false });
      }
    }
  }

  return missPositions;
};

const handleAttackOnShip = (shipsPosition: ShipDB[], x: number, y: number) => {
  for (const ship of shipsPosition) {
    const hitPosition = ship.positions.find((pos) => pos.x === x && pos.y === y);

    if (hitPosition && !hitPosition.isHit) {
      hitPosition.isHit = true;
      ship.health -= 1;

      const status = ship.health === 0 ? Statuses.killed : Statuses.shot;

      if (status === Statuses.killed) {
        shipsPosition[0].totalShips -= 1;
      }

      return {
        status,
        ...(status === Statuses.killed && {
          missAround: generateMissAround(ship.positions),
          shipPositions: ship.positions,
          leftShips: shipsPosition[0].totalShips,
        }),
      };
    } else if (hitPosition && hitPosition.isHit) {
      return { status: Statuses.shot };
    }
  }

  return { status: Statuses.miss };
};

export default handleAttackOnShip;
