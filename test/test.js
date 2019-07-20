const { join } = require('path');
const { Enki } = require('../enki.js');

let enki = require('../enki.js').stdout;

enki.red('world','hello','debug');
enki.pink('world','hello','info');
enki.blue('world','hello','success');
enki.cyan('world','hello','warning');
enki.gray('world','hello','error');
enki.green('world','hello','critical');
enki.yellow('world','hello',4);
enki.orange('world','hello',3);
enki.purple('world','hello',2);

for(let i = 0; i < 100000; i++) {
  enki.replace().info('test ' + i);
}
enki.replace().info('yes').end();
enki.replace().info('no').end();
