import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const root = process.cwd()
const indexPath = path.join(root, 'index.html')

const assets = [
  'assets/css/tailwind.css',
  'assets/css/main.css',
  'assets/js/i18n.js',
  'assets/js/language-switcher.js',
  'assets/js/main.js',
]

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let html = readFileSync(indexPath, 'utf8')

for (const asset of assets) {
  const assetPath = path.join(root, asset)
  const content = readFileSync(assetPath)
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 8)
  const pattern = new RegExp(`${escapeForRegex(asset)}(\\?v=[a-f0-9]+)?`, 'g')
  html = html.replace(pattern, `${asset}?v=${hash}`)
}

writeFileSync(indexPath, html)
console.log('Updated asset hashes in index.html')
