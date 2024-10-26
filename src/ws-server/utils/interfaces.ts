import { MessageTypes } from './types';

export interface RequestReg {
  type: MessageTypes.reg;
  data: {
    name: string;
    password: string;
  };
  id: 0;
}

export interface ResponseReg {
  type: MessageTypes.reg;
  data: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  };
  id: 0;
}
