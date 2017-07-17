#!/usr/bin/env node
var chalk = require('chalk');
var File = require('phylo');
var log = require('loog')({
  prefixStyle: 'none'
});
var switchit = require('switchit');

class npz extends switchit.Command {
  execute (params) {
    if (params.version) {
      return log.log(File.from(__dirname).join('package.json').load().version);
    }
    if (params.help) {
      return this.showHelp();
    }

    if (params.debug) {
      this.debug = true;
      log.setLogLevel('debug');
      log.debug('Debug log enabled');
    }

    if (params.cwd && params.cwd !=='undefined') {
      params.cwd = File.from(params.cwd);
    } else {
      params.cwd = File.cwd();
    }
    log.debug(`Using ${params.cwd.path} as cwd`);

    if (!params.script) {
      return this.showHelp();
    } else {
      var pkgJson = params.cwd.upTo('package.json');
      if (pkgJson) {
        log.debug(`Looking for scripts in: ${pkgJson.path}`);
        var pkg = pkgJson.load();      
        if (params.script in pkg.scripts) {
          log.debug(`Script '${params.script}' was found.`);
          require('child_process').execFileSync('npm',['run', params.script], {
            stdio: 'inherit',
            cwd: params.cwd.path
          });
        } else {
          throw new Error(`Script '${params.script}' was not found.`);
        }
      } else {
        throw new Error('No package.json file found in this directory tree.');
      }
    }
  }

  showHelp () {
      log.log(`
  Usage: ${chalk.yellow('npz')} ${chalk.dim('[options] [script]')}

  Options:

    ${chalk.yellow('-c')}, ${chalk.yellow('--cwd')}      ${chalk.dim('Specify the working directory')}
    ${chalk.yellow('-d')}, ${chalk.yellow('--debug')}    ${chalk.dim('Enable debug mode')}
    ${chalk.yellow('-h')}, ${chalk.yellow('--help')}     ${chalk.dim('Output usage information')}
    ${chalk.yellow('-v')}, ${chalk.yellow('--version')}  ${chalk.dim('Output the version number')}
`);  
  }  
}

npz.define({
  switches: '[cwd:string] [debug:boolean=false] [version:boolean=false] [help:boolean=false]',
  parameters: '[script:string]'
});

if (process.env.NODE_ENV === 'test') {
  module.exports = npz;
} else {
  var $npz = new npz();
  $npz.run().catch(e => {
    if (e) {
      log.error(e.message ? e.message : e);
      if ($npz.debug && e.stack) {
        log.debug(e.stack);
      }
    }
  });
}