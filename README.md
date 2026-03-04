# Level Up Daily (Desktop + Android Studio)

## Windows Desktop (Electron)
```bash
npm install
npm run dev
```

## Importar en Android Studio (funcional)

1. Genera el bundle web:
```bash
npm run build
```

2. Copia el bundle a `android/app/src/main/assets/web`:
```bash
npm run android:prepare
```

3. Abre Android Studio y selecciona la carpeta `android/` del repo.

4. Deja que Android Studio sincronice Gradle.

5. Ejecuta en emulador/dispositivo.

La app Android carga `file:///android_asset/web/index.html` en un `WebView` nativo.

## Scripts clave
- `npm run dev` → ventana de Electron.
- `npm run android:prepare` → build web + copia assets para Android.
- `npm run desktop:build` → empaquetado Windows.
