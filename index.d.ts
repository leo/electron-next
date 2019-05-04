type Dirs = string | string[]

interface ComplexDirs {
  development: Dirs,
  production: Dirs
}

/**
 * Starts nextjs dev server (only in dev environment)
 * @param directories folder(s) where your next.config.js is placed
 * @param port on which port to run dev server (defaults to 8000)
 */
export default function prepareRenderer (
  directories: Dirs | ComplexDirs,
  port?: string | number
): Promise<void>
