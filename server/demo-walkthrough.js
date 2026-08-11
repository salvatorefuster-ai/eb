/**
 * Demo completa en vivo — deja un anuncio visible para inspección manual.
 * node server/demo-walkthrough.js
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
    data = text.slice(0, 80);
  }
  return { ok: res.ok, status: res.status, data };
}

function line(ok, label, extra = "") {
  console.log(`${ok ? "  ✓" : "  ✗"} ${label}${extra ? " — " + extra : ""}`);
  return ok;
}

(async () => {
  console.log("\n══════════════════════════════════════════");
  console.log("  DEMO COMPLETA · EscortBenidorm");
  console.log("  " + base);
  console.log("══════════════════════════════════════════\n");

  // 1 Health
  let r = await req(`${base}/api/health`);
  line(r.ok && r.data.ok, "Servidor / health", `ads=${r.data.ads} real=${r.data.realMode}`);
  if (!r.ok) {
    console.error("\nArranca el servidor: npm start\n");
    process.exit(1);
  }

  // 2 Plans
  r = await req(`${base}/api/plans`);
  const plans = r.data.plans || [];
  const prices = Object.fromEntries(plans.map((p) => [p.id, p.price]));
  line(
    prices.basic === 5 && prices.vip === 7 && prices.top === 10,
    "Planes diarios 5 / 7 / 10 €",
    JSON.stringify(prices)
  );

  // 3 Pages
  const pages = [
    "/",
    "/precios.html",
    "/publicar.html",
    "/registro.html",
    "/putas-benidorm.html",
    "/scorts-benidorm.html",
    "/escorts-benidorm.html",
    "/en/benidorm-escorts.html",
    "/de/escort-benidorm.html",
    "/zonas.html",
    "/admin.html",
    "/sitemap.xml",
  ];
  let pagesOk = 0;
  for (const p of pages) {
    const res = await fetch(base + p);
    if (res.ok) pagesOk++;
  }
  line(pagesOk === pages.length, `Páginas estáticas ${pagesOk}/${pages.length}`);

  // 4 Auth gate
  r = await req(`${base}/api/ads`, { method: "POST", body: new FormData() });
  line(r.status === 401, "Publicar exige login", String(r.status));

  // 5 Register
  const stamp = Date.now();
  const email = `demo${stamp}@test.local`;
  const phone = "346" + String(stamp).slice(-8);
  r = await req(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      phone,
      password: "demopass12",
      name: "DemoLive",
    }),
  });
  line(r.ok && r.data.token, "Registro email+teléfono", email);
  const token = r.data.token;

  // 6 Publish TOP
  const fd = new FormData();
  fd.append("name", "Luna Demo");
  fd.append("age", "27");
  fd.append("zone", "levante");
  fd.append("price", "150");
  fd.append("phone", phone);
  fd.append("title", "Luna Demo TOP · Levante");
  fd.append(
    "desc",
    "Anuncio de demostración en Playa de Levante, Benidorm. Prueba del flujo completo: trial 24h y pago diario TOP."
  );
  fd.append("plan", "top");
  fd.append("languages", "ES, EN");
  fd.append("services", "Hotel, Salidas");
  fd.append("photos", jpegBlob(), "demo.jpg");

  r = await req(`${base}/api/ads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const ad = r.data.ad;
  const pin = r.data.managePin;
  const order = r.data.payment;
  line(r.ok && pin && order, "Publicar TOP (trial + pedido)", ad?.id || r.data.error);
  line(ad?.plan === "free", "Plan free hasta pagar", ad?.plan);
  line(!!(ad?.paidUntil || ad?.planExpiresAt), "paidUntil trial 24h");
  line(order?.amount === 10 && order?.plan === "top", "Pedido 10€ TOP", order?.id);

  // 7 Visible in list during trial
  r = await req(`${base}/api/ads`);
  const inList = (r.data.ads || []).some((a) => a.id === ad?.id);
  line(inList, "Visible en listado público (trial)");

  // 8 Clean URL
  if (ad?.id) {
    const clean = await fetch(`${base}/a/${encodeURIComponent(ad.id)}`);
    line(clean.ok, "URL limpia /a/:id", `${base}/a/${ad.id}`);
  }

  // 9 Mock pay
  r = await req(`${base}/api/checkout/${order.id}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "mock" }),
  });
  line(r.ok && r.data.activated, "Pago mock diario activado");

  r = await req(`${base}/api/ads/${encodeURIComponent(ad.id)}`);
  const paid = r.data.ad;
  line(paid?.plan === "top" && paid?.featured, "Plan TOP activo + featured");
  line(!!paid?.paidUntil, "paidUntil tras pago", paid?.paidUntil);
  line(paid?.visibleNow === true, "visibleNow=true", `hoursLeft=${paid?.hoursLeft}`);

  // 10 Bump
  r = await req(`${base}/api/my-ads/${encodeURIComponent(ad.id)}/bump`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  line(r.ok, "Renovar / bump con sesión");

  // 11 Stats
  r = await req(`${base}/api/stats`);
  line(r.ok, "Stats", `visibles=${r.data.visibleNow} pagosHoy=${r.data.paidToday} €hoy=${r.data.revenueToday}`);

  console.log("\n──────────────────────────────────────────");
  console.log("  DEMO LISTA PARA VER EN EL NAVEGADOR");
  console.log("──────────────────────────────────────────");
  console.log(`  Home:       ${base}/`);
  console.log(`  Anuncio:    ${base}/a/${ad.id}`);
  console.log(`  Listado:    ${base}/anuncios.html`);
  console.log(`  Putas SEO:  ${base}/putas-benidorm.html`);
  console.log(`  Precios:    ${base}/precios.html`);
  console.log(`  Mi anuncio: ${base}/mi-anuncio.html?id=${encodeURIComponent(ad.id)}`);
  console.log(`  Admin:      ${base}/admin.html`);
  console.log("");
  console.log("  Credenciales demo (sesión API):");
  console.log(`    email: ${email}`);
  console.log(`    pass:  demopass12`);
  console.log(`    phone: ${phone}`);
  console.log(`    PIN:   ${pin}`);
  console.log(`    order: ${order.id} (ya pagado mock)`);
  console.log("");
  console.log("  (El anuncio se deja en el catálogo para que lo veas.)");
  console.log("══════════════════════════════════════════\n");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
