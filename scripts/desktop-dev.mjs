import { spawn } from 'node:child_process'
import http from 'node:http'

const VITE_URL = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173'

function spawnCommand(command, args = [], extraEnv = {}) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/d', '/s', '/c', command], {
      stdio: 'inherit',
      env: { ...process.env, ...extraEnv }
    })
  }

  return spawn(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv }
  })
}

const vite = process.platform === 'win32'
  ? spawnCommand('npm run web:dev')
  : spawnCommand('npm', ['run', 'web:dev'])

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

async function main() {
  const ok = await waitForVite()
  if (!ok) {
    console.error('No se pudo iniciar Vite en', VITE_URL)
    shutdown(1)
    return
  }

  electronProc = process.platform === 'win32'
    ? spawnCommand('npx electron .', [], { VITE_DEV_SERVER_URL: VITE_URL })
    : spawnCommand('npx', ['electron', '.'], { VITE_DEV_SERVER_URL: VITE_URL })

  electronProc.on('exit', (code) => shutdown(code ?? 0))
}

vite.on('exit', (code) => shutdown(code ?? 0))
main()
