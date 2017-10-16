const md5 = require('md5');

const Util = {};

Util.toStr = (o) => {
  let str = '';
  let count = 0;
  if (o instanceof Array) {
    str = `${str}[`;
    const n = o.length;
    for (let p = 0; p < n; p += 1) {
      if (typeof o[p] === 'string') {
        if (count > 0) {
          str = `${str}, `;
        }
        str = `${str}${p}:${o[p]}`;
        count += 1;
      } else if (typeof o[p] === 'number') {
        if (count > 0) {
          str = `${str}, `;
        }
        str = `${str}${p}:${o[p]}`;
        count += 1;
      } else if (typeof o[p] === 'function') {
        // skip
      } else {
        if (count > 0) {
          str = `${str}, `;
        }
        str = `${str}${p}:{${Util.toStr(o[p])}}`;
        count += 1;
      }
    }
    str = `${str}]`;
  } else if (typeof o === 'object') {
    Object.entries(o).forEach((row) => {
      const [p, oo] = row;
      if (typeof oo === 'string') {
        if (count > 0) {
          str = `${str}, `;
        }
        str = `${str}${p}:${oo}`;
        count += 1;
      } else if (typeof oo === 'number') {
        if (count > 0) {
          str = `${str}, `;
        }
        str = `${str}${p}:${oo}`;
        count += 1;
      } else if (typeof oo === 'function') {
        // skip
      } else {
        if (count > 0) {
          str = `${str}, `;
        }
        str = `${str}${p}:{${Util.toStr(oo)}}`;
        count += 1;
      }
    });
  } else {
    str = `${str}${o}`;
  }
  return str;
};
Util.log = (dir, event, dataR) => {
  const data = dataR || {};
  if (dir !== '') {
    console.log(`[${dir}] (${event}) ${Util.toStr(data)}`);
  } else {
    console.log(`(${event}) ${Util.toStr(data)}`);
  }
};
Util.error = (event, dataR) => {
  const data = dataR || {};
  console.log(`ERROR: (${event}) ${Util.toStr(data)}`);
};
// + Jonas Raoni Soares Silva
// @ http://jsfromhell.com/array/shuffle [v1.0]
Util.shuffle = (oR) => {
  const o = oR;
  let j;
  let x;
  let i;
  for (i = o.length; i; j = Math.floor(Math.random() * i), x = o[(i -= 1)], o[i] = o[j], o[j] = x) {
    // empty on purpose
  }
  return o;
};

Util.generateName = () => {
  const fruits = ['Apple', 'Apricot', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gojiberry', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Huckleberry', 'Honeydew', 'Jackfruit', 'Jambul', 'Jujube', 'Kiwi', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Lychee', 'Mango', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Rockmelon', 'Miraclefruit', 'Mulberry', 'Nectarine', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Prune', 'Pineapple', 'Pomegranate', 'Pomelo', 'Mangosteen', 'Quince', 'Raspberry', 'Rambutan', 'Redcurrant', 'Salalberry', 'Salmonberry', 'Satsuma', 'Starfruit', 'Strawberry', 'Tamarillo', 'Uglifruit'];
  const animals = ['Alpaca', 'Antelope', 'Bandicoot', 'Bat', 'Bear', 'Bee', 'Bison', 'Bobcat', 'Lemur', 'Pelican', 'Capybara', 'Caribou', 'Catfish', 'Cheetah', 'Chimpanzee', 'Seal', 'Cougar', 'Cow', 'Crow', 'Dingo', 'Camel', 'Emu', 'Gazelle', 'Armadillo', 'Goat', 'Gorilla', 'Groundhog', 'Parrot', 'Hippopotamus', 'Jackal', 'Jaguar', 'Chipmunk', 'Lemur', 'Leopard', 'Mallard', 'Manatee', 'Shrew', 'Iguana', 'Goat', 'Seal', 'Ocelot', 'Ostrich', 'Otter', 'Ox', 'Peacock', 'Penguin', 'Pheasant', 'Platypus', 'Porcupine', 'Python', 'Rabbit', 'Dog', 'Raccoon', 'Crab', 'Meerkat', 'Hawk', 'Reindeer', 'Monkey', 'Lemur', 'Possum', 'Parakeet', 'Flamingo', 'Cockatoo', 'Antelope', 'Salmon', 'Elephant', 'Serval', 'Shark', 'Sheep', 'Mongoose', 'Lion', 'Goose', 'Fox', 'Dolphin', 'Hyena', 'Eagle', 'Cat', 'Gecko', 'Tortoise', 'Swan', 'Turkey', 'Turtle', 'Sloth', 'Squirrel', 'Monkey', 'Griffon', 'Wallaby', 'Elk', 'Warthog', 'Dragon', 'Kangaroo', 'Skunk', 'Whale', 'Eagle', 'Owl', 'Rat', 'Duck', 'Raven', 'Vulture', 'Deer', 'Jackrabbit', 'Robin', 'Toucan', 'Tern', 'Dove', 'Boar', 'Turkey', 'Buffalo', 'Spider', 'Wolf', 'Wombat', 'Pigeon', 'Woodchuck', 'Woodpecker', 'Yak', 'Baboon', 'Mongoose', 'Marmot', 'Stork', 'Zebra', 'Beetle', 'Lizard', 'Ant', 'Butterfly', 'Horse', 'Hamster', 'Ferret'];

  const f = Math.floor((Math.random() * fruits.length) + 0);
  const a = Math.floor((Math.random() * animals.length) + 0);

  return `${fruits[f]}${animals[a]}`;
};

Util.generateKey = () => {
  let key = Math.floor(Math.random() * 10000000000);
  key += (new Date()).getTime();
  return this.hash(key);
};

Util.hash = (str) => {
  const hash = md5(str);
  return hash;
};

Util.getTime = () => {
  // generate a unix timestamp
  const milliseconds = Math.floor((new Date()).getTime() / 1000);
  return milliseconds;
};


// Util.generateObjectString, used for compiling the client js file
// @param {function} obj - ref to the class definition
// @param {string} objClass - name to use or the class
// @param {type} objInterfaces - class methods that need to not be mangled by the minification
// scripts, will be affirmed by setting using array syntax
// @returns {string}

Util.generateObjectString = (objR, objClass, objInterfacesR) => {
  const objInterfaces = objInterfacesR || {};
  const obj = objR;

  obj.output = '';
  obj.output = `${obj.output}${objClass} = ${obj};\n`;

  let index;
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((prop) => {
    index = objInterfaces.indexOf(prop);
    if (index !== -1) {
      objInterfaces.splice(index, 1);
      obj.output += `${objClass}.prototype.${prop} = ${obj[prop]};\n`;
      obj.output += `${objClass}.prototype["${prop}"] = ${objClass}.prototype.${obj[prop]};\n`;
    } else {
      //obj.output += `${objClass}.prototype.${prop} = ${obj[prop]};\n`;
    }
  });

  if (objInterfaces.length > 0) {
    Util.error(`Util.generateObjectString : (${objClass}) Public interface(s) were not defined as methods!`, objInterfaces);
  }

  obj.toString = () => {
    const o = obj.output;
    return o;
  };
};

Util.randInt = (n) => {
  const i = Math.floor((Math.random() * n));
  return i;
};

Util.isNumeric = (n) => {
  const b = !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
  return b;
};

Util.getAge = (time, time2R) => {
  const time2 = time2R || Math.floor(Date.now() / 1000);

  const days = Math.floor(Math.abs(time - time2) / 60 / 60 / 24);
  const months = Math.floor(days / (365 / 12));
  const years = Math.floor(days / 365);
  const hours = Math.floor(Math.abs(time - time2) / 60 / 60);
  const minutes = Math.floor(Math.abs(time - time2) / 60);
  const seconds = Math.floor(Math.abs(time - time2));

  let age = '';

  if (years > 0) {
    age = `${years}y`;
  } else if (months > 0) {
    age = `${months}m`;
  } else if (days > 0) {
    age = `${days}d`;
  } else if (hours > 0) {
    age = `${hours}h`;
  } else if (minutes > 0) {
    age = `${minutes}m`;
  } else {
    age = `${seconds}s`;
  }

  return age;
};

Util.padLeft = (str, base, chr) => {
  const len = (String(base || 10).length - String(str).length) + 1;
  return len > 0 ? new Array(len).join(chr || '0') + str : str;
};

module.exports = Util; //  node modules hook
