### Enki

Enki is a customizable logger for Node.js. Capable of writing to process.stdout,
process.stderr, as well as a file descriptor. Provides timestamps, ascii
terminal color codes, log levels (debug, info, success, warning, error), and
customizable output formats.

### Installation

npm:
```bash
$ npm i --save @mdemeter/enki
```

yarn:
```bash
$ yarn add @mdemeter/enki
```

### Usage

#### Importing (Choose one)

Base definition:
```javascript
const { Enki } = require('@mdemeter/enki');
```

Pre-configured for process.stdout:
```javascript
const enki = require('@mdemeter/enki').stdout;
```

#### Targets (If not pre-configured target)

Configure for process.stdout:
```javascript
const enki = new Enki([process.stdout]);
```

Configure for process.stderr:
```javascript
const enki = new Enki([process.stderr]);
```

Configure for file:
```javascript
const fd = require('fs').openSync(
           require('path').join(__dirname,'test.log'),'w+');
const enki = new Enki([fd]);
```

Configure for multiple concurrent targets (process.stdout & fd in this example):
```javascript
const fd = require('fs').openSync(
           require('path').join(__dirname,'test.log'),'w+');
const enki = new Enki([process.stdout, fd]);
```

#### Logging

Log level bindings:
```javascript
// Logs messages at a certain log level. If log level is set, it will log all
// messages at that level and under.
//
// default log level: 3
//
// log level enums: 4 - debug
//                  3 - info       default
//                  3 - success       |
//                  2 - warning       |
//                  1 - error         |
//                  0 - critical      v
//
// <message> required
//
// By default the logger doesn't display debug messages
// To enable debug messages:
// enki.level('debug');

enki.debug(<message>);     // token: debug,    color: gray
enki.info(<message>);      // token: info,     color: blue
enki.success(<message>);   // token: success,  color: green
enki.warning(<message>);   // token: warning,  color: yellow
enki.error(<message>);     // token: error,    color: red
enki.critical(<message>);  // token: critical, color: dark red

// Console output:
//
// hh:mm:ss <level> <message>
```

Color bindings:
```javascript
// Bindings for colors. Uses ansi256 terminal escape codes.
// <message> required
// <token>   required
// <level>   optional, default: 3 (info)

enki.red(<message>,<token>,<level>);
enki.pink(<message>,<token>,<level>);
enki.blue(<message>,<token>,<level>);
enki.cyan(<message>,<token>,<level>);
enki.gray(<message>,<token>,<level>);
enki.green(<message>,<token>,<level>);
enki.yellow(<message>,<token>,<level>);
enki.orange(<message>,<token>,<level>);
enki.purple(<message>,<token>,<level>);

// Console output:
//
// hh:mm:ss <token(color)>  <message>
```

Log:

```javascript
// Creates a log message with the highest granularity.
//
// message: string
// token: stringoption
// color: string, format: '#xxx'|'xxx'|'xxx, xxx, xxx'|'xxx xxx xxx' (hex, rgb)
// level: string, values: 'debug'|'info'|'success'|'warning'|'error'|'critical'
// level: integer, values:      4|     3|        3|        2|      1|         0
//
//                                default------------------------------------->
//
// <message> required
// <token>   required
// <color>   required
// <level>   optional, default: 3 ('info')

enki.log(<message>,<token>,<color>,<level>);

// Console output:
//
// hh:mm:ss <token>  <message>
```

#### Customize

Default output format:
```javascript
// hh:mm:ss <level/token> <message>
```

Feature (prologue) options:
```javascript
// Displays either a timestamp, a date, or both at the start of the output
// string.
//
// default values: ['timestamp']
//
// feature: string|array, values: 'date','timestamp'
//
// Various console outputs:
//
// hh:mm:ss <level/token> <message>            // default, timestamp enabled
// DD:MM:YYYY hh:mm:ss <level/token> <message> // timestamp, date enabled
// DD:MM:YYYY <level/token> <message>          // date enabled
// <level/token> <message>                     // none enabled

// Add new feature:
enki.addEnabled(<feature>);

// Check if feature is active:
enki.isEnabled(<feature>); // boolean: true|false

// Specify all active feature(s):
enki.enabled([<feature(s)>]);

// Remove active feature:
enki.removeEnabled(<feature>);

// Remove all active features:
enki.removeEnabled('all');
```

Color options:
```javascript
// Sets the color for a field or log level. Prologue refers to the timestamp or
// date fields, and text refers to the message field.
//
// default values: prologue = '999'
//                 debug    = '999'
//                 info     = '59f'
//                 success  = '2f6'
//                 warning  = 'df2'
//                 error    = 'f55'
//                 critical = 'f23'
//                 text     = 'fff'
//
// item: string, values: 'prologue'|
//                       'debug'|'info'|'success'|'warning'|'error'|'critical'|
//                       'text'
// color: string, values: '#xxx'|'xxx'|'xxx, xxx, xxx'|'xxx xxx xxx' (hex, rgb)

enki.color(<item>, <color>);
```

Padding options:
```javascript
// Pads the token field so that message fields are aligned and tokens aren't
// overflowing.
//
// default value: 8
//
// item: string, values: 'token'
// number: integer

enki.padding(<item>, <number>);
```

Target options:
```javascript
// Alters logger targets.
//
// default: Enki   = undefined
//          stdout = process.stdout       (WritableStream)
//          fd     = __dirname/enki.log   (FileDescriptor)
//
// values: WritableStream|FileDescriptor

// Add an additional target
enki.add(<target>);

// Specify all active target(s)
enki.targets([<target(s)>]);
```

Log level options:
```javascript
// Specifies which log levels are output to target. Relies on enums, outputs 
// everything at and below the specified level.
//
// default value: 3
//
// level: string, values: 'debug'|'info'|'success'|'warning'|'error'|'critical'
// level: integer, values:      4|     3|        3|        2|      1|         0
//
//                                default------------------------------------->

enki.level(<level>);
```

### Examples

Log to console:
```javascript
const enki = require('@mdemeter/enki').stdout;
enki.info('This is a message');
enki.success('Successfully printed message');

// Console output:
//
// hh:mm:ss info     This is a message
// hh:mm:ss success  Successfully printed message
```

Log to file:
```javascript
const { Enki } = require('@mdemeter/enki');
const fd = require('fs').openSync(
           require('path').join(__dirname,'log'), 'w+');
const enki = new Enki([fd]);
enki.info(`This message logged to file: ${__dirname}/log`);

// Output in file:
//
// hh:mm:ss info     This message logged to file: /path/to/log
```

Change output target:
```javascript
const { Enki } = require('@mdemeter/enki');
const fd = require('fs').openSync(
           require('path').join(__dirname,'log'), 'w+');
const enki = new Enki([fd]);

// Change from writing to file to writing to console
enki.targets([process.stdout]);
enki.info('This message is now output to console');

// Console output:
//
// hh:mm:ss info     This message is now output to console
```

Log to multiple targets:
```javascript
const { Enki } = require('@mdemeter/enki');
const target_1 = require('fs').openSync(
                 require('path').join(__dirname,'log'), 'w+');
const target_2 = process.stdout;
const enki = new Enki([target_1, target_2]);
enki.info('This message will output to both console and file');

// Console output:
//
// hh:mm:ss info     This message will output to both console and file
```

Display debug messages during development:
```javascript
const enki = require('@mdemeter/enki').stdout;
if(process.env['dev'])
  enki.level('debug');
enki.debug('This is a debug message');
```

Change the token padding:
```javascript
const enki = require('@mdemeter/enki').stdout;
enki.log('A message','short_token','fff','info');
enki.log('Another message','loooooong_token','fff','info');
enki.padding(16);
enki.log('A message','short_token','fff','info');
enki.log('Another message','loooooong_token','fff','info');

// Console output:
//
// hh:mm:ss short_token A message            // token longer than default 8
// hh:mm:ss looooooong_token Another message  // token longer than default 8
// hh:mm:ss short_token      A message        // token padding set to 16 - enough
// hh:mm:ss looooooong_token Another message  // token padding set to 16 - enough
```

Display date:
```javascript
const enki = require('@mdemeter/enki').stdout;
enki.enabled(['date','timestamp']);
enki.info('This is a message');

// Console output:
//
// DD:MM:YYYY hh:mm:ss info     This is a message
```

Display only date:
```javascript
const enki = require('@mdemeter/enki').stdout;
enki.enabled(['date']);
enki.info('This is a message');

// Console output:
//
// DD:MM:YYYY info     This is a message
```

Change the color of message to red:
```javascript
const enki = require('@mdemeter/enki').stdout;
enki.color('text','f00');
enki.info('This message is now red in console');

// Console output:
//
// hh:mm:ss info     This message is now red in console
```