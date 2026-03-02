# FocusFlow (MVP)

Inicio de la app móvil de **productividad con IA** propuesta:
- Tareas con prioridad y fecha.
- "Plan de hoy" automático con 3 tareas clave.
- Base lista para conectar a una UI móvil (React Native/Expo) y a un motor de resumen con IA.

## Qué incluye este primer commit

- Modelo de datos de tareas (`Task`).
- Algoritmo de priorización para elegir las 3 tareas más importantes del día.
- Suite de pruebas unitarias para validar la lógica principal.

## Ejecutar

```bash
npm install
npm test
```

## Siguiente paso recomendado

1. Crear UI móvil con Expo (pantallas: Inbox, Hoy, Crear tarea).
2. Conectar storage local (SQLite/AsyncStorage).
3. Integrar resumen IA para notas/PDF.
