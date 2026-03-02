import { motion } from 'framer-motion'
import { RotateCcw, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../i18n/translations'

type Props = { lang: Lang; onClose: () => void; onCoinsEarned: (c: number) => void }
type Pipe = { x: number; gapY: number; passed: boolean }

const W = 420
const H = 560
const G = 190
const PIPE_W = 52
const SPEED = 1.9
const GRAVITY = 0.22
const JUMP = -4.7

export default function FlappyGame({ onClose, onCoinsEarned }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'intro' | 'running' | 'over'>('intro')
  const [score, setScore] = useState(0)
  const [showShop, setShowShop] = useState(false)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    let raf = 0
    let birdY = H / 2
    let birdV = 0
    const birdX = 80
    let pipes: Pipe[] = [{ x: W + 60, gapY: 220, passed: false }]

    const start = () => {
      if (state === 'intro' || state === 'over') {
        setScore(0)
        birdY = H / 2
        birdV = 0
        pipes = [{ x: W + 60, gapY: 220, passed: false }]
        setState('running')
      }
      birdV = JUMP
    }

    const tap = () => start()
    const key = (e: KeyboardEvent) => e.code === 'Space' && start()
    c.addEventListener('pointerdown', tap)
    window.addEventListener('keydown', key)

    const loop = () => {
      ctx.fillStyle = '#7bc3d1'
      ctx.fillRect(0, 0, W, H)

      if (state === 'running') {
        birdV += GRAVITY
        birdY += birdV
        pipes.forEach((p) => (p.x -= SPEED))
        if (pipes[pipes.length - 1].x < W - 170) pipes.push({ x: W + 40, gapY: 100 + Math.random() * 250, passed: false })
        pipes = pipes.filter((p) => p.x > -PIPE_W)

        pipes.forEach((p) => {
          if (!p.passed && p.x + PIPE_W < birdX) {
            p.passed = true
            setScore((s) => {
              onCoinsEarned(1)
              return s + 1
            })
          }
          const hitX = birdX + 14 > p.x && birdX - 14 < p.x + PIPE_W
          const hitY = birdY - 14 < p.gapY || birdY + 14 > p.gapY + G
          if (hitX && hitY) setState('over')
        })

        if (birdY > H || birdY < 0) setState('over')
      }

      ctx.fillStyle = '#37c871'
      pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY)
        ctx.fillRect(p.x, p.gapY + G, PIPE_W, H)
      })

      ctx.beginPath()
      ctx.arc(birdX, birdY, 12, 0, Math.PI * 2)
      ctx.fillStyle = '#fcd34d'
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = '700 48px Inter'
      ctx.fillText(String(score), W / 2 - 10, 80)

      if (state !== 'running') {
        ctx.fillStyle = 'rgba(0,0,0,0.35)'
        ctx.fillRect(0, 0, W, H)
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      c.removeEventListener('pointerdown', tap)
      window.removeEventListener('keydown', key)
    }
  }, [onCoinsEarned, state, score])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-[28px] border border-zinc-700 bg-zinc-700/95 p-6 shadow-2xl">
        {state === 'intro' && (
          <div className="mb-4 text-center text-zinc-100">
            <div className="text-5xl font-extrabold italic">FLAPPY BIRD</div>
            <p className="mt-2 text-xl text-zinc-200">Pulsa para volar y esquivar las tuberías.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setState('running')} className="rounded-2xl bg-emerald-500 px-4 py-3 text-lg font-extrabold text-black">EMPEZAR JUEGO</button>
              <button onClick={() => setShowShop((s) => !s)} className="rounded-2xl bg-zinc-800 px-4 py-3 text-lg font-bold">TIENDA</button>
            </div>
            {showShop ? <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="mt-3 rounded-xl bg-zinc-800 py-2"><ShoppingCart className="mx-auto" /> Próximamente...</motion.div> : null}
          </div>
        )}

        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-[22px] border border-cyan-200/40" />

        <div className="mt-4 text-center text-xs tracking-[0.28em] text-zinc-300">HAZ CLIC O PULSA PARA SALTAR</div>

        {state === 'over' && (
          <div className="mt-4 rounded-2xl bg-zinc-900/80 p-5 text-center">
            <div className="text-6xl font-black italic text-rose-500">FIN DE LA PARTIDA</div>
            <p className="text-zinc-300">PUNTUACIÓN FINAL</p>
            <p className="text-7xl font-bold">{score}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => setState('running')} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 font-bold text-zinc-900"><RotateCcw size={16} />Reintentar</button>
              <button onClick={onClose} className="rounded-xl bg-zinc-800 px-6 py-3 font-bold">Salir</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
