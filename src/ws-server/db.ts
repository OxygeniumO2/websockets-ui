import ws from 'ws';
import { GameDB, Room } from './utils/interfaces';

const loggedUsersMap = new Map<string, { password: string; ws: ws; logged: boolean }>();

const availableRooms = new Map<string, Room>();

const currentGames = new Map<string, GameDB>();

export { loggedUsersMap, availableRooms, currentGames };
