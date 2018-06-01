const { writeSync } = require('fs');
const color = require('colors-md').ansi256.color_h;
const pad = require('pad-md');

class Enki {
  
  constructor( args ) {
    if(args && args.length)
      this.targets = args.map(arg => ({
        type: typeof arg == 'number' ? 'fd' : 'stream',
        target: arg
      }));
    this.separator = { before: '', after: ' ' };
    this.boundary = { left: '', right: '' };
    this._enabled = [ 'date','timestamp' ];
    this.config = {
      colors: {
        text: '#fff',
        prologue: '#999'
      }
    }
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
    let l = this.boundary.left.length + this.boundary.right.length + 8;
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
    this.log(text, this._createTokenText('DEBUG'), '#999');
  }
  info( text ) {
    this.log(text, this._createTokenText('INFO'), '#59f');
  }
  success( text ) {
    this.log(text, this._createTokenText('SUCCESS'), '#2f6');
  }
  warning( text ) {
    this.log(text, this._createTokenText('WARNING'), '#df2');
  }
  error( text ) {
    this.log(text, this._createTokenText('ERROR'), '#f55');
  }
  critical( text ) {
    this.log(text, this._createTokenText('CRITICAL'), '#f23');
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
  
}

module.exports = Enki;