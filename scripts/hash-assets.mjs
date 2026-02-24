import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { HASHED_ASSETS } from './hashed-assets.mjs'

const root = process.cwd()
const indexPath = path.join(root, 'index.html')

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

let html = readFileSync(indexPath, 'utf8')

for (const asset of HASHED_ASSETS) {
  const assetPath = path.join(root, asset)
  const content = readFileSync(assetPath)
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 8)
  const pattern = new RegExp(`${escapeForRegex(asset)}(\\?v=[a-f0-9]+)?`, 'g')
  html = html.replace(pattern, `${asset}?v=${hash}`)
}

writeFileSync(indexPath, html)
console.log('Updated asset hashes in index.html')
