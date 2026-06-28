import { readFileSync } from 'fs'
import { join } from 'path'

const cssCache = new Map<string, string>()

export function getClientCss(name: 'login' | 'profile') {
  const cached = cssCache.get(name)

  if (cached) {
    return cached
  }

  const css = readFileSync(join(process.cwd(), 'public', 'client', `${name}.css`), 'utf8').replaceAll('url("./', 'url("/client/')
  cssCache.set(name, css)
  return css
}
