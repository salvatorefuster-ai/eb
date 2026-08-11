/**
 * Asistente NIVEL 3 — datos legales, cobro y modo negocio
 * Uso:  node server/setup-nivel3.js
 *   o:  nivel3.bat
 *
 * Pregunta en español y actualiza .env sin borrar JWT/admin si ya existen.
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");

function loadEnv() {
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) map[m[1]] = m[2];
    });
  return map;
}

function saveEnv(map) {
  const order = [
    "NODE_ENV",
    "REAL_MODE",
    "SEED_DEMOS",
    "ALLOW_MOCK_PAY",
    "AUTO_ACTIVATE_PAY",
    "PORT",
    "SITE_URL",
    "SITE_NAME",
    "JWT_SECRET",
    "ADMIN_USER",
    "ADMIN_PASSWORD",
    "OPERATOR_NAME",
    "OPERATOR_NIF",
    "OPERATOR_EMAIL",
    "OPERATOR_ADDRESS",
    "PLAN_VIP_PRICE",
    "PLAN_TOP_PRICE",
    "PAY_BIZUM",
    "PAY_IBAN",
    "PAY_HOLDER",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "SMTP_TO",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "GA_MEASUREMENT_ID",
  ];
  const lines = [
    "# EscortBenidorm — NIVEL 3 (negocio real)",
    `# Generado: ${new Date().toISOString()}`,
    "",
  ];
  const written = new Set();
  for (const k of order) {
    if (map[k] !== undefined && map[k] !== "") {
      lines.push(`${k}=${map[k]}`);
      written.add(k);
    }
  }
  Object.keys(map).forEach((k) => {
    if (!written.has(k) && map[k] !== undefined && map[k] !== "") {
      lines.push(`${k}=${map[k]}`);
    }
  });
  fs.writeFileSync(envPath, lines.join("\n") + "\n", "utf8");
}

function ask(rl, q, def = "") {
  const hint = def ? ` [${def}]` : "";
  return new Promise((resolve) => {
    rl.question(`${q}${hint}: `, (ans) => {
      const v = String(ans || "").trim();
      resolve(v || def);
    });
  });
}

function askYes(rl, q, defYes = true) {
  return ask(rl, `${q} (s/n)`, defYes ? "s" : "n").then((a) => /^s|si|y|yes$/i.test(a));
}

async function main() {
  console.log(`
========================================
  ESCORTBENIDORM — NIVEL 3
  Datos para que la web sea de negocio
========================================
Responde y pulsa Enter.
Si dejas vacío, se mantiene el valor entre corchetes.
`);

  const env = loadEnv();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // Base
  env.NODE_ENV = "production";
  env.REAL_MODE = "1";
  env.SEED_DEMOS = "0";
  env.PORT = env.PORT || "3456";
  env.SITE_NAME = env.SITE_NAME || "EscortBenidorm";

  if (!env.JWT_SECRET || env.JWT_SECRET.length < 24) {
    env.JWT_SECRET = crypto.randomBytes(40).toString("base64url");
  }
  if (!env.ADMIN_USER) env.ADMIN_USER = "admin";
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD === "benidorm2026" || env.ADMIN_PASSWORD.length < 10) {
    env.ADMIN_PASSWORD = crypto.randomBytes(14).toString("base64url").replace(/[^a-zA-Z0-9]/g, "x");
    console.log("\n  → Se ha generado una contraseña admin NUEVA (guárdala).\n");
  }

  console.log("--- 1) DÓNDE ESTÁ LA WEB ---");
  env.SITE_URL = await ask(
    rl,
    "URL pública (si aún no tienes dominio, deja localhost)",
    env.SITE_URL || "http://localhost:3456"
  );

  console.log("\n--- 2) DATOS LEGALES (aparecen en Aviso legal) ---");
  env.OPERATOR_NAME = await ask(rl, "Tu nombre completo o nombre de la empresa", env.OPERATOR_NAME || "");
  env.OPERATOR_NIF = await ask(rl, "NIF o CIF", env.OPERATOR_NIF || "");
  env.OPERATOR_EMAIL = await ask(rl, "Email de contacto / soporte", env.OPERATOR_EMAIL || "");
  env.OPERATOR_ADDRESS = await ask(
    rl,
    "Dirección fiscal (calle, CP, ciudad)",
    env.OPERATOR_ADDRESS || ""
  );

  console.log("\n--- 3) CÓMO COBRAS (recarga de créditos) ---");
  env.PAY_BIZUM = await ask(rl, "Número de móvil para Bizum (sin espacios)", env.PAY_BIZUM || "");
  env.PAY_IBAN = await ask(rl, "IBAN de la cuenta (transferencias)", env.PAY_IBAN || "");
  env.PAY_HOLDER = await ask(rl, "Titular de la cuenta / Bizum", env.PAY_HOLDER || env.OPERATOR_NAME || "");

  console.log("\n--- 4) COSTE EN CRÉDITOS POR DÍA (1 crédito ≈ 1 €) ---");
  env.PLAN_BASIC_PRICE = await ask(rl, "Créditos plan Día (recomendado 5)", env.PLAN_BASIC_PRICE || env.PLAN_DAY_PRICE || "5");
  env.PLAN_DAY_PRICE = env.PLAN_BASIC_PRICE;
  env.PLAN_VIP_PRICE = await ask(rl, "Créditos plan VIP (recomendado 7)", env.PLAN_VIP_PRICE || "7");
  env.PLAN_TOP_PRICE = await ask(rl, "Créditos plan TOP (recomendado 10)", env.PLAN_TOP_PRICE || "10");

  console.log("\n--- 5) SEGURIDAD DE PAGOS ---");
  const isLocal = /localhost|127\.0\.0\.1/.test(env.SITE_URL || "");
  if (isLocal) {
    const mock = await askYes(rl, "¿Dejar activado el 'pago simulado' (solo para pruebas en el PC)?", true);
    env.ALLOW_MOCK_PAY = mock ? "1" : "0";
  } else {
    console.log("  URL pública detectada → se DESACTIVA el pago simulado (correcto para negocio).");
    env.ALLOW_MOCK_PAY = "0";
  }

  const autoPay = await askYes(
    rl,
    "¿Activar VIP/TOP en cuanto digan 'he pagado' SIN que revises el Bizum? (NO recomendado)",
    false
  );
  env.AUTO_ACTIVATE_PAY = autoPay ? "1" : "0";

  console.log("\n--- 6) OPCIONAL (puedes saltar con Enter) ---");
  const wantMail = await askYes(rl, "¿Quieres configurar email de avisos ahora?", false);
  if (wantMail) {
    env.SMTP_HOST = await ask(rl, "SMTP host", env.SMTP_HOST || "");
    env.SMTP_PORT = await ask(rl, "SMTP puerto", env.SMTP_PORT || "587");
    env.SMTP_USER = await ask(rl, "SMTP usuario", env.SMTP_USER || "");
    env.SMTP_PASS = await ask(rl, "SMTP contraseña", env.SMTP_PASS || "");
    env.SMTP_FROM = await ask(rl, "Email remitente", env.SMTP_FROM || env.OPERATOR_EMAIL || "");
    env.SMTP_TO = await ask(rl, "Email donde recibes avisos", env.SMTP_TO || env.OPERATOR_EMAIL || "");
  }

  const wantStripe = await askYes(rl, "¿Tienes claves de Stripe (tarjeta) ya?", false);
  if (wantStripe) {
    env.STRIPE_SECRET_KEY = await ask(rl, "STRIPE_SECRET_KEY", env.STRIPE_SECRET_KEY || "");
    env.STRIPE_WEBHOOK_SECRET = await ask(rl, "STRIPE_WEBHOOK_SECRET", env.STRIPE_WEBHOOK_SECRET || "");
  }

  const wantGa = await askYes(rl, "¿Tienes Google Analytics (G-XXXX)?", false);
  if (wantGa) {
    env.GA_MEASUREMENT_ID = await ask(rl, "GA_MEASUREMENT_ID", env.GA_MEASUREMENT_ID || "");
  }

  rl.close();
  saveEnv(env);

  // credenciales
  const creds = `EscortBenidorm — NIVEL 3
========================
Fecha: ${new Date().toISOString()}
URL: ${env.SITE_URL}

ADMIN
  Usuario: ${env.ADMIN_USER}
  Contraseña: ${env.ADMIN_PASSWORD}
  Panel: ${env.SITE_URL.replace(/\/$/, "")}/admin.html

LEGAL
  ${env.OPERATOR_NAME} · ${env.OPERATOR_NIF}
  ${env.OPERATOR_EMAIL}
  ${env.OPERATOR_ADDRESS}

COBRO
  Bizum: ${env.PAY_BIZUM}
  IBAN: ${env.PAY_IBAN}
  Titular: ${env.PAY_HOLDER}
  Coste/día: Día ${env.PLAN_DAY_PRICE || env.PLAN_BASIC_PRICE} · VIP ${env.PLAN_VIP_PRICE} · TOP ${env.PLAN_TOP_PRICE} créd.
  Recarga: 1–1000 € enteros · 50–999 +20% · 1000 +50%

MOCK PAY: ${env.ALLOW_MOCK_PAY === "1" ? "SÍ (solo pruebas)" : "NO (negocio)"}

1) Guarda esta contraseña en un sitio seguro
2) Borra este archivo: data/ADMIN-CREDENTIALS.txt
3) Reinicia la web: start.bat
4) Lee NIVEL-3.md  →  cómo cobrar cada día
`;
  const credsPath = path.join(root, "data", "ADMIN-CREDENTIALS.txt");
  fs.mkdirSync(path.dirname(credsPath), { recursive: true });
  fs.writeFileSync(credsPath, creds, "utf8");

  console.log(`
========================================
  LISTO — NIVEL 3 configurado
========================================
  .env actualizado
  Credenciales: data\\ADMIN-CREDENTIALS.txt

  SIGUIENTE:
  1. Cierra la ventana negra del servidor si está abierta
  2. Doble clic en start.bat
  3. Abre: ${env.SITE_URL}
  4. Comprueba Aviso legal (sin aviso rojo)
  5. Comprueba Precios (tu Bizum/IBAN)
  6. Publica el primer anuncio real
  7. Lee NIVEL-3.md (cómo cobrar VIP)

  Admin: ${env.ADMIN_USER} / (ver ADMIN-CREDENTIALS.txt)
========================================
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
