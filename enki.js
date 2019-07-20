const { writeSync } = require('fs');
const color = require('colors-md').ansi256.color_h;
const pad = require('pad-md');

class Enki {

  constructor( args ) {
    this.targets = new Array();
    if(args && args.length)
      this.targets = args.map(arg => ({
        type: typeof arg == 'number' ? 'fd' : 'stream',
        target: arg
      }));
    this.separator = { before: '', after: ' ' };
    this.boundary = { left: '', right: '' };
    this._enabled = [ 'timestamp' ];
    this.config = {
      colors: {
        text: 'fff',
        prologue: '999',
        debug: '999',
        info: '59f',
        success: '2f6',
        warning: 'df2',
        error: 'f55',
        critical: 'f23',
      },
      padding: {
        token: 8
      }
    }
    this.enums = {
      critical: 0,
      error: 1,
      warning: 2,
      info: 3,
      success: 3,
      debug: 4,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4
    }
    this._level = 3;
  }
  log( string, token, tokenColor, lvl=3 ) {
    this.l(string, token, tokenColor, lvl);
    if(this.isEnabled('replace')); {
      this.removeEnabled('replace');
    }
  }
  l( string, token, tokenColor, lvl=3 ) {
    if( this._level < lvl ) return;
    this.targets.forEach(_ => {
      if(_.type == 'stream') {
        if(!_.target._type=='tty')
          _.target.write(this._createWritableString({
            noColor: true,
            colors: { ...this.config.colors, token: tokenColor },
            token,
            text: string
          }));
        else
          _.target.write(this._createWritableString({
            noColor: false,
            colors: { ...this.config.colors, token: tokenColor },
            token,
            text: string
          }));
      } else if(_.type == 'fd') {
        writeSync(_.target, this._createWritableString({
          noColor: true,
          colors: { ...this.config.colors, token: tokenColor },
          token,
          text: string
        }));
      }
    });
  }

  _createPrologue() {
    let prologue = new String();
    if(this._enabled.includes('date') && this._enabled.includes('timestamp'))
      prologue += (this._date() + ' ' + this._timestamp());
    else if(this._enabled.includes('date'))
      prologue += this._date();
    else if(this._enabled.includes('timestamp'))
      prologue += this._timestamp();
    if(prologue.length) prologue += ' ';
    return prologue;
  }

  _createToken( token ) {
    if(token === undefined || token === null) return '';
    let l = this.boundary.left.length +
            this.boundary.right.length +
            this.config.padding.token;
    let subtoken = pad.right(this.boundary.left + token + this.boundary.right, l);
    return (this.separator.before + subtoken + this.separator.after);
  }

  _createEpilogue() {
    if(!this.isEnabled('replace'))
      return '\n';
    return '';
  }

  _createWritableString( config ) {
    let clr = color;
    if( config.noColor ) clr = text => text;
    let string = new String();
    string += clr(this._createPrologue(), config.colors.prologue );
    string += clr(this._createToken( config.token ), config.colors.token );
    string += clr(config.text, config.colors.text );
    string += this._createEpilogue();
    return string;
  }

  _createTokenText( text ) {
    return text.toLowerCase();
  }

  debug( text ) {
    this.log(text,
             this._createTokenText('DEBUG'),
             this.config.colors.debug,
             this.enums.debug);
    return this;
  }
  info( text ) {
    this.log(text,
             this._createTokenText('INFO'),
             this.config.colors.info,
             this.enums.info);
    return this;
  }
  success( text ) {
    this.log(text,
             this._createTokenText('SUCCESS'),
             this.config.colors.success,
             this.enums.success);
    return this;
  }
  warning( text ) {
    this.log(text,
             this._createTokenText('WARNING'),
             this.config.colors.warning,
             this.enums.warning);
    return this;
  }
  error( text ) {
    this.log(text,
             this._createTokenText('ERROR'),
             this.config.colors.error,
             this.enums.error);
    return this;
  }
  critical( text ) {
    this.log(text,
             this._createTokenText('CRITICAL'),
             this.config.colors.critical,
             this.enums.critical);
    return this;
  }

  red() {
    this.log(arguments[0],arguments[1],'f00',this.enums[arguments[2]]);
    return this;
  }
  pink() {
    this.log(arguments[0],arguments[1],'f29',this.enums[arguments[2]]);
    return this;
  }
  blue() {
    this.log(arguments[0],arguments[1],'00f',this.enums[arguments[2]]);
    return this;
  }
  cyan() {
    this.log(arguments[0],arguments[1],'0ff',this.enums[arguments[2]]);
    return this;
  }
  gray() {
    this.log(arguments[0],arguments[1],'999',this.enums[arguments[2]]);
    return this;
  }
  grey() {
    this.log(arguments[0],arguments[1],'999',this.enums[arguments[2]]);
    return this;
  }
  green() {
    this.log(arguments[0],arguments[1],'0f0',this.enums[arguments[2]]);
    return this;
  }
  yellow() {
    this.log(arguments[0],arguments[1],'ff0',this.enums[arguments[2]]);
    return this;
  }
  orange() {
    this.log(arguments[0],arguments[1],'fa0',this.enums[arguments[2]]);
    return this;
  }
  purple() {
    this.log(arguments[0],arguments[1],'92f',this.enums[arguments[2]]);
    return this;
  }

  _date() {
    let d = new Date().getDate();
    let m = new Date().getMonth() + 1;
    let y = new Date().getFullYear();
    return (`${pad.left(m,2,'0')}-${pad.left(d,2,'0')}-${y}`);
  }

  _timestamp() {
    return new Date().toString().replace(/ GMT.+/,'').split(' ').slice(4)[0];
  }

  enabled( enabled ) {
    this._enabled = enabled || new Array();
  }
  isEnabled( property ) {
    return this._enabled.includes(property);
  }
  addEnabled( enabled ) {
    this._enabled.push( enabled );
  }
  removeEnabled( enabled ) {
    if( enabled === 'all' ) return (this._enabled = []);
    for(let i = 0; i < this._enabled.length; i++) {
      if(this._enabled[i] === enabled) {
        this._enabled.splice(i,1);
        break;
      }
    }
  }

  color( item, color ) {
    if(item === 'prologue') this.config.colors.prologue = color;
    if(item === 'debug') this.config.colors.debug = color;
    if(item === 'info') this.config.colors.info = color;
    if(item === 'success') this.config.colors.success = color;
    if(item === 'warning') this.config.colors.warning = color;
    if(item === 'error') this.config.colors.error = color;
    if(item === 'critical') this.config.colors.critical = color;
    if(item === 'text') this.config.colors.text = color;
  }

  padding( item, number ) {
    if(item === 'token') this.config.padding.token = number;
  }

  add( target ) {
    this.targets.push(target);
  }

  targets( targets ) {
    this.targets = targets || new Array();
  }

  level( lvl ) {
    this._level = this.enums[lvl] || 3;
  }

  replace() {
    this.addEnabled('replace');
    this.l('\x1b[?25l\x1b[2K\x1b[G','','fff',0);
    return this;
  }

  end() {
    let enabled = this._enabled;
    this.removeEnabled('all');
    this.log('\x1b[?25h','','fff',0);
    this.enabled(enabled);
  }

}

const stdout = new Enki([process.stdout]);
const fd = new Enki(
  [require('fs').openSync(require('path').join(__dirname,'enki.log'),'w+')]
);

module.exports = { Enki, stdout, fd };
