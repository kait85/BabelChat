const Wayward = require('./../Wayward.js');
const Connection = require('./Connection.js');
const Util = require('./../Common/Util.js');

class ConnectionsManager {
  constructure(server) {
    this.server = server;

    this.connections = [];
    this.keys = {};
    this.dead = [];

    this.connectionIDs = 1;
  }
  create(socket) {
    const connection = new Connection(this.server, socket);

    this.connectionIDs += 1;
    connection.key = `conn${this.connectionIDs}`;

    this.add(connection);

    Util.log('sys', 'connection established', { connection: connection.key });

    // link them up..
    // user.setConnection(connection);
    // connection.setUser(user);

    return connection;
  }
  add(connection) {
    let i;
    if (this.dead.length > 0) {
      i = this.dead.pop();
      this.connections[i] = connection;
      this.keys[connection.key] = i;
    } else {
      this.connections.push(connection);
      this.keys[connection.key] = this.connections.length - 1;
    }
  }
  getAll() {
    const connections = [];
    Object.keys(this.keys).forEach((key) => {
      connections.push(this.connections[this.keys[key]]);
    });
    return connections;
  }
  get(key) {
    let connection;

    if (Object.prototype.hasOwnProperty.call(this.keys, key)) {
      connection = this.connections[this.keys[key]];
      connection.lastActivity = Util.getTime();
    }

    return connection;
  }
  handleDropped() {
    // check for any new dropped..
    // see if any have been gone too long, remove them if we need to
    const now = Util.getTime();

    // see if any have been gone too long, remove them if we need to
    Object.keys(this.keys).forEach((key) => {
      const connection = this.connections[this.keys[key]];
      if (connection.dropped && (now - connection.lastActivity) > Wayward.DROP_WAIT_TIME) {
        // clean up
        connection.dispose();

        // clear up the connection slot
        this.connections[this.keys[key]] = undefined;
        this.dead.push(this.keys[key]); // recycle the connection

        // remove the key
        delete this.keys[key];
      }
    });
  }
  remove(connection) {
    this.removeByKey(connection.key);
  }
  removeByKey(key) {
    Util.log('sys', 'ConnectionsManager:removeByKey', key);
    if (Object.prototype.hasOwnProperty.call(this.keys, key)) {
      const i = this.keys[key];

      // clean up
      this.connections[i].dispose();

      // clear up the connection slot
      this.connections[i] = undefined;
      this.dead.push(i); // recycle the connection

      // remove the key
      delete this.keys[key];
    }
  }
  removeAll() {
    Util.log('sys', 'ConnectionsManager:removeAll', this.keys);
    Object.keys(this.keys).forEach((key) => {
      this.connections[this.keys[key]].dispose();
      this.connections[this.keys[key]] = undefined;
      this.dead.push(this.keys[key]); // recycle the connection
      delete this.keys[key];
    });
  }
  emitAll(action, data) {
    Util.log('out', `[ALL] : ${action}`, data);
    Object.keys(this.keys).forEach((key) => {
      this.connections[this.keys[key]].socket.emit(action, data);
    });
  }
  dispose() {
    this.removeAll();
    this.server = undefined;
  }
}

module.exports = ConnectionsManager; // node modules hook
