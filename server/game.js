const crypto = require('crypto');

const Chess = require('chess.js').Chess;

const gameUtils = require('../common/gameUtils');

var gameIds = {};

function generateId() {
  return crypto.randomBytes(3).toString('hex');
}

function generateUniqueGameId() {
  let gameId = generateId();
  while (gameIds.hasOwnProperty(gameId)) {
    gameId = generateId();
  }
  gameIds[gameId] = gameId;
  return gameId;
}

module.exports = function(options) {
  const gameId = options.id || generateUniqueGameId();
  const players = [];
  let boardWidth = Infinity;
  let pendingMove = null;

  function addPlayer(webSocket, playerBoardWidth, pieces) {
    pieces = pieces || gameUtils.PIECES.WHITE;
    if (players.length === 1) {
      pieces = players[0].pieces === gameUtils.PIECES.WHITE ? gameUtils.PIECES.BLACK : gameUtils.PIECES.WHITE;
    }
    boardWidth = Math.min(boardWidth, playerBoardWidth);
    players.push(Object.freeze({
      pieces: pieces,
      boardWidth: playerBoardWidth,
      ws: webSocket,
    }));
  }

  const game = {
    id: gameId,
    // status: GAME_STATUS_WAITING,
    game: new Chess(),
    getBoardWidth: () => {
      return boardWidth;
    },
    addPlayer: addPlayer,
    getPlayers: () => {
      return players;
    },
    setPendingMove: (location) => {
      pendingMove = location;
    },
    getPendingMove: () => {
      return pendingMove;
    },
  };
  return Object.freeze(game);
};
