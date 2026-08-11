/**
 * Update keys in .env without wiping the rest.
 *
 * Examples:
 *   node server/patch-env.js SITE_URL=https://escortbenidorm.es
 *   node server/patch-env.js PAY_BIZUM=612345678 PAY_IBAN=ES12... PAY_HOLDER="Nombre"
 *   node server/patch-env.js ALLOW_MOCK_PAY=0
 *   node server/patch-env.js --list
 */
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const args = process.argv.slice(2);

if (!args.length || args.includes("--help") || args.includes("-h")) {
  console.log(`Usage:
  node server/patch-env.js KEY=value [KEY=value ...]
  node server/patch-env.js --list
`);
  process.exit(0);
}

if (!fs.existsSync(envPath)) {
  console.error("No .env found. Run: npm run real:init");
  process.exit(1);
}

let text = fs.readFileSync(envPath, "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

function parseEnv(raw) {
  const map = new Map();
  const lines = raw.split(/\r?\n/);
  const order = [];
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) {
      order.push({ type: "raw", line });
      continue;
    }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) {
      order.push({ type: "raw", line });
      continue;
    }
    map.set(m[1], m[2]);
    order.push({ type: "key", key: m[1] });
  }
  return { map, order };
}

const { map, order } = parseEnv(text);

if (args.includes("--list")) {
  for (const [k, v] of map) {
    const hide = /SECRET|PASSWORD|JWT/i.test(k);
    console.log(`${k}=${hide ? "***" : v}`);
  }
  process.exit(0);
}

const updates = [];
for (const a of args) {
  if (a.startsWith("--")) continue;
  const i = a.indexOf("=");
  if (i < 0) {
    console.error("Bad arg (need KEY=value):", a);
    process.exit(1);
  }
  const key = a.slice(0, i).trim();
  let val = a.slice(i + 1);
  // strip surrounding quotes
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    console.error("Invalid key:", key);
    process.exit(1);
  }
  updates.push([key, val]);
}

for (const [key, val] of updates) {
  if (map.has(key)) {
    map.set(key, val);
    console.log(`updated ${key}`);
  } else {
    map.set(key, val);
    order.push({ type: "key", key });
    console.log(`added   ${key}`);
  }
}

const out = [];
const seen = new Set();
for (const item of order) {
  if (item.type === "raw") {
    out.push(item.line);
    continue;
  }
  if (seen.has(item.key)) continue;
  seen.add(item.key);
  out.push(`${item.key}=${map.get(item.key)}`);
}
// any new keys not in order (already pushed)
for (const [k, v] of map) {
  if (!seen.has(k)) out.push(`${k}=${v}`);
}

fs.writeFileSync(envPath, out.join("\n").replace(/\n*$/, "\n"), "utf8");
console.log("\n.env saved. Restart server for changes: npm start");
