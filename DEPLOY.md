# Despliegue EscortBenidorm (VPS)

Guía práctica para poner la web en internet.

> **Checklist completa de lanzamiento:** ver **`GO-LIVE.md`**  
> **Activar modo real en local:** `npm run real:init`

---

## 1. Requisitos

- VPS Linux (Ubuntu 22.04+) **que permita contenido adult**
- Dominio apuntando al VPS (A record)
- Node.js 18+
- (Recomendado) Cloudflare delante, con SSL

---

## 2. Subir código

```bash
# En el VPS
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

git clone <tu-repo> escort-benidorm
# o sube la carpeta por scp/sftp
cd escort-benidorm
npm install --production
```

---

## 3. Variables de entorno

```bash
cp .env.example .env
nano .env
```

```env
PORT=3456
JWT_SECRET=genera-una-cadena-larga-aleatoria
ADMIN_USER=admin
ADMIN_PASSWORD=cambia-esto-ya
SITE_URL=https://tudominio.com
```

---

## 4. PM2 (proceso permanente)

```bash
sudo npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Docker (alternativa)

```bash
docker compose up -d --build
```

Datos persistentes en `./data` y `./uploads`.

---

## 5. Nginx + HTTPS (ejemplo)

```nginx
server {
  listen 80;
  server_name tudominio.com www.tudominio.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name tudominio.com www.tudominio.com;

  # ssl_certificate ... (certbot)

  client_max_body_size 8M;

  location / {
    proxy_pass http://127.0.0.1:3456;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
sudo systemctl reload nginx
```

---

## 6. Post-despliegue

1. Abre `https://tudominio.com` y prueba publicar + admin  
2. Cambia contraseña admin  
3. Google Search Console → propiedad dominio → envía `https://tudominio.com/sitemap.xml`  
4. Completa aviso legal / privacidad con NIF real  
5. Backup diario: copia `data/` y `uploads/` (o cron + `backup.ps1` adaptado a bash)

### Cron backup (Linux)

```bash
0 3 * * * tar -czf /home/backup/eb-$(date +\%F).tgz -C /ruta/escort-benidorm data uploads .env
```

---

## 7. Checklist go-live

- [ ] HTTPS OK  
- [ ] Admin con password fuerte  
- [ ] Anuncios demo borrados o ocultos  
- [ ] Formulario contacto funciona  
- [ ] Sitemap accesible  
- [ ] Age gate + cookies  
- [ ] Hosting permite adult  

---

## Hosting adult-friendly (orientativo)

Evita free tiers genéricos (Vercel/Netlify free a menudo prohíben adult).  
Opciones habituales: VPS propios (Hetzner, Contabo, OVH) con tu propia config.

---

*EscortBenidorm · Deploy guide*
