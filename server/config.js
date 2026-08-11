/**
 * Config central — leída de .env
 */
const isProd = process.env.NODE_ENV === "production";
const realMode = process.env.REAL_MODE === "1" || isProd;

function assertProductionSecrets() {
  if (!isProd && process.env.REAL_MODE !== "1") return;

  const jwt = process.env.JWT_SECRET || "";
  const pass = process.env.ADMIN_PASSWORD || "";
  const weakJwt = !jwt || jwt.length < 24 || /change|dev-secret|secret-change/i.test(jwt);
  const weakPass =
    !pass ||
    pass.length < 10 ||
    /benidorm2026|password|admin123|123456/i.test(pass);

  if (weakJwt || weakPass) {
    console.error("\n  ✗ SECRETOS DÉBILES — no se arranca en modo real/producción.");
    console.error("  Ejecuta:  npm run real:init -- --force");
    console.error("  O edita .env con JWT_SECRET y ADMIN_PASSWORD fuertes.\n");
    process.exit(1);
  }
}

function publicConfig() {
  return {
    siteName: process.env.SITE_NAME || "EscortBenidorm",
    siteUrl: (process.env.SITE_URL || "").replace(/\/$/, ""),
    realMode,
    operator: {
      name: process.env.OPERATOR_NAME || "",
      nif: process.env.OPERATOR_NIF || "",
      email: process.env.OPERATOR_EMAIL || "",
      address: process.env.OPERATOR_ADDRESS || "",
    },
  };
}

module.exports = {
  isProd,
  realMode,
  assertProductionSecrets,
  publicConfig,
  PORT: Number(process.env.PORT) || 3456,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  ADMIN_USER: process.env.ADMIN_USER || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "benidorm2026",
  SEED_DEMOS: process.env.SEED_DEMOS === "1",
};
