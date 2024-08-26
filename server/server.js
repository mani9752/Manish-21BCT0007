const WebSocket = require('ws');
const Game = require('./game');

const wss = new WebSocket.Server({ port: 3000 });
const game = new Game();

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(game.getGameState()));

  ws.on('message', (message) => {
    const { position, player } = JSON.parse(message);
    const isValidMove = game.validateMove(position, player);

    if (isValidMove) {
      const gameState = game.getGameState();
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(gameState));
        }
      });
    } else {
      ws.send(JSON.stringify({ error: 'Invalid move' }));
    }
  });
});
