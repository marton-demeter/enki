const { join } = require('path');
const Enki = require('../enki.js');

let fd = require('fs').openSync(join(__dirname,'test.txt'),'a+');

let enki = new Enki([process.stdout,fd]);

setInterval(_ => {
  enki.log('Hello World!');
  enki.debug('Hello World!');
  enki.info('Hello World!');
  enki.success('Hello World!');
  enki.warning('Hello World!');
  enki.error('Hello World!');
  enki.critical('Hello World!');
}, 500);