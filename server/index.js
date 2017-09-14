const path = require('path');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const msgUtilsFactory = require('../common/msgUtils');
const game = require('./game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server: server,
});

server.listen();

wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(data) {
    try {
      var msg = JSON.parse(data);
      msgUtils.parseMsg(msg, ws);
    } catch (e) {
      console.error(e);
    }
    console.log('received: %s', data);
  });
});

var methodsMap = {
  createGame: createGame,
  joinGame: joinGame,
  move: move,
};

const msgUtils = msgUtilsFactory(methodsMap);

var games = {};

var GAME_STATUS_WAITING = 0;
var GAME_STATUS_STARTED = 1;

app.use('/', express.static(path.resolve(__dirname, '../dist')));

function sendMsg(msg, ws) {
  ws.send(JSON.stringify(msg));
}

function createGame(params, ws) {
  var gameId = process.env.NODE_ENV !== 'production' && params.fGameId ? params.fGameId : null;
  var newGame = game({
    id: gameId,
    role: params.role,
    boardWidth: params.width,
  });
  games[newGame.id] = newGame;
  newGame.addPlayer(ws, params.width, params.role);
  console.log('new game', gameId);
  sendMsg(msgUtils.createMsg('createGame', {gameId: newGame.id, role: params.role}), ws);
}

function joinGame(params, ws) {
  var gameId = params.gameId;
  var currentGame = games[gameId];
  if (currentGame) {
    currentGame.status = GAME_STATUS_STARTED;
    console.log('joined game', gameId);
    currentGame.addPlayer(ws, params.width);
    currentGame.getPlayers().forEach(function(player) {
      sendMsg(msgUtils.createMsg('startGame', {
        gameId: gameId,
        width: currentGame.boardWidth,
        role: player.pieces,
      }), player.ws);
    });
  }
}

function move(params, ws) {
  const gameId = params.gameId;
  const location = params.location;
  const currentGame = games[gameId];
  if (currentGame) {
    console.log('move for game', gameId, location, currentGame.pendingMove);
    const pendingMove = currentGame.getPendingMove();
    if (pendingMove) {
      const moveResult = currentGame.game.move({
        from: pendingMove,
        to: location,
      });
      currentGame.setPendingMove(null);
      console.log(currentGame.game.ascii());
      currentGame.getPlayers().forEach(function(player) {
        sendMsg(msgUtils.createMsg('move', moveResult), player.ws);
      });
    } else {
      currentGame.setPendingMove(location);
    }
  }
}
