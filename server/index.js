require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const {
  listAds,
  getAd,
  createAd,
  updateAd,
  deleteAd,
  bumpViews,
  bumpAd,
  expireStaleAds,
  stats,
  saveContact,
  listContacts,
  deleteContact,
  saveReport,
  listReports,
  updateReport,
  deleteReport,
  createPayment,
  getPayment,
  updatePayment,
  listPayments,
  purgeOrphanPayments,
  savePinRecovery,
  listPinRecoveries,
  hashPassword,
  verifyPassword,
  publicUser,
  createUser,
  findUserByEmail,
  findUserByPhone,
  getUser,
  listUsers,
  updateUser,
  canBumpToday,
  recordBumpToday,
  countAll,
  uploadsDir,
  dataDir,
  adjustCredits,
  listCreditLedger,
  getUserCredits,
} = require("./db");

const {
  listPlans,
  getPlan,
  PAYMENT_METHODS,
  paymentInstructions,
  applyPlanToAdFields,
} = require("./plans");

const {
  listCreditPacks,
  getCreditPack,
  creditCostForPlan,
  parseRechargeAmount,
  creditsForRechargeAmount,
  RECHARGE_MIN,
  RECHARGE_MAX,
} = require("./credits");

const {
  notifyContact,
  notifyPaymentAwaiting,
  notifyPaymentActivated,
  notifyNewPublish,
  notifyOwnerPublished,
  notifyReport,
  notifyPinRecovery,
  sendPinToOwner,
} = require("./mail");

const {
  isStripeEnabled,
  createCheckoutSession,
  constructWebhookEvent,
} = require("./stripe");

const {
  isProd,
  realMode,
  assertProductionSecrets,
  publicConfig,
  PORT,
  JWT_SECRET,
  ADMIN_USER,
  ADMIN_PASSWORD,
  SEED_DEMOS,
} = require("./config");

assertProductionSecrets();

// Seed demos solo si se pide explícitamente (nunca en prod real por defecto)
if (countAll() === 0 && SEED_DEMOS) {
  require("./seed.js");
} else if (countAll() === 0 && !isProd && process.env.SEED_DEMOS !== "0" && !realMode) {
  // dev local: seed automático solo si no es REAL_MODE
  require("./seed.js");
}

const app = express();
// detrás de Nginx/Cloudflare
app.set("trust proxy", 1);

const ZONE_MAP = {
  levante: "Playa de Levante",
  poniente: "Playa de Poniente",
  "rincon-de-loix": "Rincón de Loix",
  "casco-antiguo": "Casco Antiguo",
  "nueva-poniente": "Nueva Poniente",
  foietes: "Foietes",
};

const root = path.join(__dirname, "..");

/* —— Security headers —— */
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  // Never stick language UI on stale JS/CSS/HTML (tourists switch lang every visit)
  const p = _req.path || "";
  if (
    p.endsWith(".html") ||
    p === "/" ||
    p === "" ||
    p.startsWith("/js/") ||
    p.startsWith("/css/") ||
    p.endsWith(".js") ||
    p.endsWith(".css") ||
    p.endsWith("/sw.js")
  ) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
  } else if (/\.(svg|png|jpg|jpeg|webp|woff2?)$/i.test(p)) {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }
  next();
});

/* —— Simple in-memory rate limit —— */
const hits = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  let bucket = hits.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { start: now, count: 0 };
    hits.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count <= max;
}
function clientIp(req) {
  return (
    (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

// Security headers (lightweight; no extra deps)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-XSS-Protection", "0");
  if (realMode || isProd) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  }
  next();
});

// CORS: en REAL/prod limita al SITE_URL (+ localhost para admin)
const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
const corsOrigins = new Set(
  [siteUrl, "http://localhost:3456", "http://127.0.0.1:3456"].filter(Boolean)
);
app.use(
  cors({
    origin(origin, cb) {
      // same-origin / curl / mobile webviews without Origin
      if (!origin) return cb(null, true);
      if (corsOrigins.has(origin.replace(/\/$/, ""))) return cb(null, true);
      // LAN dev (192.168.x / 10.x)
      if (/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        return cb(null, true);
      }
      if (process.env.CORS_OPEN === "1") return cb(null, true);
      return cb(null, false);
    },
  })
);
// Stripe webhook needs raw body (before json parser)
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!isStripeEnabled()) return res.status(503).send("Stripe off");
  const sig = req.headers["stripe-signature"];
  try {
    const event = await constructWebhookEvent(req.body, sig);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const payment = getPayment(orderId);
        if (payment && payment.status !== "paid") {
          activatePayment(payment, "card");
        }
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("stripe webhook", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir, { maxAge: "7d" }));

// Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safe = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${nanoid(8)}${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Solo imágenes JPG, PNG, WEBP o GIF"));
  },
});

// Accept both single photo and multiple photos (cap per plan applied after)
const uploadPhotos = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "photos", maxCount: 8 },
]);

function maxPhotosForPlan(planId) {
  const p = getPlan(planId) || getPlan("free");
  return p.maxPhotos || 3;
}

function unlinkUploadIfUser(filePath) {
  if (!filePath || !String(filePath).startsWith("/uploads/")) return;
  const name = path.basename(filePath);
  if (String(name).startsWith("demo-")) return;
  const full = path.join(uploadsDir, name);
  if (fs.existsSync(full)) {
    try {
      fs.unlinkSync(full);
    } catch (_) {}
  }
}

function authAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") return res.status(401).json({ error: "No autorizado" });
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o caducado" });
  }
}

function authUser(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Debes iniciar sesión" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "user") return res.status(401).json({ error: "Debes iniciar sesión como anunciante" });
    const user = getUser(payload.userId);
    if (!user) return res.status(401).json({ error: "Cuenta no encontrada" });
    req.user = user;
    req.userToken = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Sesión caducada. Vuelve a entrar." });
  }
}

function findOwnedAd(id, phone, pin) {
  const ad = getAd(id);
  if (!ad) return null;
  if (normalizePhone(ad.phone) !== phone) return null;
  if (String(ad.editPin || "") !== String(pin)) return null;
  return ad;
}

/** Owner by account OR legacy phone+pin */
function resolveOwnedAd(req, adId) {
  const ad = getAd(adId);
  if (!ad) return null;
  if (req.user && ad.userId && ad.userId === req.user.id) return ad;
  if (req.user && !ad.userId && normalizePhone(ad.phone) === normalizePhone(req.user.phone)) return ad;
  const phone = normalizePhone(req.body?.phone || req.query?.phone || "");
  const pin = String(req.body?.pin || req.query?.pin || "").trim();
  if (phone && pin) return findOwnedAd(adId, phone, pin);
  return null;
}

function collectUploadedPhotos(req) {
  const files = [];
  if (req.files?.photo) files.push(...req.files.photo);
  if (req.files?.photos) files.push(...req.files.photos);
  if (req.file) files.push(req.file);
  return files.map((f) => `/uploads/${f.filename}`);
}

function publicAd(ad, { includePin = false } = {}) {
  if (!ad) return null;
  const copy = { ...ad };
  if (!includePin) {
    delete copy.editPin;
    delete copy.manageEmail; // private recovery email
  }
  // convenience for UI: visibility of the paid day
  try {
    const until = copy.paidUntil || copy.planExpiresAt;
    const ms = until ? new Date(until).getTime() : 0;
    copy.visibleNow = copy.status === "active" && ms > Date.now();
    copy.hoursLeft = ms > Date.now() ? Math.max(0, Math.round((ms - Date.now()) / 3600000)) : 0;
  } catch (_) {
    copy.visibleNow = false;
    copy.hoursLeft = 0;
  }
  return copy;
}

function parseList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val)
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function envLooksFilled(key) {
  const v = String(process.env[key] || "").trim();
  if (!v) return false;
  return !/RELLENAR|CONFIGURA|tudominio|example\.com|cambia|genera/i.test(v);
}

/* —— API health —— */
app.get("/api/health", (_req, res) => {
  const siteUrl = process.env.SITE_URL || "";
  const readiness = {
    realMode: !!realMode,
    httpsSiteUrl: /^https:\/\//i.test(siteUrl),
    operator: envLooksFilled("OPERATOR_NAME") && envLooksFilled("OPERATOR_EMAIL"),
    payments: envLooksFilled("PAY_BIZUM") && envLooksFilled("PAY_IBAN"),
    mockPayOff: process.env.ALLOW_MOCK_PAY !== "1",
    plansDaily:
      Number(process.env.PLAN_VIP_PRICE || 7) <= 15 &&
      Number(process.env.PLAN_TOP_PRICE || 10) <= 20,
  };
  const readyForPublic =
    readiness.realMode &&
    readiness.operator &&
    readiness.payments &&
    readiness.mockPayOff &&
    readiness.plansDaily;

  res.json({
    ok: true,
    service: "EscortBenidorm",
    ads: countAll(),
    realMode,
    env: isProd ? "production" : "development",
    siteUrl: siteUrl || null,
    readiness,
    readyForPublic,
  });
});

/** Config pública (legal / branding) — sin secretos */
app.get("/api/config", (_req, res) => {
  res.json({
    ...publicConfig(),
    stripeEnabled: isStripeEnabled(),
    analyticsId: process.env.GA_MEASUREMENT_ID || process.env.ANALYTICS_ID || "",
    requireRegister: true,
  });
});

/* —— Auth anunciantes (registro obligatorio para publicar) —— */
app.post("/api/auth/register", (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`reg:${ip}`, 10, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados registros. Espera un rato." });
  }
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const phone = normalizePhone(req.body?.phone || "");
  const password = String(req.body?.password || "");
  const name = String(req.body?.name || "").trim().slice(0, 60);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailOk) return res.status(400).json({ error: "Email inválido" });
  if (!phone || phone.length < 9) return res.status(400).json({ error: "Teléfono/WhatsApp inválido" });
  if (password.length < 8) return res.status(400).json({ error: "Contraseña: mínimo 8 caracteres" });
  if (findUserByEmail(email)) return res.status(400).json({ error: "Ya existe una cuenta con ese email" });
  if (findUserByPhone(phone)) return res.status(400).json({ error: "Ya existe una cuenta con ese teléfono" });

  const now = new Date().toISOString();
  const user = createUser({
    id: `u_${nanoid(12)}`,
    email,
    phone,
    name,
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now,
  });

  const token = jwt.sign(
    { role: "user", userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
  res.status(201).json({
    ok: true,
    token,
    user: publicUser(user),
    message: "Cuenta creada. Ya puedes publicar anuncios.",
  });
});

app.post("/api/auth/login", (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`ulogin:${ip}`, 30, 15 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados intentos." });
  }
  const login = String(req.body?.email || req.body?.login || "").trim().toLowerCase();
  const phoneLogin = normalizePhone(req.body?.phone || "");
  const password = String(req.body?.password || "");
  if (!password) return res.status(400).json({ error: "Falta la contraseña" });

  let user = null;
  if (login.includes("@")) user = findUserByEmail(login);
  else if (phoneLogin.length >= 9) user = findUserByPhone(phoneLogin);
  else if (login) user = findUserByEmail(login) || findUserByPhone(normalizePhone(login));

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: "Email/teléfono o contraseña incorrectos" });
  }

  const token = jwt.sign(
    { role: "user", userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
  res.json({ ok: true, token, user: publicUser(user) });
});

app.get("/api/auth/me", authUser, (req, res) => {
  res.json({ ok: true, user: publicUser(req.user) });
});

/** Planes de pago públicos */
app.get("/api/plans", (_req, res) => {
  res.json({
    plans: listPlans(),
    creditPacks: listCreditPacks(),
    creditNote:
      "1 crédito = 1 € de servicio. Compras packs de créditos y los gastas en Día (5), VIP (7) o TOP (10) por día.",
    methods: PAYMENT_METHODS.filter((m) => m.enabled || m.id === "card"),
    currency: "EUR",
    instructions: paymentInstructions(),
  });
});

/* —— Créditos: packs, saldo, compra y gasto —— */
app.get("/api/credits/packs", (_req, res) => {
  res.json({
    packs: listCreditPacks(),
    min: RECHARGE_MIN,
    max: RECHARGE_MAX,
    integersOnly: true,
    bonusRules: [
      { from: 1, to: 49, percent: 0, label: "Sin bonus" },
      { from: 50, to: 999, percent: 20, label: "+20% créditos" },
      { from: 1000, to: 1000, percent: 50, label: "+50% créditos" },
    ],
    services: listPlans().map((p) => ({
      id: p.id,
      name: p.name,
      creditCost: p.creditCost || p.price,
      periodLabel: p.periodLabel,
      tagline: p.tagline,
    })),
    note: "Elige de 1 a 1000 € (solo enteros). 50–999: +20%. 1000: +50%. Luego gasta en Día/VIP/TOP.",
  });
});

/** Preview de recarga: GET /api/credits/preview?amount=50 */
app.get("/api/credits/preview", (req, res) => {
  const calc = creditsForRechargeAmount(req.query.amount);
  if (!calc.ok) return res.status(400).json({ error: calc.error });
  res.json(calc);
});

app.get("/api/credits/me", authUser, (req, res) => {
  const user = getUser(req.user.id);
  res.json({
    credits: Number(user?.credits) || 0,
    user: publicUser(user),
    ledger: listCreditLedger(req.user.id, 40),
    packs: listCreditPacks(),
    services: listPlans().map((p) => ({
      id: p.id,
      name: p.name,
      creditCost: p.creditCost || p.price,
    })),
  });
});

/**
 * Comprar créditos (dinero real → créditos al activar pago)
 * Body: { amount: 1..1000 } entero  O  { packId: "a50" } atajo
 */
app.post("/api/credits/checkout", authUser, (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`cred:${ip}`, 20, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados intentos." });
  }

  let amount = req.body?.amount;
  const packId = String(req.body?.packId || req.body?.pack || "").trim();
  if ((amount === undefined || amount === null || amount === "") && packId) {
    const pack = getCreditPack(packId);
    if (!pack) {
      return res.status(400).json({ error: "Pack inválido. Usa amount entre 1 y 1000 (entero)." });
    }
    amount = pack.amount || pack.price;
  }

  const parsed = parseRechargeAmount(amount);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });

  const calc = creditsForRechargeAmount(parsed.amount);
  if (!calc.ok) return res.status(400).json({ error: calc.error });

  const now = new Date().toISOString();
  const payment = createPayment({
    id: `EB-${nanoid(8).toUpperCase()}`,
    kind: "credits",
    type: "credits",
    packId: `a${calc.amount}`,
    amountEur: calc.amount,
    baseCredits: calc.base,
    bonusCredits: calc.bonus,
    bonusPercent: calc.bonusPercent,
    credits: calc.totalCredits,
    userId: req.user.id,
    phone: req.user.phone,
    plan: `credits:a${calc.amount}`,
    amount: calc.amount, // euros a pagar (entero)
    currency: "EUR",
    status: "pending",
    method: null,
    createdAt: now,
    updatedAt: now,
  });
  notifyPaymentAwaiting(payment).catch(() => {});
  res.status(201).json({
    ok: true,
    payment: {
      id: payment.id,
      kind: "credits",
      packId: payment.packId,
      amount: payment.amount,
      baseCredits: calc.base,
      bonus: calc.bonus,
      bonusPercent: calc.bonusPercent,
      credits: calc.totalCredits,
      currency: payment.currency,
      status: payment.status,
      checkoutUrl: `/checkout.html?order=${encodeURIComponent(payment.id)}`,
    },
    calc,
  });
});

/**
 * Gastar créditos en un plan de visibilidad (servicio)
 * Body: { adId, plan, days, phone?, pin? }
 */
app.post("/api/credits/spend", (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`spend:${ip}`, 40, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados intentos." });
  }
  attachUserFromAuth(req);
  const adId = String(req.body?.adId || "").trim();
  let planId = String(req.body?.plan || "basic").toLowerCase();
  if (planId === "day" || planId === "free") planId = "basic";
  const days = Math.min(30, Math.max(1, Number(req.body?.days) || 1));
  const phone = normalizePhone(req.body?.phone || "");
  const pin = String(req.body?.pin || "").trim();

  const plan = getPlan(planId);
  if (!plan || plan.price <= 0 || plan.sellable === false) {
    return res.status(400).json({ error: "Servicio inválido (basic / vip / top)" });
  }

  let owned = resolveOwnedAd(req, adId);
  if (!owned && phone && pin) owned = findOwnedAd(adId, phone, pin);
  if (!owned) return res.status(403).json({ error: "No autorizado o anuncio no encontrado" });

  // Resolve user: session, or userId on ad, or phone match
  let userId = req.user?.id || owned.userId || null;
  if (!userId && owned.phone) {
    const u = findUserByPhone(owned.phone);
    if (u) userId = u.id;
  }
  if (!userId) {
    return res.status(400).json({
      error: "Necesitas una cuenta de anunciante con créditos. Regístrate, compra créditos y gástalos aquí.",
      needAccount: true,
    });
  }

  const cost = creditCostForPlan(plan, days);
  const bal = getUserCredits(userId);
  if (bal < cost) {
    return res.status(402).json({
      error: `Saldo insuficiente: necesitas ${cost} créditos y tienes ${bal}. Compra un pack.`,
      needCredits: true,
      credits: bal,
      cost,
      buyUrl: "/precios.html#creditos",
    });
  }

  const spent = adjustCredits(userId, -cost, {
    type: "spend",
    meta: { adId, plan: plan.id, days, service: plan.name },
  });
  if (spent?.error) {
    return res.status(402).json({ error: spent.error, credits: spent.credits, cost });
  }

  const planFields = applyPlanToAdFields(plan.id, owned, { grantDays: days });
  const tags = new Set(planFields.tags);
  if ((owned.tags || []).includes("new")) tags.add("new");
  const ad = updateAd(adId, {
    ...planFields,
    tags: [...tags],
    pendingPlan: null,
    online: true,
    status: "active",
  });

  res.json({
    ok: true,
    spent: cost,
    credits: spent.credits,
    days,
    plan: plan.id,
    ad: publicAd(ad, { includePin: true }),
    ledger: spent.entry,
    message: `Gastados ${cost} créditos · plan ${plan.name} · +${days} día(s)`,
  });
});

/** Admin: listar usuarios con saldo */
app.get("/api/admin/users", authAdmin, (_req, res) => {
  const users = listUsers().map((u) => ({
    ...publicUser(u),
    credits: Number(u.credits) || 0,
  }));
  res.json({
    users,
    ledger: listCreditLedger(null, 80),
  });
});

/** Admin: regalar / ajustar créditos */
app.post("/api/admin/credits/grant", authAdmin, (req, res) => {
  const userId = String(req.body?.userId || "").trim();
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const amount = Number(req.body?.amount);
  const note = String(req.body?.note || "admin").slice(0, 200);
  let uid = userId;
  if (!uid && email) {
    const u = findUserByEmail(email);
    if (u) uid = u.id;
  }
  if (!uid || !Number.isFinite(amount) || amount === 0) {
    return res.status(400).json({ error: "userId o email y amount (≠0) obligatorios" });
  }
  const result = adjustCredits(uid, amount, {
    type: amount > 0 ? "admin_grant" : "admin_adjust",
    meta: { note, by: req.admin?.user || "admin" },
  });
  if (!result || result.error) {
    return res.status(400).json({ error: result?.error || "Usuario no encontrado" });
  }
  res.json({ ok: true, credits: result.credits, user: publicUser(result.user), entry: result.entry });
});

app.get("/api/stats", (_req, res) => {
  res.json(stats());
});

/* Dynamic sitemap for SEO */
app.get("/sitemap.xml", (_req, res) => {
  const base = (process.env.SITE_URL || "https://www.escortbenidorm.es").replace(/\/$/, "");
  const ads = listAds({ admin: false });
  const staticUrls = [
    ["", "1.0", "daily"],
    ["/anuncios.html", "0.95", "daily"],
    ["/publicar.html", "0.8", "monthly"],
    ["/precios.html", "0.85", "daily"],
    ["/putas-benidorm.html", "0.98", "daily"],
    ["/scorts-benidorm.html", "0.98", "daily"],
    ["/escorts-benidorm.html", "0.98", "daily"],
    ["/en/benidorm-escorts.html", "0.95", "daily"],
    ["/de/escort-benidorm.html", "0.95", "daily"],
    ["/registro.html", "0.75", "monthly"],
    ["/login.html", "0.7", "monthly"],
    ["/zonas.html", "0.9", "weekly"],
    ["/favoritos.html", "0.3", "monthly"],
    ["/comparar.html", "0.3", "monthly"],
    ["/contacto.html", "0.45", "yearly"],
    ["/precios.html", "0.85", "monthly"],
    ["/blog/index.html", "0.7", "weekly"],
    ["/blog/mejores-zonas-escorts-benidorm.html", "0.65", "monthly"],
    ["/blog/consejos-turistas-benidorm.html", "0.6", "monthly"],
    ["/blog/seo-anunciantes-benidorm.html", "0.55", "monthly"],
    ["/blog/creditos-anunciantes-benidorm.html", "0.75", "weekly"],
    ["/zonas/levante.html", "0.9", "daily"],
    ["/zonas/poniente.html", "0.9", "daily"],
    ["/zonas/rincon-de-loix.html", "0.9", "daily"],
    ["/zonas/casco-antiguo.html", "0.85", "daily"],
    ["/zonas/nueva-poniente.html", "0.8", "weekly"],
    ["/zonas/foietes.html", "0.8", "weekly"],
  ];
  const urls = staticUrls
    .map(
      ([path, prio, freq]) => `  <url>
    <loc>${base}${path || "/"}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`
    )
    .concat(
      ads.map(
        (a) => `  <url>
    <loc>${base}/a/${encodeURIComponent(a.id)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.75</priority>
  </url>`
      )
    )
    .join("\n");

  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
});

/* —— Ads public —— */
app.get("/api/ads", (req, res) => {
  const q = req.query;
  let ads = listAds({
    zone: q.zone || undefined,
    q: q.q || undefined,
    online: q.online === "1" || q.online === "true",
    maxPrice: q.price || q.max || undefined,
    minPrice: q.minPrice || undefined,
    nationality: q.nationality || undefined,
    minAge: q.minAge || undefined,
    maxAge: q.maxAge || undefined,
    independent: q.independent,
    incall: q.incall,
    outcall: q.outcall,
    available24h: q.available24h || q.h24,
    featured: q.featured,
    lang: q.lang || undefined,
  }).map((a) => publicAd(a));
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(60, Math.max(1, Number(q.limit) || 60));
  const total = ads.length;
  const start = (page - 1) * limit;
  const slice = ads.slice(start, start + limit);
  res.json({
    ads: slice,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
  });
});

app.get("/api/ads/:id", (req, res) => {
  const ad = getAd(req.params.id);
  // allow owner to open own non-active / unpaid ad with pin
  const pin = String(req.query.pin || "").trim();
  const phone = normalizePhone(req.query.phone || "");
  const isOwner = ad && pin && phone && findOwnedAd(ad.id, phone, pin);
  if (!ad) return res.status(404).json({ error: "Anuncio no encontrado" });
  if (ad.status !== "active" && !isOwner) {
    return res.status(404).json({ error: "Anuncio no encontrado" });
  }
  // listado público exige pago del día; ficha directa sigue si está active (SEO / deep links)
  if (!isOwner) bumpViews(ad.id);
  res.json({ ad: publicAd(getAd(ad.id), { includePin: !!isOwner }) });
});

/* —— Publish (requiere cuenta registrada) —— */
app.post("/api/ads", authUser, (req, res) => {
  uploadPhotos(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || "Error de subida" });
    try {
      const ip = clientIp(req);
      if (!rateLimit(`pub:${ip}`, 8, 60 * 60 * 1000)) {
        return res.status(429).json({ error: "Demasiadas publicaciones. Espera un rato." });
      }
      const b = req.body || {};
      const name = String(b.name || "").trim();
      const age = Number(b.age);
      const zoneSlug = String(b.zone || b.zoneSlug || "").trim();
      const price = Number(b.price);
      // phone/email from account; allow override phone for ad WhatsApp
      const phone = normalizePhone(b.phone || req.user.phone);
      const manageEmail = String(b.manageEmail || b.email || req.user.email || "")
        .trim()
        .toLowerCase()
        .slice(0, 200);
      const desc = String(b.desc || b.description || "").trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manageEmail);

      if (!name || name.length < 2) return res.status(400).json({ error: "Nombre inválido" });
      if (!age || age < 18 || age > 99) return res.status(400).json({ error: "Edad mínima 18" });
      if (!ZONE_MAP[zoneSlug]) return res.status(400).json({ error: "Zona de Benidorm inválida" });
      if (!price || price < 50 || price > 9999) return res.status(400).json({ error: "Tarifa inválida" });
      if (!phone || phone.length < 9) return res.status(400).json({ error: "Teléfono/WhatsApp inválido" });
      if (!manageEmail || !emailOk) {
        return res.status(400).json({ error: "Email de la cuenta inválido" });
      }
      if (!desc || desc.length < 20) return res.status(400).json({ error: "Descripción demasiado corta (mín. 20)" });

      // Modelo diario: 24h de prueba al publicar; planes 5/7/10 €/día amplían paidUntil
      let requestedPlan = String(b.plan || "basic").toLowerCase();
      if (requestedPlan === "free" || requestedPlan === "day") requestedPlan = "basic";
      if (!["basic", "vip", "top"].includes(requestedPlan)) requestedPlan = "basic";
      const planInfo = getPlan(requestedPlan) || getPlan("basic");
      // Siempre trial 24h visible; plan free hasta pagar el día elegido
      const planFields = applyPlanToAdFields("free", null, { trial: true });
      const needsPayment = planInfo.price > 0;
      if (!planFields.tags.includes("new")) planFields.tags = ["new", ...planFields.tags];

      const languages = parseList(b.languages).map((l) => l.toUpperCase()).slice(0, 5);
      if (!languages.length) languages.push("ES");
      const services = parseList(b.services).slice(0, 8);
      if (!services.length) services.push("Hotel");

      const now = new Date().toISOString();
      const id = `${name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 24)}-${zoneSlug}-${nanoid(6)}`;

      // Límite de fotos del plan elegido (aunque el pago active luego)
      const maxPh = maxPhotosForPlan(requestedPlan);
      let photos = collectUploadedPhotos(req);
      if (photos.length > maxPh) {
        photos.slice(maxPh).forEach(unlinkUploadIfUser);
        photos = photos.slice(0, maxPh);
      }
      const photo = photos[0] || "";
      const title = String(b.title || name).trim();
      const bool = (v) => v === true || v === "1" || v === "true" || v === "on";
      const editPin = nanoid(10);

      const ad = createAd({
        id,
        userId: req.user.id,
        name,
        title,
        age,
        zone: ZONE_MAP[zoneSlug],
        zoneSlug,
        locationDetail: String(b.locationDetail || b.location || "").trim(),
        nationality: String(b.nationality || "").trim(),
        height: String(b.height || "").trim(),
        bodyType: String(b.bodyType || "").trim(),
        hair: String(b.hair || "").trim(),
        languages,
        price,
        tags: planFields.tags,
        services,
        desc,
        descEn: String(b.descEn || desc).trim(),
        phone,
        manageEmail,
        photo,
        photos,
        editPin,
        featured: planFields.featured,
        online: true,
        views: 0,
        status: "active",
        plan: planFields.plan,
        planExpiresAt: planFields.planExpiresAt,
        paidUntil: planFields.paidUntil,
        planPaidAt: planFields.planPaidAt,
        pendingPlan: needsPayment ? requestedPlan : null,
        preferredPlan: needsPayment ? requestedPlan : null,
        source: "user",
        independent: b.independent === undefined ? true : bool(b.independent),
        incall: b.incall === undefined ? true : bool(b.incall),
        outcall: b.outcall === undefined ? true : bool(b.outcall),
        available24h: bool(b.available24h) || bool(b.h24),
        schedule: String(b.schedule || "Flexible").trim(),
        createdAt: now,
        updatedAt: now,
        lastBump: now,
      });

      // Modelo solo créditos: no se crea pedido de plan al publicar.
      // Trial 24h activo; el usuario recarga créditos y gasta en Mi anuncio.
      const payment = null;

      notifyNewPublish({ ad, pin: editPin, payment }).catch(() => {});
      notifyOwnerPublished({ ad, pin: editPin, payment }).catch(() => {});

      res.status(201).json({
        ok: true,
        ad: publicAd(ad),
        managePin: editPin,
        manageUrl: `/mi-anuncio.html?id=${encodeURIComponent(id)}`,
        message: needsPayment
          ? `Anuncio visible 24h de prueba. Luego recarga créditos en /precios.html y gasta ${planInfo.creditCost || planInfo.price} créd./día (${planInfo.name}) en Mi anuncio.`
          : "Guarda tu PIN de gestión. No se volverá a mostrar.",
        preferredPlan: needsPayment ? requestedPlan : null,
        creditsHint: {
          buyUrl: "/precios.html#creditos",
          spendUrl: `/mi-anuncio.html?id=${encodeURIComponent(id)}`,
          dayCost: planInfo.creditCost || planInfo.price,
          plan: planInfo.id,
        },
        payment: null,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || "Error al publicar" });
    }
  });
});

/* —— Owner: list my ads (cuenta O phone+pin legado) —— */
app.get("/api/my-ads", authUser, (req, res) => {
  const ads = listAds({ admin: true }).filter(
    (a) =>
      a.userId === req.user.id ||
      (!a.userId && normalizePhone(a.phone) === normalizePhone(req.user.phone))
  );
  res.json({ ads: ads.map((a) => publicAd(a, { includePin: true })), user: publicUser(req.user) });
});

app.post("/api/my-ads", (req, res) => {
  // Prefer session token if present
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload.role === "user") {
        const user = getUser(payload.userId);
        if (user) {
          const ads = listAds({ admin: true }).filter(
            (a) =>
              a.userId === user.id ||
              (!a.userId && normalizePhone(a.phone) === normalizePhone(user.phone))
          );
          return res.json({
            ads: ads.map((a) => publicAd(a, { includePin: true })),
            user: publicUser(user),
          });
        }
      }
    } catch (_) {}
  }
  const phone = normalizePhone(req.body?.phone || "");
  const pin = String(req.body?.pin || "").trim();
  if (!phone || !pin) {
    return res.status(400).json({ error: "Inicia sesión o usa teléfono + PIN" });
  }
  const ads = listAds({ admin: true }).filter(
    (a) => normalizePhone(a.phone) === phone && String(a.editPin || "") === pin
  );
  res.json({ ads: ads.map((a) => publicAd(a, { includePin: true })) });
});

/* —— Owner: update own ad —— */
app.patch("/api/my-ads/:id", (req, res) => {
  uploadPhotos(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    // attach user if token
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload.role === "user") req.user = getUser(payload.userId);
      } catch (_) {}
    }
    const owned = resolveOwnedAd(req, req.params.id);
    if (!owned) return res.status(403).json({ error: "No autorizado o anuncio no encontrado" });

    const b = req.body || {};
    const patch = {};
    if (b.name) patch.name = String(b.name).trim();
    if (b.title) patch.title = String(b.title).trim();
    if (b.age) patch.age = Number(b.age);
    if (b.price) patch.price = Number(b.price);
    if (b.desc || b.description) patch.desc = String(b.desc || b.description).trim();
    if (b.nationality !== undefined) patch.nationality = String(b.nationality).trim();
    if (b.height !== undefined) patch.height = String(b.height).trim();
    if (b.locationDetail !== undefined) patch.locationDetail = String(b.locationDetail).trim();
    if (b.schedule !== undefined) patch.schedule = String(b.schedule).trim();
    if (b.languages) patch.languages = parseList(b.languages).map((l) => l.toUpperCase());
    if (b.services) patch.services = parseList(b.services);
    if (b.zone && ZONE_MAP[b.zone]) {
      patch.zoneSlug = b.zone;
      patch.zone = ZONE_MAP[b.zone];
    }
    const bool = (v) => v === true || v === "1" || v === "true" || v === "on";
    if (b.online !== undefined) patch.online = bool(b.online);
    if (b.incall !== undefined) patch.incall = bool(b.incall);
    if (b.outcall !== undefined) patch.outcall = bool(b.outcall);
    if (b.available24h !== undefined) patch.available24h = bool(b.available24h);
    if (b.independent !== undefined) patch.independent = bool(b.independent);
    if (b.status === "active" || b.status === "hidden" || b.status === "paused") {
      patch.status = b.status === "paused" ? "hidden" : b.status;
    }

    const maxPh = maxPhotosForPlan(owned.plan || "free");
    let currentPhotos = Array.isArray(owned.photos) ? [...owned.photos] : owned.photo ? [owned.photo] : [];

    // remove specific photos: removePhotos = "/uploads/a.jpg,/uploads/b.jpg" or JSON array
    if (b.removePhotos) {
      let toRemove = [];
      try {
        toRemove = Array.isArray(b.removePhotos) ? b.removePhotos : JSON.parse(b.removePhotos);
      } catch {
        toRemove = parseList(b.removePhotos);
      }
      const removeSet = new Set(toRemove.map(String));
      currentPhotos.forEach((p) => {
        if (removeSet.has(String(p))) unlinkUploadIfUser(p);
      });
      currentPhotos = currentPhotos.filter((p) => !removeSet.has(String(p)));
    }

    const newPhotos = collectUploadedPhotos(req);
    if (newPhotos.length) {
      const room = Math.max(0, maxPh - currentPhotos.length);
      const keep = newPhotos.slice(0, room);
      newPhotos.slice(room).forEach(unlinkUploadIfUser);
      currentPhotos = [...currentPhotos, ...keep];
    }
    if (newPhotos.length || b.removePhotos) {
      patch.photos = currentPhotos.slice(0, maxPh);
      patch.photo = patch.photos[0] || "";
    }

    const ad = updateAd(req.params.id, patch);
    res.json({ ok: true, ad: publicAd(ad), maxPhotos: maxPh });
  });
});

/** Owner: delete one photo */
function attachUserFromAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role === "user") req.user = getUser(payload.userId);
  } catch (_) {}
}

app.post("/api/my-ads/:id/remove-photo", (req, res) => {
  attachUserFromAuth(req);
  const phone = normalizePhone(req.body?.phone || "");
  const pin = String(req.body?.pin || "").trim();
  const photo = String(req.body?.photo || "").trim();
  const owned = resolveOwnedAd(req, req.params.id) || (phone && pin ? findOwnedAd(req.params.id, phone, pin) : null);
  if (!owned) return res.status(403).json({ error: "No autorizado" });
  if (!photo) return res.status(400).json({ error: "Falta foto" });
  let photos = Array.isArray(owned.photos) ? [...owned.photos] : owned.photo ? [owned.photo] : [];
  if (!photos.includes(photo)) return res.status(404).json({ error: "Foto no encontrada" });
  photos = photos.filter((p) => p !== photo);
  unlinkUploadIfUser(photo);
  const ad = updateAd(req.params.id, {
    photos,
    photo: photos[0] || "",
  });
  res.json({ ok: true, ad: publicAd(ad) });
});

/** Owner: reorder photos (array of paths) */
app.post("/api/my-ads/:id/reorder-photos", (req, res) => {
  attachUserFromAuth(req);
  const phone = normalizePhone(req.body?.phone || "");
  const pin = String(req.body?.pin || "").trim();
  const owned = resolveOwnedAd(req, req.params.id) || (phone && pin ? findOwnedAd(req.params.id, phone, pin) : null);
  if (!owned) return res.status(403).json({ error: "No autorizado" });
  let order = req.body?.photos || req.body?.order || [];
  if (!Array.isArray(order)) return res.status(400).json({ error: "Orden inválido" });
  const current = Array.isArray(owned.photos) ? owned.photos : owned.photo ? [owned.photo] : [];
  const set = new Set(current);
  const next = order.map(String).filter((p) => set.has(p));
  // append any missing
  current.forEach((p) => {
    if (!next.includes(p)) next.push(p);
  });
  const ad = updateAd(req.params.id, { photos: next, photo: next[0] || "" });
  res.json({ ok: true, ad: publicAd(ad) });
});

/** PIN recovery: phone + manageEmail (if set at publish) or admin ticket */
app.post("/api/pin-recovery", (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`pinrec:${ip}`, 8, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados intentos. Espera un rato." });
  }
  const phone = normalizePhone(req.body?.phone || "");
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!phone || phone.length < 9) return res.status(400).json({ error: "Teléfono inválido" });

  const ads = listAds({ admin: true }).filter((a) => normalizePhone(a.phone) === phone);
  if (!ads.length) {
    // same message to avoid enumeration
    return res.json({
      ok: true,
      message: "Si hay anuncios con esos datos, recibirás instrucciones por email o te contactaremos.",
    });
  }

  const row = savePinRecovery({
    id: nanoid(10),
    phone,
    email,
    adIds: ads.map((a) => a.id),
    createdAt: new Date().toISOString(),
    status: "open",
  });

  // If manageEmail matches, send PIN to owner
  const matched = ads.filter(
    (a) => a.manageEmail && String(a.manageEmail).toLowerCase() === email && email.includes("@")
  );
  if (matched.length) {
    sendPinToOwner({ email, ads: matched }).catch(() => {});
    notifyPinRecovery({ phone, ads: matched, email }).catch(() => {});
    return res.json({
      ok: true,
      sentToOwner: true,
      message: "Si el email coincide con el de gestión, te hemos enviado el PIN.",
    });
  }

  // Always notify admin (with PINs for support)
  notifyPinRecovery({ phone, ads, email }).catch(() => {});
  res.json({
    ok: true,
    sentToOwner: false,
    message:
      "Solicitud registrada. Si no configuraste email de gestión al publicar, el administrador revisará la petición. Añade manageEmail en el próximo anuncio para recuperación automática.",
    recoveryId: row.id,
  });
});

app.get("/api/admin/pin-recoveries", authAdmin, (_req, res) => {
  res.json({ recoveries: listPinRecoveries() });
});

app.post("/api/my-ads/:id/bump", (req, res) => {
  attachUserFromAuth(req);
  const phone = normalizePhone(req.body?.phone || "");
  const pin = String(req.body?.pin || "").trim();
  const owned = resolveOwnedAd(req, req.params.id) || (phone && pin ? findOwnedAd(req.params.id, phone, pin) : null);
  if (!owned) return res.status(403).json({ error: "No autorizado" });
  const quota = canBumpToday(owned);
  if (!quota.ok) {
    return res.status(429).json({
      error: `Límite de renovaciones de hoy (${quota.max} en plan ${(owned.plan || "free").toUpperCase()}). Mejora a VIP/TOP o vuelve mañana.`,
      quota,
    });
  }
  recordBumpToday(owned.id);
  const ad = bumpAd(req.params.id);
  const q2 = canBumpToday(ad);
  res.json({ ok: true, ad: publicAd(ad), quota: q2 });
});

app.delete("/api/my-ads/:id", (req, res) => {
  attachUserFromAuth(req);
  const phone = normalizePhone(req.body?.phone || req.query?.phone || "");
  const pin = String(req.body?.pin || req.query?.pin || "").trim();
  const owned = resolveOwnedAd(req, req.params.id) || (phone && pin ? findOwnedAd(req.params.id, phone, pin) : null);
  if (!owned) return res.status(403).json({ error: "No autorizado" });
  deleteAd(req.params.id);
  res.json({ ok: true });
});

/* —— Payments: solo recarga de créditos (planes se activan gastando saldo) —— */
app.post("/api/checkout", (req, res) => {
  // Legacy plan-checkout desactivado: el modelo es comprar créditos y gastarlos
  return res.status(400).json({
    error:
      "Los planes se activan gastando créditos. Recarga saldo en /precios.html y usa Mi anuncio → gastar créditos.",
    needCredits: true,
    buyUrl: "/precios.html#creditos",
    spendUrl: "/mi-anuncio.html",
  });
});

app.get("/api/checkout/:id", (req, res) => {
  const payment = getPayment(req.params.id);
  if (!payment) return res.status(404).json({ error: "Pedido no encontrado" });
  const isCredits = payment.kind === "credits" || payment.type === "credits";
  const plan = isCredits
    ? {
        id: payment.packId || "credits",
        name: `${payment.credits || 0} créditos`,
        tagline: "Recarga de saldo",
        price: payment.amount,
      }
    : getPlan(payment.plan);
  const ad = payment.adId ? getAd(payment.adId) : null;
  res.json({
    payment: {
      id: payment.id,
      kind: isCredits ? "credits" : "plan",
      plan: payment.plan,
      packId: payment.packId || null,
      credits: payment.credits || null,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt || null,
      adId: payment.adId || null,
      adName: ad?.name || null,
      days: payment.days || null,
    },
    plan,
    methods: PAYMENT_METHODS.filter((m) => m.enabled || m.id === "card"),
    instructions: paymentInstructions(),
  });
});

function activatePayment(payment, method) {
  if (!payment || payment.status === "paid") return payment;

  // Pack de créditos: recarga saldo del usuario
  if (payment.kind === "credits" || payment.type === "credits") {
    const credits = Number(payment.credits) || 0;
    const userId = payment.userId;
    if (userId && credits > 0) {
      adjustCredits(userId, credits, {
        type: "purchase",
        paymentId: payment.id,
        meta: { packId: payment.packId, amount: payment.amount },
      });
    }
    const updatedPay = updatePayment(payment.id, {
      status: "paid",
      method: method || payment.method || "manual",
      paidAt: new Date().toISOString(),
    });
    const user = userId ? getUser(userId) : null;
    if (user?.email) {
      notifyPaymentActivated(
        { ...updatedPay, plan: `${credits} créditos` },
        { manageEmail: user.email, name: user.name || user.email, paidUntil: null }
      ).catch(() => {});
    }
    return updatedPay;
  }

  // Legacy / opcional: pago directo de plan (sin créditos)
  const ad = getAd(payment.adId);
  const days = Number(payment.days) > 0 ? Number(payment.days) : 1;
  const planFields = applyPlanToAdFields(payment.plan, ad, { grantDays: days });
  let updatedAd = ad;
  if (ad) {
    const tags = new Set(planFields.tags);
    if ((ad.tags || []).includes("new")) tags.add("new");
    updatedAd = updateAd(payment.adId, {
      ...planFields,
      tags: [...tags],
      pendingPlan: null,
      online: true,
      status: "active",
    });
  }
  const updatedPay = updatePayment(payment.id, {
    status: "paid",
    method: method || payment.method || "manual",
    paidAt: new Date().toISOString(),
    days,
  });
  notifyPaymentActivated(updatedPay, updatedAd || ad).catch(() => {});
  return updatedPay;
}

/** Confirmar pago (Bizum/transferencia declarado por usuario, mock, o Stripe session) */
app.post("/api/checkout/:id/confirm", async (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`payc:${ip}`, 15, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados intentos." });
  }
  const payment = getPayment(req.params.id);
  if (!payment) return res.status(404).json({ error: "Pedido no encontrado" });
  if (payment.status === "paid") {
    return res.json({ ok: true, payment, alreadyPaid: true });
  }
  const method = String(req.body?.method || "bizum").toLowerCase();
  const allowed = PAYMENT_METHODS.filter((m) => m.enabled).map((m) => m.id);
  if (!allowed.includes(method) && method !== "bizum" && method !== "transfer") {
    return res.status(400).json({ error: "Método no disponible" });
  }

  // mock: activate immediately
  if (method === "mock") {
    const allowMock =
      process.env.ALLOW_MOCK_PAY === "1" ||
      process.env.NODE_ENV !== "production" ||
      /localhost|127\.0\.0\.1/.test(process.env.SITE_URL || "");
    if (!allowMock) {
      return res.status(403).json({ error: "Simulación desactivada en producción" });
    }
    const paid = activatePayment(payment, "mock");
    return res.json({ ok: true, payment: paid, activated: true });
  }

  // Stripe card → Checkout Session URL
  if (method === "card") {
    if (!isStripeEnabled()) {
      return res.status(400).json({ error: "Tarjeta no configurada. Usa Bizum o transferencia." });
    }
    try {
      const plan =
        payment.kind === "credits"
          ? { name: `${payment.credits || ""} créditos` }
          : getPlan(payment.plan);
      const session = await createCheckoutSession(
        payment,
        plan || { name: payment.plan },
        process.env.SITE_URL || `${req.protocol}://${req.get("host")}`
      );
      updatePayment(payment.id, {
        method: "card",
        stripeSessionId: session.id,
        status: "pending",
      });
      return res.json({
        ok: true,
        activated: false,
        stripeUrl: session.url,
        payment: getPayment(payment.id),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message || "Error Stripe" });
    }
  }

  // bizum/transfer: mark awaiting review (or auto if AUTO_ACTIVATE_PAY=1)
  if (process.env.AUTO_ACTIVATE_PAY === "1") {
    const paid = activatePayment(payment, method);
    return res.json({ ok: true, payment: paid, activated: true });
  }

  const updated = updatePayment(payment.id, {
    status: "awaiting",
    method,
    declaredAt: new Date().toISOString(),
    note: String(req.body?.note || "").slice(0, 200),
  });
  notifyPaymentAwaiting(updated).catch(() => {});
  res.json({
    ok: true,
    payment: updated,
    activated: false,
    message: "Pago declarado. Activaremos el plan al confirmar el ingreso (admin).",
  });
});

/** Admin confirma pago y activa plan */
app.post("/api/admin/payments/:id/activate", authAdmin, (req, res) => {
  const payment = getPayment(req.params.id);
  if (!payment) return res.status(404).json({ error: "No encontrado" });
  const paid = activatePayment(payment, req.body?.method || payment.method || "manual");
  res.json({ ok: true, payment: paid, ad: getAd(payment.adId) });
});

app.get("/api/admin/payments", authAdmin, (_req, res) => {
  res.json({ payments: listPayments() });
});

app.post("/api/admin/payments/purge-orphans", authAdmin, (_req, res) => {
  const n = purgeOrphanPayments();
  res.json({ ok: true, removed: n });
});

// startup: clean orphan payment orders (safe)
try {
  const n = purgeOrphanPayments();
  if (n) console.log(`  Cleaned ${n} orphan payment(s)`);
} catch (_) {}

/* —— Contact —— */
app.post("/api/contact", (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 10, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados mensajes. Intenta más tarde." });
  }
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || req.body?.asunto || "").trim();
  const message = String(req.body?.message || req.body?.msg || "").trim();
  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Faltan campos" });
  }
  if (email.length > 200 || subject.length > 200 || message.length > 4000) {
    return res.status(400).json({ error: "Mensaje demasiado largo" });
  }
  saveContact({ email, subject, message });
  notifyContact({ email, subject, message }).catch(() => {});
  res.json({ ok: true });
});

/* —— Admin auth —— */
app.post("/api/admin/login", async (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`login:${ip}`, 20, 15 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados intentos de login." });
  }
  const user = String(req.body?.user || req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
  const token = jwt.sign({ role: "admin", user: ADMIN_USER }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ ok: true, token, user: ADMIN_USER });
});

app.get("/api/admin/me", authAdmin, (req, res) => {
  res.json({ ok: true, user: req.admin.user });
});

app.get("/api/admin/ads", authAdmin, (_req, res) => {
  res.json({ ads: listAds({ admin: true }) });
});

app.get("/api/admin/contacts", authAdmin, (_req, res) => {
  res.json({ contacts: listContacts() });
});

app.delete("/api/admin/contacts/:id", authAdmin, (req, res) => {
  const ok = deleteContact(req.params.id);
  if (!ok) return res.status(404).json({ error: "No encontrado" });
  res.json({ ok: true });
});

app.patch("/api/ads/:id", authAdmin, upload.single("photo"), (req, res) => {
  const current = getAd(req.params.id);
  if (!current) return res.status(404).json({ error: "No encontrado" });

  const b = req.body || {};
  const patch = {};

  if (b.name) patch.name = String(b.name).trim();
  if (b.age) patch.age = Number(b.age);
  if (b.zone || b.zoneSlug) {
    const zs = b.zone || b.zoneSlug;
    if (ZONE_MAP[zs]) {
      patch.zoneSlug = zs;
      patch.zone = ZONE_MAP[zs];
    }
  }
  if (b.nationality !== undefined) patch.nationality = String(b.nationality);
  if (b.height !== undefined) patch.height = String(b.height);
  if (b.price) patch.price = Number(b.price);
  if (b.phone) patch.phone = normalizePhone(b.phone);
  if (b.desc || b.description) patch.desc = String(b.desc || b.description);
  if (b.descEn) patch.descEn = String(b.descEn);
  if (b.status) patch.status = String(b.status);
  if (b.plan) patch.plan = String(b.plan);
  if (b.languages) patch.languages = parseList(b.languages).map((l) => l.toUpperCase());
  if (b.services) patch.services = parseList(b.services);
  if (b.tags) patch.tags = parseList(b.tags);
  if (b.featured !== undefined) {
    patch.featured = b.featured === true || b.featured === "1" || b.featured === "true";
  }
  if (b.online !== undefined) {
    patch.online = b.online === true || b.online === "1" || b.online === "true";
  }
  if (b.toggleVip === "1" || b.toggleVip === true) {
    const tags = new Set(current.tags || []);
    if (tags.has("vip")) tags.delete("vip");
    else tags.add("vip");
    patch.tags = [...tags];
    patch.featured = tags.has("vip");
  }
  if (b.toggleOnline === "1" || b.toggleOnline === true) {
    patch.online = !current.online;
  }
  // Admin: grant N days of visibility (daily model)
  if (b.grantDays !== undefined && b.grantDays !== null && b.grantDays !== "") {
    const days = Math.min(30, Math.max(1, Number(b.grantDays) || 1));
    const planId = String(b.plan || current.plan || "basic").toLowerCase();
    const fields = applyPlanToAdFields(planId === "free" ? "basic" : planId, current, {
      grantDays: days,
    });
    Object.assign(patch, fields);
    patch.status = "active";
    patch.online = true;
    patch.pendingPlan = null;
  }
  // Admin: cut visibility now (unpaid / end day)
  if (b.cutVisibility === true || b.cutVisibility === "1") {
    const past = new Date(Date.now() - 60 * 1000).toISOString();
    patch.paidUntil = past;
    patch.planExpiresAt = past;
    patch.featured = false;
  }
  if (req.file) {
    patch.photo = `/uploads/${req.file.filename}`;
  }

  const ad = updateAd(req.params.id, patch);
  res.json({ ok: true, ad });
});

app.delete("/api/ads/:id", authAdmin, (req, res) => {
  const ok = deleteAd(req.params.id);
  if (!ok) return res.status(404).json({ error: "No encontrado" });
  res.json({ ok: true });
});

/* Bump / renovar anuncio (sube al listado) */
app.post("/api/ads/:id/bump", authAdmin, (req, res) => {
  const ad = bumpAd(req.params.id);
  if (!ad) return res.status(404).json({ error: "No encontrado" });
  res.json({ ok: true, ad });
});

/* Caducar manualmente anuncios viejos */
app.post("/api/admin/expire", authAdmin, (req, res) => {
  const days = Number(req.body?.days) || 30;
  const n = expireStaleAds(days);
  res.json({ ok: true, expired: n, days });
});

/* Reportar anuncio */
app.post("/api/report", (req, res) => {
  const ip = clientIp(req);
  if (!rateLimit(`report:${ip}`, 15, 60 * 60 * 1000)) {
    return res.status(429).json({ error: "Demasiados reportes." });
  }
  const adId = String(req.body?.adId || "").trim();
  const reason = String(req.body?.reason || "other").trim().slice(0, 80);
  const detail = String(req.body?.detail || "").trim();
  if (!adId) return res.status(400).json({ error: "Falta anuncio" });
  saveReport({ adId, reason, detail });
  notifyReport({ adId, reason, detail }).catch(() => {});
  res.json({ ok: true });
});

app.get("/api/admin/reports", authAdmin, (_req, res) => {
  res.json({ reports: listReports() });
});

app.patch("/api/admin/reports/:id", authAdmin, (req, res) => {
  const status = String(req.body?.status || "resolved").trim();
  if (!["open", "resolved", "dismissed"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  const report = updateReport(req.params.id, { status });
  if (!report) return res.status(404).json({ error: "No encontrado" });
  res.json({ ok: true, report });
});

app.delete("/api/admin/reports/:id", authAdmin, (req, res) => {
  const ok = deleteReport(req.params.id);
  if (!ok) return res.status(404).json({ error: "No encontrado" });
  res.json({ ok: true });
});

/* Dynamic robots.txt with SITE_URL */
app.get("/robots.txt", (_req, res) => {
  const base = (process.env.SITE_URL || "https://www.escortbenidorm.es").replace(/\/$/, "");
  res.type("text/plain").send(`# EscortBenidorm
User-agent: *
Allow: /

Disallow: /admin.html
Disallow: /offline.html
Disallow: /mi-anuncio.html
Disallow: /checkout.html
Disallow: /api/

Sitemap: ${base}/sitemap.xml
`);
});

/* SEO clean URLs for ads: /a/slug-id → anuncio.html */
app.get("/a/:id", (req, res) => {
  res.sendFile(path.join(root, "anuncio.html"));
});

/* —— Static site —— */
app.use(express.static(root, { extensions: ["html"] }));

// SPA-ish fallback for missing files
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API no encontrada" });
  }
  next();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Error" });
});

app.listen(PORT, "0.0.0.0", () => {
  const mode = realMode || isProd ? "PRODUCCIÓN / REAL" : "desarrollo";
  const os = require("os");
  const nets = os.networkInterfaces();
  const lan = [];
  for (const name of Object.keys(nets)) {
    for (const n of nets[name] || []) {
      if (n.family === "IPv4" && !n.internal) lan.push(n.address);
    }
  }
  console.log(`\n  EscortBenidorm [${mode}]`);
  console.log(`  Local:   http://localhost:${PORT}`);
  lan.forEach((ip) => console.log(`  Red LAN: http://${ip}:${PORT}`));
  if (!isProd && !realMode) {
    console.log(`  Admin: ${ADMIN_USER} / (ver .env)`);
  } else {
    console.log(`  Admin: ${ADMIN_USER} / ********  (data/ADMIN-CREDENTIALS.txt)`);
  }
  console.log(`  Anuncios: ${countAll()}  ·  Planes: /precios.html  ·  Health: /api/health\n`);
});
