export type Lang = 'es' | 'en'

export const translations = {
  es: {
    title: 'Level Up Daily',
    subtitle: 'Sube de nivel todos los días',
    day: 'Día',
    coins: 'Monedas',
    progress: 'Progreso',
    unlockedGame: 'Juego desbloqueado',
    playFlappy: 'Jugar Flappy',
    close: 'Cerrar',
    shop: 'Tienda',
    comingSoon: 'Próximamente',
    highScore: 'Récord',
    tapToStart: 'Toca para iniciar',
    gameOver: 'Game Over',
    restart: 'Reiniciar',
    completeDay: 'Completar día'
  },
  en: {
    title: 'Level Up Daily',
    subtitle: 'Level up every day',
    day: 'Day',
    coins: 'Coins',
    progress: 'Progress',
    unlockedGame: 'Game unlocked',
    playFlappy: 'Play Flappy',
    close: 'Close',
    shop: 'Shop',
    comingSoon: 'Coming soon',
    highScore: 'High Score',
    tapToStart: 'Tap to start',
    gameOver: 'Game Over',
    restart: 'Restart',
    completeDay: 'Complete day'
  }
} as const
