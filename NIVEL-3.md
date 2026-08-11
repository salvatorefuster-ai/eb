# NIVEL 3 — Negocio real (sin tecnicismos)

La web ya está hecha. El **nivel 3** es:  
**datos tuyos + cobrar + anuncios de verdad + (si quieres) internet.**

---

## Paso 0 — Prepara esto encima de la mesa (5 minutos)

Escríbelo en un papel o tenlo en el móvil:

1. **Nombre** tuyo o de la empresa  
2. **NIF** o **CIF**  
3. **Email** donde quieres que te escriban  
4. **Dirección** fiscal (calle, código postal, ciudad)  
5. **Móvil de Bizum** (el que usas para cobrar)  
6. **IBAN** de tu cuenta bancaria  
7. **Nombre del titular** de esa cuenta  

Opcional (más adelante):
- Dominio (ej. `midominio.es`)  
- Servidor VPS  
- Cuenta Stripe (tarjeta)  
- Email SMTP del hosting  

---

## Paso 1 — Configurar la web con tus datos (10 minutos)

1. Abre la carpeta:  
   `C:\Users\salva\escort-benidorm`
2. Doble clic en **`nivel3.bat`**
3. Responde las preguntas y pulsa Enter en cada una  
4. Al final se crea/actualiza el archivo `.env`  
5. Se guarda la contraseña de admin en:  
   `data\ADMIN-CREDENTIALS.txt`  
6. **Copia esa contraseña** a un sitio seguro (Notas, gestor de contraseñas)  
7. Luego **borra** el archivo `ADMIN-CREDENTIALS.txt` (por seguridad)

---

## Paso 2 — Encender la web (1 minuto)

1. Doble clic en **`start.bat`**  
2. No cierres la ventana negra  
3. Abre en el navegador: **http://localhost:3456**

### Comprueba esto (checklist)

| Dónde | Qué debe pasar |
|-------|----------------|
| http://localhost:3456/aviso-legal.html | Tus nombre/NIF/email (sin aviso rojo de “pendiente”) |
| http://localhost:3456/privacidad.html | Lo mismo |
| http://localhost:3456/precios.html | Tu Bizum e IBAN abajo o en el texto de pago |
| http://localhost:3456/admin.html | Entras con usuario/contraseña del paso 1 |

Si algo sale mal: cierra la ventana negra, vuelve a `nivel3.bat` y revisa los datos.

---

## Paso 3 — Primer anuncio real (5 minutos)

1. Entra en **Publicar**: http://localhost:3456/publicar.html  
2. Sube **fotos reales**  
3. WhatsApp real + email de la cuenta  
4. Publica → tienes **24 h de prueba**  
5. **Copia el PIN**  

Prueba:
- http://localhost:3456/mi-anuncio.html  

---

## Paso 4 — Cómo cobras con créditos (lo más importante)

### Modelo
1. El anunciante **recarga créditos** en `/precios.html` (elige de **1 a 1000 €**, solo enteros)  
2. Bonus automático: **50–999 € → +20%** · **1000 € → +50%**  
3. Paga por Bizum/transferencia con código **`EB-XXXX`**  
4. Tú en Admin → **Pagos → Activar créditos**  
5. Ella en **Mi anuncio** gasta: Día **5** / VIP **7** / TOP **10** créditos por día  

### Lo que haces tú (5 minutos al día)

1. Revisa Bizum/banco con concepto `EB-…`  
2. Admin → **Pagos** → **Activar créditos**  
3. (Opcional) Admin → **Usuarios / créditos** para ver saldos  

> **No actives** si no has visto el dinero.

---

## Paso 5 — Rutina diaria de negocio (15 minutos)

Cada día, o cada dos días:

| Orden | Acción |
|-------|--------|
| 1 | Admin → **Pagos** → activar los que hayan pagado |
| 2 | Admin → **Mensajes** (contacto) → responder |
| 3 | Admin → **Reportes** → resolver o borrar basura |
| 4 | Admin → Anuncios → ocultar fakes / subir VIP de pago |
| 5 | Mirar que los anuncios nuevos tengan foto y WhatsApp reales |

---

## Paso 6 — Que la vea todo el mundo (internet)

Esto es **aparte** del nivel 3 de datos, pero lo necesitas para clientes reales fuera de tu casa:

1. Compras un **dominio** (ej. `escortbenidorm.es`)  
2. Alquilas un **servidor VPS** que acepte contenido adulto  
3. Sigues la guía **`GO-LIVE.md`** (o un técnico 1–2 h)  
4. En `nivel3.bat` pones la URL `https://tudominio.com`  
5. En el servidor: **pago simulado = NO**  

Atajo solo para enseñar (no para negocio 24/7): **`publicar-hoy.bat`**

---

## Paso 7 — Opcional (cuando ya cobres bien)

| Quieres… | Haces… |
|----------|--------|
| Cobrar con **tarjeta** | Cuenta Stripe → claves en `.env` (o otra vez `nivel3.bat`) |
| **Emails** automáticos | SMTP del hosting en `.env` |
| **Google Analytics** | Código `G-XXXX` en `.env` |

---

## Precios por defecto (los puedes cambiar en nivel3.bat)

| Plan | Precio | Qué da |
|------|--------|--------|
| Básico | 0 € | Listado normal |
| VIP | 29 € / 30 días | Más arriba, más fotos |
| TOP | 49 € / 30 días | Máxima prioridad + “Real” |

---

## Errores típicos (y solución tonta)

| Problema | Qué hacer |
|----------|-----------|
| “No abre la web” | `start.bat` y deja la ventana negra abierta |
| Aviso legal en rojo | Falta rellenar nombre/NIF/email → otra vez `nivel3.bat` |
| No veo mi Bizum en precios | Reinicia con `start.bat` tras guardar `.env` |
| Pagué y no soy VIP | Admin → Pagos → Activar (¿entró el Bizum?) |
| Perdí el PIN | Mi anuncio → “Olvidé el PIN” (con el email de gestión) o Admin |
| Olvidé la contraseña admin | `nivel3.bat` otra vez (genera/cambia) o mira `.env` |

---

## Checklist “ya estoy en nivel 3”

Marca con un bolígrafo:

- [ ] He corrido **`nivel3.bat`** con mis datos reales  
- [ ] Legal se ve bien (sin rojo)  
- [ ] Precios muestran mi Bizum/IBAN  
- [ ] Sé entrar en **Admin**  
- [ ] He publicado **1 anuncio real** y tengo el **PIN**  
- [ ] Sé activar un pago en Admin → Pagos  
- [ ] Contraseña admin guardada y `ADMIN-CREDENTIALS.txt` borrado  
- [ ] (Cuando toque) Dominio + servidor en internet  

---

## Orden del día de hoy (90 minutos)

1. **`nivel3.bat`** (datos)  
2. **`start.bat`** (encender)  
3. Revisar legal + precios  
4. Publicar 1 anuncio  
5. Simular o hacer un pago de prueba VIP  
6. Activar en Admin  
7. Leer otra vez la sección “Cómo cobras”  

---

**En una frase:**  
Nivel 3 = **tus datos en `nivel3.bat` + `start.bat` + cobrar con Bizum y activar en Admin + anuncios reales.**  
Internet público = dominio + VPS (`GO-LIVE.md`) cuando quieras.
