/**
 * Inicializa el sitio en modo REAL (producción / catálogo vacío).
 *
 * Uso:
 *   node server/setup-real.js
 *   node server/setup-real.js --domain=https://www.tudominio.com
 *   node server/setup-real.js --with-demos   (mantiene demos, solo secrets)
 *   node server/setup-real.js --force        (sobrescribe .env)
 *
 * Variables opcionales de entorno antes de lanzar:
 *   DOMAIN, ADMIN_USER, OPERATOR_NAME, OPERATOR_NIF, OPERATOR_EMAIL, OPERATOR_ADDRESS
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const args = process.argv.slice(2);
const withDemos = args.includes("--with-demos");
const force = args.includes("--force");
const domainArg = (args.find((a) => a.startsWith("--domain=")) || "").split("=")[1];

function rand(n = 48) {
  return crypto.randomBytes(n).toString("base64url");
}

function pass(n = 18) {
  // legible pero fuerte
  return crypto.randomBytes(n).toString("base64url").replace(/[^a-zA-Z0-9]/g, "x").slice(0, n);
}

const domain =
  domainArg ||
  process.env.DOMAIN ||
  process.env.SITE_URL ||
  "https://www.escortbenidorm.es";

const adminUser = process.env.ADMIN_USER || "admin";
const adminPass = process.env.ADMIN_PASSWORD || pass(20);
const jwtSecret = process.env.JWT_SECRET || rand(40);

const operatorName = process.env.OPERATOR_NAME || "";
const operatorNif = process.env.OPERATOR_NIF || "";
const operatorEmail = process.env.OPERATOR_EMAIL || "";
const operatorAddress = process.env.OPERATOR_ADDRESS || "";

if (fs.existsSync(envPath) && !force) {
  console.log("Ya existe .env — no se sobrescribe (usa --force para regenerar secrets).\n");
} else {
  const env = `# EscortBenidorm — MODO REAL
# Generado: ${new Date().toISOString()}
NODE_ENV=production
REAL_MODE=1
SEED_DEMOS=0
PORT=3456
SITE_URL=${domain.replace(/\/$/, "")}
SITE_NAME=EscortBenidorm

JWT_SECRET=${jwtSecret}
ADMIN_USER=${adminUser}
ADMIN_PASSWORD=${adminPass}

# Datos legales (rellena y reinicia)
OPERATOR_NAME=${operatorName || "[RELLENAR: Nombre o razón social]"}
OPERATOR_NIF=${operatorNif || "[RELLENAR: NIF/CIF]"}
OPERATOR_EMAIL=${operatorEmail || "[RELLENAR: email@tudominio.com]"}
OPERATOR_ADDRESS=${operatorAddress || "[RELLENAR: dirección fiscal, Benidorm/…]"}
`;
  fs.writeFileSync(envPath, env, "utf8");
  console.log("✓ Escrito .env (modo producción)\n");
}

// DB wipe demos / empty catalog
const { wipe, replaceAllAds, listAds, load, countAll } = require("./db");
const data = load();

if (withDemos) {
  console.log(`✓ Catálogo intacto (${countAll()} anuncios). Solo secrets/config.`);
} else {
  // backup first
  const backupDir = path.join(root, "backups");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const bak = path.join(backupDir, `pre-real-${stamp}.json`);
  fs.writeFileSync(bak, JSON.stringify(data, null, 2), "utf8");
  console.log(`✓ Backup DB → ${bak}`);

  wipe();
  // clean non-demo uploads? keep demo svgs for optional reseed; remove user uploads
  const uploads = path.join(root, "uploads");
  if (fs.existsSync(uploads)) {
    for (const f of fs.readdirSync(uploads)) {
      if (f.startsWith("demo-") || f === ".gitkeep") continue;
      try {
        fs.unlinkSync(path.join(uploads, f));
      } catch (_) {}
    }
  }
  console.log("✓ Catálogo vacío (sin demos) — listo para anuncios reales");
}

// credentials file once (gitignored ideally)
const credsPath = path.join(root, "data", "ADMIN-CREDENTIALS.txt");
const envNow = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const mPass = envNow.match(/^ADMIN_PASSWORD=(.+)$/m);
const mUser = envNow.match(/^ADMIN_USER=(.+)$/m);
const mJwt = envNow.match(/^JWT_SECRET=(.+)$/m);
const outPass = mPass ? mPass[1].trim() : adminPass;
const outUser = mUser ? mUser[1].trim() : adminUser;

const creds = `EscortBenidorm — CREDENCIALES ADMIN
=====================================
Fecha: ${new Date().toISOString()}
URL:   ${domain.replace(/\/$/, "")}
Admin: ${domain.replace(/\/$/, "")}/admin.html

Usuario:     ${outUser}
Contraseña:  ${outPass}

GUARDA ESTO EN UN GESTOR DE CONTRASEÑAS y borra este archivo:
  data/ADMIN-CREDENTIALS.txt

NO subas este archivo a git ni lo envíes por WhatsApp.
`;
fs.writeFileSync(credsPath, creds, "utf8");

console.log(`
========================================
  MODO REAL LISTO
========================================
  Dominio/SITE_URL: ${domain}
  Admin URL:        ${domain.replace(/\/$/, "")}/admin.html
  Usuario:          ${outUser}
  Contraseña:       ${outPass}

  Guardado también en:
  data/ADMIN-CREDENTIALS.txt  ← bórralo tras copiarla

  Siguiente:
  1. Edita .env → OPERATOR_* con tus datos legales
  2. npm start  (o pm2 / docker)
  3. Publica el primer anuncio real en /publicar.html
  4. Lee GO-LIVE.md para dominio + HTTPS + Search Console
========================================
`);
