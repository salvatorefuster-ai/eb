# Auditoría 100% — EscortBenidorm

**Fecha:** 2026-08-11 · **Actualizado post-P1/P2:** mismo día  
**Alcance:** código, páginas HTML, API, negocio (créditos), SEO, docs, seguridad, operación.  
**Tests de referencia:** `test:credits` · `test:today` (flujo créditos) · `test:auth` · preflight local.

### Cambios post-auditoría (ya hechos)
- Docs ENTREGA/HOY/NIVEL-3/README/DAY1 alineadas a créditos  
- Privacidad con cuenta/créditos/pagos  
- Checkout de plan legacy **desactivado**  
- Publicar sin pedido de plan; solo trial + CTA recarga  
- Historial de créditos en Mi anuncio  
- Blog `creditos-anunciantes-benidorm.html`

---

## 1. Veredicto global

| Dimensión | Nota | Estado |
|-----------|------|--------|
| Producto funcional (local) | **9/10** | Flujos core verdes |
| Modelo de negocio (créditos) | **8.5/10** | Implementado y testeado |
| UI coherente con el modelo | **7/10** | Precios/mi-anuncio OK; docs viejas |
| SEO / landings | **7.5/10** | Estructura lista; sin dominio |
| Legal / cumplimiento | **5/10** | Plantillas OK; datos vacíos |
| Seguridad producción | **5.5/10** | Mock pay on; credentials file |
| Documentación | **4/10** | Muchas guías desactualizadas |
| Listo para cobrar en internet | **3/10** | Falta Bizum, dominio, VPS |

**Resumen:** el **software de producto está ~90% listo para operar en local**.  
El **negocio en producción está ~25%**: datos reales + hosting + anunciantes.

---

## 2. Inventario de contenido

### 2.1 Páginas HTML (usuario)

| Archivo | Rol | Estado contenido |
|---------|-----|------------------|
| `index.html` | Home | OK · CTA 24h · putas/scorts footer |
| `anuncios.html` | Listado | OK · SEO putas/scorts · filtros |
| `anuncio.html` | Ficha | OK · rutas absolutas `/a/` fijas |
| `publicar.html` | Alta | OK · trial + créditos en copy |
| `precios.html` | Recarga 1–1000 + servicios | OK · bonus 20%/50% |
| `checkout.html` | Pago packs/pedidos | OK · packs créditos |
| `mi-anuncio.html` | Panel anunciante | OK · gastar créditos |
| `registro.html` / `login.html` | Auth | OK |
| `admin.html` | Moderación + créditos | OK · tab usuarios |
| `putas/scorts/escorts-benidorm.html` | SEO money | OK · JSON-LD |
| `en/benidorm-escorts.html` · `de/escort-benidorm.html` | SEO multi | OK |
| `zonas.html` + 6 zonas | SEO local | OK · KW putas |
| `blog/*` (4) | Contenido long-tail | OK · copy daily/créditos parcial |
| `favoritos.html` · `comparar.html` | UX local | OK |
| `contacto.html` | Soporte | OK · opción Bizum |
| `aviso-legal.html` · `privacidad.html` | Legal | Plantilla · **sin OPERATOR_*** |
| `offline.html` | PWA | OK |
| `en/index|listing|listings.html` | Redirects lang | OK (redirects) |

### 2.2 Backend (`server/`)

| Módulo | Función | Estado |
|--------|---------|--------|
| `index.js` | Express API + estáticos + `/a/` | OK ~50 rutas |
| `db.js` | JSON DB, users, credits ledger | OK |
| `plans.js` | Día 5 / VIP 7 / TOP 10 | OK |
| `credits.js` | Recarga 1–1000, bonus, enteros | OK |
| `mail.js` | SMTP opcional | OK (skip sin config) |
| `stripe.js` | Tarjeta opcional | OK si hay keys |
| `e2e-*.js` | Smoke tests | OK |
| `setup-real.js` / `setup-nivel3.js` | Init | **nivel3 desfasado (29/49)** |

### 2.3 JS cliente

| Archivo | Estado |
|---------|--------|
| `api.js` | OK JWT user/admin |
| `app.js` | OK (grande ~125k) · créditos, admin, /a/ |
| `i18n.js` | 11 idiomas · CTA “24h” actualizado |
| `icons.js` · `styles.css` | OK |

### 2.4 Deploy / ops

| Artefacto | Estado |
|-----------|--------|
| `deploy/install-vps.sh` · `nginx.conf` | OK |
| `go-live-pack.bat` · `LIVE-TOMORROW.md` | OK |
| `Dockerfile` · `pm2` | OK |
| `ADMIN-CREDENTIALS.txt` | **Presente — riesgo** |
| `.env` PAY/OPERATOR | **Placeholders** |

---

## 3. Modelo de negocio (auditoría lógica)

### Flujo canónico actual

```
Registro → Publicar (trial 24h gratis)
        → Recargar créditos (1–1000 € enteros)
            · 1–49: sin bonus
            · 50–999: +20%
            · 1000: +50%
        → Gastar en Día(5) / VIP(7) / TOP(10)
        → visible mientras paidUntil vigente
```

### Coherencia código ↔ UI

| Pieza | ¿Alineado? |
|-------|------------|
| `credits.js` reglas bonus | Sí |
| `precios.html` input 1–1000 | Sí |
| `mi-anuncio` gastar créditos | Sí |
| Checkout recarga | Sí |
| Admin grant + ledger | Sí |
| Publicar aún crea `payment` de plan TOP legacy | **Parcial** (fallback OK) |
| Docs ENTREGA/NIVEL-3/HOY “gratis / 29€” | **No** |

### Riesgos de negocio

1. **Dual path:** aún existe `POST /api/checkout` de plan directo (legacy). Puede saltarse la narrativa “solo créditos” si alguien usa ese endpoint.  
2. **Trial 24h** sigue dando visibilidad sin gastar créditos (diseño consciente).  
3. **1 crédito = 1 €** de servicio; packs de 1000 con +50% abaratan TOP (1500 créd / 10 = 150 días TOP por 1000€ → ~6,7€/día efectivo).

---

## 4. API — cobertura

### Auth y anunciantes
- register / login / me  
- publish (auth) multi-foto  
- my-ads CRUD, bump, photos  

### Créditos
- packs, preview, me, checkout, spend  
- admin users, grant  

### Pagos
- checkout plan (legacy) + confirm mock/bizum/stripe  
- admin activate / purge  

### Público
- ads list/filter, ad by id, stats, plans, sitemap, robots  

### Admin
- ads, contacts, reports, payments, expire, pin-recoveries  

**Huecos menores:**  
- No hay endpoint “historial de créditos” en UI de anunciante (solo admin ledger).  
- No hay reembolso de créditos self-service.  
- Stripe metadata ok para créditos.

---

## 5. SEO / contenido marketing

### Bien
- Landings putas / scorts / escorts + EN/DE  
- Zonas con KW y enlaces cruzados  
- `/a/:id` + absolute assets  
- Sitemap dinámico con money URLs  
- Schema CollectionPage / ProfilePage  

### Mejorable
- Blog `seo-anunciantes` no detalla recarga 1–1000 / bonus 50%.  
- `AUDITORIA-TOP1` y `PLAN-*` describen modelo **mensual 29/49** (obsoleto).  
- Indexación real = 0 sin dominio.  
- SafeSearch / adult: límite externo inevitable.

### Keywords objetivo vs páginas

| KW | Página |
|----|--------|
| putas benidorm | `putas-benidorm.html` |
| scorts benidorm | `scorts-benidorm.html` |
| escorts benidorm | `escorts-benidorm.html` + home |
| escorts levante… | `zonas/levante.html` |
| precios / anunciarse | `precios.html` |

---

## 6. Legal y privacidad

| Requisito | Estado |
|-----------|--------|
| Aviso legal estructura | OK |
| Privacidad RGPD estructura | OK |
| Datos OPERATOR_* rellenos | **FAIL** placeholders |
| Banner legal incompleto | Código listo (rojo si vacío) |
| Mención de **saldo/créditos/pagos** en privacidad | **Ausente** (debe listar: email cuenta, pagos, ledger) |
| Cookies | OK (banner + analytics opt-in) |
| Age gate +18 | OK |

---

## 7. Seguridad

| Control | Estado |
|---------|--------|
| JWT admin + user | OK |
| Rate limits | OK |
| Headers X-Frame / nosniff | OK |
| REAL_MODE / sin demos seed | OK |
| `ALLOW_MOCK_PAY=1` | **WARN** (solo local) |
| `data/ADMIN-CREDENTIALS.txt` | **WARN** borrar en prod |
| Passwords hashed scrypt | OK |
| PIN en plain en DB | Aceptable para demo; prod valorar hash |
| Uploads size limit 5MB | OK |
| CORS restringido | OK |

---

## 8. Tests y calidad

| Suite | Resultado |
|-------|-----------|
| `npm run test:credits` | **19/19** |
| `npm run test:today` | **35/35** |
| `npm run test:auth` | **OK** |
| Preflight local | **19 OK · 8 WARN · 0 FAIL** |

### Preflight WARN (bloquean “readyForPublic”)
1. OPERATOR_NAME / EMAIL / NIF  
2. PAY_BIZUM / IBAN / HOLDER  
3. ALLOW_MOCK_PAY=1  
4. ADMIN-CREDENTIALS.txt presente  
5. SITE_URL no https de dominio real  

---

## 9. Documentación (estado)

| Doc | Alineado con créditos 1–1000? |
|-----|-------------------------------|
| `precios.html` / código | Sí |
| `LIVE-TOMORROW.md` / deploy | Sí (infra) |
| `DAY1-OPS.md` | Parcial (habla de planes, no recarga libre) |
| `ENTREGA.md` | **No** (“publicar gratis”, planes Básico/VIP) |
| `NIVEL-3.md` | **No** (29/49 € mes) |
| `HOY.md` | **No** (“publicar gratis”) |
| `AUDITORIA-TOP1-NEGOCIO.md` | Histórica; actualizada a medias |
| `README.md` | Parcial (no menciona créditos) |
| `setup-nivel3.js` | **No** (pregunta VIP 29 / TOP 49) |

---

## 10. Bugs / deuda conocida (priorizada)

### P0 — bloquean producción real
1. Rellenar OPERATOR_* y PAY_*  
2. Dominio + HTTPS + VPS  
3. `ALLOW_MOCK_PAY=0`  
4. Eliminar ADMIN-CREDENTIALS del servidor  

### P1 — producto / coherencia
5. Actualizar docs ENTREGA / NIVEL-3 / HOY / README al modelo créditos  
6. Privacidad: añadir “cuenta, créditos, pedidos de recarga”  
7. Opcional: desactivar checkout de plan legacy o forzar solo créditos  
8. Historial de créditos en “Mi anuncio” (hoy solo admin)  

### P2 — SEO / polish
9. Blog post “cómo funcionan los créditos”  
10. Hreflang en putas/scorts  
11. Regenerar ZIP deploy tras cambios  

### P3 — nice to have
12. Stripe tested end-to-end con packs  
13. Email al usuario al recargar créditos  
14. Hash de PIN  

---

## 11. Checklist de aceptación por flujo

| Flujo | ¿Funciona en tests/código? |
|-------|----------------------------|
| Registro email+tel | Sí |
| Publicar sin login → 401 | Sí |
| Publicar + trial 24h visible | Sí |
| Recarga amount 1–1000 entero | Sí |
| Rechazo decimales / 0 / 1001 | Sí |
| Bonus 50→60, 1000→1500 | Sí |
| Gastar VIP 7 créd. | Sí |
| Listado filtra no pagados | Sí |
| URL `/a/:id` + CSS/JS | Sí (fix base) |
| Admin activar pago / créditos | Sí |
| Admin grant créditos | Sí |
| SEO landings 200 | Sí |
| Go-live sin datos .env | **No** |

---

## 12. Score “100% contenido”

| Capa | Completitud |
|------|-------------|
| Código producto | **~92%** |
| Contenido UI alineado | **~85%** |
| Contenido SEO landings | **~80%** |
| Legal rellenable | **~40%** (plantilla sí, datos no) |
| Docs operativas al día | **~45%** |
| Infra / go-live | **~20%** |
| **Promedio ponderado “negocio en marcha”** | **~55%** |

El **código y la web usable** superan el 90%.  
El **paquete completo negocio+legal+internet** ronda el **55%** hasta rellenar `.env` y desplegar.

---

## 13. Recomendación inmediata (orden)

1. `fill-payments.bat` → Bizum + legal  
2. Actualizar 4 docs basura (ENTREGA, NIVEL-3, HOY, README) o archivarlos  
3. Añadir créditos a privacidad (1 párrafo)  
4. Pack + VPS (`go-live-pack.bat` + `install-vps.sh`)  
5. Search Console + 3 anunciantes reales  

---

*Auditoría automática + revisión estática del repo EscortBenidorm. No sustituye asesoría legal ni auditoría de pentest.*
