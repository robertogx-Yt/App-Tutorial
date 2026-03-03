import { motion } from 'framer-motion'
import { RotateCcw, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../i18n/translations'

type Props = { lang: Lang; onClose: () => void; onCoinsEarned: (c: number) => void }
type Pipe = { x: number; gapY: number; passed: boolean }

const W = 420
const H = 560
const GAP = 220
const PIPE_W = 52
const PIPE_SPEED = 1.45
const PIPE_DISTANCE = 230
const GRAVITY = 0.17
const JUMP = -4.1

export default function FlappyGame({ onClose, onCoinsEarned }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runningRef = useRef(false)
  const birdYRef = useRef(H / 2)
  const birdVRef = useRef(0)
  const scoreRef = useRef(0)
  const pipesRef = useRef<Pipe[]>([{ x: W + 100, gapY: 180, passed: false }])

  const [phase, setPhase] = useState<'intro' | 'running' | 'over'>('intro')
  const [score, setScore] = useState(0)
  const [showShop, setShowShop] = useState(false)

  const resetGame = () => {
    scoreRef.current = 0
    setScore(0)
    birdYRef.current = H / 2
    birdVRef.current = 0
    pipesRef.current = [{ x: W + 100, gapY: 180 + Math.random() * 120, passed: false }]
    runningRef.current = true
    setPhase('running')
  }

  const flap = () => {
    if (phase === 'intro' || phase === 'over') {
      resetGame()
      return
    }
    if (runningRef.current) birdVRef.current = JUMP
  }

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let raf = 0
    const birdX = 80

    const handlePointer = () => flap()
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') flap()
    }

    c.addEventListener('pointerdown', handlePointer)
    window.addEventListener('keydown', handleKey)

    const endGame = () => {
      runningRef.current = false
      setPhase('over')
    }

    const drawBackground = () => {
      ctx.fillStyle = '#7bc3d1'
      ctx.fillRect(0, 0, W, H)
    }

    const tick = () => {
      drawBackground()

      if (runningRef.current) {
        birdVRef.current += GRAVITY
        birdYRef.current += birdVRef.current

        const pipes = pipesRef.current
        for (const p of pipes) p.x -= PIPE_SPEED

        const lastPipe = pipes[pipes.length - 1]
        if (lastPipe && lastPipe.x < W - PIPE_DISTANCE) {
          pipes.push({ x: W + PIPE_W, gapY: 90 + Math.random() * 210, passed: false })
        }

        pipesRef.current = pipes.filter((p) => p.x > -PIPE_W - 30)

        for (const p of pipesRef.current) {
          if (!p.passed && p.x + PIPE_W < birdX) {
            p.passed = true
            scoreRef.current += 1
            setScore(scoreRef.current)
            onCoinsEarned(1)
          }

          const hitX = birdX + 13 > p.x && birdX - 13 < p.x + PIPE_W
          const hitY = birdYRef.current - 13 < p.gapY || birdYRef.current + 13 > p.gapY + GAP
          if (hitX && hitY) endGame()
        }

        if (birdYRef.current > H || birdYRef.current < 0) endGame()
      }

      ctx.fillStyle = '#37c871'
      for (const p of pipesRef.current) {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY)
        ctx.fillRect(p.x, p.gapY + GAP, PIPE_W, H)
      }

      ctx.beginPath()
      ctx.arc(birdX, birdYRef.current, 12, 0, Math.PI * 2)
      ctx.fillStyle = '#fcd34d'
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = '700 48px Inter'
      ctx.fillText(String(scoreRef.current), W / 2 - 10, 80)

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      c.removeEventListener('pointerdown', handlePointer)
      window.removeEventListener('keydown', handleKey)
      runningRef.current = false
    }
  }, [onCoinsEarned])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-[28px] border border-zinc-700 bg-zinc-700/95 p-6 shadow-2xl">
        {phase === 'intro' && (
          <div className="mb-4 text-center text-zinc-100">
            <div className="text-5xl font-extrabold italic">FLAPPY BIRD</div>
            <p className="mt-2 text-xl text-zinc-200">Pulsa para volar y esquivar las tuberías.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={resetGame} className="rounded-2xl bg-emerald-500 px-4 py-3 text-lg font-extrabold text-black">EMPEZAR JUEGO</button>
              <button onClick={() => setShowShop((s) => !s)} className="rounded-2xl bg-zinc-800 px-4 py-3 text-lg font-bold">TIENDA</button>
            </div>
            {showShop ? <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="mt-3 rounded-xl bg-zinc-800 py-2"><ShoppingCart className="mx-auto" /> Próximamente...</motion.div> : null}
          </div>
        )}

        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-[22px] border border-cyan-200/40" />

        <div className="mt-4 text-center text-xs tracking-[0.28em] text-zinc-300">HAZ CLIC O PULSA PARA SALTAR</div>

        {phase === 'over' && (
          <div className="mt-4 rounded-2xl bg-zinc-900/80 p-5 text-center">
            <div className="text-6xl font-black italic text-rose-500">FIN DE LA PARTIDA</div>
            <p className="text-zinc-300">PUNTUACIÓN FINAL</p>
            <p className="text-7xl font-bold">{score}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={resetGame} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 font-bold text-zinc-900"><RotateCcw size={16} />Reintentar</button>
              <button onClick={onClose} className="rounded-xl bg-zinc-800 px-6 py-3 font-bold">Salir</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
