// Native
const { createServer } = require('http')
const { parse, normalize, join } = require('path')

// Packages
const electron = require('electron')
const next = require('next')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

const devServer = async (dir, port) => {
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
    electron.app.on('before-quit', () => server.close())
  })
}

const adjustRenderer = directory => {
  const paths = ['_next', 'static']
  const isWindows = process.platform === 'win32'

  electron.protocol.interceptFileProtocol('file', (request, callback) => {
    let path = request.url.substr(isWindows ? 8 : 7)

    for (const replacement of paths) {
      if (!path.includes(replacement)) {
        continue
      }

      const parsed = parse(path)
      const newPrefix = directory.replace(normalize(parsed.root), '')
      const newPath = join(newPrefix, replacement)

      path = normalize(path.replace(replacement, newPath))
    }

    callback({ path })
  })
}

module.exports = async (directories, port) => {
  if (!directories) {
    throw new Error('Renderer location not defined')
  }

  if (typeof directories === 'string') {
    directories = {
      production: directories,
      development: directories
    }
  }

  for (const directory in directories) {
    if (!{}.hasOwnProperty.call(directories, directory)) {
      continue
    }

    directories[directory] = resolve(directories[directory])
  }

  if (!isDev) {
    adjustRenderer(directories.production)
    return
  }

  await devServer(directories.development, port)
}
