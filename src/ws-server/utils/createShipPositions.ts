import { Position, Ship, ShipDB } from './interfaces';

const createShipPositions = (ship: Ship): ShipDB => {
  const positions: Position[] = [];

  for (let i = 0; i < ship.length; i += 1) {
    positions.push({
      x: ship.position.x + (!ship.direction ? i : 0),
      y: ship.position.y + (ship.direction ? i : 0),
      isHit: false,
    });
  }
  return {
    positions,
    health: ship.length,
    totalShips: 9,
  };
};

export default createShipPositions;
