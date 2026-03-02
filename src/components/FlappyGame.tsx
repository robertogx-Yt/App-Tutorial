import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../i18n/translations'
import { translations } from '../i18n/translations'

type Props = { lang: Lang; onClose: () => void; onCoinsEarned: (c: number) => void }

type Pipe = { x: number; gapY: number; passed: boolean }

const W = 320
const H = 520
const G = 170
const PIPE_W = 48
const SPEED = 2.1
const GRAVITY = 0.24
const JUMP = -4.6

export default function FlappyGame({ lang, onClose, onCoinsEarned }: Props) {
  const t = translations[lang]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('lud-highscore') || 0))
  const [showShop, setShowShop] = useState(false)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    let raf = 0
    let birdY = H / 2
    let birdV = 0
    const birdX = 64
    let pipes: Pipe[] = [{ x: W + 40, gapY: 200, passed: false }]

    const flap = () => {
      if (!running) {
        setRunning(true)
        setScore(0)
        birdY = H / 2
        birdV = 0
        pipes = [{ x: W + 40, gapY: 220, passed: false }]
      }
      birdV = JUMP
    }

    const onKey = (e: KeyboardEvent) => e.code === 'Space' && flap()
    window.addEventListener('keydown', onKey)
    c.addEventListener('pointerdown', flap)

    const sound = (hz: number, ms: number) => {
      const a = new AudioContext()
      const o = a.createOscillator()
      const g = a.createGain()
      o.connect(g)
      g.connect(a.destination)
      o.frequency.value = hz
      o.start()
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + ms / 1000)
      o.stop(a.currentTime + ms / 1000)
    }

    const loop = () => {
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, W, H)
      if (running) {
        birdV += GRAVITY
        birdY += birdV
        pipes.forEach((p) => (p.x -= SPEED))
        if (pipes[pipes.length - 1].x < W - 150) pipes.push({ x: W + 20, gapY: 120 + Math.random() * 220, passed: false })
        pipes = pipes.filter((p) => p.x > -PIPE_W)

        for (const p of pipes) {
          if (!p.passed && p.x + PIPE_W < birdX) {
            p.passed = true
            setScore((s) => {
              const ns = s + 1
              onCoinsEarned(1)
              sound(700, 90)
              if (ns > highScore) {
                localStorage.setItem('lud-highscore', String(ns))
                setHighScore(ns)
              }
              return ns
            })
          }
          const hitX = birdX + 14 > p.x && birdX - 14 < p.x + PIPE_W
          const hitY = birdY - 14 < p.gapY || birdY + 14 > p.gapY + G
          if (hitX && hitY) {
            setRunning(false)
            sound(180, 220)
          }
        }
        if (birdY > H || birdY < 0) {
          setRunning(false)
          sound(140, 220)
        }
      }

      ctx.fillStyle = '#10b981'
      pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY)
        ctx.fillRect(p.x, p.gapY + G, PIPE_W, H)
      })

      ctx.beginPath()
      ctx.arc(birdX, birdY, 14, 0, Math.PI * 2)
      ctx.fillStyle = '#facc15'
      ctx.fill()

      ctx.fillStyle = '#e4e4e7'
      ctx.font = '600 18px system-ui'
      ctx.fillText(`${t.highScore}: ${highScore}`, 12, 26)
      ctx.fillText(`Score: ${score}`, 12, 48)
      if (!running) ctx.fillText(t.tapToStart, 100, H / 2)

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      c.removeEventListener('pointerdown', flap)
    }
  }, [lang, running, highScore, onCoinsEarned, t.highScore, t.tapToStart])

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-3">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-2xl bg-zinc-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setShowShop((s) => !s)} className="rounded-xl border border-zinc-700 px-3 py-1 text-sm">{t.shop}</button>
          <button onClick={onClose} className="rounded-xl border border-zinc-700 px-3 py-1 text-sm">{t.close}</button>
        </div>
        {showShop && <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.1 }} className="mb-2 rounded-xl bg-zinc-800 p-2 text-center text-sm">{t.comingSoon}...</motion.div>}
        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-xl border border-zinc-700" />
      </motion.div>
    </div>
  )
}
