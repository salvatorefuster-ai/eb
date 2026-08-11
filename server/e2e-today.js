/**
 * Smoke "funcionando hoy" — registro → publicar trial → créditos → gastar → manage
 */
const base = process.env.BASE_URL || "http://localhost:3456";

function jpegBlob() {
  const b64 =
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGcP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z";
  return new Blob([Buffer.from(b64, "base64")], { type: "image/jpeg" });
}

async function req(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text.slice(0, 120);
  }
  return { ok: res.ok, status: res.status, data };
}

(async () => {
  const results = [];
  const check = (n, p, x = "") => {
    results.push(!!p);
    console.log(`${p ? "OK  " : "FAIL"} ${n}${x ? " — " + x : ""}`);
  };

  let r = await req(`${base}/api/health`);
  check("health", r.ok && r.data.ok, `real=${r.data.realMode}`);

  r = await req(`${base}/api/plans`);
  const plans = r.data.plans || [];
  check("planes diarios", r.ok && plans.length >= 3);
  const byId = Object.fromEntries(plans.map((p) => [p.id, p]));
  check("precio Día 5", byId.basic?.price === 5);
  check("precio VIP 7", byId.vip?.price === 7);
  check("precio TOP 10", byId.top?.price === 10);

  r = await req(`${base}/api/credits/preview?amount=50`);
  check("bonus 50→60", r.ok && r.data.totalCredits === 60);

  const pages = [
    "/",
    "/publicar.html",
    "/precios.html",
    "/mi-anuncio.html",
    "/registro.html",
    "/login.html",
    "/putas-benidorm.html",
    "/scorts-benidorm.html",
    "/escorts-benidorm.html",
    "/en/benidorm-escorts.html",
    "/de/escort-benidorm.html",
    "/admin.html",
  ];
  for (const p of pages) {
    const res = await fetch(base + p);
    check("page " + p, res.ok);
  }

  r = await req(`${base}/api/ads`, { method: "POST", body: new FormData() });
  check("publicar exige login", r.status === 401);

  // plan checkout legacy off
  r = await req(`${base}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adId: "x", plan: "top", phone: "34600000000", pin: "x" }),
  });
  check("checkout plan legacy off", r.status === 400 && r.data.needCredits);

  const email = `hoy${Date.now()}@test.local`;
  const phone = "346" + String(Date.now()).slice(-8);
  r = await req(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone, password: "testpass12", name: "Hoy" }),
  });
  check("registro", r.ok && r.data.token);
  const token = r.data.token;

  const fd = new FormData();
  fd.append("name", "HoyDemo");
  fd.append("age", "26");
  fd.append("zone", "levante");
  fd.append("price", "140");
  fd.append("phone", phone);
  fd.append("desc", "Anuncio de prueba para lanzamiento hoy en Benidorm Levante.");
  fd.append("plan", "top");
  fd.append("title", "HoyDemo TOP test");
  fd.append("languages", "ES, EN");
  fd.append("photos", jpegBlob(), "h.jpg");

  r = await req(`${base}/api/ads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  check("publicar trial", r.ok && r.data.managePin, r.data.error);
  check("sin pedido plan al publicar", r.data.payment == null);
  check("hint créditos", !!r.data.creditsHint?.buyUrl);
  const pin = r.data.managePin;
  const adId = r.data.ad?.id;
  check("trial free", r.data.ad?.plan === "free", r.data.ad?.plan);
  check("paidUntil trial", !!r.data.ad?.paidUntil || !!r.data.ad?.planExpiresAt);
  check("userId", !!r.data.ad?.userId);

  r = await req(`${base}/api/ads`);
  check("visible trial", r.ok && (r.data.ads || []).some((a) => a.id === adId));

  if (adId) {
    const clean = await fetch(`${base}/a/${encodeURIComponent(adId)}`);
    check("URL limpia /a/:id", clean.ok);
  }

  // recarga créditos 50 → 60
  r = await req(`${base}/api/credits/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 50 }),
  });
  check("recarga 50€", r.ok && r.data.payment?.credits === 60, String(r.data.payment?.credits));
  const order = r.data.payment?.id;

  r = await req(`${base}/api/checkout/${order}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "mock" }),
  });
  check("pago mock recarga", r.ok && r.data.activated);

  // gastar TOP 10
  r = await req(`${base}/api/credits/spend`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adId, plan: "top", days: 1 }),
  });
  check("gastar TOP 10", r.ok && r.data.spent === 10, r.data.message || r.data.error);
  check("plan TOP", r.data.ad?.plan === "top" && r.data.ad?.featured);
  check("saldo 50", r.data.credits === 50, String(r.data.credits));

  r = await req(`${base}/api/my-ads/${encodeURIComponent(adId)}/bump`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  check("renovar sesión", r.ok);

  r = await req(`${base}/api/my-ads/${encodeURIComponent(adId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  check("limpiar test", r.ok);

  const passed = results.filter(Boolean).length;
  console.log(`\n==== HOY ${passed}/${results.length} ====`);
  if (passed < results.length) process.exit(1);
  console.log("\nWeb lista. Flujo: registro → trial → recarga créditos → gastar → gestionar");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
