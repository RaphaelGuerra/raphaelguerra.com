import { spawnSync } from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'

const root = process.cwd()
const filesToCheck = ['index.html', 'assets/css/tailwind.css']

const before = new Map(
  filesToCheck.map((relativePath) => {
    const fullPath = path.join(root, relativePath)
    return [relativePath, readFileSync(fullPath, 'utf8')]
  }),
)

const buildResult = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' })
if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1)
}

const changed = filesToCheck.filter((relativePath) => {
  const fullPath = path.join(root, relativePath)
  const after = readFileSync(fullPath, 'utf8')
  return after !== before.get(relativePath)
})

if (changed.length > 0) {
  console.error(`ERROR: Build changed committed artifacts: ${changed.join(', ')}`)
  process.exit(1)
}

console.log('Build artifact check passed (no changes after rebuild).')
