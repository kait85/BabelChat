// const Wayward = require('./../Wayward.js');
const User = require('./User.js');
const Util = require('./../Common/Util.js');

class UsersManager {
  constructure(server) {
    this.server = server;

    this.users = [];
    this.keys = {};
    this.dead = [];
  }
  create() {
    const user = new User(this.server);

    const key = Util.generateKey();
    user.key = key;

    this.add(user);

    return user;
  }
  add(user) {
    let i;
    if (this.dead.length > 0) {
      i = this.dead.pop();
      this.users[i] = user;
      this.keys[user.key] = i;
    } else {
      this.users.push(user);
      this.keys[user.key] = this.users.length - 1;
    }
  }
  getAll() {
    const users = [];
    Object.keys(this.keys).forEach((key) => {
      users.push(this.users[this.keys[key]]);
    });
    return users;
  }
  get(key) {
    let user;
    if (Object.prototype.hasOwnProperty.call(this.keys, key)) {
      user = this.users[this.keys[key]];
    }
    return user;
  }
  remove(user) {
    this.removeByKey(user.key);
  }
  removeByKey(key) {
    Util.log('sys', 'UsersManager:removeByKey', key);
    if (Object.prototype.hasOwnProperty.call(this.keys, key)) {
      const i = this.keys[key];

      this.users[i].dispose();
      this.users[i] = undefined;
      this.dead.push(i); // recycle the user

      // remove the key
      delete this.keys[key];
    }
  }
  removeAll() {
    Util.log('sys', 'UsersManager:removeAll', this.keys);
    Object.keys(this.keys).forEach((key) => {
      this.users[this.keys[key]].dispose();
      this.users[this.keys[key]] = undefined;
      this.dead.push(this.keys[key]); // recycle the user
      delete this.keys[key];
    });
  }
  dispose() {
    this.removeAll();
    this.server = undefined;
  }
}

module.exports = UsersManager; // node modules hook
