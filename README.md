# npz

[![Greenkeeper badge](https://badges.greenkeeper.io/israelroldan/npz.svg)](https://greenkeeper.io/)
> 

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> Run your npm scripts with ease

`npm` provides a great way to run scripts in your package json by using `npm run {scriptName}`, but in some cases, these scripts are run without the `run` keyword (e.g. `test`).

`npz` allows you to run any script in `package.json` directly, (no `run` keyword).

Instead of:

    npm run myscript

You can:

    npz myscript

Behind the scenes, `npz` uses `npm run` which makes your scripts behave the same.

# Installation
You can install this package globally:

    npm i -g npz

or run it using `npx`:

    npx npz {script}

# License

MIT