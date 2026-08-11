/**
 * Smoke tests for REAL mode (empty catalog OK)
 */
const base = process.env.BASE_URL || "http://localhost:3456";

async function req(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text.slice(0, 200);
  }
  return { status: res.status, data, ok: res.ok };
}

function jpegBlob() {
  const b64 =
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGcP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z";
  return new Blob([Buffer.from(b64, "base64")], { type: "image/jpeg" });
}

(async () => {
  const results = [];
  const ok = (name, pass, extra = "") => {
    results.push({ name, pass, extra });
    console.log(`${pass ? "OK  " : "FAIL"} ${name}${extra ? " — " + extra : ""}`);
  };

  let r = await req(`${base}/api/health`);
  ok("health", r.ok && r.data.ok, `realMode=${r.data.realMode} ads=${r.data.ads}`);
  ok("real mode on", r.data.realMode === true || r.data.env === "production");

  r = await req(`${base}/api/config`);
  ok("public config", r.ok && r.data.siteName);

  r = await req(`${base}/api/ads`);
  ok("list ads empty-or-any", r.ok && Array.isArray(r.data.ads), `n=${(r.data.ads || []).length}`);

  // publish real ad
  const fd = new FormData();
  fd.append("name", "RealQA");
  fd.append("age", "26");
  fd.append("zone", "levante");
  fd.append("price", "150");
  fd.append("phone", "34611122233");
  fd.append("manageEmail", "realqa@test.local");
  fd.append("desc", "Anuncio real de prueba en Benidorm Levante. Calidad y contacto directo.");
  fd.append("title", "Real QA Levante Benidorm");
  fd.append("languages", "ES, EN");
  fd.append("services", "Hotel");
  fd.append("plan", "free");
  fd.append("photos", jpegBlob(), "a.jpg");

  r = await req(`${base}/api/ads`, { method: "POST", body: fd });
  ok("publish real", r.ok && r.data.managePin && r.data.ad, r.data.error || r.data.managePin);
  const id = r.data.ad?.id;
  const pin = r.data.managePin;

  if (id && pin) {
    r = await req(`${base}/api/my-ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "34611122233", pin }),
    });
    ok("manage pin works", r.ok && (r.data.ads || []).length === 1);

    r = await req(`${base}/api/my-ads/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "34611122233", pin }),
    });
    ok("delete real ad", r.ok);
  }

  // admin with env password - skip if we can't read
  const fs = require("fs");
  const path = require("path");
  let adminPass = "";
  try {
    const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
    adminPass = (env.match(/^ADMIN_PASSWORD=(.+)$/m) || [])[1]?.trim() || "";
  } catch (_) {}

  if (adminPass) {
    r = await req(`${base}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "admin", password: adminPass }),
    });
    ok("admin login strong pass", r.ok && !!r.data.token);
  } else {
    ok("admin login strong pass", false, "no .env password");
  }

  for (const p of ["/", "/publicar.html", "/mi-anuncio.html", "/aviso-legal.html", "/privacidad.html"]) {
    const res = await fetch(base + p);
    ok(`page ${p}`, res.ok);
  }

  const failed = results.filter((x) => !x.pass);
  console.log(`\n==== ${results.filter((x) => x.pass).length}/${results.length} real-mode passed ====`);
  if (failed.length) {
    failed.forEach((f) => console.log(" -", f.name, f.extra));
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
