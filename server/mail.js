/**
 * Email opcional — solo si hay SMTP_* en .env
 * Requiere: npm i nodemailer (ya en package.json)
 */
async function sendMail({ subject, text, html, to: toOverride }) {
  const host = process.env.SMTP_HOST;
  const to = toOverride || process.env.SMTP_TO || process.env.OPERATOR_EMAIL || process.env.ADMIN_EMAIL;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || "noreply@localhost";
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!host || !to || String(to).includes("[RELLENAR")) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[mail:skip] ${subject} → (configura SMTP_HOST y SMTP_TO/OPERATOR_EMAIL)`);
    }
    return { ok: false, skipped: true };
  }

  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch {
    console.log(`[mail:no-nodemailer] ${subject}\n${text}`);
    return { ok: false, skipped: true, reason: "nodemailer missing" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
    await transporter.sendMail({
      from,
      to,
      subject: `[EscortBenidorm] ${subject}`,
      text,
      html: html || `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`,
    });
    return { ok: true };
  } catch (err) {
    console.error("[mail:error]", err.message);
    return { ok: false, error: err.message };
  }
}

function notifyContact({ email, subject, message }) {
  return sendMail({
    subject: `Contacto: ${subject}`,
    text: `De: ${email}\nAsunto: ${subject}\n\n${message}`,
  });
}

function notifyPaymentAwaiting(payment) {
  return sendMail({
    subject: `Pago pendiente ${payment.id} · ${payment.plan} ${payment.amount}€`,
    text: `Pedido: ${payment.id}\nPlan: ${payment.plan}\nImporte: ${payment.amount} ${payment.currency || "EUR"}\nDías: ${payment.days || 1}\nAnuncio: ${payment.adId}\nMétodo: ${payment.method || "—"}\n\nActiva en admin → Pagos.`,
  });
}

function notifyPaymentActivated(payment, ad) {
  const email = ad?.manageEmail;
  if (!email || !String(email).includes("@")) {
    return Promise.resolve({ ok: false, skipped: true });
  }
  const until = ad?.paidUntil || ad?.planExpiresAt || "";
  return sendMail({
    to: email,
    subject: `Pago activado · ${payment.plan} +${payment.days || 1}d`,
    text: `Tu pago ${payment.id} está activo.\n\nPlan: ${(payment.plan || "").toUpperCase()}\nImporte: ${payment.amount}€\nVisible hasta: ${until}\nAnuncio: ${ad?.name || payment.adId}\n\nGestiona: /mi-anuncio.html\nListado: /anuncios.html`,
  });
}

function notifyNewPublish({ ad, pin, payment }) {
  const lines = [
    `Nuevo anuncio publicado`,
    `Nombre: ${ad?.name}`,
    `ID: ${ad?.id}`,
    `Zona: ${ad?.zone || ad?.zoneSlug}`,
    `Plan pendiente: ${ad?.pendingPlan || ad?.plan || "—"}`,
    payment ? `Pedido: ${payment.id} · ${payment.amount}€` : "Sin pedido de pago (trial)",
    `Email: ${ad?.manageEmail || "—"}`,
    `Tel: ${ad?.phone || "—"}`,
  ];
  return sendMail({
    subject: `Nuevo anuncio · ${ad?.name || ad?.id}`,
    text: lines.join("\n"),
  });
}

function notifyOwnerPublished({ ad, pin, payment }) {
  const email = ad?.manageEmail;
  if (!email || !String(email).includes("@")) {
    return Promise.resolve({ ok: false, skipped: true });
  }
  const payLine = payment
    ? `\nPedido pendiente: ${payment.id} · ${payment.amount}€ · checkout /checkout.html?order=${payment.id}`
    : "\nTienes 24h de prueba visible. Luego paga el día (5/7/10€).";
  return sendMail({
    to: email,
    subject: `Anuncio publicado · PIN de gestión`,
    text: `Hola ${ad?.name || ""},\n\nTu anuncio en Benidorm ya está creado.\nID: ${ad?.id}\nPIN de gestión: ${pin}\nGuárdalo.${payLine}\n\nPanel: /mi-anuncio.html\nPrecios: /precios.html`,
  });
}

function notifyReport({ adId, reason, detail }) {
  return sendMail({
    subject: `Reporte anuncio ${adId}`,
    text: `Anuncio: ${adId}\nMotivo: ${reason}\nDetalle: ${detail || "—"}`,
  });
}

function notifyPinRecovery({ phone, ads, email }) {
  const lines = (ads || [])
    .map((a) => `- ${a.name} (${a.id}) · PIN: ${a.editPin} · zona: ${a.zone || a.zoneSlug}`)
    .join("\n");
  const text = `Solicitud recuperación PIN\nTeléfono: ${phone}\nEmail indicado: ${email || "—"}\n\nAnuncios:\n${lines || "(ninguno)"}`;
  return sendMail({
    subject: `Recuperación PIN · ${phone}`,
    text,
  });
}

function sendPinToOwner({ email, ads }) {
  if (!email) return Promise.resolve({ ok: false, skipped: true });
  const lines = (ads || [])
    .map((a) => `- ${a.name}: PIN ${a.editPin} · gestión: /mi-anuncio.html`)
    .join("\n");
  return sendMail({
    to: email,
    subject: "Tu PIN de gestión EscortBenidorm",
    text: `Has solicitado recuperar tu PIN.\n\n${lines}\n\nGuárdalo en un sitio seguro. Si no fuiste tú, contacta soporte.`,
  });
}

module.exports = {
  sendMail,
  notifyContact,
  notifyPaymentAwaiting,
  notifyPaymentActivated,
  notifyNewPublish,
  notifyOwnerPublished,
  notifyReport,
  notifyPinRecovery,
  sendPinToOwner,
};
