import { spawn } from 'node:child_process'
import http from 'node:http'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const VITE_URL = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173'

function spawnShell(command, extraEnv = {}) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/d', '/s', '/c', command], {
      stdio: 'inherit',
      env: { ...process.env, ...extraEnv }
    })
  }

  return spawn(command, [], {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
    shell: true
  })
}

const vite = spawnShell('npm run web:dev')

let shuttingDown = false
let electronProc = null

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  if (electronProc && !electronProc.killed) electronProc.kill()
  if (vite && !vite.killed) vite.kill()
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(VITE_URL, (res) => {
      res.resume()
      resolve(res.statusCode && res.statusCode < 500)
    })

    req.on('error', () => resolve(false))
    req.setTimeout(1200, () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function waitForVite(maxAttempts = 90) {
  for (let i = 0; i < maxAttempts; i += 1) {
    if (await checkServer()) return true
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

function resolveElectronCommand() {
  if (process.platform === 'win32') {
    const cmdPath = join(process.cwd(), 'node_modules', '.bin', 'electron.cmd')
    if (existsSync(cmdPath)) {
      return `"${cmdPath}" .`
    }
    return null
  }

  const binPath = join(process.cwd(), 'node_modules', '.bin', 'electron')
  if (existsSync(binPath)) {
    return `"${binPath}" .`
  }
  return null
}

async function main() {
  const ok = await waitForVite()
  if (!ok) {
    console.error('No se pudo iniciar Vite en', VITE_URL)
    shutdown(1)
    return
  }

  const electronCommand = resolveElectronCommand()
  if (!electronCommand) {
    console.error('No se encontró Electron local en node_modules. Ejecuta: npm install')
    shutdown(1)
    return
  }

  console.log('[desktop-dev] Vite listo en', VITE_URL)
  console.log('[desktop-dev] Abriendo ventana Electron...')

  electronProc = spawnShell(electronCommand, { VITE_DEV_SERVER_URL: VITE_URL })

  electronProc.on('exit', (code) => shutdown(code ?? 0))
  electronProc.on('error', (err) => {
    console.error('[desktop-dev] Error lanzando Electron:', err.message)
    shutdown(1)
  })
}

vite.on('exit', (code) => shutdown(code ?? 0))
main()
