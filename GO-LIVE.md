# Go-live — poner EscortBenidorm en internet de verdad

> **Speedrun “live tomorrow” (EN):** see **`LIVE-TOMORROW.md`**  
> Package for VPS: double-click **`go-live-pack.bat`** or `npm run pack`  
> One-shot VPS: `DOMAIN=tudominio.com bash deploy/install-vps.sh`  
> Checklist: `npm run preflight`

## 0. En este PC (ya hecho con `npm run real:init`)

- [x] `.env` en modo producción / REAL  
- [x] Secretos fuertes (JWT + admin)  
- [x] Catálogo vacío (sin demos)  
- [ ] Completar `OPERATOR_*` en `.env` (nombre, NIF, email, dirección)  
- [ ] Guardar contraseña admin y **borrar** `data/ADMIN-CREDENTIALS.txt`  

```bash
npm run real:init -- --force --domain=https://www.TU-DOMINIO.com
# edita .env con tus datos legales
npm start
```

---

## 1. Lo que NECESITAS comprar / contratar

| Qué | Notas |
|-----|--------|
| **Dominio** | Ej. `escortbenidorm.es` (cualquier registrador) |
| **VPS Linux** | Ubuntu 22.04, **adult-friendly** (Hetzner, Contabo, OVH, etc.). Evita free tiers que prohíben adult. |
| **DNS** | Registro A → IP del VPS (y www) |

Presupuesto orientativo: 5–15 €/mes VPS + ~10 €/año dominio.

---

## 2. En el VPS (15–30 min)

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Código (scp, rsync o git)
cd /var/www
# sube la carpeta escort-benidorm (sin node_modules)
cd escort-benidorm
npm ci --omit=dev

# Config
cp .env.example .env   # o sube tu .env ya generado
nano .env              # SITE_URL=https://tudominio.com + OPERATOR_* + secrets

# Proceso
sudo npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Nginx + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/escortbenidorm
sudo nano /etc/nginx/sites-available/escortbenidorm   # cambia el dominio
sudo ln -sf /etc/nginx/sites-available/escortbenidorm /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

### Docker (alternativa)

```bash
docker compose up -d --build
```

---

## 3. Checklist el día del lanzamiento

- [ ] `https://tudominio.com` carga con candado  
- [ ] Age gate +18  
- [ ] `/publicar.html` crea anuncio real y muestra PIN  
- [ ] `/mi-anuncio.html` edita con PIN  
- [ ] `/admin.html` login con password fuerte  
- [ ] Sin anuncios demo  
- [ ] Aviso legal / privacidad con NIF real (sin banner rojo)  
- [ ] `/sitemap.xml` OK  
- [ ] Search Console → enviar sitemap  
- [ ] Backup cron: `deploy/backup.sh`  
- [ ] Borrado `ADMIN-CREDENTIALS.txt` del servidor  

---

## 4. Primeros anuncios reales

1. Comparte el link de **Publicar** a anunciantes reales  
2. O crea tú un anuncio de prueba con tu WhatsApp y el PIN  
3. En admin: VIP / online / borrar fakes  

---

## 5. SEO (después de indexar)

Ver `PLAN-TOP1-SEO-BENIDORM.md` y `seo-checklist.md`.

---

## Comandos útiles

| Comando | Uso |
|---------|-----|
| `npm run real:init` | Modo real + vaciar demos + secrets |
| `npm run real:init -- --with-demos` | Secrets sin borrar demos |
| `npm run db:reset` | Solo demos (dev) |
| `npm start` / `npm run pm2` | Arrancar |
| `npm test` | Smoke (con servidor up; catálogo puede estar vacío) |

---

**Importante:** el hosting debe permitir contenido adulto. Lee los ToS antes de pagar.
