//const Wayward = require('./../Wayward.js');
const Util = require('./../Common/Util.js');

function Connection(server, socket) {
  this.server = server;
  this.socket = socket;

  this.key;
  this.userKey = 0;

  this.lastActivity = Util.getTime();
  this.dropped = false;
}

Connection.prototype = {
  setUser: function (user) {
    this.userKey = user.key;
    Util.log('sys', 'connection assigned to user', {user: this.userKey, connection: this.key});
  },
  clearUser: function (user) {
    this.userKey = 0;
    Util.log('sys', 'connection unassigned from user', {user: this.userKey, connection: this.key});
  },
  drop: function () {
    this.dropped = true;
    Util.log('sys', 'connection dropped', {user: this.userKey, connection: this.key});
  },
  undrop: function () {
    this.dropped = false;
    this.lastActivity = Util.getTime();
    Util.log('sys', 'connection undropped', {user: this.userKey, connection: this.key});
  },
  emit: function (action, data) {
    this.socket.emit(action, data);
  },
  dispose: function () {
    Util.log('sys', 'connection removed', {user: this.userKey, connection: this.key});
    if (this.userKey !== 0) {
      this.server.users.removeByKey(this.userKey);
    }
    this.server = undefined;
  }
};

module.exports = Connection; //node modules hook