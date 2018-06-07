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
    }
    this._level = 3;
  }
  
  log( string, token, tokenColor ) {
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
    if(!token) return '';
    let l = this.boundary.left.length + 
            this.boundary.right.length + 
            this.config.padding.token;
    let subtoken = pad.right(this.boundary.left + token + this.boundary.right, l);
    return (this.separator.before + subtoken + this.separator.after);
  }
  
  _createEpilogue() {
    return '\n';
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
    if( this._level == 4)
      this.log(text, this._createTokenText('DEBUG'), this.config.colors.debug);
  }
  info( text ) {
    if( this._level >= 3)
    this.log(text, this._createTokenText('INFO'), this.config.colors.info);
  }
  success( text ) {
    if( this._level >= 3)
      this.log(text, this._createTokenText('SUCCESS'), this.config.colors.success);
  }
  warning( text ) {
    if( this._level >= 2)
      this.log(text, this._createTokenText('WARNING'), this.config.colors.warning);
  }
  error( text ) {
    if( this._level >= 1)
      this.log(text, this._createTokenText('ERROR'), this.config.colors.error);
  }
  critical( text ) {
    if( this._level >= 0)
    this.log(text, this._createTokenText('CRITICAL'), this.config.colors.critical);
  }
  
  red( text, token='' ) { this.log(text, token, 'f00') }
  pink( text, token='' ) { this.log(text, token, 'f29') }
  blue( text, token='' ) { this.log(text, token, '00f') }
  cyan( text, token='' ) { this.log(text, token, '0ff') }
  green( text, token='' ) { this.log(text, token, '0f0') }
  yellow( text, token='' ) { this.log(text, token, 'ff0') }
  orange( text, token='' ) { this.log(text, token, 'fa0') }
  purple( text, token='' ) { this.log(text, token, '92f') }
  
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
  
}

module.exports = Enki;