import ws from 'ws';
import { Room } from './utils/interfaces';

const db = [];

const loggedUsersMap = new Map<string, { password: string; ws: ws; logged: boolean }>();

const availableRooms = new Map<string, Room>();

export { db, loggedUsersMap, availableRooms };
