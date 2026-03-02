# FocusFlow - MVP (Productividad + Gamificación)

Este repositorio ahora incluye un **prototipo ejecutable** para el primer release de prueba.

## Incluye

- Planificador de tareas con prioridad y fecha (`internal/planner`).
- Selección automática del **Plan de Hoy** (top 3 tareas).
- Sistema de juego: XP, niveles y badges (`internal/gamification`).
- Resumen IA básico por palabras clave (`internal/ai`).
- Gráficos de base para app móvil (`assets/illustrations/*.svg`).
- Build de release para Windows en `.exe` (artefacto local, no se versiona en git).

## Ejecutar local

```bash
go run ./cmd/focusflow --mode demo
```

## Resumen IA de texto

```bash
go run ./cmd/focusflow --mode summary --text "Tus notas o texto"
```

## Pruebas

```bash
go test ./...
```

## Crear primer `.exe` de prueba

```bash
./scripts/build_release.sh
```

El binario se genera localmente en `dist/focusflow.exe` (no se sube al repo; adjúntalo al Release de GitHub).
