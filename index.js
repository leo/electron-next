// Native
const { createServer } = require('http')
const path = require('path')

// Packages
const next = require('next')
const isDev = require('electron-is-dev')

const devServer = async (app, dir, port) => {
  const nextApp = next({
    dev: true,
    dir: dir || path.join(process.cwd(), 'renderer')
  })

  const nextHandler = nextApp.getRequestHandler()

  // Build the renderer code and watch the files
  await nextApp.prepare()

  // But if developing the application, create a
  // new native HTTP server (which supports hot code reloading)
  const server = createServer(nextHandler)

  server.listen(port || 8000, () => {
    // Make sure to stop the server when the app closes
    // Otherwise it keeps running on its own
    app.on('before-quit', () => server.close())
  })
}

const adjustRenderer = protocol => {
  const paths = ['_next', 'static']

  protocol.interceptFileProtocol('file', (request, callback) => {
    let filePath = request.url.substr('file'.length + 1)

    for (const replacement of paths) {
      const wrongPath = '///' + replacement
      const rightPath = '//' + resolvePath('./renderer') + '/' + replacement

      filePath = filePath.replace(wrongPath, rightPath)
    }

    callback({ path: filePath })
  })
}

module.exports = async (electron, dir, port) => {
  if (!isDev) {
    adjustRenderer(electron.protocol)
    return
  }

  await devServer(electron.app, dir, port)
}
