import { winners } from '../db';
import { messageStringify } from './messagesHelpers';
import { MessageTypes } from './types';

const winnersResponseHelper = () => {
  const winnersArray = Object.entries(winners).map(([name, wins]) => ({ name, wins }));

  return messageStringify({
    type: MessageTypes.updateWinners,
    data: winnersArray,
    id: 0,
  });
};

export default winnersResponseHelper;
