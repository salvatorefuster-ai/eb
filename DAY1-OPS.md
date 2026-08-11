# Day-1 operations (after go-live)

## Admin login
1. Open `https://YOURDOMAIN/admin.html`
2. User/password from server `.env`
3. Save password offline; delete `data/ADMIN-CREDENTIALS.txt` if present

## When an advertiser recharges credits (Bizum)
1. They buy credits on `/precios.html` (amount 1–1000 integer)
2. They get order code `EB-XXXX` and euro amount
3. They send Bizum with that concept
4. You: **Admin → Pagos → Activar créditos**
5. Their balance increases (with +20% if ≥50€, +50% if 1000€)
6. They spend credits on **Mi anuncio** (Día 5 / VIP 7 / TOP 10)

## If they only use trial
- First 24h free visibility after publish
- After that, ad leaves public list until they **spend credits**

## Daily checklist (5 min)
- [ ] Admin → pending payments (credit packs)
- [ ] Confirm real Bizum transfers → activate
- [ ] Admin → Usuarios / créditos (balances)
- [ ] Delete spam / fake ads
- [ ] Check reports
- [ ] Note recharges + ads visible today

## Invite advertisers (copy/paste)
```
Directorio solo Benidorm. Publica 24h de prueba, luego recarga créditos
(50€ → 60 créd. · 1000€ → 1500) y gasta 5/7/10 al día (Día/VIP/TOP).
Registro: https://YOURDOMAIN/registro.html
Precios: https://YOURDOMAIN/precios.html
```

## Restart / logs (VPS)
```bash
pm2 status
pm2 logs escort-benidorm --lines 50
pm2 restart escort-benidorm
```

## Backup (VPS)
```bash
bash deploy/backup.sh
```

## Emergency
| Problem | Fix |
|---------|-----|
| Site down | `pm2 restart` + nginx status |
| Wrong plan costs | `.env` PLAN_* + restart |
| Bonus rules | `CREDIT_BONUS_*` in credits.js / env |
| Mock pay in prod | `ALLOW_MOCK_PAY=0` |
| Lost admin pass | new `ADMIN_PASSWORD` in `.env` |
