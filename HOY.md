# EscortBenidorm — Funcionando HOY

## En 60 segundos

1. Doble clic **`start.bat`**  
2. http://localhost:3456  
3. Admin: http://localhost:3456/admin.html  

### Qué puedes hacer ya

| Acción | URL |
|--------|-----|
| Ver web | http://localhost:3456 |
| Registro | /registro.html |
| Publicar (24h prueba) | /publicar.html |
| **Recargar créditos** | /precios.html |
| Gastar en plan | /mi-anuncio.html |
| Admin | /admin.html |

**Pago local:** checkout → **Simular pago** (`ALLOW_MOCK_PAY=1`).

### Flujo dinero (créditos)

```
Registro → Publicar (24h gratis)
→ Precios: elige 1–1000 € (enteros)
   · 50–999 → +20% créditos
   · 1000 → +50%
→ Checkout Bizum/mock
→ Mi anuncio: gastar 5/7/10 créd./día
```

---

## Checklist del día

- [ ] `start.bat` abre la home  
- [ ] Registro + publicar → PIN  
- [ ] Recargar 50 € → 60 créditos (mock)  
- [ ] Gastar VIP (7) en Mi anuncio  
- [ ] Admin → Pagos / Usuarios·créditos  
- [ ] Completar `.env`: OPERATOR_*, PAY_*  

Tests: `npm run test:today` · `npm run test:credits`

---

## Internet temporal / definitivo

- Temporal: `publicar-hoy.bat` o `npm run tunnel`  
- Definitivo: **`LIVE-TOMORROW.md`** · `fill-payments.bat` · VPS  

Ops: **`DAY1-OPS.md`**

---

## Si algo falla

| Problema | Solución |
|----------|----------|
| Puerto ocupado | Cierra otros `npm start` |
| Secretos débiles | `npm run real:init -- --force` |
| Sin anuncios | Normal en modo real; publica uno |
| Admin no entra | `data/ADMIN-CREDENTIALS.txt` |
