# Primer release de prueba

## Qué se completó

- Lógica de priorización para "Plan de Hoy".
- Módulo de gamificación (XP, nivel, badges).
- Resumen IA básico por palabras clave.
- Recursos gráficos base (`assets/illustrations/*.svg`) para splash/empty-state.
- Binario de prueba para Windows: se genera en `dist/focusflow.exe` durante el proceso de release local.

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

### Generar `.exe` de release

```bash
./scripts/build_release.sh
```

Esto creará `dist/focusflow.exe` localmente. Luego súbelo como asset en GitHub Releases.
