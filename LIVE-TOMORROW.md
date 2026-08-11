# LIVE TOMORROW — Speedrun (EscortBenidorm)

**Goal:** `https://YOURDOMAIN` online, charging €5/€7/€10 per day.  
**Code status:** ready. **You still need:** domain + VPS + payment details.

---

## Super-short path

| Step | Action |
|------|--------|
| 1 | Buy domain + VPS (Hetzner/Contabo/OVH) |
| 2 | Double-click **`fill-payments.bat`** → enter Bizum/IBAN/legal |
| 3 | Double-click **`go-live-pack.bat`** → zip ready |
| 4 | DNS A records → VPS IP |
| 5 | `scp` zip → VPS → `DOMAIN=… bash deploy/install-vps.sh` |
| 6 | Phone test + Search Console |

Ops after live: **`DAY1-OPS.md`**  
Env helper: `npm run env:set KEY=value` · list: `npm run env:list`  
Local check: `npm run preflight -- --local`

---

## Tonight (before sleep) — 30–45 min

### 1) Buy these two things

| Item | Where | Notes |
|------|--------|--------|
| **Domain** | Namecheap / Cloudflare / DonDominio | e.g. `escortbenidorm.es` |
| **VPS Ubuntu 22.04** | **Hetzner / Contabo / OVH** | Adult-friendly. ~€5–12/mo. 1 vCPU, 2 GB RAM enough |

Avoid: free tiers that ban adult content (many “hobby” hosts).

### 2) DNS (at domain registrar)

| Type | Name | Value |
|------|------|--------|
| A | `@` | VPS public IP |
| A | `www` | VPS public IP |

DNS can take 5–60 minutes (sometimes longer).

### 3) Fill payment + legal data on this PC

Edit `C:\Users\salva\escort-benidorm\.env`:

```env
OPERATOR_NAME=Your Name or Company
OPERATOR_NIF=Your NIF/CIF
OPERATOR_EMAIL=you@email.com
OPERATOR_ADDRESS=Street, Benidorm, Spain
PAY_BIZUM=6XXXXXXXX
PAY_IBAN=ES...
PAY_HOLDER=Account holder name
ALLOW_MOCK_PAY=0
```

Save. You’ll copy the same values onto the server.

### 4) Build the upload package (this PC)

```powershell
cd C:\Users\salva\escort-benidorm
powershell -ExecutionPolicy Bypass -File deploy\package-upload.ps1
```

Creates: `backups\escort-benidorm-upload-YYYYMMDD-HHMM.zip`

---

## Tomorrow morning — 45–90 min on the VPS

### A) Upload code

From **Windows PowerShell** (replace IP and zip name):

```powershell
scp C:\Users\salva\escort-benidorm\backups\escort-benidorm-upload-XXXX.zip root@VPS_IP:/tmp/eb.zip
```

On **VPS** (SSH):

```bash
apt-get update -y && apt-get install -y unzip
mkdir -p /var/www/escort-benidorm
unzip -o /tmp/eb.zip -d /var/www/escort-benidorm
cd /var/www/escort-benidorm
```

### B) One-command install

```bash
DOMAIN=yourdomain.com EMAIL=you@email.com bash deploy/install-vps.sh
```

This installs Node, Nginx, PM2, firewall, HTTPS (Let’s Encrypt).

### C) Put real Bizum / legal on the server

```bash
nano /var/www/escort-benidorm/.env
# paste PAY_* and OPERATOR_*
# SITE_URL=https://yourdomain.com
# ALLOW_MOCK_PAY=0
pm2 restart escort-benidorm
```

### D) Smoke test (phone on mobile data)

- https://yourdomain.com  
- https://yourdomain.com/precios.html → €5 / €7 / €10  
- https://yourdomain.com/api/health  
- https://yourdomain.com/admin.html → login  
- Register → Publish (24h trial) → recarga créditos (1–1000) → gastar Día/VIP/TOP  

### E) Google (10 min)

1. [Search Console](https://search.google.com/search-console) → add domain  
2. Submit sitemap: `https://yourdomain.com/sitemap.xml`  
3. Request index for `/putas-benidorm.html` and `/scorts-benidorm.html`

---

## Checklist — “we are live”

- [ ] HTTPS padlock works  
- [ ] No demo ads  
- [ ] Bizum/IBAN real on `/precios.html`  
- [ ] `ALLOW_MOCK_PAY=0`  
- [ ] Admin password saved; `ADMIN-CREDENTIALS.txt` deleted on server  
- [ ] First real advertiser invited  

---

## Commands cheat sheet

| Where | Command |
|-------|---------|
| Package zip (PC) | `deploy\package-upload.ps1` |
| Preflight (PC or server) | `npm run preflight` |
| Install (VPS) | `DOMAIN=x.com bash deploy/install-vps.sh` |
| Restart app | `pm2 restart escort-benidorm` |
| Logs | `pm2 logs escort-benidorm` |
| Temporary public URL from PC | `npm start` then `npm run tunnel` |

---

## If DNS is not ready yet

1. `npm start` on this PC  
2. `npm run tunnel` → temporary public HTTPS URL for testing  
3. Still finish VPS + real domain for production  

---

## What only YOU can do (I cannot)

1. Buy domain  
2. Buy VPS / give SSH access  
3. Fill real Bizum, IBAN, legal identity  

Once you have **domain + VPS IP + root password**, paste them here (or SSH) and we finish the install together.
