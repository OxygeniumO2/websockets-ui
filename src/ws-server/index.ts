import ws from 'ws';

const port = 3000;

const server = new ws.Server({ port });

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(message.toString());
  });
  console.log('connected');
});
