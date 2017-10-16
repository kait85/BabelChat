//const Wayward = require('./../Wayward.js');
const User = require('./User.js');
const Util = require('./../Common/Util.js');

function UsersManager(server) {
  this.server = server;

  this.users = [];
  this.keys = {};
  this.dead = [];
}

UsersManager.prototype = {
  create: function () {
    let user = new User(this.server);

    let key = Util.generateKey();
    user.key = key;

    this.add(user);

    return user;
  },
  add: function (user) {
    let i;
    if (this.dead.length > 0) {
      i = this.dead.pop();
      this.users[i] = user;
      this.keys[user.key] = i;
    } else {
      this.users.push(user);
      this.keys[user.key] = this.users.length - 1;
    }
  },
  getAll: function () {
    let users = [], key;
    for (key in this.keys) {
      users.push(this.users[this.keys[key]]);
    }
    return users;
  },
  get: function (key) {
    let user;

    if (this.keys.hasOwnProperty(key))
      user = this.users[this.keys[key]];
    return user;
  },
  remove: function (user) {
    this.removeByKey(user.key);
  },
  removeByKey: function (key) {
    Util.log('sys', 'UsersManager:removeByKey', key);
    if (this.keys.hasOwnProperty(key)) {
      let i = this.keys[key];

      this.users[i].dispose();
      this.users[i] = undefined;
      this.dead.push(i); //recycle the user

      //remove the key
      delete this.keys[key];
    }
  },
  removeAll: function () {
    Util.log('sys', 'UsersManager:removeAll', this.keys);
    let key;
    for (key in this.keys) {
      this.users[this.keys[key]].dispose();
      this.users[this.keys[key]] = undefined;
      this.dead.push(this.keys[key]); //recycle the user
      delete this.keys[key];
    }
  },
  dispose: function () {
    this.removeAll();
    this.server = undefined;
  }
};

module.exports = UsersManager; //node modules hook