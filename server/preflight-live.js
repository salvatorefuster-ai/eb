/**
 * Pre-flight checklist before going live.
 * Run: node server/preflight-live.js
 * Optional: BASE_URL=https://yourdomain.com node server/preflight-live.js
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const localMode = process.argv.includes("--local") || process.env.PREFLIGHT_LOCAL === "1";
const base =
  process.env.BASE_URL ||
  (localMode ? "http://localhost:3456" : process.env.SITE_URL) ||
  "http://localhost:3456";
const root = path.join(__dirname, "..");
const results = [];

function check(name, ok, detail = "", { soft = false } = {}) {
  const pass = !!ok;
  results.push({ name, ok: pass, detail, soft });
  const tag = pass ? "OK  " : soft || localMode ? "WARN" : "FAIL";
  console.log(`${tag} ${name}${detail ? " — " + detail : ""}`);
}

function envFilled(key) {
  const v = process.env[key] || "";
  if (!v.trim()) return false;
  if (/RELLENAR|CONFIGURA|tudominio|example\.com|cambia|genera/i.test(v)) return false;
  return true;
}

(async () => {
  console.log("\n=== LIVE PREFLIGHT ===\n");
  console.log("Target:", base, "\n");

  if (localMode) console.log("(local mode: payment/legal missing = WARN, not FAIL)\n");

  check(".env exists", fs.existsSync(path.join(root, ".env")));
  check("REAL_MODE=1", process.env.REAL_MODE === "1");
  check("SEED_DEMOS off", process.env.SEED_DEMOS !== "1");
  check("JWT_SECRET strong", (process.env.JWT_SECRET || "").length >= 24);
  check("ADMIN_PASSWORD set", (process.env.ADMIN_PASSWORD || "").length >= 10);
  check(
    "SITE_URL is https (prod)",
    /^https:\/\//i.test(process.env.SITE_URL || "") || /localhost/i.test(base),
    process.env.SITE_URL || "(empty)",
    { soft: localMode }
  );
  check("OPERATOR_NAME", envFilled("OPERATOR_NAME"), "", { soft: localMode });
  check("OPERATOR_EMAIL", envFilled("OPERATOR_EMAIL"), "", { soft: localMode });
  check("OPERATOR_NIF", envFilled("OPERATOR_NIF"), "", { soft: localMode });
  check("PAY_BIZUM", envFilled("PAY_BIZUM"), "", { soft: localMode });
  check("PAY_IBAN", envFilled("PAY_IBAN"), "", { soft: localMode });
  check("PAY_HOLDER", envFilled("PAY_HOLDER"), "", { soft: localMode });
  check(
    "ALLOW_MOCK_PAY off for real money",
    process.env.ALLOW_MOCK_PAY !== "1",
    `ALLOW_MOCK_PAY=${process.env.ALLOW_MOCK_PAY || "unset"}`,
    { soft: localMode }
  );
  check(
    "PLAN prices daily",
    Number(process.env.PLAN_VIP_PRICE || 7) <= 15 && Number(process.env.PLAN_TOP_PRICE || 10) <= 20
  );

  const pages = [
    "/",
    "/api/health",
    "/api/plans",
    "/precios.html",
    "/publicar.html",
    "/putas-benidorm.html",
    "/scorts-benidorm.html",
    "/sitemap.xml",
    "/robots.txt",
  ];

  let serverUp = false;
  for (const p of pages) {
    try {
      const res = await fetch(base.replace(/\/$/, "") + p, { redirect: "follow" });
      const ok = res.ok;
      if (p === "/api/health" && ok) serverUp = true;
      check("HTTP " + p, ok, String(res.status));
    } catch (e) {
      check("HTTP " + p, false, e.message);
    }
  }

  if (serverUp) {
    try {
      const r = await fetch(base.replace(/\/$/, "") + "/api/plans");
      const j = await r.json();
      const plans = j.plans || [];
      const prices = Object.fromEntries(plans.map((x) => [x.id, x.price]));
      check("Plan basic ~5€", prices.basic === 5, String(prices.basic));
      check("Plan vip ~7€", prices.vip === 7, String(prices.vip));
      check("Plan top ~10€", prices.top === 10, String(prices.top));
    } catch (e) {
      check("Plan prices API", false, e.message);
    }
  }

  const creds = path.join(root, "data", "ADMIN-CREDENTIALS.txt");
  check("ADMIN-CREDENTIALS.txt removed (prod)", !fs.existsSync(creds), creds, {
    soft: localMode,
  });

  const failed = results.filter((r) => !r.ok && !(localMode && r.soft));
  const warns = results.filter((r) => !r.ok && r.soft);
  const pass = results.filter((r) => r.ok).length;
  console.log(`\n==== ${pass}/${results.length} OK · ${warns.length} WARN · ${failed.length} FAIL ====`);
  if (warns.length) {
    console.log("\nStill needed before real production:");
    warns.forEach((f) => console.log(" -", f.name, f.detail ? `(${f.detail})` : ""));
  }
  if (failed.length) {
    console.log("\nBlockers:");
    failed.forEach((f) => console.log(" -", f.name, f.detail ? `(${f.detail})` : ""));
    console.log("\nFix, restart, re-run: npm run preflight");
    console.log("Local-only check: npm run preflight -- --local");
    process.exit(1);
  }
  if (localMode && warns.length) {
    console.log("\nLocal stack OK. Fill payment/legal + VPS to go live.");
    process.exit(0);
  }
  console.log("\nReady for go-live.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
