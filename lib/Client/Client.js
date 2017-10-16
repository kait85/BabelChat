const Connection = require('./Connection.js');

const fs = require('fs');
const Wayward = require('./../Wayward.js');
const Util = require('./../Common/Util.js');

const Client = class Client {
  constructor() {
    if (Client.instance) {
      return Client.instance;
    }
    Client.instance = this;

    this.file = Wayward.Client.FILE_NAME;
    this.path = Wayward.Client.FILE_PATH;

    this.types = [ // labels for debugging
      ['connection', 'Client.Connection'],
    ];

    return this;
  }
  generateHeader() {
    const header = `
    /*  ${Util.hash(this.output)}
     *
     *     ${Wayward.PROJECT_NAME}
     *
     *     Version:       ${Wayward.VERSION}
     *     Generated On:  ${(new Date()).toUTCString()}
     *     License:       ${Wayward.LICENSE}
     *
     */\n`;
    this.output = `${header}${this.output}`;
  }
  generateSource() {
    this.output = '';
    const rows = [];

    rows.push('(function(window){ \'use strict\';\n');
    rows.push('var Client = {};\n');
    rows.push('window[\'Client\'] = Client;\n\n');
    rows.push('Client.types = {};\n');

    this.types.forEach((row) => {
      const [key, value] = row;
      rows.push(`Client.types.${key} = '${(Wayward.DEBUGGING ? value : '')}';\n`);
    });

    rows.push('\n');

    // files for client go here
    rows.push(`\n${Connection.toString()}`);

    rows.push('\n})(window);');
    this.output = rows.join('');

    return this;
  }
  minifySource() {
    // TODO: add in a minify library here..
    // if (!!Wayward.Client.MINIFY)
    return this;
  }
  save() {
    let update = true;
    const hash = Util.hash(this.output);
    let fsInstance;
    let oldHash = '';

    try {
      // check the first line of the currently saved file, extract the hash string
      const lines = fs.readFileSync(`${this.path}${this.file}`, { encoding: 'UTF8' }).split('\n');
      [oldHash] = lines;

      // trimming front comment '\*', linebreaks, white spaces..
      oldHash = oldHash.substr(2, oldHash.length - 2).replace(/(\r\n|\n|\r)/gm, '').trim();
    } catch (e) {
      // console.log(e.message);
    }

    if (hash === oldHash) { // if the hashes don't match then something has changed!
      update = false;
    }

    if (!update) {
      // skip if no changes so the file system timestamp doesn't get updated.
      // Should ensure the browser cache won't be bypassed needlessly (I think)
      Util.log('sys', 'Client:save', 'No changes detected.');
    } else {
      // go ahead and save a new cache for the client
      try {
        fsInstance = fs.openSync(`${this.path}${this.file}`, 'w');
        this.generateHeader(); // append version, date, etc
        const bout = Buffer.from(this.output, 'ascii');
        fs.writeSync(fsInstance, bout, 0, bout.length);
        fs.closeSync(fsInstance);
      } catch (e) {
        Util.error('sys', `Unable to save [${this.file}] to the file system! [${this.path}${this.file}]`);
        console.log(e.message);
        return this;
      }

      console.log('================CLIENT JS==================');
      console.log(this.output);
      console.log('===========================================');

      Util.log('sys', 'Client:save', `The file ${this.file} has been UPDATED. {path:${this.path}${this.file}}`);
    }
    return this;
  }
  clear() {
    this.output = '';
    return this;
  }
  static generateCache() {
    Client.instance = Client.instance || new Client();
    Client.instance.generateSource()
      .minifySource()
      .save()
      .clear();
  }
};
Client.instance = undefined;

module.exports = Client;
