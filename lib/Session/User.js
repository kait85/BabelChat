//const Wayward = require('./../Wayward.js');
const Util = require('./../Common/Util.js');

function User(server) {
  this.server = server;

  this.key;
  this.connectionKey = 0;
  this.gameKey = 0;
  this.playerKey = 0;

  this.name = Util.generateName();
  this.location = ''; //lobby, game, etc
}

User.prototype = {
  setConnection: function (connection) {
    this.connectionKey = connection.key;
  },
  setGame: function (game) {
    this.gameKey = game.key;
  },
  setPlayer: function (player) {
    this.playerKey = player.key;
  },
  getConnection: function () {
    let conn;
    if (this.connectionKey !== 0)
      conn = this.server.connections.get(this.connectionKey);
    return conn;
  },
  getGame: function () {
    let game;
    if (this.gameKey !== 0)
      game = this.server.games.get(this.gameKey);
    return game;
  },
  getPlayer: function () {
    let player;
    if (this.gameKey !== 0 && this.playerKey !== 0)
      player = this.server.games.get(this.gameKey).players.get(this.playerKey);
    return player;
  },
  clearConnection: function () {
    this.connectionKey = 0;
  },
  clearPlayer: function () {
    this.playerKey = 0;
  },
  clearGame: function () {
    this.gameKey = 0;
    this.clearPlayer();
  },
  dispose: function () {
    this.server = undefined;
  }
};

module.exports = User; //node modules hook