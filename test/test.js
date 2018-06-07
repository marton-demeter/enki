const { join } = require('path');
const Enki = require('../enki.js');

let fd = require('fs').openSync(join(__dirname,'test.txt'),'a+');

let enki = new Enki([process.stdout,fd]);

enki.red('world','hello','debug');
enki.pink('world','hello','info');
enki.blue('world','hello','success');
enki.cyan('world','hello','warning');
enki.gray('world','hello','error');
enki.green('world','hello','critical');
enki.yellow('world','hello',4);
enki.orange('world','hello',3);
enki.purple('world','hello',2);

setInterval(_ => {
  enki.log('Hello World!');
  enki.debug('Hello World!');
  enki.info('Hello World!');
  enki.success('Hello World!');
  enki.warning('Hello World!');
  enki.error('Hello World!');
  enki.critical('Hello World!');
}, 500);