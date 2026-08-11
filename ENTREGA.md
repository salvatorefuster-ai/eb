# Entrega — EscortBenidorm

**Actualizado:** 2026-08-11  
**Estado:** Producto local operativo · modelo **créditos** · listo para rellenar `.env` y desplegar.

---

## Arrancar

```bat
cd C:\Users\salva\escort-benidorm
start.bat
```

→ http://localhost:3456

| Rol | Acceso |
|-----|--------|
| Admin | `/admin.html` · `.env` / `data/ADMIN-CREDENTIALS.txt` |
| Anunciante | `/registro.html` → `/publicar.html` → `/precios.html` |
| Live mañana | `LIVE-TOMORROW.md` · `go-live-pack.bat` |

---

## Modelo de negocio (actual)

1. **Registro** (email + teléfono)  
2. **Publicar** → **24 h de prueba** visible  
3. **Recargar créditos** (1–1000 €, solo enteros)  
   - 1–49: sin bonus  
   - 50–999: **+20%**  
   - 1000: **+50%**  
4. **Gastar créditos** en Día (5) / VIP (7) / TOP (10) por día  
5. Sin créditos activos → **sale del listado**  

Pagas packs con Bizum/transferencia (código **EB-XXXX**) o mock en local.

---

## Mapa de la web

| URL | Función |
|-----|---------|
| `/` | Home |
| `/anuncios.html` | Listado |
| `/a/:id` | Ficha SEO limpia |
| `/publicar.html` | Alta + multi-foto |
| `/precios.html` | Recarga créditos + costes servicios |
| `/checkout.html?order=` | Pago de recarga |
| `/mi-anuncio.html` | Gestionar + gastar créditos + historial |
| `/putas-benidorm.html` etc. | SEO |
| `/admin.html` | Moderación, pagos, usuarios/créditos |

---

## Comandos

| Comando | Efecto |
|---------|--------|
| `npm start` / `start.bat` | Servidor |
| `npm run test:today` | Smoke producto |
| `npm run test:credits` | Smoke créditos |
| `npm run preflight -- --local` | Checklist local |
| `npm run pack` | ZIP para VPS |

---

## Checklist negocio (tú)

- [ ] `.env` OPERATOR_* y PAY_* reales  
- [ ] Dominio + VPS HTTPS  
- [ ] `ALLOW_MOCK_PAY=0` en prod  
- [ ] Borrar `ADMIN-CREDENTIALS.txt`  
- [ ] Anuncios reales + Search Console  

Ver **`AUDITORIA-100-COMPLETA.md`** y **`LIVE-TOMORROW.md`**.
