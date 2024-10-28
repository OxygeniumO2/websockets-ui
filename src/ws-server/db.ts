import ws from 'ws';
import { GameDB, Room } from './utils/interfaces';

const loggedUsersMap = new Map<string, { password: string; ws: ws; logged: boolean }>();

const availableRooms = new Map<string, Room>();

const currentGames = new Map<string, GameDB>();

const winners: Record<string, number> = {};

const activeSockets: Set<ws> = new Set();

export { loggedUsersMap, availableRooms, currentGames, winners, activeSockets };
