import { motion } from 'framer-motion'
import { ChevronRight, CircleCheck, Coins, CreditCard, Gamepad2, Star, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import FlappyGame from './components/FlappyGame'
import { translations, type Lang } from './i18n/translations'

const getNum = (k: string, d = 0) => Number(localStorage.getItem(k) || d)

export default function App() {
  const [lang, setLang] = useState<Lang>((localStorage.getItem('lud-lang') as Lang) || 'es')
  const [completedDays, setCompletedDays] = useState(() => getNum('lud-days', 2))
  const [coins, setCoins] = useState(() => getNum('lud-coins', 25))
  const [openGame, setOpenGame] = useState(false)
  const t = translations[lang]

  const limit = completedDays >= 10 ? 20 : 10
  const days = Array.from({ length: limit }, (_, i) => i + 1)
  const progress = Math.min(100, (completedDays / limit) * 100)

  const levelNode = useMemo(() => (
    <motion.span key={completedDays >= 10 ? '2' : '1'} initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260 }} className="text-emerald-400">
      {completedDays >= 10 ? '2' : '1'}
    </motion.span>
  ), [completedDays])

  const save = (d: number, c: number, l: Lang) => {
    localStorage.setItem('lud-days', String(d))
    localStorage.setItem('lud-coins', String(c))
    localStorage.setItem('lud-lang', l)
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
                    if (isFlappy && completedDays >= 3) return setOpenGame(true)
                    const next = Math.max(completedDays, d)
                    setCompletedDays(next)
                    save(next, coins, lang)
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
              <button className="hover:text-zinc-300">Reiniciar Datos</button>
              <button className="hover:text-zinc-300">Documentación</button>
              <button
                onClick={() => {
                  const next = lang === 'es' ? 'en' : 'es'
                  setLang(next)
                  save(completedDays, coins, next)
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

      {openGame ? <FlappyGame lang={lang} onClose={() => setOpenGame(false)} onCoinsEarned={(c) => { const next = coins + c; setCoins(next); save(completedDays, next, lang) }} /> : null}
    </main>
  )
}
