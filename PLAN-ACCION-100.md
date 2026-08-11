# Plan de acción autónomo — EscortBenidorm al 100%

**Fecha:** 2026-07-28  
**Web local:** http://localhost:3456  
**Estado actual (auditoría):**

| Capa | % | Significado |
|------|---|-------------|
| **Producto local** | **~95%** | Publicar, PIN, listado, pagos manuales, admin, SEO base |
| **Producción en internet** | **~70%** | Falta dominio, HTTPS, datos legales reales, mock off |
| **Negocio / cobrar en serio** | **~40%** | Bizum manual OK; Stripe y emails no existen |

Este plan está pensado para ejecutarse **en orden**, sin depender de decisiones de diseño: cada tarea es concreta y tiene criterio de “hecho”.

---

## 0. Arranque inmediato (ya)

| # | Acción | Cómo saber que está hecho |
|---|--------|---------------------------|
| 0.1 | Servidor local en marcha | `start.bat` o `npm start` → http://localhost:3456/api/health → `"ok":true` |
| 0.2 | Abrir y probar en navegador | Home, Publicar, Precios, Admin cargan |
| 0.3 | Smoke automático | `npm run test:today` → todo OK |
| 0.4 | Credenciales admin | Leer `data/ADMIN-CREDENTIALS.txt` y guardar en gestor de contraseñas |

**Comandos:**

```bat
cd C:\Users\salva\escort-benidorm
start.bat
```

Otra terminal:

```bat
npm run test:today
```

---

## Fase A — “100% producto usable” (hoy / 1 día)

Objetivo: cualquier persona en tu PC o Wi‑Fi puede usar la web de verdad.

### A1. Configuración verdadera (30 min)

Editar **`.env`** (no commitear):

```env
SITE_URL=http://localhost:3456
# Cuando tengas dominio:
# SITE_URL=https://www.tudominio.com

OPERATOR_NAME=Tu nombre o S.L.
OPERATOR_NIF=12345678A
OPERATOR_EMAIL=tu@email.com
OPERATOR_ADDRESS=Calle…, Benidorm

PAY_BIZUM=6XXXXXXXX
PAY_IBAN=ES00 0000 0000 0000 0000 0000
PAY_HOLDER=Titular de la cuenta

PLAN_VIP_PRICE=29
PLAN_TOP_PRICE=49

# En el PC de desarrollo puedes dejar:
ALLOW_MOCK_PAY=1

# En el servidor público NUNCA:
# ALLOW_MOCK_PAY=1
```

Reiniciar servidor. Comprobar:

- http://localhost:3456/aviso-legal.html → **sin banner rojo**
- http://localhost:3456/precios.html → Bizum/IBAN reales

| Hecho cuando | Banner legal desaparece y checkout muestra tus datos de cobro |

### A2. Checklist funcional manual (20 min)

| # | Flujo | Resultado esperado |
|---|--------|-------------------|
| 1 | Publicar **gratis** | Anuncio en listado + PIN en pantalla |
| 2 | **Mi anuncio** con PIN | Editar tarifa, renovar, pausar |
| 3 | Publicar **VIP** | Anuncio en Básico + CTA checkout |
| 4 | Checkout → Simular pago (local) | Plan VIP activo + badge |
| 5 | Admin → **Pagos** | Ver pedido y “Activar plan” |
| 6 | Contacto | Mensaje en Admin → Mensajes |
| 7 | Reportar en ficha | Aparece en Admin → Reportes |
| 8 | Favoritos / comparar | Persistencia en el navegador |
| 9 | Móvil misma Wi‑Fi | URL `Red LAN` de la consola |

### A3. Limpieza de seguridad local (10 min)

| # | Acción | Archivo |
|---|--------|---------|
| 1 | Guardar password admin offline | — |
| 2 | Borrar `data/ADMIN-CREDENTIALS.txt` del disco (tras copiar) | `data/` |
| 3 | No subir `.env` a git | `.gitignore` ya lo ignora |
| 4 | Ocultar o suavizar texto “benidorm2026” en admin | `admin.html` |

### A4. Primer contenido real (variable)

| # | Acción |
|---|--------|
| 1 | Publicar 1–3 anuncios reales (tuyos o de contactos) |
| 2 | Opcional: `npm run db:reset` solo si quieres demos de nuevo (rompe modo real vacío) |
| 3 | Fotos reales en publicar (no SVG demo) |

**Criterio Fase A completa:** smoke + checklist manual en verde + legales con datos reales + al menos 1 anuncio real.

---

## Fase B — “100% en internet” (1–3 días)

Objetivo: URL pública HTTPS, sin mock, con backups.

### B1. Infraestructura

| # | Tarea | Artefacto |
|---|--------|-----------|
| 1 | Dominio (ej. escortbenidorm.es) | Registrador |
| 2 | VPS **adult-friendly** (Hetzner/Contabo/OVH…) | Ubuntu 22+ |
| 3 | DNS A → IP del VPS | Panel DNS |
| 4 | Subir código (`scp`/`git`/rsync) **sin** `node_modules`, **con** `.env` prod | VPS `/var/www/...` |
| 5 | `npm ci --omit=dev` | VPS |
| 6 | PM2: `npm run pm2` + `pm2 save` + `pm2 startup` | `ecosystem.config.cjs` |
| 7 | Nginx + Certbot HTTPS | `deploy/nginx.conf` |
| 8 | Cron backup 03:00 | `deploy/backup.sh` |

Guía detallada: **`GO-LIVE.md`** + **`DEPLOY.md`**.

### B2. `.env` de producción (crítico)

```env
NODE_ENV=production
REAL_MODE=1
SEED_DEMOS=0
SITE_URL=https://www.tudominio.com
# SIN Allow mock:
# ALLOW_MOCK_PAY=   (vacío o borrar la línea)
JWT_SECRET=...largo...
ADMIN_PASSWORD=...fuerte...
OPERATOR_*=reales
PAY_*=reales
```

| Hecho cuando | `curl https://tudominio.com/api/health` OK y mock pay no aparece en checkout |

### B3. Smoke en producción

```bat
set BASE_URL=https://www.tudominio.com
npm run test:today
```

(Manual si el test mock no está permitido en prod: publicar gratis + VIP awaiting + admin activar.)

### B4. SEO día 1 post-deploy

| # | Tarea |
|---|--------|
| 1 | Google Search Console → propiedad dominio |
| 2 | Enviar `https://tudominio.com/sitemap.xml` |
| 3 | Comprobar `robots.txt` apunta al dominio correcto |

**Criterio Fase B completa:** HTTPS público, admin fuerte, mock off, backup programado, sitemap enviado.

---

## Fase C — “100% negocio / dinero” (semana 1–4)

Objetivo: cobrar sin mirar el panel todo el día y crecer.

### C1. Cobro manual disciplinado (semana 1)

| # | Tarea | Dueño |
|---|--------|--------|
| 1 | SOP: ver Bizum/banco → Admin Pagos → Activar | Tú |
| 2 | Concepto obligatorio = código `EB-XXXX` | Checkout ya lo indica |
| 3 | Revisar pagos `awaiting` 1–2 veces al día | Admin |
| 4 | WhatsApp de soporte anunciantes | Enlace en contacto |

### C2. Automatización (semana 2–3) — desarrollo

| # | Tarea | Archivos a tocar |
|---|--------|------------------|
| 1 | **Stripe Checkout** + webhook → `activatePayment` | Nuevo `server/stripe.js`, `server/index.js`, `package.json` |
| 2 | **Email** al admin en contacto y pago “awaiting” | SMTP/Resend; `POST /api/contact`, checkout confirm |
| 3 | Forzar **max fotos por plan** (3/6/8) | `server/index.js`, multer, `publicar.html` |
| 4 | Borrar / reordenar fotos en mi-anuncio | `mi-anuncio.html`, `PATCH /api/my-ads` |
| 5 | Recuperación de PIN (SOP o email al admin) | Docs + opcional API |
| 6 | Resolver/cerrar reportes en admin | `admin.html`, `js/app.js` |

### C3. Crecimiento (mes 1)

| # | Tarea | Ref |
|---|--------|-----|
| 1 | 10–30 anuncios reales activos | Captación |
| 2 | Contenido blog + zonas (ritmo semanal) | `PLAN-TOP1-SEO-BENIDORM.md` |
| 3 | Checklist SEO | `seo-checklist.md` |
| 4 | Quitar enlace Admin del footer público | `index.html` |
| 5 | Iconos PWA PNG 192/512 | `img/`, `manifest.webmanifest` |
| 6 | CSP + CORS restringido al dominio | `server/index.js` |
| 7 | Si crece tráfico: valorar SQLite/Postgres | `server/db.js` |

**Criterio Fase C completa:** cobros sin simulación, aviso por email o SOP estable, ≥10 anuncios reales, SEO en marcha.

---

## Matriz de prioridad (qué hacer primero)

```
BLOQUEA LANZAMIENTO          →  A1 legales + PAY_* + B1 host + B2 mock off
BLOQUEA COBRAR BIEN          →  C1 SOP Bizum  o  C2 Stripe
MEJORA PRODUCTO              →  fotos delete, maxPhotos, reportes
CRECE TRÁFICO                →  SEO + anuncios reales
```

---

## Agentes / automatismos del propio proyecto

| Script / archivo | Uso |
|------------------|-----|
| `start.bat` | Arranque local 1 clic |
| `publicar-hoy.bat` | Túnel Cloudflare (internet temporal) |
| `npm run test:today` | Smoke 14 checks producto+pago |
| `npm run real:init` | Regenerar secrets + vaciar demos |
| `npm run db:reset` | Solo demos (dev) |
| `deploy/backup.sh` | Backup Linux |
| `backup.ps1` | Backup Windows |
| `HOY.md` | Guía del día |
| `GO-LIVE.md` | VPS definitivo |

---

## Definición de “100%” (cierre)

Marca solo cuando **todas** sean sí:

### Producto 100%
- [x] Listado, ficha, filtros, favoritos, comparar, zonas, blog  
- [x] Publicar multi-foto + PIN  
- [x] Mi anuncio (editar, renovar, pausar, borrar, upgrade)  
- [x] Planes Básico/VIP/TOP + checkout  
- [x] Admin anuncios/contactos/reportes/pagos  
- [ ] Datos legales y de cobro **reales** en `.env`  
- [ ] Al menos 1 anuncio real no-test  

### Producción 100%
- [ ] Dominio + HTTPS  
- [ ] Mock pay desactivado  
- [ ] Credentials file borrado del servidor  
- [ ] Backup automático  
- [ ] Health y sitemap en dominio real  

### Negocio 100%
- [ ] Procedimiento de activación de pagos (manual o Stripe)  
- [ ] Aviso de contactos/pagos (email o rutina diaria)  
- [ ] Captación continua de anunciantes  
- [ ] Search Console + primeras indexaciones  

---

## Plan autónomo por “sprints” (si dejas trabajar a la IA)

Si dices **“ejecuta fase A”** o **“ejecuta fase C2”**, se puede implementar en código sin bloqueos de negocio:

| Sprint IA | Contenido técnico (sin necesitar tu dominio) |
|-----------|-----------------------------------------------|
| **A-tech** | ✅ Hint admin, ENTREGA, maxPhotos por plan, borrar fotos, purge huérfanos, CORS, footer sin admin |
| **C2-stripe** | ✅ Checkout + webhook (`server/stripe.js`, STRIPE_*) |
| **C2-mail** | ✅ `server/mail.js` + nodemailer; PIN recovery; no-op sin SMTP |
| **C2-photos** | API borrar foto + UI mi-anuncio |
| **C3-sec** | CORS por SITE_URL, quitar admin del footer, PNG icons |

Lo que **solo puedes hacer tú** (no la IA):

1. Comprar dominio y VPS  
2. Rellenar NIF, IBAN, Bizum reales  
3. Contratar Stripe / buzón email  
4. Publicar anuncios reales de terceros  
5. Validar ToS del hosting adult  

---

## Orden recomendado HOY (checklist de 90 minutos)

1. [ ] `start.bat` + abrir http://localhost:3456  
2. [ ] Rellenar `.env` OPERATOR + PAY (aunque sea provisional)  
3. [ ] Reiniciar servidor  
4. [ ] `npm run test:today`  
5. [ ] Publicar 1 anuncio de prueba real (tu WhatsApp)  
6. [ ] Probar VIP + simular pago  
7. [ ] Guardar password admin y borrar `ADMIN-CREDENTIALS.txt`  
8. [ ] Si quieres URL pública hoy: `publicar-hoy.bat`  
9. [ ] Esta noche: leer `GO-LIVE.md` y decidir dominio/VPS  

---

## Referencias del repo

| Doc | Para qué |
|-----|----------|
| `HOY.md` | Usar la web hoy |
| `GO-LIVE.md` | Lanzamiento VPS |
| `DEPLOY.md` | Nginx/PM2/Docker |
| `PLAN-TOP1-SEO-BENIDORM.md` | Ranking local |
| `seo-checklist.md` | SEO operativo |
| `ENTREGA.md` | Mapa de entrega producto |
| `PLAN-ACCION-100.md` | **Este plan** |

---

**Conclusión:**  
La web **ya funciona al ~95% como producto local**. El “100%” real es **operación**: datos legales, cobro, hosting y anuncios reales. Sigue la Fase A hoy; Fase B cuando tengas dominio; Fase C para automatizar dinero y crecer.

*Última auditoría de código: 2026-07-28.*
