# Level Up Daily (Desktop first - Windows)

Aplicación gamificada estilo sci‑fi con Flappy Bird integrado.

## Abrir SIEMPRE como ventana de escritorio (Windows)

```bash
npm install
npm run dev
```

`npm run dev` ahora usa un script propio (`scripts/desktop-dev.mjs`) que:
1. inicia Vite,
2. espera a que levante,
3. abre Electron en ventana.

> Esto evita depender de `concurrently`, `wait-on` o `cross-env`.

## Solo web (debug opcional)

```bash
npm run web:dev
```

## Ejecutar app de escritorio desde build local

```bash
npm run desktop:start
```

## Exportar ejecutable Windows (.exe)

```bash
npm run desktop:build
```

## Android (después)

```bash
npm run android:setup
npm run android:update
```
