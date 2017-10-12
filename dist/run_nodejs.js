#!/usr/bin/env node

var Wayward = require('./Wayward/Wayward.js');
var path    = require('path');
global.appRoot = path.resolve(__dirname).replace(/\\/g,"/") + '/'; //simple root path is defined globally for use elsewhere

var config = {};

/* server port */
config.port = 3070;

/* database settings */
config.db = {
    'host' : '127.0.0.1',
    'name' : 'chat',
    'user' : 'root',
    'password' : ''
};

config.Client = {
    FILE_NAME : 'chatClient.min.js',
    FILE_PATH : global.appRoot + 'public_html/Wayward/',
    MINIFY : false
};

//server run file
Wayward.run(config);