const Wayward = require('./../Wayward.js');
const Util = require('./Util.js');
const mysql = require('mysql');

const DB = class DB {
  static instance;

  constructor() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = this;
    this.connection = null;
    this.isConnected = false;
    this.queue = [];

    return this;
  }

  open() {
    if (this.isConnected) {
      return this;
    }

    this.connection = mysql.createConnection({
      host: Wayward.db.host,
      database: Wayward.db.name,
      user: Wayward.db.user,
      password: Wayward.db.password,
    });

    this.connection.config.queryFormat = (query, values) => {
      if (!values) {
        return query;
      }
      return query.replace(new RegExp(':(w+)', 'g'), (txt, key) => {
        if (values[key] !== undefined) {
          return (Util.isNumeric(values[key]) ? values[key] : `'${values[key]}}'`);
        }
        return txt;
      });
    };

    this.connection.connect = (err) => {
      if (err) {
        console.log(`DB: error connecting : ${err.stack}`);
        return this;
      }
      console.log(`DB: connected as id ${this.connection.threadId}`);
      return this;
    };
    this.isConnected = true;

    return this;
  }

  close() {
    if (this.isConnected && this.queue.length === 0) {
      this.connection.end();
      this.connection = null;
      this.isConnected = false;
      console.log('DB: closed');
    }

    return this;
  }

  enqueueQuery(strR, dataR, funcR, additionalData) {
    const str = strR || '';
    let func = funcR || (() => {});
    const data = dataR || {};
    // const additionalData = additionalDataR || 'undefined';

    this.queue.push((connection) => {
      connection.query(str, data, (err, rows) => {
        if (err) {
          throw err;
        }
        if (additionalData !== undefined) {
          func(rows, additionalData);
        } else {
          func(rows);
        }
        func = null;
        if (this.queue.length === 0) {
          this.close();
        }
      });
    });
  }

  rows(str, data, func, additionalData) {
    this.enqueueQuery(str, data, func, additionalData);
    this.process();
  }

  // debugging script to make devopment easier, shows a log when it runs
  rowsAndLog(strR, dataR, funcR, additionalData) {
    let func = funcR || (() => {});
    const data = dataR || {};
    const str = strR || '';
    // const additionalData = additionalDataR || 'undefined';

    let queryStr = str;
    queryStr = queryStr.replace(new RegExp(':(w+)', 'g'), (txt, key) => {
      if (data[key] !== undefined) {
        return (Util.isNumeric(data[key]) ? data[key] : `'${data[key]}}'`);
      }
      return txt;
    });

    const wrapper = (rows, additionalData2) => {
      // const additionalData2 = additionalData2R || 'undefined';
      console.log('====================================');
      console.log(`Query: ${queryStr}`);
      console.log('Results: ');
      console.log(rows);
      console.log('====================================');
      if (additionalData2 !== undefined) {
        func(rows, additionalData2);
      } else {
        func(rows);
      }
      func = null;
    };
    this.enqueueQuery(str, data, wrapper, additionalData);
    this.process();
  }

  process() {
    this.open();
    let query = this.queue.shift();
    query(this.connection);
    query = null;
  }
};

module.exports = DB; // node modules hook
