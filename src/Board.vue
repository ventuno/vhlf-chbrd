<template>
  <div>
    <div id="loader" v-if="loading">Waiting for player 2 to join. Game ID: {{gameId}}.</div>
    <div id="board" style="width: 100%"></div>
  </div>
</template>

<script>
import msgUtilsFactory from '../common/msgUtils'
import gameUtils from '../common/gameUtils'

export default {
  name: 'board',
  data() {
    return {
      loading: true,
      gameId: undefined,
    }
  },
  methods: {
    createGame: function(params) {
      this.game.gameId = params.gameId;
      this.$data.gameId = this.game.gameId;
    },

    startGame: function(params) {
      this.$data.loading = false;
      this.game.role = params.role;
      this.positionBoard(params.width);
      if (this.game.role === gameUtils.PIECES.BLACK) {
        this.game.board.flip();
      }
    },

    move: function(params) {
      if (params.color) {
        this.game.board.move(params.from + '-' + params.to);
      }
    },

    positionBoard: function(width) {
      this.game.$board.width(width);
      this.game.board.resize();
      const boardHeight = this.game.$board.height();
      this.game.$board.css('top', -boardHeight/2);
    },

    onSelect: function(square) {
      this.game.$board.find('.highlight').removeClass('highlight');
      this.game.$board.find(`.square-${square}`).addClass('highlight');
      this.sendMsg(this.msgUtils.createMsg('move', {
        gameId: this.game.gameId,
        location: square,
      }));
    },

    onWsMessage: function(message) {
      const msg = JSON.parse(message.data);
      this.msgUtils.parseMsg(msg);
    },

    onWsOpen: function() {
      const query = this.$route.query;
      if (query.gameId) {
        this.game.gameId = query.gameId;
        this.sendMsg(this.msgUtils.createMsg('joinGame', {
          gameId: this.game.gameId,
          width: this.game.$board.width(),
        }));
      } else {
        query.width = this.game.$board.width();
        this.sendMsg(this.msgUtils.createMsg('createGame', query));
      }
    },

    sendMsg: function(msg) {
      this.ws.send(JSON.stringify(msg));
    },
  },
  created() {
    const methodMap = {
      startGame: this.startGame,
      createGame: this.createGame,
      move: this.move,
      resize: this.resize,
    };
    this.msgUtils = msgUtilsFactory(methodMap);
    this.game = {};
  },
  mounted() {
    // eslint-disable-next-line no-undef
    const board = ChessBoard('board', {
      interactionMode: 'select',
      position: 'start',
      draggable: true,
      onSelect: this.onSelect,
    });
    this.game.board = board;
    // eslint-disable-next-line no-undef
    this.game.$board = $('#board');
    this.positionBoard();
    this.ws = new WebSocket('ws://' + window.location.host);
    this.ws.addEventListener('open', this.onWsOpen);
    this.ws.addEventListener('message', this.onWsMessage);
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
}

#loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: white;
}

#board {
  position: relative;
  margin: 0 auto;
}

.highlight {
  -webkit-box-shadow: inset 0 0 3px 3px yellow;
  -moz-box-shadow: inset 0 0 3px 3px yellow;
  box-shadow: inset 0 0 3px 3px yellow;  
}
</style>
