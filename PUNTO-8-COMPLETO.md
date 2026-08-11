# Punto 8 — Aclaración y cierre (qué falta / qué ya está completo)

Este documento **aclara el antiguo “punto 8”** del inventario y marca qué queda **cerrado en producto** vs **pendiente solo de tus datos/infra**.

---

## Resumen

| # | Tema | Estado producto (código) | Qué falta de tu lado |
|---|------|--------------------------|----------------------|
| 1 | **Stripe / tarjeta** | ✅ Completo (opcional) | Claves `STRIPE_*` en `.env` + webhook en prod |
| 2 | **Email** | ✅ Completo (opcional) | `SMTP_*` + email real |
| 3 | **Dominio + VPS + HTTPS** | ✅ Scripts/docs listos | Contratar dominio/VPS y seguir `GO-LIVE.md` |
| 4 | **Datos legales / cobro** | ✅ Pantallas leen `.env` | Rellenar `OPERATOR_*` y `PAY_*` |
| 5 | **Anuncios reales** | ✅ Flujo 100% | Publicar o captar anunciantes |
| 6 | **Recuperar PIN** | ✅ Completo | Usar email de gestión al publicar + SMTP |
| 7 | **Reordenar / borrar fotos** | ✅ Completo | — |
| 8 | **Analytics con cookies** | ✅ Completo (opcional) | `GA_MEASUREMENT_ID` en `.env` |
| 9 | **DB escalable** | ✅ Completo para este tamaño | Solo si creces mucho → Postgres después |

**Conclusión:** el **producto está completo**. Lo que no es “código” es **configuración y operación tuya** (llaves Stripe, SMTP, dominio, NIF, anuncios).

---

## Detalle de cada ítem

### 1. Stripe (tarjeta) — COMPLETO en código

**Qué hay:**
- Dependencia `stripe` instalada  
- `server/stripe.js` → crea Checkout Session  
- `POST /api/checkout/:id/confirm` con `method: "card"` → redirige a Stripe  
- `POST /api/stripe/webhook` → al pagar activa el plan  
- En checkout: opción “Tarjeta (Stripe)” solo si hay `STRIPE_SECRET_KEY`  

**Para activarlo (tú):**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=https://tudominio.com
```
Webhook Stripe apuntando a: `https://tudominio.com/api/stripe/webhook`  
Evento: `checkout.session.completed`

Sin claves: la opción no se ofrece o avisa; Bizum/mock siguen funcionando.

---

### 2. Email — COMPLETO en código

**Qué hay:**
- `nodemailer` en dependencias  
- `server/mail.js`  
- Avisos en: contacto, pago awaiting, reporte, recuperación PIN  

**Para activarlo (tú):**
```env
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@tudominio.com
SMTP_TO=tu@email.com
```

Sin SMTP: la web no falla; en local solo loguea “mail:skip”.

---

### 3. Dominio + VPS + HTTPS — COMPLETO en documentación / scripts

**Qué hay:** `GO-LIVE.md`, `DEPLOY.md`, `deploy/nginx.conf`, Docker, PM2, `start.bat`, `publicar-hoy.bat` (túnel temporal).

**Qué no puede el código:** comprar dominio ni VPS por ti.  
**Hecho =** seguir la guía cuando tengas cuenta de hosting.

---

### 4. Datos legales y de cobro — COMPLETO en producto

**Qué hay:** legal/privacidad leen `OPERATOR_*`; checkout/precios leen `PAY_*`.

**Tú rellenas en `.env`:** nombre, NIF, email, dirección, Bizum, IBAN.  
Hasta entonces verás placeholders o banner “pendiente”.

---

### 5. Anuncios reales — COMPLETO en flujo

**Qué hay:** publicar, listar, gestionar, planes. Catálogo vacío en REAL es intencional.

**Tú:** publicas el primero o captas anunciantes.  
Opcional demos: `npm run db:reset` (solo dev).

---

### 6. Recuperar PIN — COMPLETO

**Qué hay:**
- Campo opcional **Email de gestión** al publicar (`manageEmail`, no público)  
- En mi-anuncio: **¿Olvidé el PIN?**  
- `POST /api/pin-recovery`  
  - Si phone + email coinciden con `manageEmail` → email con PIN (si SMTP)  
  - Siempre se registra y se notifica al admin  

---

### 7. Fotos: borrar y reordenar — COMPLETO

**Qué hay:**
- × borrar foto  
- ↑ ↓ reordenar (portada = primera)  
- Límites 3 / 6 / 8 por plan  

---

### 8. Analytics con consentimiento — COMPLETO

**Qué hay:**
- Banner cookies: “Solo técnicas” vs “Aceptar”  
- Si aceptas todo y hay `GA_MEASUREMENT_ID` en `.env` → carga gtag  

```env
GA_MEASUREMENT_ID=G-XXXXXXXX
```

Sin ID: no se carga ningún tracker (cumplimiento OK).

---

### 9. Base de datos “escalable” — COMPLETO para este producto

**Qué hay:** JSON atómico (`db.json.tmp` + rename), suficiente para cientos/miles de anuncios en un VPS pequeño.

**Cuándo cambiar:** tráfico alto o multi-servidor → migrar a Postgres (fase posterior, no bloquea el 100% actual).

---

## Checklist “punto 8 cerrado”

### Código (ya hecho)
- [x] Stripe opcional  
- [x] Email opcional  
- [x] Docs deploy  
- [x] Legal/PAY desde env  
- [x] PIN recovery  
- [x] Reordenar + borrar fotos  
- [x] Analytics solo con consentimiento  
- [x] JSON DB estable para el tamaño del proyecto  

### Operación (solo tú, no es “falta de producto”)
- [ ] Rellenar `.env` real  
- [ ] Dominio + HTTPS  
- [ ] Claves Stripe (si quieres tarjeta)  
- [ ] SMTP (si quieres emails)  
- [ ] Primeros anuncios reales  
- [ ] En prod: quitar `ALLOW_MOCK_PAY`  

---

## Variables `.env` nuevas / relevantes

```env
# Stripe (opcional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Analytics (opcional, solo si el usuario acepta cookies)
GA_MEASUREMENT_ID=

# Email (opcional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SMTP_TO=
```

---

*Actualizado 2026-07-28 — el “punto 8 incompleto” pasa a “producto completo; falta configuración tuya”.*
