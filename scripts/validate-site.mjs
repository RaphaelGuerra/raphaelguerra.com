import { createHash } from 'crypto'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { HASHED_ASSETS } from './hashed-assets.mjs'

const root = process.cwd()
const indexPath = path.join(root, 'index.html')
const localeDir = path.join(root, 'locales')
const jsPaths = [
  path.join(root, 'assets/js/main.js'),
  path.join(root, 'assets/js/i18n.js'),
  path.join(root, 'assets/js/language-switcher.js'),
]

const issues = []
const warnings = []

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const indexHtml = readFileSync(indexPath, 'utf8')

const htmlTranslationKeys = new Set(
  [...indexHtml.matchAll(/data-translate="([^"]+)"/g)].map((match) => match[1]),
)

const jsTranslationKeys = new Set(
  jsPaths.flatMap((jsPath) => {
    const js = readFileSync(jsPath, 'utf8')
    return [...js.matchAll(/window\.i18n(?:\?\.)?t\(\s*['"]([^'"]+)['"]\s*\)/g)].map((match) => match[1])
  }),
)

const requiredTranslationKeys = new Set([...htmlTranslationKeys, ...jsTranslationKeys, 'pageTitle'])

const localeFiles = readdirSync(localeDir).filter((file) => file.endsWith('.json')).sort()
if (localeFiles.length === 0) {
  issues.push('No locale files found in ./locales')
}

const locales = new Map(
  localeFiles.map((file) => {
    const fullPath = path.join(localeDir, file)
    return [file, JSON.parse(readFileSync(fullPath, 'utf8'))]
  }),
)

const baselineFile = locales.has('en.json') ? 'en.json' : localeFiles[0]
const baselineKeys = new Set(Object.keys(locales.get(baselineFile) || {}))

for (const [file, locale] of locales.entries()) {
  const localeKeys = new Set(Object.keys(locale))

  const missingFromBaseline = [...baselineKeys].filter((key) => !localeKeys.has(key))
  if (missingFromBaseline.length > 0) {
    issues.push(`${file} is missing ${missingFromBaseline.length} baseline keys: ${missingFromBaseline.join(', ')}`)
  }

  const extraAgainstBaseline = [...localeKeys].filter((key) => !baselineKeys.has(key))
  if (extraAgainstBaseline.length > 0) {
    issues.push(`${file} has ${extraAgainstBaseline.length} extra keys not in ${baselineFile}: ${extraAgainstBaseline.join(', ')}`)
  }

  const missingRequired = [...requiredTranslationKeys].filter((key) => !localeKeys.has(key))
  if (missingRequired.length > 0) {
    issues.push(`${file} is missing ${missingRequired.length} required translation keys: ${missingRequired.join(', ')}`)
  }
}

const unusedBaselineKeys = [...baselineKeys].filter((key) => !requiredTranslationKeys.has(key)).sort()
if (unusedBaselineKeys.length > 0) {
  warnings.push(`Unused keys in ${baselineFile}: ${unusedBaselineKeys.join(', ')}`)
}

for (const asset of HASHED_ASSETS) {
  const expectedHash = createHash('sha256')
    .update(readFileSync(path.join(root, asset)))
    .digest('hex')
    .slice(0, 8)

  const hashedAssetPattern = new RegExp(`${escapeForRegex(asset)}\\?v=([a-f0-9]{8})`, 'g')
  const hashedMatches = [...indexHtml.matchAll(hashedAssetPattern)]

  if (hashedMatches.length === 0) {
    issues.push(`Missing hashed reference for ${asset} in index.html`)
    continue
  }

  if (hashedMatches.length > 1) {
    issues.push(`Expected one reference for ${asset}, found ${hashedMatches.length}`)
  }

  const actualHash = hashedMatches[0]?.[1]
  if (actualHash && actualHash !== expectedHash) {
    issues.push(`${asset} hash mismatch in index.html: expected ${expectedHash}, found ${actualHash}`)
  }

  const unversionedPattern = new RegExp(`${escapeForRegex(asset)}(?!\\?v=)`, 'g')
  const unversionedMatches = [...indexHtml.matchAll(unversionedPattern)]
  if (unversionedMatches.length > 0) {
    issues.push(`Found unversioned reference(s) for ${asset} in index.html`)
  }
}

for (const warning of warnings) {
  console.log(`WARN: ${warning}`)
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`ERROR: ${issue}`)
  }
  process.exit(1)
}

console.log(
  `Site checks passed (${localeFiles.length} locales, ${requiredTranslationKeys.size} required translation keys, ${HASHED_ASSETS.length} hashed assets).`,
)
