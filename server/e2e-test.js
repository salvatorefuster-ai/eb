/**
 * E2E smoke tests against local server
 * Usage: node server/e2e-test.js
 */
const base = process.env.BASE_URL || "http://localhost:3456";

async function req(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text.slice(0, 240);
  }
  return { status: res.status, data, ok: res.ok };
}

function jpegBlob(name) {
  // minimal valid-ish JPEG
  const b64 =
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGcP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z";
  const buf = Buffer.from(b64, "base64");
  return new Blob([buf], { type: "image/jpeg" });
}

(async () => {
  const results = [];
  const ok = (name, pass, extra = "") => {
    results.push({ name, pass, extra });
    console.log(`${pass ? "OK  " : "FAIL"} ${name}${extra ? " — " + extra : ""}`);
  };

  let r = await req(`${base}/api/health`);
  ok("health", r.ok && r.data.ok, `ads=${r.data.ads}`);

  r = await req(`${base}/api/ads`);
  const ads = r.data.ads || [];
  ok("list ads", r.ok && ads.length >= 12, `total=${r.data.total || ads.length}`);
  ok(
    "ads have photos",
    ads.filter((a) => a.photo && String(a.photo).includes("/uploads/")).length >= 10
  );
  ok("publicAd strips pin", ads.every((a) => !a.editPin));

  const id = ads[0].id;
  r = await req(`${base}/api/ads/${encodeURIComponent(id)}`);
  ok("get ad", r.ok && r.data.ad?.id === id, id);
  ok("ad multi photos", Array.isArray(r.data.ad?.photos) && r.data.ad.photos.length >= 2);

  r = await req(`${base}/api/my-ads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "34600000001", pin: "demo-sofia-le" }),
  });
  ok("owner my-ads", r.ok && (r.data.ads || []).length >= 1);
  ok("owner sees pin", r.ok && !!r.data.ads?.[0]?.editPin);

  r = await req(`${base}/api/my-ads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "34600000001", pin: "wrong-pin-xx" }),
  });
  ok("wrong pin empty", r.ok && (r.data.ads || []).length === 0);

  // publish multi-photo
  const fd = new FormData();
  fd.append("name", "TestQA");
  fd.append("age", "25");
  fd.append("zone", "levante");
  fd.append("price", "130");
  fd.append("phone", "34699988777");
  fd.append("manageEmail", "qa@test.local");
  fd.append("desc", "Anuncio de prueba QA E2E en Benidorm Levante con descripcion real.");
  fd.append("title", "Test QA multi foto Benidorm");
  fd.append("languages", "ES, EN");
  fd.append("services", "Hotel, GFE");
  fd.append("plan", "free");
  fd.append("independent", "true");
  fd.append("incall", "true");
  fd.append("outcall", "true");
  fd.append("photos", jpegBlob(), "test1.jpg");
  fd.append("photos", jpegBlob(), "test2.jpg");

  r = await req(`${base}/api/ads`, { method: "POST", body: fd });
  ok("publish multi-foto", r.ok && r.data.managePin && r.data.ad, `pin=${r.data.managePin || r.data.error}`);
  const newId = r.data.ad?.id;
  const managePin = r.data.managePin;
  ok("publish has photos", r.ok && (r.data.ad?.photos || []).length >= 1, `n=${(r.data.ad?.photos || []).length}`);
  ok("publish no pin in ad", r.ok && !r.data.ad?.editPin);

  if (newId && managePin) {
    r = await req(`${base}/api/my-ads/${encodeURIComponent(newId)}/bump`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "34699988777", pin: managePin }),
    });
    ok("owner bump", r.ok && r.data.ok, r.data.error || "");

    const fd2 = new FormData();
    fd2.append("phone", "34699988777");
    fd2.append("pin", managePin);
    fd2.append("price", "145");
    fd2.append("name", "TestQA");
    fd2.append("desc", "Anuncio actualizado por QA E2E en Benidorm con precio nuevo.");
    r = await req(`${base}/api/my-ads/${encodeURIComponent(newId)}`, { method: "PATCH", body: fd2 });
    ok("owner update", r.ok && r.data.ad?.price === 145, `price=${r.data.ad?.price}`);

    r = await req(`${base}/api/my-ads/${encodeURIComponent(newId)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "34699988777", pin: managePin }),
    });
    ok("owner delete", r.ok && r.data.ok);

    r = await req(`${base}/api/ads/${encodeURIComponent(newId)}`);
    ok("deleted not found", r.status === 404);
  } else {
    ok("owner bump", false, "skipped — no ad");
    ok("owner update", false, "skipped");
    ok("owner delete", false, "skipped");
    ok("deleted not found", false, "skipped");
  }

  for (const p of [
    "/",
    "/anuncios.html",
    "/publicar.html",
    "/mi-anuncio.html",
    `/anuncio.html?id=${encodeURIComponent(id)}`,
    "/admin.html",
    "/sitemap.xml",
    "/favoritos.html",
    "/comparar.html",
  ]) {
    const res = await fetch(`${base}${p}`);
    ok(`page ${p.split("?")[0]}`, res.ok, `status=${res.status}`);
  }

  const av = await fetch(`${base}/uploads/demo-sofia-levante-1.svg`);
  ok("demo avatar serves", av.ok);

  r = await req(`${base}/api/stats`);
  ok("stats", r.ok && r.data.total >= 12, JSON.stringify(r.data));

  r = await req(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: "admin", password: "benidorm2026" }),
  });
  ok("admin login", r.ok && !!r.data.token);

  // report
  r = await req(`${base}/api/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adId: id, reason: "test", detail: "e2e" }),
  });
  ok("report ad", r.ok && r.data.ok);

  // contact
  r = await req(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "qa@test.local",
      subject: "E2E",
      message: "Mensaje de prueba del suite E2E",
    }),
  });
  ok("contact form", r.ok && r.data.ok);

  const failed = results.filter((x) => !x.pass);
  console.log(`\n==== ${results.filter((x) => x.pass).length}/${results.length} passed ====`);
  if (failed.length) {
    console.log("FAILED:");
    failed.forEach((f) => console.log(` - ${f.name}: ${f.extra}`));
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
