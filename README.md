# FocusFlow - MVP (Productividad + Gamificación)

Este repositorio mantiene un release de tipo **source-only**: no versiona artefactos binarios.

## Incluye

- Planificador de tareas con prioridad y fecha (`internal/planner`).
- Selección automática del **Plan de Hoy** (top 3 tareas).
- Sistema de juego: XP, niveles y badges (`internal/gamification`).
- Resumen IA básico por palabras clave (`internal/ai`).
- Gráficos de base para app móvil (`assets/illustrations/*.svg`).

## Cómo probarlo

### 1) Probar lógica automática (demo)

```bash
go run ./cmd/focusflow --mode demo
```

### 2) Probar resumen IA

```bash
go run ./cmd/focusflow --mode summary --text "Tus notas o texto"
```

### 3) Ejecutar pruebas automáticas

```bash
go test ./...
```

### 4) Verificar que no hay binarios versionados

```bash
python3 scripts/check_no_binary.py
```

### 5) Flujo de release (solo código fuente)

```bash
./scripts/build_release.sh
```
