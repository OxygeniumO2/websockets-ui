import ws from 'ws';

export const messageParser = (message: ws.RawData) => {
  const outerObj = JSON.parse(message.toString());
  const dataObj = JSON.parse(outerObj.data);
  return { ...outerObj, data: dataObj };
};

export const messageStringify = <T extends { data: unknown }>(obj: T): string => {
  return JSON.stringify({ ...obj, data: JSON.stringify(obj.data) });
};
