import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')
const target = join(root, 'android', 'app', 'src', 'main', 'assets', 'web')

if (!existsSync(dist)) {
  console.error('No existe dist/. Ejecuta primero: npm run build')
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
cpSync(dist, target, { recursive: true })

writeFileSync(join(root, 'android', 'app', 'src', 'main', 'assets', 'README_ASSETS.txt'),
`Archivos copiados desde dist/ para Android WebView.\nComando: npm run android:prepare\n`)

console.log('Assets Android actualizados en', target)
