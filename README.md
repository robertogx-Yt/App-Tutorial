# FocusFlow - MVP Desktop (Productividad + Gamificación)

Este proyecto ahora funciona como **app de escritorio real** (ventana de PC), no como web en navegador.

## Incluye

- Planificador de tareas con prioridad y fecha.
- Selección automática del **Plan de Hoy** (top 3 tareas).
- Sistema de gamificación (XP y nivel).
- Resumen IA básico por keywords.
- Menú lateral y gráficos dentro de una ventana desktop.

## Cómo probarlo

### 1) Abrir la app de escritorio (ventana)

```bash
go run ./cmd/focusflow
```

> Esto abre una ventana nativa de escritorio (Tkinter) con menú, tareas, panel de XP y gráficos.

### 2) Probar resumen IA desde terminal (opcional)

```bash
go run ./cmd/focusflow --mode summary --text "Tus notas o texto"
```

### 3) Ejecutar pruebas automáticas

```bash
go test ./...
```

### 4) Validar que no haya binarios versionados

```bash
python3 scripts/check_no_binary.py
```

### 5) Flujo de release (solo código fuente)

```bash
./scripts/build_release.sh
```
