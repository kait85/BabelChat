// const Wayward = require('./../Wayward.js');
const Util = require('./../Common/Util.js');

class User {
  constructure(server) {
    this.server = server;

    this.key = '';
    this.connectionKey = 0;
    this.gameKey = 0;
    this.playerKey = 0;

    this.name = Util.generateName();
    this.location = ''; // lobby, game, etc
  }
  setConnection(connection) {
    this.connectionKey = connection.key;
  }
  setGame(game) {
    this.gameKey = game.key;
  }
  setPlayer(player) {
    this.playerKey = player.key;
  }
  getConnection() {
    let conn;
    if (this.connectionKey !== 0) {
      conn = this.server.connections.get(this.connectionKey);
    }
    return conn;
  }
  getGame() {
    let game;
    if (this.gameKey !== 0) {
      game = this.server.games.get(this.gameKey);
    }
    return game;
  }
  getPlayer() {
    let player;
    if (this.gameKey !== 0 && this.playerKey !== 0) {
      player = this.server.games.get(this.gameKey).players.get(this.playerKey);
    }
    return player;
  }
  clearConnection() {
    this.connectionKey = 0;
  }
  clearPlayer() {
    this.playerKey = 0;
  }
  clearGame() {
    this.gameKey = 0;
    this.clearPlayer();
  }
  dispose() {
    this.server = undefined;
  }
}

module.exports = User; // node modules hook
