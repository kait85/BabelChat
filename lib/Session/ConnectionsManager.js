const Wayward = require('./../Wayward.js');
const Connection = require('./Connection.js');
const Util = require('./../Common/Util.js');

function ConnectionsManager(server) {
  this.server = server;

  this.connections = [];
  this.keys = {};
  this.dead = [];

  this.connectionIDs = 1;
}

ConnectionsManager.prototype = {
  create: function (socket) {
    let connection = new Connection(this.server, socket);

    this.connectionIDs += 1;
    connection.key = 'conn' + this.connectionIDs;

    this.add(connection);

    Util.log('sys', 'connection established', {connection: connection.key});

    //link them up..
    //user.setConnection(connection);
    //connection.setUser(user);

    return connection;
  },
  add: function (connection) {
    let i;
    if (this.dead.length > 0) {
      i = this.dead.pop();
      this.connections[i] = connection;
      this.keys[connection.key] = i;
    } else {
      this.connections.push(connection);
      this.keys[connection.key] = this.connections.length - 1;
    }
  },
  getAll: function () {
    let connections = [], key;
    for (key in this.keys) {
      connections.push(this.connections[this.keys[key]]);
    }
    return connections;
  },
  get: function (key) {
    let connection;

    if (this.keys.hasOwnProperty(key)) {
      connection = this.connections[this.keys[key]];
      connection.lastActivity = Util.getTime();
    }

    return connection;
  },
  handleDropped: function () {
    //check for any new dropped..
    //see if any have been gone too long, remove them if we need to
    let now = Util.getTime();

    //see if any have been gone too long, remove them if we need to
    let key;
    for (key in this.keys) {
      let connection = this.connections[this.keys[key]];
      if (!!connection.dropped && (now - connection.lastActivity) > Wayward.DROP_WAIT_TIME) {

        //clean up
        connection.dispose();

        //clear up the connection slot
        this.connections[this.keys[key]] = undefined;
        this.dead.push(this.keys[key]); //recycle the connection

        //remove the key
        delete this.keys[key];
      }
    }
  },
  remove: function (connection) {
    this.removeByKey(connection.key);
  },
  removeByKey: function (key) {
    Util.log('sys', 'ConnectionsManager:removeByKey', key);
    if (this.keys.hasOwnProperty(key)) {
      let i = this.keys[key];

      //clean up
      this.connections[i].dispose();

      //clear up the connection slot
      this.connections[i] = undefined;
      this.dead.push(i); //recycle the connection

      //remove the key
      delete this.keys[key];
    }
  },
  removeAll: function () {
    Util.log('sys', 'ConnectionsManager:removeAll', this.keys);
    let key;
    for (key in this.keys) {
      this.connections[this.keys[key]].dispose();
      this.connections[this.keys[key]] = undefined;
      this.dead.push(this.keys[key]); //recycle the connection
      delete this.keys[key];
    }
  },
  emitAll: function (action, data) {
    Util.log('out', '[ALL] : ' + action, data);

    let key;
    for (key in this.keys) {
      this.connections[this.keys[key]].socket.emit(action, data);
    }
  },
  dispose: function () {
    this.removeAll();
    this.server = undefined;
  }
};

module.exports = ConnectionsManager; //node modules hook