import { motion } from 'framer-motion'
import { ChevronRight, CircleCheck, Coins, CreditCard, Gamepad2, Star, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import FlappyGame from './components/FlappyGame'
import { translations, type Lang } from './i18n/translations'

type ProgressState = {
  completedDays: number
  coins: number
  lang: Lang
  lastCheckinMs: number
}

const DAY_MS = 24 * 60 * 60 * 1000

const getNum = (k: string, d = 0) => Number(localStorage.getItem(k) || d)

function loadState(): ProgressState {
  return {
    completedDays: getNum('lud-days', 1),
    coins: getNum('lud-coins', 0),
    lang: (localStorage.getItem('lud-lang') as Lang) || 'es',
    lastCheckinMs: getNum('lud-last-checkin', Date.now())
  }
}

function persistState(state: ProgressState) {
  localStorage.setItem('lud-days', String(state.completedDays))
  localStorage.setItem('lud-coins', String(state.coins))
  localStorage.setItem('lud-lang', state.lang)
  localStorage.setItem('lud-last-checkin', String(state.lastCheckinMs))
}

export default function App() {
  const initial = loadState()
  const [lang, setLang] = useState<Lang>(initial.lang)
  const [completedDays, setCompletedDays] = useState(initial.completedDays)
  const [coins, setCoins] = useState(initial.coins)
  const [lastCheckinMs, setLastCheckinMs] = useState(initial.lastCheckinMs)
  const [openGame, setOpenGame] = useState(false)
  const [testCoinsInput, setTestCoinsInput] = useState('10')
  const t = translations[lang]

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastCheckinMs
    if (elapsed < DAY_MS) return

    const gainDays = Math.floor(elapsed / DAY_MS)
    const nextDays = completedDays + gainDays
    const nextCheckin = lastCheckinMs + gainDays * DAY_MS

    setCompletedDays(nextDays)
    setLastCheckinMs(nextCheckin)
    persistState({ completedDays: nextDays, coins, lang, lastCheckinMs: nextCheckin })
  }, [])

  const limit = completedDays >= 10 ? 20 : 10
  const days = Array.from({ length: limit }, (_, i) => i + 1)
  const progress = Math.min(100, (completedDays / limit) * 100)
  const nextDayInMs = Math.max(0, DAY_MS - (Date.now() - lastCheckinMs))

  const levelNode = useMemo(
    () => (
      <motion.span
        key={completedDays >= 10 ? '2' : '1'}
        initial={{ y: -22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260 }}
        className="text-emerald-400"
      >
        {completedDays >= 10 ? '2' : '1'}
      </motion.span>
    ),
    [completedDays]
  )

  const save = (next: Partial<ProgressState>) => {
    const state: ProgressState = {
      completedDays,
      coins,
      lang,
      lastCheckinMs,
      ...next
    }
    setCompletedDays(state.completedDays)
    setCoins(state.coins)
    setLang(state.lang)
    setLastCheckinMs(state.lastCheckinMs)
    persistState(state)
  }

  const resetData = () => {
    const base: ProgressState = {
      completedDays: 1,
      coins: 0,
      lang,
      lastCheckinMs: Date.now()
    }
    persistState(base)
    setCompletedDays(base.completedDays)
    setCoins(base.coins)
    setLastCheckinMs(base.lastCheckinMs)
  }

  const formatRemaining = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen bg-[#030712] text-zinc-100 app-shell">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <section className="panel p-8">
          <div className="inline-flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-2 text-emerald-300">
            <Zap size={16} /> <span className="text-xs tracking-[0.2em]">SISTEMA ACTIVO</span>
          </div>
          <h1 className="mt-6 text-6xl font-bold">Nivel {levelNode}</h1>
          <p className="mt-4 max-w-2xl text-xl text-zinc-400">Tu sistema de progresión diaria. Completa 10 días para desbloquear la siguiente fase.</p>

          <div className="mt-10 grid gap-3 md:grid-cols-2">
            <div>
              <div className="label">PROGRESO ACTUAL</div>
              <div className="text-5xl font-bold">{t.day} {completedDays} de {limit}</div>
            </div>
            <div className="text-right">
              <div className="label">COMPLETADO</div>
              <div className="text-5xl font-bold text-emerald-400">{Math.round(progress)}%</div>
            </div>
          </div>
          <div className="mt-6 h-3 rounded-full bg-zinc-800"><div className="h-3 rounded-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="mt-4 text-sm text-zinc-400">Siguiente día en: <span className="font-semibold text-emerald-300">{formatRemaining(nextDayInMs)}</span></p>
        </section>

        <section className="mt-10">
          <div className="label mb-4">LÍNEA DE TIEMPO</div>
          <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
            {days.map((d) => {
              const isFlappy = d === 3
              const active = d <= completedDays
              return (
                <button
                  key={d}
                  onClick={() => {
                    if (isFlappy && completedDays >= 3) setOpenGame(true)
                  }}
                  className={`day-card ${active ? 'active' : ''} ${isFlappy ? 'flappy' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{d}</span>
                    {active ? <CircleCheck size={16} className="text-emerald-300" /> : null}
                  </div>
                  <span className="mt-1 text-[10px] tracking-[0.2em] text-zinc-500">DÍA</span>
                  {isFlappy ? <span className="mt-1 block text-[10px] font-semibold text-black">DESAFÍO FLAPPY BIRD</span> : null}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-8 panel p-5">
          <div className="label mb-2">PANEL DE TEST (TEMPORAL)</div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-zinc-900" onClick={() => save({ completedDays: completedDays + 1, lastCheckinMs: Date.now() })}>
              +1 Día
            </button>
            <input
              value={testCoinsInput}
              onChange={(e) => setTestCoinsInput(e.target.value)}
              className="rounded-xl border border-zinc-600 bg-zinc-900 px-3 py-2"
              type="number"
              min="0"
            />
            <button
              className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-zinc-900"
              onClick={() => {
                const add = Math.max(0, Number(testCoinsInput) || 0)
                save({ coins: coins + add })
              }}
            >
              Añadir monedas
            </button>
          </div>
        </section>

        <section className="mt-12 panel p-6">
          <div className="label mb-5">RECOMPENSA DIARIA</div>
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-4">
              <div className="icon-box"><CreditCard size={28} /></div>
              <div>
                <h3 className="text-3xl font-bold text-emerald-400">Tarjeta de Nivel 2</h3>
                <p className="text-zinc-400">La pieza final del rompecabezas.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="label">CONTENIDO EXTRA</div>
          <button onClick={() => setOpenGame(true)} className="panel flex w-full items-center justify-between p-8 hover:border-emerald-400/70">
            <div className="flex items-center gap-5">
              <div className="icon-box bg-emerald-500/20 text-emerald-300"><Gamepad2 size={28} /></div>
              <div className="text-left">
                <h3 className="text-4xl font-bold">Desafío Flappy Bird</h3>
                <p className="text-zinc-400">Pon a prueba tus reflejos y recibe feedback de la IA.</p>
              </div>
            </div>
            <ChevronRight className="text-emerald-400" />
          </button>

          <div className="panel p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3"><Star className="text-emerald-300" /><h3 className="text-4xl font-bold">Nivel 2</h3></div>
                <p className="mt-2 text-sm tracking-[0.2em] text-zinc-500">LA PRÓXIMA FRONTERA</p>
                <div className="mt-4 inline-flex rounded-full bg-emerald-500 px-5 py-2 font-bold text-zinc-900">PRÓXIMAMENTE</div>
                <p className="mt-4 max-w-2xl text-2xl text-zinc-300">¡Felicidades! Has dominado la primera fase. El Nivel 2 está en desarrollo y estará disponible pronto.</p>
              </div>
              <div className="text-zinc-700"><Star size={128} /></div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-800 py-8 text-sm text-zinc-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>© 2026 PROGRESSION SYSTEMS</span>
            <div className="flex items-center gap-6">
              <button className="hover:text-zinc-300" onClick={resetData}>Reiniciar Datos</button>
              <button className="hover:text-zinc-300">Documentación</button>
              <button
                onClick={() => {
                  const next = lang === 'es' ? 'en' : 'es'
                  save({ lang: next })
                }}
                className="rounded-lg border border-zinc-700 px-3 py-1"
              >
                {lang.toUpperCase()}
              </button>
              <div className="inline-flex items-center gap-1 text-amber-400"><Coins size={16} />{coins}</div>
            </div>
          </div>
        </footer>
      </div>

      {openGame ? (
        <FlappyGame
          lang={lang}
          onClose={() => setOpenGame(false)}
          onCoinsEarned={(c) => save({ coins: coins + c })}
        />
      ) : null}
    </main>
  )
}
