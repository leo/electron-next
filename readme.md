# electron-next

[![Build Status](https://travis-ci.org/leo/electron-next.svg?branch=master)](https://travis-ci.org/leo/electron-next)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

This package allows you to use [Next.js](https://github.com/zeit/next.js) easily for building the renderer process inside [Electron](https://electron.atom.io) apps.

### Usage

Firstly, install the package using [npm](https://www.npmjs.com):

```bash
npm install --save electron-next
```

Then load it (and ensure that [electron](https://electron.atom.io) is accessible as well):

```js
const prepareRenderer = require('electron-next')
const electron = require('electron')
```

And finally use it to prepare your application before you create and `BrowserWindow`s:

```js
await prepareRenderer(electron, {
  dev: resolve('./renderer/out'),
  prod: resolve('./renderer')
})
```

## Caught a Bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Link the package to the global module directory: `npm link`
3. Within the module you want to test your local development instance of the package, just link it to the dependencies: `npm link electron-next`. Instead of the default one from npm, node will now use your clone of the package!

## Author

- Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo))
