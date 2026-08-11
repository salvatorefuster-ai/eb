/**
 * Planes DIARIOS — EscortBenidorm
 * Modelo: 5 / 7 / 10 € al día. Sin free eterno (solo prueba 24h al publicar).
 */

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

const PLANS = {
  // trial interno — no se vende; al publicar se da 24h
  free: {
    id: "free",
    name: "Prueba 24h",
    tagline: "Solo el primer día gratis",
    price: 0,
    currency: "EUR",
    period: "trial",
    periodLabel: "24 h al publicar",
    featured: false,
    verified: false,
    bumpsPerDay: 1,
    maxPhotos: 3,
    highlight: false,
    sellable: false,
    features: [
      "24 horas de prueba al publicar",
      "Después debes pagar el día para salir en el listado",
      "Hasta 3 fotos",
    ],
    cta: "Probar 24h",
  },
  // 5 €/día — listado estándar de pago
  basic: {
    id: "basic",
    name: "Día",
    tagline: "Visible hoy en Benidorm",
    price: num(process.env.PLAN_DAY_PRICE, num(process.env.PLAN_BASIC_PRICE, 5)),
    currency: "EUR",
    period: "1d",
    periodLabel: "/ día",
    featured: false,
    verified: false,
    bumpsPerDay: 2,
    maxPhotos: 4,
    highlight: false,
    sellable: true,
    features: [
      "Visible en el listado las próximas 24 h",
      "Hasta 4 fotos",
      "WhatsApp y teléfono",
      "2 renovaciones de posición / día",
    ],
    cta: "Gastar 5 créditos",
    creditCost: num(process.env.PLAN_DAY_PRICE, num(process.env.PLAN_BASIC_PRICE, 5)),
  },
  // alias histórico vip → 7€/día destacado
  vip: {
    id: "vip",
    name: "VIP día",
    tagline: "Más arriba · más visitas",
    price: num(process.env.PLAN_VIP_PRICE, 7),
    currency: "EUR",
    period: "1d",
    periodLabel: "/ día",
    featured: true,
    verified: false,
    bumpsPerDay: 5,
    maxPhotos: 6,
    highlight: true,
    sellable: true,
    features: [
      "Todo lo del Día",
      "Badge VIP · prioridad en el listado",
      "Hasta 6 fotos",
      "5 renovaciones / día",
      "Aparece en Destacadas",
    ],
    cta: "Gastar 7 créditos",
    creditCost: num(process.env.PLAN_VIP_PRICE, 7),
  },
  top: {
    id: "top",
    name: "TOP día",
    tagline: "Máxima prioridad hoy",
    price: num(process.env.PLAN_TOP_PRICE, 10),
    currency: "EUR",
    period: "1d",
    periodLabel: "/ día",
    featured: true,
    verified: true,
    bumpsPerDay: 99,
    maxPhotos: 8,
    highlight: true,
    popular: true,
    sellable: true,
    features: [
      "Todo lo del VIP",
      "Badge Real · máxima prioridad",
      "Hasta 8 fotos",
      "Renovaciones ilimitadas (uso razonable)",
    ],
    cta: "Gastar 10 créditos",
    creditCost: num(process.env.PLAN_TOP_PRICE, 10),
  },
};

// compat: "day" = basic
PLANS.day = PLANS.basic;

const PAYMENT_METHODS = [
  {
    id: "bizum",
    name: "Bizum",
    desc: "Pago del día al número indicado. Concepto = código del pedido (EB-XXXX).",
    enabled: true,
  },
  {
    id: "transfer",
    name: "Transferencia bancaria",
    desc: "SEPA. Activa al confirmar el ingreso.",
    enabled: true,
  },
  {
    id: "card",
    name: "Tarjeta (Stripe)",
    desc: process.env.STRIPE_SECRET_KEY
      ? "Pago seguro con tarjeta (24 h de visibilidad)."
      : "Configura STRIPE_SECRET_KEY para tarjeta.",
    enabled: !!process.env.STRIPE_SECRET_KEY,
  },
  {
    id: "mock",
    name: "Simular pago (local)",
    desc: "Pruebas: activa 24 h al instante.",
    enabled:
      process.env.ALLOW_MOCK_PAY === "1" ||
      process.env.NODE_ENV !== "production" ||
      /localhost|127\.0\.0\.1/.test(process.env.SITE_URL || ""),
  },
];

function listPlans() {
  return ["basic", "vip", "top"].map((id) => {
    const p = { ...PLANS[id] };
    p.creditCost = p.creditCost != null ? p.creditCost : p.price;
    return p;
  });
}

function listAllPlans() {
  return Object.keys(PLANS)
    .filter((k) => k !== "day")
    .map((id) => ({ ...PLANS[id] }));
}

function getPlan(id) {
  if (!id) return null;
  if (id === "day" || id === "free") return PLANS[id] ? { ...PLANS[id] } : null;
  return PLANS[id] ? { ...PLANS[id] } : null;
}

function paymentInstructions() {
  return {
    bizumPhone: process.env.PAY_BIZUM || process.env.OPERATOR_PHONE || "[RELLENAR BIZUM en .env PAY_BIZUM]",
    bankIban: process.env.PAY_IBAN || "[RELLENAR IBAN en .env PAY_IBAN]",
    bankHolder: process.env.PAY_HOLDER || process.env.OPERATOR_NAME || "[RELLENAR titular]",
    supportEmail: process.env.OPERATOR_EMAIL || "contacto",
    note: "Concepto obligatorio: código del pedido (EB-XXXX). Los packs recargan créditos; luego gastas créditos en días de visibilidad.",
  };
}

/** Extiende paidUntil 24h desde ahora o desde el final actual si aún vigente */
function extendPaidUntil(currentPaidUntil, days = 1) {
  const ms = days * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const cur = currentPaidUntil ? new Date(currentPaidUntil).getTime() : 0;
  const base = cur > now ? cur : now;
  return new Date(base + ms).toISOString();
}

function applyPlanToAdFields(planId, existingAd = null, { grantDays = 1, trial = false } = {}) {
  const plan = getPlan(planId) || getPlan("basic");
  const tags = new Set((existingAd && existingAd.tags) || []);
  if (!existingAd) tags.add("new");
  if (plan.featured) tags.add("vip");
  else tags.delete("vip");
  if (plan.verified) tags.add("verified");
  else tags.delete("verified");

  let paidUntil;
  if (trial || plan.id === "free" || plan.price === 0) {
    paidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  } else {
    paidUntil = extendPaidUntil(existingAd && (existingAd.paidUntil || existingAd.planExpiresAt), grantDays);
  }

  return {
    plan: plan.id === "day" ? "basic" : plan.id,
    featured: !!plan.featured,
    tags: [...tags],
    planExpiresAt: paidUntil,
    paidUntil,
    planPaidAt: plan.price > 0 ? new Date().toISOString() : existingAd?.planPaidAt || null,
  };
}

/** Visible en listado público si status active y paidUntil > now (o trial) */
function isAdVisibleNow(ad) {
  if (!ad) return false;
  if (ad.status && ad.status !== "active") return false;
  if (ad.source === "demo") return true;
  const until = ad.paidUntil || ad.planExpiresAt;
  if (until) return new Date(until).getTime() > Date.now();
  // legacy sin paidUntil: trial 24h desde creación
  const created = new Date(ad.createdAt || 0).getTime();
  if (!created) return false;
  return Date.now() - created < 24 * 60 * 60 * 1000;
}

function visibilityScore(ad) {
  const until = new Date(ad.paidUntil || ad.planExpiresAt || 0).getTime();
  const paidBoost = until > Date.now() ? until / 1e10 : 0;
  return (
    (ad.featured ? 1000 : 0) +
    (ad.online ? 100 : 0) +
    ((ad.tags || []).includes("verified") ? 80 : 0) +
    ((ad.tags || []).includes("new") ? 50 : 0) +
    paidBoost +
    (ad.views || 0) / 100
  );
}

module.exports = {
  PLANS,
  listPlans,
  listAllPlans,
  getPlan,
  PAYMENT_METHODS,
  paymentInstructions,
  applyPlanToAdFields,
  extendPaidUntil,
  isAdVisibleNow,
  visibilityScore,
};
