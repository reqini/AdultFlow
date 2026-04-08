# Evil MultiUploader — MVP

Sube un video una sola vez y publícalo en múltiples plataformas adultas.

## Inicio rápido

```bash
cd evil-multiuploader
npm install
npm start
```

Abre http://localhost:3000

## Flujo completo

1. **Registro / Login** — email + contraseña, sesión persistida en localStorage
2. **Seleccionar plataformas** — Pornhub, xHamster, Fansly, ManyVids, Twitter/X, Reddit, Telegram
3. **Subir video** — drag & drop, horizontal o vertical
4. **Título + traducciones** — auto a EN, PT, FR, DE, IT (editables)
5. **Portada** — upload imagen, preview (opcional)
6. **Publicar** — workers simulados por plataforma con estados en tiempo real
7. **Dashboard** — lista de videos, estados, botón reintentar
8. **Notificaciones** — campana con contador, aprobado / rechazado / error

## Estructura

```
src/
  constants.js          # plataformas, idiomas, colores de estado
  hooks/useStore.js     # estado global persistido en localStorage
  components/
    UI.js               # Btn, Badge, PlatformIcon, Input, Card
    AuthScreen.js       # login + registro
    TopBar.js           # navegación + notificaciones + perfil
    UploadWizard.js     # wizard 5 pasos
    Dashboard.js        # lista de videos
  App.js                # root
```

## Próximos pasos (fuera del MVP)

- Integrar APIs reales de cada plataforma (OAuth2 por plataforma)
- Backend Node.js + base de datos (SQLite o Postgres)
- Cola de trabajos real (BullMQ + Redis)
- Almacenamiento S3 / Cloudflare R2
- Traducciones via DeepL o Google Translate API
# AdultFlow
