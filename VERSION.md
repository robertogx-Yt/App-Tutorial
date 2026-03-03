# Registro de Versiones (Version Log)

Este archivo te permite registrar:
- Número de versión
- Fecha y hora del cambio
- Resumen de cambios
- Información relevante para release

## Versión 1.0.2
- Fecha y hora (UTC): 2026-03-03 15:46:52 UTC
- Tipo de cambio: fix
- Autor: Codex
- Commit: pendiente

### Resumen
- Se corrigió el script de arranque para escritorio: `desktop:dev` ahora apunta correctamente a `node scripts/desktop-dev.mjs`.
- Se dejó `dev` como alias estable de escritorio (`npm run dev` => `npm run desktop:dev`).
- Se mantuvo `start` para iniciar rápidamente en Windows.

### Notas
- Si ves `Missing script: dev` o `Missing script: desktop:dev`, estás en una copia/branch anterior. Haz `git pull` en la rama correcta.

---

## Versión 1.0.1
- Fecha y hora (UTC): 2026-03-03 15:45:25 UTC
- Tipo de cambio: fix
- Autor: Codex
- Commit: pendiente

### Resumen
- Se agregaron mejoras al flujo de scripts para arranque en escritorio.
- Se añadió `start` apuntando a `npm run dev`.

---

## Versión 1.0.0
- Fecha y hora (UTC): 2026-03-03 15:01:33 UTC
- Tipo de cambio: documentación
- Autor: Codex
- Commit base: de49252

### Resumen
- Se creó el archivo VERSION.md para llevar control manual de versiones y cambios.

---

## Plantilla para próximas versiones

```md
## Versión X.Y.Z
- Fecha y hora (UTC): YYYY-MM-DD HH:MM:SS UTC
- Tipo de cambio: feat | fix | chore | docs | refactor
- Autor: Nombre
- Commit: hash

### Resumen
- Cambio 1
- Cambio 2

### Notas
- Riesgos, migraciones o pasos manuales si aplican.
```
