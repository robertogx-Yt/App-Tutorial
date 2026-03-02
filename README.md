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


## Ventana gráfica (menús + gráficos)

Ejecuta un servidor local y abre la interfaz visual:

```bash
python3 -m http.server 4173
```

Luego abre en el navegador:

- `http://localhost:4173/web/`

Incluye menú lateral, lista de plan de hoy, barra de XP y gráficos de prioridad/estado.
