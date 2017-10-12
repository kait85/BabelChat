#!/usr/bin/env node

var Wayward = require('./nodejs/Wayward/Wayward.js');
var path    = require('path');
global.appRoot = path.resolve(__dirname).replace(/\\/g,"/") + '/'; //simple root path is defined globally for use elsewhere

/*!
 * Starships
 * Copyright(c) 2016 HotHammerGames <hothammergames@gmail.com>
 */

var config = {};

/* server port */
config.port = 3070;

/* database settings */
config.db = {
    'host' : '127.0.0.1',
    'name' : 'hhg-lobby',
    'user' : 'root',
    'password' : ''
};

config.Client = {
    FILE_NAME : 'chatClient.min.js',
    FILE_PATH : global.appRoot + 'public_html/assets/js/Wayward/Generated/',
    MINIFY : false
};

//server run file
Wayward.run(config);