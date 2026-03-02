# Release de prueba (Desktop source-only)

## Qué se completó

- App de escritorio con ventana nativa (Tkinter).
- Lógica de priorización para "Plan de Hoy".
- Módulo de gamificación (XP y nivel).
- Resumen IA básico por palabras clave.
- Gráficos de prioridad y estado dentro de la ventana.
- Política de repo sin binarios versionados.

## Cómo probar

### Abrir app desktop (ventana)

```bash
go run ./cmd/focusflow
```

### Modo resumen IA

```bash
go run ./cmd/focusflow --mode summary --text "Texto de notas para resumir"
```

### Ejecutar tests

```bash
go test ./...
```

### Validar que no existan binarios versionados

```bash
python3 scripts/check_no_binary.py
```

### Flujo de release (solo fuente)

```bash
./scripts/build_release.sh
```
