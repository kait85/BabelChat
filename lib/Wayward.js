import 'airbnb-js-shims/target/es2015';
import 'airbnb-browser-shims/browser-only';

const path = require('path');

// simple root path is defined globally for use elsewhere
const strPath = path.resolve(__dirname).replace(/\\/g, '/');
global.appRoot = `${strPath}/`;

const Wayward = {
  PROJECT_NAME: 'BabelChat',
  LICENSE: 'MIT License',
  VERSION: '1.0',

  DEBUGGING: true,

  // after a connection drops: how long until we remove it entirly (in seconds)
  DROP_WAIT_TIME: 20,

  Client: {
    FILE_NAME: 'chatClient.min.js',
    FILE_PATH: `${global.appRoot}../public_html/Wayward/`,
    MINIFY: false,
  },
};

// node modules hook
module.exports = Wayward;


/* *********************************************************************************
 * NOTE: For this file all 'require' calls need to happen after the namespace
 * & constants are defined due to potential circular depenencies issues. Nodejs
 * will load a blank object for any Wayward.js requires if we have not set to exports
 * before we start requiring everything else here.
 * ******************************************************************************* */

const ChatServer = require('./Servers/ChatServer.js');
const Client = require('./Client/Client.js');

/**
 * Launch all the server instances required for client-server communication
 * @param {object} config - db settings, stored in a seperate location
 * @returns {void}
 */
Wayward.run = function run(config) {
  // db credentials
  Wayward.db = config.db;

  // client path settings
  if (config.Client !== undefined) { // ES2015+ no longer neess typeof( ) !== "undefined"
    Wayward.Client = config.Client;
  }

  // save a fresh cache of the client, this will be delivered to users by apache
  Client.generateCache();

  // a basic server that handles chat
  const server = new ChatServer(config);
  server.run();
};
