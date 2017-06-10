// Native
const { createServer } = require('http')
const path = require('path')

// Packages
const next = require('next')
const isDev = require('electron-is-dev')

const devServer = async (app, dir, port) => {
  const nextApp = next({ dev: true, dir })
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

const adjustRenderer = (protocol, dir) => {
  const paths = ['_next', 'static']
  const isWindows = process.platform === 'win32'

  protocol.interceptFileProtocol('file', (request, callback) => {
    let filePath = request.url.substr(isWindows ? 8 : 7)

    for (const replacement of paths) {
      if (!filePath.includes(replacement)) {
        continue
      }

      const parsed = path.parse(filePath)
      const newPrefix = dir.replace(path.normalize(parsed.root), '')
      const newPath = path.join(newPrefix, replacement)

      filePath = path.normalize(filePath.replace(replacement, newPath))
    }

    callback({path: filePath})
  })
}

module.exports = async (electron, dirs, port) => {
  let directories = {}

  if (typeof dirs === 'string') {
    directories.prod = dirs
    directories.dev = dirs
  } else {
    directories = dirs
  }

  if (!isDev) {
    adjustRenderer(electron.protocol, directories.prod)
    return
  }

  await devServer(electron.app, directories.dev, port)
}
