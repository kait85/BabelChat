const md5 = require('md5');

const Util = {};

Util.toStr = (o) => {
  let str = '';
  let count = 0;
  if (o instanceof Array) {
    str += '[';

    for (let p in o) {
      if (typeof o[p] === 'string') {
        if (count > 0)
          str += ', ';
        str += p + ':' + o[p];
        count++;
      } else if (typeof o[p] === 'number') {
        if (count > 0)
          str += ', ';
        str += p + ':' + o[p];
        count++;
      } else if (typeof o[p] === 'function') {

      } else {
        if (count > 0)
          str += ', ';
        str += p + ':{' + this.toStr(o[p]) + '}';
        count++;
      }
    }

    str += ']';
  } else if (typeof o === 'object') {
    for (let p in o) {
      if (typeof o[p] === 'string') {
        if (count > 0)
          str += ', ';
        str += p + ':' + o[p];
        count++;
      } else if (typeof o[p] === 'number') {
        if (count > 0)
          str += ', ';
        str += p + ':' + o[p];
        count++;
      } else if (typeof o[p] === 'function') {

      } else {
        if (count > 0)
          str += ', ';
        str += p + ':{' + this.toStr(o[p]) + '}';
        count++;
      }
    }
  } else {
    str += o;
  }
  return str;
};
Util.log = function (dir, event, data) {
  data = data || {};
  if (dir !== '')
    console.log('[' + dir + '] (' + event + ') ' + this.toStr(data));
  else
    console.log('(' + event + ') ' + this.toStr(data));
};
Util.error = function (event, data) {
  data = data || {};
  console.log('ERROR: (' + event + ') ' + this.toStr(data));
};
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Util.shuffle = function (o) { //v1.0
  for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
    ;
  return o;
};

Util.generateName = function () {
  let fruits = ['Apple', 'Apricot', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gojiberry', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Huckleberry', 'Honeydew', 'Jackfruit', 'Jambul', 'Jujube', 'Kiwi', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Lychee', 'Mango', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Rockmelon', 'Miraclefruit', 'Mulberry', 'Nectarine', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Prune', 'Pineapple', 'Pomegranate', 'Pomelo', 'Mangosteen', 'Quince', 'Raspberry', 'Rambutan', 'Redcurrant', 'Salalberry', 'Salmonberry', 'Satsuma', 'Starfruit', 'Strawberry', 'Tamarillo', 'Uglifruit'];
  let animals = ['Alpaca', 'Antelope', 'Bandicoot', 'Bat', 'Bear', 'Bee', 'Bison', 'Bobcat', 'Lemur', 'Pelican', 'Capybara', 'Caribou', 'Catfish', 'Cheetah', 'Chimpanzee', 'Seal', 'Cougar', 'Cow', 'Crow', 'Dingo', 'Camel', 'Emu', 'Gazelle', 'Armadillo', 'Goat', 'Gorilla', 'Groundhog', 'Parrot', 'Hippopotamus', 'Jackal', 'Jaguar', 'Chipmunk', 'Lemur', 'Leopard', 'Mallard', 'Manatee', 'Shrew', 'Iguana', 'Goat', 'Seal', 'Ocelot', 'Ostrich', 'Otter', 'Ox', 'Peacock', 'Penguin', 'Pheasant', 'Platypus', 'Porcupine', 'Python', 'Rabbit', 'Dog', 'Raccoon', 'Crab', 'Meerkat', 'Hawk', 'Reindeer', 'Monkey', 'Lemur', 'Possum', 'Parakeet', 'Flamingo', 'Cockatoo', 'Antelope', 'Salmon', 'Elephant', 'Serval', 'Shark', 'Sheep', 'Mongoose', 'Lion', 'Goose', 'Fox', 'Dolphin', 'Hyena', 'Eagle', 'Cat', 'Gecko', 'Tortoise', 'Swan', 'Turkey', 'Turtle', 'Sloth', 'Squirrel', 'Monkey', 'Griffon', 'Wallaby', 'Elk', 'Warthog', 'Dragon', 'Kangaroo', 'Skunk', 'Whale', 'Eagle', 'Owl', 'Rat', 'Duck', 'Raven', 'Vulture', 'Deer', 'Jackrabbit', 'Robin', 'Toucan', 'Tern', 'Dove', 'Boar', 'Turkey', 'Buffalo', 'Spider', 'Wolf', 'Wombat', 'Pigeon', 'Woodchuck', 'Woodpecker', 'Yak', 'Baboon', 'Mongoose', 'Marmot', 'Stork', 'Zebra', 'Beetle', 'Lizard', 'Ant', 'Butterfly', 'Horse', 'Hamster', 'Ferret'];

  let f = Math.floor((Math.random() * fruits.length) + 0);
  let a = Math.floor((Math.random() * animals.length) + 0);

  return fruits[f] + '' + animals[a];
};

Util.generateKey = function () {
  let key = Math.floor((Math.random() * 10000000000));
  key += (new Date).getTime();
  return this.hash(key);
};

Util.hash = function (str) {
  return md5(str);
};

Util.getTime = function () {
  //generate a unix timestamp
  let milliseconds = Math.floor((new Date).getTime() / 1000);
  return milliseconds;
};


// Util.generateObjectString, used for compiling the client js file
// @param {function} obj - ref to the class definition
// @param {string} objClass - name to use or the class
// @param {type} objInterfaces - class methods that need to not be mangled by the minification scripts, will be affirmed by setting using array syntax
// @returns {string}

Util.generateObjectString = function (obj, objClass, objInterfaces) {
  objInterfaces = objInterfaces || {};

  obj.output = '';
  obj.output += objClass + ' = ' + obj + ';\n';

  let prop, index;
  for (prop in obj.prototype) {
    if ((index = objInterfaces.indexOf(prop)) !== -1) {
      objInterfaces.splice(index, 1);
      obj.output += objClass + '.prototype.' + prop + ' = ' + obj.prototype[prop] + ';\n';
      obj.output += objClass + '.prototype["' + prop + '"] = ' + objClass + '.prototype.' + prop + ';\n';
    } else {
      obj.output += objClass + '.prototype.' + prop + ' = ' + obj.prototype[prop] + ';\n';
    }
  }

  if (objInterfaces.length > 0) {
    Util.error('Util.generateObjectString : (' + objClass + ') Public interface(s) were not defined as methods!', objInterfaces);
  }

  obj.toString = function () {
    return obj.output;
  }
};

Util.randInt = function (n) {
  return Math.floor((Math.random() * n));
};

Util.isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

Util.getAge = function (time, time2) {
  time2 = time2 || Math.floor(Date.now() / 1000);

  let days = Math.floor(Math.abs(time - time2) / 60 / 60 / 24);
  let months = Math.floor(days / (365 / 12));
  let years = Math.floor(days / 365);
  let hours = Math.floor(Math.abs(time - time2) / 60 / 60);
  let minutes = Math.floor(Math.abs(time - time2) / 60);
  let seconds = Math.floor(Math.abs(time - time2));

  let age = '';

  if (years > 0)
    age = years + 'y';
  else if (months > 0)
    age = months + 'm';
  else if (days > 0)
    age = days + 'd';
  else if (hours > 0)
    age = hours + 'h';
  else if (minutes > 0)
    age = minutes + 'm';
  else
    age = seconds + 's';

  return age;
};

Util.padLeft = (str, base,chr) => {
    let len = (String(base || 10).length - String(str).length)+1;
    return len > 0? new Array(len).join(chr || '0')+str : str;
};

module.exports = Util; //  node modules hook
