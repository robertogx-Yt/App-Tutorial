# Release de prueba (source-only)

## Qué se completó

- Lógica de priorización para "Plan de Hoy".
- Módulo de gamificación (XP, nivel, badges).
- Resumen IA básico por palabras clave.
- Recursos gráficos base (`assets/illustrations/*.svg`) para splash/empty-state.
- Política de repo sin binarios versionados.

## Cómo probar

### Modo demo (simula el juego/productividad)

```bash
go run ./cmd/focusflow --mode demo
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
