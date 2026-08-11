# Continue → Live tomorrow

## Status (code)

| Area | Ready? |
|------|--------|
| Daily plans €5/7/10 + trial 24h | YES |
| Register before publish | YES |
| SEO landings putas/scorts/escorts + EN/DE | YES |
| Clean URLs `/a/:id` + sitemap | YES |
| VPS one-shot install | YES (`deploy/install-vps.sh`) |
| Upload ZIP builder | YES (`go-live-pack.bat`) |
| Preflight | YES (`npm run preflight -- --local`) |

## Status (you)

| Area | Ready? |
|------|--------|
| Bizum / IBAN / legal in `.env` | NO (placeholders) |
| Domain | NO |
| VPS | NO |
| Permanent HTTPS | NO |

---

## Do this in order

### A — This PC (15 min)
1. `start.bat` — site on http://localhost:3456  
2. `fill-payments.bat` — real Bizum + name + NIF + email  
3. `deploy-ready.bat` — preflight + fresh ZIP  

### B — Buy (tonight)
1. Domain  
2. Ubuntu VPS (Hetzner / Contabo / OVH)  
3. DNS A `@` + `www` → VPS IP  

### C — Deploy (tomorrow, 1h)
```powershell
powershell -File deploy\print-commands.ps1 -Domain YOURDOMAIN.com -VpsIp YOUR.VPS.IP
```
Copy-paste the printed `scp` + VPS commands.

### D — After live
- Phone test on mobile data  
- Search Console + sitemap  
- Follow **`DAY1-OPS.md`**  

### E — Public URL without VPS (demo only)
- `publicar-hoy.bat` (Cloudflare) or `npm run tunnel` (localtunnel)

---

## Reply with

```
DOMAIN=example.com
VPS_IP=1.2.3.4
```

→ exact deploy commands customized for you.
