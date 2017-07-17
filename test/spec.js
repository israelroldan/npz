const expect = require('assertly').expect;
const File = require('phylo');
const sinon = require('sinon');
const stripAnsi = require('strip-ansi');
const tmp = require('tmp');
const npz = require('..');

describe('npz', () => {
  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
  });

  describe('help', () => {
    it('should how the help page if no argument was specified', () => {
      return new npz().run([]).then(()=> {
        expect(stripAnsi(console.log.firstCall.args[0])).to.equal([
          '',
          '  Usage: npz [options] [script]',
          '',
          '  Options:',
          '',
          '    -c, --cwd      Specify the working directory',
          '    -d, --debug    Enable debug mode',
          '    -h, --help     Output usage information',
          '    -v, --version  Output the version number',
          ''
        ].join('\n'));
      });
    });

    it('should show the help page if asked for it', () => {
    return new npz().run('-h').then(() =>{
      expect(stripAnsi(console.log.firstCall.args[0])).to.equal([
        '',
        '  Usage: npz [options] [script]',
        '',
        '  Options:',
        '',
        '    -c, --cwd      Specify the working directory',
        '    -d, --debug    Enable debug mode',
        '    -h, --help     Output usage information',
        '    -v, --version  Output the version number',
        ''
      ].join('\n'));
    });
  });
  });
  
  describe('debug mode', () => {
    it('should provide a switch to enable debug mode', () => {
      return new npz().run(['-d']).then(()=> {
        expect(stripAnsi(console.log.firstCall.args[0])).to.equal('Debug log enabled');
      });
    });
  });


  describe('reflection', () => {
    it('should show the version number if asked for it', () => {
      return new npz().run('-v').then(() =>{
        expect(stripAnsi(console.log.firstCall.args[0])).to.equal(require('../package.json').version);
      });
    });
  });

  describe('location', () => {
    it('should fail gracefuly if no package.json is found in the parent tree', () => {
      var tmpobj = tmp.dirSync();
      return new npz().run('-d', '-c', tmpobj.name, 'foo').then(()=> {
        throw new Error('should not reach here!');
      },(e) => {
        expect(e.message).to.equal('No package.json file found in this directory tree.');
      });
      tmpobj.removeCallback();
    });

    it('should look for a package.json in the parent tree', () => {
      return new npz().run('-d', '-c', File.from(__dirname).join('fixtures/foo/bar').path, 'foo').then(()=> {
        expect(stripAnsi(console.log.lastCall.args[0])).to.equal("Script 'foo' was found.");
      },(e) => {
        throw new Error('Should not reach this place!');
      });
    });

    it('should fail gracefully if the specified script is not found', () => {
      return new npz().run('-d', '-c', File.from(__dirname).join('fixtures/foo/bar').path, 'bar').catch((e)=> {
        expect(e.message).to.equal("Script 'bar' was not found.");
      });
    });
  });
});