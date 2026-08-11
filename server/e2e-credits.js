/**
 * E2E créditos: recarga libre 1–1000, bonus 20%/50%, sin decimales
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
    data = text.slice(0, 100);
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
  check("health", r.ok);

  r = await req(`${base}/api/credits/preview?amount=50`);
  check("preview 50 → 60", r.ok && r.data.totalCredits === 60 && r.data.bonusPercent === 20);

  r = await req(`${base}/api/credits/preview?amount=999`);
  check("preview 999 → +20%", r.ok && r.data.bonusPercent === 20 && r.data.totalCredits === 999 + Math.floor(999 * 0.2));

  r = await req(`${base}/api/credits/preview?amount=1000`);
  check("preview 1000 → 1500", r.ok && r.data.totalCredits === 1500 && r.data.bonusPercent === 50);

  r = await req(`${base}/api/credits/preview?amount=49`);
  check("preview 49 sin bonus", r.ok && r.data.totalCredits === 49 && r.data.bonus === 0);

  r = await req(`${base}/api/credits/preview?amount=10.5`);
  check("rechaza decimal", !r.ok || r.status === 400);

  r = await req(`${base}/api/credits/preview?amount=0`);
  check("rechaza 0", !r.ok);

  r = await req(`${base}/api/credits/preview?amount=1001`);
  check("rechaza 1001", !r.ok);

  const email = `cred${Date.now()}@test.local`;
  const phone = "346" + String(Date.now()).slice(-8);
  r = await req(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone, password: "testpass12", name: "CredUser" }),
  });
  check("register", r.ok && r.data.token);
  const token = r.data.token;

  const fd = new FormData();
  fd.append("name", "CredAd");
  fd.append("age", "24");
  fd.append("zone", "poniente");
  fd.append("price", "120");
  fd.append("phone", phone);
  fd.append("desc", "Anuncio para probar gasto de créditos en Benidorm Poniente.");
  fd.append("plan", "basic");
  fd.append("photos", jpegBlob(), "c.jpg");
  r = await req(`${base}/api/ads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  check("publish", r.ok && r.data.ad?.id);
  const adId = r.data.ad?.id;

  // decimal amount rejected on checkout
  r = await req(`${base}/api/credits/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 25.5 }),
  });
  check("checkout rechaza decimal", !r.ok);

  // buy 50 → 60 credits
  r = await req(`${base}/api/credits/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 50 }),
  });
  check("checkout 50€", r.ok && r.data.payment?.credits === 60, String(r.data.payment?.credits));
  const order = r.data.payment?.id;

  r = await req(`${base}/api/checkout/${order}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "mock" }),
  });
  check("pago mock 50", r.ok && r.data.activated);

  r = await req(`${base}/api/credits/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check("saldo 60", r.ok && r.data.credits === 60, String(r.data.credits));

  // buy 1000 → +50% = 1500
  r = await req(`${base}/api/credits/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: 1000 }),
  });
  check("checkout 1000 → 1500 créd", r.ok && r.data.payment?.credits === 1500, String(r.data.payment?.credits));
  const orderMax = r.data.payment?.id;
  r = await req(`${base}/api/checkout/${orderMax}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method: "mock" }),
  });
  check("pago mock 1000", r.ok);
  r = await req(`${base}/api/credits/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check("saldo 60+1500=1560", r.ok && r.data.credits === 1560, String(r.data.credits));

  r = await req(`${base}/api/credits/spend`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adId, plan: "vip", days: 1 }),
  });
  check("spend VIP 7", r.ok && r.data.spent === 7);
  check("saldo 1553", r.data.credits === 1553, String(r.data.credits));

  await req(`${base}/api/my-ads/${encodeURIComponent(adId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  const pass = results.filter(Boolean).length;
  console.log(`\n==== CREDITS ${pass}/${results.length} ====`);
  if (pass < results.length) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
