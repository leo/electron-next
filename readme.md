# electron-next

This package allows you to use [Next.js](https://github.com/zeit/next.js) easily for building the renderer process inside [Electron](https://electron.atom.io) apps.

### Usage

Simply install the package:

```bash
npm install --save electron-next
```

Then load it:

```js
const isDev = require('electron-is-dev')
const { devServer, adjustRenderer } = require('electron-next')
```

And finally use it to prepare your application before you create and `BrowserWindow`s:

```js
if (isDev) {
  await devServer(app)
} else {
  adjustRenderer(protocol)
}
```
