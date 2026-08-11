#!/usr/bin/env bash
# EscortBenidorm — one-shot VPS install (Ubuntu 22.04+)
# Usage (as root or with sudo):
#   DOMAIN=escortbenidorm.es bash deploy/install-vps.sh
# Optional:
#   APP_DIR=/var/www/escort-benidorm
#   EMAIL=admin@yourdomain.com   (for Let's Encrypt)

set -euo pipefail

DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-admin@${DOMAIN:-example.com}}"
APP_DIR="${APP_DIR:-/var/www/escort-benidorm}"
PORT="${PORT:-3456}"

if [[ -z "$DOMAIN" ]]; then
  echo "ERROR: set DOMAIN=yourdomain.com"
  echo "Example: DOMAIN=escortbenidorm.es EMAIL=you@mail.com bash deploy/install-vps.sh"
  exit 1
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Re-run as root: sudo DOMAIN=$DOMAIN bash deploy/install-vps.sh"
  exit 1
fi

echo "==> [1/8] System packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates gnupg nginx certbot python3-certbot-nginx ufw

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 18 ]]; then
  echo "==> Installing Node 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "==> [2/8] App directory: $APP_DIR"
mkdir -p "$APP_DIR"
if [[ ! -f "$APP_DIR/package.json" ]]; then
  echo "ERROR: project files not found in $APP_DIR"
  echo "Upload the project first, e.g.:"
  echo "  scp -r escort-benidorm-upload/* root@VPS_IP:$APP_DIR/"
  exit 1
fi

cd "$APP_DIR"
mkdir -p data uploads
chown -R www-data:www-data data uploads 2>/dev/null || true

echo "==> [3/8] npm install"
npm ci --omit=dev 2>/dev/null || npm install --omit=dev

echo "==> [4/8] .env"
if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
  else
    touch .env
  fi
  # generate secrets
  JWT=$(openssl rand -base64 48 | tr -d '\n')
  ADMIN_PASS=$(openssl rand -base64 18 | tr -d '\n' | tr '+/' 'Aa')
  sed -i "s|^SITE_URL=.*|SITE_URL=https://$DOMAIN|" .env || true
  grep -q '^SITE_URL=' .env || echo "SITE_URL=https://$DOMAIN" >> .env
  if grep -q '^JWT_SECRET=' .env; then
    sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$JWT|" .env
  else
    echo "JWT_SECRET=$JWT" >> .env
  fi
  if grep -q '^ADMIN_PASSWORD=' .env; then
    sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$ADMIN_PASS|" .env
  else
    echo "ADMIN_PASSWORD=$ADMIN_PASS" >> .env
  fi
  grep -q '^NODE_ENV=' .env || echo "NODE_ENV=production" >> .env
  grep -q '^REAL_MODE=' .env || echo "REAL_MODE=1" >> .env
  grep -q '^SEED_DEMOS=' .env || echo "SEED_DEMOS=0" >> .env
  grep -q '^PORT=' .env || echo "PORT=$PORT" >> .env
  grep -q '^ALLOW_MOCK_PAY=' .env || echo "ALLOW_MOCK_PAY=0" >> .env
  echo ""
  echo ">>> ADMIN PASSWORD (save now): $ADMIN_PASS"
  echo ">>> Edit .env for Bizum/IBAN/operator: nano $APP_DIR/.env"
  echo ""
else
  # force public URL
  if grep -q '^SITE_URL=' .env; then
    sed -i "s|^SITE_URL=.*|SITE_URL=https://$DOMAIN|" .env
  else
    echo "SITE_URL=https://$DOMAIN" >> .env
  fi
fi

echo "==> [5/8] PM2"
npm i -g pm2
pm2 delete escort-benidorm 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

echo "==> [6/8] Nginx"
NGINX_SITE="/etc/nginx/sites-available/escortbenidorm"
cat > "$NGINX_SITE" <<EOF
upstream escort_benidorm {
  server 127.0.0.1:${PORT};
  keepalive 32;
}

server {
  listen 80;
  listen [::]:80;
  server_name ${DOMAIN} www.${DOMAIN};

  client_max_body_size 8M;

  location / {
    proxy_pass http://escort_benidorm;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Connection "";
    proxy_read_timeout 60s;
  }
}
EOF

ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/escortbenidorm
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> [7/8] Firewall"
ufw allow OpenSSH || true
ufw allow 'Nginx Full' || true
ufw --force enable || true

echo "==> [8/8] HTTPS (Let's Encrypt)"
if certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect; then
  echo "HTTPS OK"
else
  echo "WARN: certbot failed (DNS not ready?). Site may work on HTTP only for now."
  echo "Retry later: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# remove credentials file if uploaded by mistake
rm -f "$APP_DIR/data/ADMIN-CREDENTIALS.txt" 2>/dev/null || true

echo ""
echo "=============================================="
echo "  LIVE: https://$DOMAIN"
echo "  Admin: https://$DOMAIN/admin.html"
echo "  Health: https://$DOMAIN/api/health"
echo "  Edit payments: nano $APP_DIR/.env && pm2 restart escort-benidorm"
echo "=============================================="
