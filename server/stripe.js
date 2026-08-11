/**
 * Stripe Checkout (opcional). Activo solo si STRIPE_SECRET_KEY está en .env
 */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    return require("stripe")(key);
  } catch {
    return null;
  }
}

function isStripeEnabled() {
  return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * @param {object} payment - order from DB
 * @param {object} plan - plan catalog entry
 * @param {string} baseUrl - SITE_URL
 */
async function createCheckoutSession(payment, plan, baseUrl) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe no configurado (STRIPE_SECRET_KEY)");

  const base = (baseUrl || "http://localhost:3456").replace(/\/$/, "");
  const amountCents = Math.round(Number(payment.amount) * 100);
  if (!amountCents || amountCents < 50) throw new Error("Importe Stripe inválido");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: (payment.currency || "eur").toLowerCase(),
          unit_amount: amountCents,
          product_data: {
            name: `EscortBenidorm · ${plan.name || payment.plan}`,
            description: payment.kind === "credits"
              ? `Pedido ${payment.id} · ${payment.credits} créditos`
              : `Pedido ${payment.id} · anuncio ${payment.adId || ""}`,
          },
        },
      },
    ],
    metadata: {
      orderId: payment.id,
      adId: payment.adId || "",
      plan: payment.plan || "",
    },
    success_url: `${base}/checkout.html?order=${encodeURIComponent(payment.id)}&stripe=ok`,
    cancel_url: `${base}/checkout.html?order=${encodeURIComponent(payment.id)}&stripe=cancel`,
  });

  return session;
}

async function constructWebhookEvent(rawBody, signature) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) throw new Error("Webhook Stripe no configurado");
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

module.exports = {
  getStripe,
  isStripeEnabled,
  createCheckoutSession,
  constructWebhookEvent,
};
