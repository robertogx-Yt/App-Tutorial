import { motion } from 'framer-motion'
import { Bird, Coins, Globe } from 'lucide-react'
import { useMemo, useState } from 'react'
import FlappyGame from './components/FlappyGame'
import { translations, type Lang } from './i18n/translations'

const getNum = (k: string, d = 0) => Number(localStorage.getItem(k) || d)

export default function App() {
  const [lang, setLang] = useState<Lang>((localStorage.getItem('lud-lang') as Lang) || 'es')
  const [completedDays, setCompletedDays] = useState(() => getNum('lud-days'))
  const [coins, setCoins] = useState(() => getNum('lud-coins'))
  const [openGame, setOpenGame] = useState(false)
  const t = translations[lang]

  const limit = completedDays >= 10 ? 20 : 10
  const days = Array.from({ length: limit }, (_, i) => i + 1)
  const progress = Math.min(100, (completedDays / limit) * 100)

  const levelNode = useMemo(
    () => (
      <motion.div key={completedDays >= 10 ? '2' : '1'} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="text-3xl font-bold text-emerald-500">
        {completedDays >= 10 ? '2' : '1'}
      </motion.div>
    ),
    [completedDays]
  )

  const save = (d: number, c: number, l: Lang) => {
    localStorage.setItem('lud-days', String(d))
    localStorage.setItem('lud-coins', String(c))
    localStorage.setItem('lud-lang', l)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-zinc-950 p-4 text-zinc-100">
      <div className="mx-auto w-full max-w-xl space-y-4">
        <header className="rounded-2xl bg-zinc-900 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{t.title}</h1>
              <p className="text-sm text-zinc-400">{t.subtitle}</p>
            </div>
            <button
              className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-2 py-1 text-sm"
              onClick={() => {
                const next = lang === 'es' ? 'en' : 'es'
                setLang(next)
                save(completedDays, coins, next)
              }}
            >
              <Globe size={16} /> {lang.toUpperCase()}
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">{levelNode}<span className="text-zinc-400">{t.progress}: {Math.round(progress)}%</span></div>
            <div className="inline-flex items-center gap-1 text-amber-400"><Coins size={16} /> {coins}</div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-800"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
        </header>

        <section className="grid grid-cols-5 gap-2 rounded-2xl bg-zinc-900 p-4 sm:grid-cols-6">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => {
                const next = Math.max(completedDays, d)
                setCompletedDays(next)
                save(next, coins, lang)
              }}
              className={`rounded-xl border p-2 text-sm ${d <= completedDays ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-800'}`}
            >
              {t.day} {d}
            </button>
          ))}
        </section>

        <button
          onClick={() => {
            const next = Math.min(limit, completedDays + 1)
            setCompletedDays(next)
            save(next, coins, lang)
          }}
          className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-zinc-950 active:scale-[0.99]"
        >
          {t.completeDay}
        </button>

        {completedDays >= 3 && (
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOpenGame(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-zinc-900 py-3 text-emerald-400">
            <Bird size={18} /> {t.playFlappy}
          </motion.button>
        )}
      </div>

      {openGame && (
        <FlappyGame
          lang={lang}
          onClose={() => setOpenGame(false)}
          onCoinsEarned={(c) => {
            const next = coins + c
            setCoins(next)
            save(completedDays, next, lang)
          }}
        />
      )}
    </main>
  )
}
