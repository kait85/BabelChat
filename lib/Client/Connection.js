// const Wayward = require('./../Wayward.js');
const Client = require('./Client.js');
const Util = require('./../Common/Util.js');

const objClass = 'Client.Connection';
const objInterface = [];

const obj = class Connection {
  constructor(config) {
    this.debugging = Client.types.connection;
    this.server = config.server;
    this.clientInterface = config.clientInterface;
    this.socket = null;
    this.isReady = false;
    this.isConnect = false;
  }
  connect() {
    if (this.isConnect) {
      return this;
    }

    // make sure socket.io is loaded
    if (window.io === undefined) {
      this.clientInterface.log(`Unable to connect with server at ${this.server.address}`);
      return this;
    }

    // connect with server
    this.socket = window.io.connect(this.server.address);
    this.isConnect = true;

    // primary event rigging
    this.setEvents(this.socket);

    return this;
  }
  ready() {
    if (this.isReady) {
      return this;
    }

    this.socket.emit('clientReady', {
      // key: this.key
    });
    this.clientInterface.ready();
    this.isReady = true;
    this.setUIEvents(this.socket);

    return this;
  }
  sendMessage(name, scope, msg) {
    this.socket.emit('chatMessage', {
      name,
      scope,
      key: this.user.key,
      msg,
    });
    return this;
  }

  // //////////////////////////////////////////////////////
  // Events that the client routes to the UI             //
  // //////////////////////////////////////////////////////
  setUIEvents(socket) {
    const client = this;
    Object.entries(client.clientInterface).forEach((row) => {
      const [e, event] = row;
      socket.removeListener(e, event);
      socket.on(e, event);
    });
  }

  // //////////////////////////////////////////////////////
  // Core events for the client / server communciation   //
  // //////////////////////////////////////////////////////

  setEvents(socket) {
    const client = this;

    const events = {
      ready: (data) => {
        Util.log(data);
        client.ready();
      },
    };

    Object.entries(events).forEach((row) => {
      const [e, event] = row;
      socket.removeListener(e, event);
      socket.on(e, event);
    });
  }
};

// /////////////////////////////////
// public interfaces for minify/////
objInterface.push('connect');
objInterface.push('ready');
objInterface.push('sendMessage');
// /////////////////////////////////

Util.generateObjectString(obj, objClass, objInterface);
module.exports = obj;
