const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "..", "data");
const uploadsDir = path.join(__dirname, "..", "uploads");
const dbPath = path.join(dataDir, "db.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

function defaultDb() {
  return {
    ads: [],
    contacts: [],
    payments: [],
    pinRecoveries: [],
    users: [],
    creditLedger: [],
  };
}

function load() {
  try {
    if (!fs.existsSync(dbPath)) {
      const empty = defaultDb();
      fs.writeFileSync(dbPath, JSON.stringify(empty, null, 2), "utf8");
      return empty;
    }
    const raw = fs.readFileSync(dbPath, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data.ads)) data.ads = [];
    if (!Array.isArray(data.contacts)) data.contacts = [];
    if (!Array.isArray(data.payments)) data.payments = [];
    if (!Array.isArray(data.pinRecoveries)) data.pinRecoveries = [];
    if (!Array.isArray(data.users)) data.users = [];
    if (!Array.isArray(data.creditLedger)) data.creditLedger = [];
    return data;
  } catch (err) {
    console.error("DB load error, recreating:", err.message);
    return defaultDb();
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !String(stored).includes(":")) return false;
  const [salt, hash] = String(stored).split(":");
  try {
    const h = crypto.scryptSync(String(password), salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(h, "hex"));
  } catch {
    return false;
  }
}

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    phone: u.phone,
    name: u.name || "",
    credits: Number(u.credits) || 0,
    createdAt: u.createdAt,
  };
}

function createUser(user) {
  const data = load();
  data.users = data.users || [];
  const row = {
    ...user,
    credits: Number(user.credits) >= 0 ? Number(user.credits) : 0,
  };
  data.users.unshift(row);
  save(data);
  return row;
}

/** Añade o resta créditos y escribe en el ledger. amount > 0 = ingreso */
function adjustCredits(userId, amount, { type = "adjust", meta = {}, paymentId = null } = {}) {
  const data = load();
  const i = (data.users || []).findIndex((u) => u.id === userId);
  if (i < 0) return null;
  const delta = Number(amount) || 0;
  const prev = Number(data.users[i].credits) || 0;
  const next = Math.round((prev + delta) * 100) / 100;
  if (next < -0.001) return { error: "Saldo insuficiente", credits: prev };
  data.users[i].credits = Math.max(0, next);
  data.users[i].updatedAt = new Date().toISOString();
  data.creditLedger = data.creditLedger || [];
  const entry = {
    id: `CL-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    type,
    amount: delta,
    balanceAfter: data.users[i].credits,
    paymentId,
    meta,
    createdAt: new Date().toISOString(),
  };
  data.creditLedger.unshift(entry);
  if (data.creditLedger.length > 2000) data.creditLedger = data.creditLedger.slice(0, 2000);
  save(data);
  return { user: data.users[i], entry, credits: data.users[i].credits };
}

function listCreditLedger(userId, limit = 50) {
  const all = load().creditLedger || [];
  const rows = userId ? all.filter((e) => e.userId === userId) : all;
  return rows.slice(0, limit);
}

function getUserCredits(userId) {
  const u = getUser(userId);
  return u ? Number(u.credits) || 0 : 0;
}

function findUserByEmail(email) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  return (load().users || []).find((u) => u.email === e) || null;
}

function findUserByPhone(phone) {
  const p = String(phone || "").replace(/\D/g, "");
  return (load().users || []).find((u) => String(u.phone || "").replace(/\D/g, "") === p) || null;
}

function getUser(id) {
  return (load().users || []).find((u) => u.id === id) || null;
}

function listUsers() {
  return load().users || [];
}

function updateUser(id, patch) {
  const data = load();
  const i = (data.users || []).findIndex((u) => u.id === id);
  if (i < 0) return null;
  data.users[i] = { ...data.users[i], ...patch, updatedAt: new Date().toISOString() };
  save(data);
  return data.users[i];
}

function save(data) {
  const tmp = dbPath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, dbPath);
}

function expireStaleAds(days = 30) {
  const data = load();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  let n = 0;
  data.ads.forEach((a) => {
    if (a.status !== "active") return;
    if (a.source === "demo") return; // demos no caducan
    const t = new Date(a.lastBump || a.updatedAt || a.createdAt || 0).getTime();
    if (t && t < cutoff) {
      a.status = "expired";
      a.updatedAt = new Date().toISOString();
      n += 1;
    }
  });
  if (n) save(data);
  return n;
}

function bumpAd(id) {
  const data = load();
  const ad = data.ads.find((a) => a.id === id);
  if (!ad) return null;
  const now = new Date().toISOString();
  ad.lastBump = now;
  ad.updatedAt = now;
  ad.status = "active";
  ad.online = true;
  // move to front
  data.ads = [ad, ...data.ads.filter((a) => a.id !== id)];
  save(data);
  return ad;
}

/** Downgrade VIP/TOP if planExpiresAt passed */
function enforcePlanExpiry(ad) {
  if (!ad || !ad.planExpiresAt || ad.plan === "free") return ad;
  const exp = new Date(ad.planExpiresAt).getTime();
  if (!exp || exp > Date.now()) return ad;
  ad.plan = "free";
  ad.featured = false;
  ad.planExpiresAt = null;
  ad.planPaidAt = null;
  ad.pendingPlan = null;
  const tags = new Set(ad.tags || []);
  tags.delete("vip");
  tags.delete("verified");
  ad.tags = [...tags];
  ad.updatedAt = new Date().toISOString();
  return ad;
}

function enforceAllPlanExpiries() {
  const data = load();
  let n = 0;
  data.ads.forEach((a) => {
    const before = a.plan;
    enforcePlanExpiry(a);
    if (a.plan !== before) n += 1;
  });
  if (n) save(data);
  return n;
}

/** Daily bump quota by plan */
function canBumpToday(ad) {
  const plan = ad.plan || "free";
  const limits = { free: 1, basic: 2, day: 2, vip: 5, top: 99 };
  const max = limits[plan] != null ? limits[plan] : 1;
  const day = new Date().toISOString().slice(0, 10);
  const bumps = ad.bumpsToday || { day: "", count: 0 };
  const count = bumps.day === day ? bumps.count : 0;
  return { ok: count < max, remaining: Math.max(0, max - count), max, used: count };
}

function recordBumpToday(id) {
  const data = load();
  const ad = data.ads.find((a) => a.id === id);
  if (!ad) return null;
  const day = new Date().toISOString().slice(0, 10);
  const bumps = ad.bumpsToday || { day: "", count: 0 };
  if (bumps.day !== day) {
    ad.bumpsToday = { day, count: 1 };
  } else {
    ad.bumpsToday = { day, count: (bumps.count || 0) + 1 };
  }
  save(data);
  return ad;
}

function saveReport({ adId, reason, detail }) {
  const data = load();
  if (!Array.isArray(data.reports)) data.reports = [];
  data.reports.unshift({
    id: Date.now().toString(36),
    adId: adId || "",
    reason: reason || "other",
    detail: (detail || "").slice(0, 1000),
    status: "open",
    createdAt: new Date().toISOString(),
  });
  if (data.reports.length > 200) data.reports = data.reports.slice(0, 200);
  save(data);
}

function listReports() {
  return load().reports || [];
}

function updateReport(id, patch) {
  const data = load();
  if (!Array.isArray(data.reports)) data.reports = [];
  const i = data.reports.findIndex((r) => r.id === id);
  if (i < 0) return null;
  data.reports[i] = { ...data.reports[i], ...patch, updatedAt: new Date().toISOString() };
  save(data);
  return data.reports[i];
}

function deleteReport(id) {
  const data = load();
  const before = (data.reports || []).length;
  data.reports = (data.reports || []).filter((r) => r.id !== id);
  save(data);
  return data.reports.length < before;
}

function listAds({
  admin = false,
  zone,
  q,
  online,
  maxPrice,
  minPrice,
  nationality,
  minAge,
  maxAge,
  independent,
  incall,
  outcall,
  available24h,
  featured,
  lang,
} = {}) {
  // auto-expire user ads + paid plans on read (cheap maintenance)
  try {
    expireStaleAds(30);
    enforceAllPlanExpiries();
  } catch (_) {}

  let ads = load().ads.slice();
  ads.forEach((a) => enforcePlanExpiry(a));
  if (!admin) {
    const { isAdVisibleNow } = require("./plans");
    ads = ads.filter((a) => a.status === "active" && isAdVisibleNow(a));
  }

  if (zone) ads = ads.filter((a) => a.zoneSlug === zone);
  if (online === true || online === "1" || online === "true") {
    ads = ads.filter((a) => a.online);
  }
  if (featured === true || featured === "1" || featured === "true") {
    ads = ads.filter((a) => a.featured);
  }
  if (independent === true || independent === "1" || independent === "true") {
    ads = ads.filter((a) => a.independent);
  }
  if (incall === true || incall === "1" || incall === "true") {
    ads = ads.filter((a) => a.incall);
  }
  if (outcall === true || outcall === "1" || outcall === "true") {
    ads = ads.filter((a) => a.outcall);
  }
  if (available24h === true || available24h === "1" || available24h === "true") {
    ads = ads.filter((a) => a.available24h);
  }
  if (maxPrice) ads = ads.filter((a) => a.price <= Number(maxPrice));
  if (minPrice) ads = ads.filter((a) => a.price >= Number(minPrice));
  if (minAge) ads = ads.filter((a) => a.age >= Number(minAge));
  if (maxAge) ads = ads.filter((a) => a.age <= Number(maxAge));
  if (nationality) {
    const n = String(nationality).toLowerCase();
    ads = ads.filter((a) => (a.nationality || "").toLowerCase().includes(n));
  }
  if (lang) {
    const L = String(lang).toUpperCase();
    ads = ads.filter((a) =>
      (a.languages || []).map((x) => String(x).toUpperCase()).includes(L)
    );
  }
  if (q) {
    const s = String(q).toLowerCase();
    ads = ads.filter(
      (a) =>
        a.name.toLowerCase().includes(s) ||
        (a.title || "").toLowerCase().includes(s) ||
        a.zone.toLowerCase().includes(s) ||
        (a.locationDetail || "").toLowerCase().includes(s) ||
        (a.nationality || "").toLowerCase().includes(s) ||
        (a.desc || "").toLowerCase().includes(s) ||
        (a.languages || []).some((l) => String(l).toLowerCase().includes(s))
    );
  }

  const { visibilityScore } = require("./plans");
  ads.sort((a, b) => {
    const bumpA = new Date(a.lastBump || a.updatedAt || a.createdAt || 0).getTime() / 1e12;
    const bumpB = new Date(b.lastBump || b.updatedAt || b.createdAt || 0).getTime() / 1e12;
    return visibilityScore(b) + bumpB - (visibilityScore(a) + bumpA);
  });

  return ads;
}

function getAd(id) {
  const ad = load().ads.find((a) => a.id === id) || null;
  if (!ad) return null;
  const before = ad.plan;
  enforcePlanExpiry(ad);
  if (ad.plan !== before) {
    updateAd(id, {
      plan: ad.plan,
      featured: ad.featured,
      tags: ad.tags,
      planExpiresAt: ad.planExpiresAt,
      planPaidAt: ad.planPaidAt,
      pendingPlan: ad.pendingPlan,
    });
  }
  return getAdRaw(id);
}

function getAdRaw(id) {
  return load().ads.find((a) => a.id === id) || null;
}

function createAd(ad) {
  const data = load();
  data.ads.unshift(ad);
  save(data);
  return ad;
}

function updateAd(id, patch) {
  const data = load();
  const i = data.ads.findIndex((a) => a.id === id);
  if (i < 0) return null;
  data.ads[i] = {
    ...data.ads[i],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  save(data);
  return data.ads[i];
}

function deleteAd(id) {
  const data = load();
  const ad = data.ads.find((a) => a.id === id);
  if (!ad) return false;
  data.ads = data.ads.filter((a) => a.id !== id);
  save(data);
  const files = new Set();
  if (ad.photo) files.add(path.basename(ad.photo));
  (ad.photos || []).forEach((p) => {
    if (p && String(p).startsWith("/uploads/")) files.add(path.basename(p));
  });
  files.forEach((name) => {
    // keep demo assets
    if (String(name).startsWith("demo-")) return;
    const file = path.join(uploadsDir, name);
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (_) {}
    }
  });
  return true;
}

function bumpViews(id) {
  const data = load();
  const ad = data.ads.find((a) => a.id === id);
  if (!ad) return null;
  ad.views = (ad.views || 0) + 1;
  ad.updatedAt = new Date().toISOString();
  save(data);
  return ad;
}

function stats() {
  const data = load();
  const { isAdVisibleNow } = require("./plans");
  const ads = data.ads.filter((a) => a.status === "active");
  const payments = data.payments || [];
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const dayMs = startOfDay.getTime();
  const paidToday = payments.filter((p) => {
    if (p.status !== "paid") return false;
    const t = new Date(p.paidAt || p.updatedAt || 0).getTime();
    return t >= dayMs;
  });
  const revenueToday = paidToday.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const visibleNow = data.ads.filter((a) => a.status === "active" && isAdVisibleNow(a)).length;
  return {
    total: visibleNow,
    online: ads.filter((a) => a.online && isAdVisibleNow(a)).length,
    zones: 6,
    contacts: (data.contacts || []).length,
    reports: (data.reports || []).filter((r) => (r.status || "open") === "open").length,
    allAds: data.ads.length,
    activeAds: ads.length,
    visibleNow,
    expired: data.ads.filter((a) => a.status === "expired").length,
    paymentsPending: payments.filter((p) => p.status === "pending" || p.status === "awaiting").length,
    paymentsPaid: payments.filter((p) => p.status === "paid").length,
    paidToday: paidToday.length,
    revenueToday: Math.round(revenueToday * 100) / 100,
  };
}

function createPayment(order) {
  const data = load();
  data.payments = data.payments || [];
  data.payments.unshift(order);
  if (data.payments.length > 500) data.payments = data.payments.slice(0, 500);
  save(data);
  return order;
}

function getPayment(id) {
  return (load().payments || []).find((p) => p.id === id) || null;
}

function updatePayment(id, patch) {
  const data = load();
  data.payments = data.payments || [];
  const i = data.payments.findIndex((p) => p.id === id);
  if (i < 0) return null;
  data.payments[i] = { ...data.payments[i], ...patch, updatedAt: new Date().toISOString() };
  save(data);
  return data.payments[i];
}

function listPayments() {
  return load().payments || [];
}

/** Remove payments whose ad no longer exists */
function purgeOrphanPayments() {
  const data = load();
  const ids = new Set((data.ads || []).map((a) => a.id));
  const before = (data.payments || []).length;
  data.payments = (data.payments || []).filter((p) => !p.adId || ids.has(p.adId));
  const n = before - data.payments.length;
  if (n) save(data);
  return n;
}

function savePinRecovery(row) {
  const data = load();
  data.pinRecoveries = data.pinRecoveries || [];
  data.pinRecoveries.unshift(row);
  if (data.pinRecoveries.length > 100) data.pinRecoveries = data.pinRecoveries.slice(0, 100);
  save(data);
  return row;
}

function listPinRecoveries() {
  return load().pinRecoveries || [];
}

function saveContact({ email, subject, message }) {
  const data = load();
  data.contacts.unshift({
    id: Date.now().toString(36),
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  });
  // keep last 200
  if (data.contacts.length > 200) data.contacts = data.contacts.slice(0, 200);
  save(data);
}

function listContacts() {
  return load().contacts || [];
}

function deleteContact(id) {
  const data = load();
  const before = data.contacts.length;
  data.contacts = (data.contacts || []).filter((c) => c.id !== id);
  save(data);
  return data.contacts.length < before;
}

function countAll() {
  return load().ads.length;
}

function wipe() {
  save(defaultDb());
}

function replaceAllAds(ads) {
  const data = load();
  data.ads = ads;
  save(data);
}

module.exports = {
  dbPath,
  uploadsDir,
  dataDir,
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
  adjustCredits,
  listCreditLedger,
  getUserCredits,
  canBumpToday,
  recordBumpToday,
  enforcePlanExpiry,
  enforceAllPlanExpiries,
  countAll,
  wipe,
  replaceAllAds,
  load,
  getAdRaw,
};
