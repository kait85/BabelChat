// let Wayward = require('./../Wayward.js');

class BufferArrayIterator {
  constructor(bufferArray) {
    this.buffer = bufferArray;
    this.start = this.buffer.position;
    this.position = 0;
    this.length = this.buffer.length;
  }
  reset() {
    this.start = this.buffer.position;
    this.position = 0;
  }
  next() {
    let data = null;
    const adjPosition = ((this.start + this.position + 1) % this.length);
    if (adjPosition !== this.start) {
      this.position += 1;
      data = this.buffer.array[adjPosition];
    }
    return data;
  }
  hasNext() {
    return (((this.start + this.position + 1) % this.length) !== this.start);
  }
}

class BufferArray {
  constructor(length, emptyValue) {
    this.array = [];
    this.position = 0;
    this.length = length;
    this.empty = null;

    let i;
    const n = this.length;
    for (i = 0; i < n; i += 1) {
      this.array.push(null);
    }
    this.clear(emptyValue);
  }
  clear(emptyValue) {
    if (typeof emptyValue !== 'undefined') {
      this.empty = emptyValue;
    }

    let i;
    const n = this.length;
    for (i = 0; i < n; i += 1) {
      this.array[i] = this.empty;
    }
  }
  getIterator() {
    return new BufferArrayIterator(this);
  }
  push(data) {
    this.array[this.position] = data;
    this.position += 1;
    this.position %= this.length;
  }

  /*
   * you should use the iterator for looping values, this is
   * just if you need a new array that is reordered properly
   */
  getArray() {
    let iterator = this.getIterator();
    const arr = [];
    let data;
    while (iterator.hasNext()) {
      data = iterator.next();
      if (data !== this.empty) { // only send messages within the last hour
        arr.push(data);
      } else {
        break;
      }
    }
    iterator = null;
    return arr;
  }
}

module.exports = BufferArray; // node modules hook
