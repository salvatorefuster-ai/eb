# EscortBenidorm — Producto final

Directorio **premium** de escorts **solo en Benidorm**: API real, multi-foto, PIN de gestión, multi-idioma, favoritos, comparar, PWA, admin y SEO local.

---

## Arrancar

### Modo REAL (recomendado — catálogo vacío, secretos fuertes)

```bash
cd C:\Users\salva\escort-benidorm
npm install
npm run real:init -- --force --domain=https://www.tudominio.com
# edita .env → OPERATOR_NAME / NIF / EMAIL / ADDRESS
npm start
```

Credenciales admin en `data/ADMIN-CREDENTIALS.txt` (bórralo tras copiarlas).  
**Usar HOY:** doble clic `start.bat` · guía **`HOY.md`** · internet temporal `publicar-hoy.bat`.  
Producción definitiva: **`GO-LIVE.md`**.

### Modo desarrollo (con demos)

```bash
# .env con REAL_MODE=0 o SEED_DEMOS=1
npm run db:reset
npm start
```

**Windows:** `start.bat` · **Backup:** `powershell -File backup.ps1`

| Acceso | Datos |
|--------|--------|
| Web | http://localhost:3456 |
| Admin | http://localhost:3456/admin.html |
| Credenciales | `.env` / `data/ADMIN-CREDENTIALS.txt` (modo real) |

```bash
npm run real:init   # producción local: vacía demos + secrets
npm run db:reset    # solo demos (dev)
npm test:real       # smoke modo real
npm run pm2         # proceso permanente
npm run docker      # Docker Compose
```

---

## Qué incluye (completo)

### Producto
- [x] Home mobile-first, listado, filtros, favoritos, comparar
- [x] Fichas multi-foto + URLs limpias `/a/:id`
- [x] **Registro obligatorio** + publicar multi-foto + PIN
- [x] **Créditos:** recarga 1–1000 € (enteros); 50–999 +20%; 1000 +50%
- [x] Gastar en Día 5 / VIP 7 / TOP 10 créd./día · trial 24h
- [x] Panel anunciante + historial de créditos
- [x] Admin: anuncios, pagos, usuarios/créditos, reportes
- [x] Landings SEO putas/scorts/escorts + EN/DE + zonas + blog
- [x] 11 idiomas UI · PWA · sitemap dinámico

### Backend
- Express + `data/db.json` · uploads · JWT user/admin
- API: ads, auth, **credits** (packs/preview/spend), checkout, admin

### SEO / growth
- Landings money + plan docs · `AUDITORIA-100-COMPLETA.md` · `LIVE-TOMORROW.md`

---

## Flujos clave

### Anunciante (créditos)
1. `/registro.html` → cuenta  
2. `/publicar.html` → 24h prueba + PIN  
3. `/precios.html` → recarga 1–1000 € (Bizum / mock)  
4. `/mi-anuncio.html` → gastar créditos en Día/VIP/TOP  

### Admin
1. `/admin.html`  
2. Pagos → activar recargas de créditos  
3. Usuarios/créditos → saldos y ledger  
4. Moderación de anuncios / reportes  

---

## Estructura

```
escort-benidorm/
├── server/           # API Express + seed + e2e
├── data/db.json      # Base de datos
├── uploads/          # Fotos
├── js/               # api, app, i18n, icons
├── css/styles.css
├── index.html …      # Páginas
├── mi-anuncio.html   # Gestión anunciante
├── sw.js             # Service worker
├── offline.html
├── DEPLOY.md
└── ENTREGA.md
```

---

## Despliegue

Ver `DEPLOY.md` (Docker, PM2, VPS adult-friendly, HTTPS, backups).

---

## Legal

Sitio +18. Ajusta `aviso-legal.html` y `privacidad.html` con tu NIF/empresa real antes de producción.
