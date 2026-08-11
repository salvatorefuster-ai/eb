/** Auth register → publish → manage */
const base = process.env.BASE_URL || "http://localhost:3456";

function jpegBlob() {
  const b64 =
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGcP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z";
  return new Blob([Buffer.from(b64, "base64")], { type: "image/jpeg" });
}

(async () => {
  const email = `user${Date.now()}@test.local`;
  const phone = "346" + String(Date.now()).slice(-8);
  // no auth publish
  let r = await fetch(`${base}/api/ads`, { method: "POST", body: new FormData() });
  console.log("publish sin login", r.status, r.status === 401 ? "OK" : "FAIL");

  r = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      phone,
      password: "testpass12",
      name: "TestUser",
    }),
  });
  let j = await r.json();
  console.log("register", r.ok, !!j.token);
  const token = j.token;

  const fd = new FormData();
  fd.append("name", "AuthAd");
  fd.append("age", "25");
  fd.append("zone", "levante");
  fd.append("price", "120");
  fd.append("phone", phone);
  fd.append("desc", "Anuncio con cuenta registrada en Benidorm para test auth.");
  fd.append("plan", "free");
  fd.append("photos", jpegBlob(), "a.jpg");

  r = await fetch(`${base}/api/ads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  j = await r.json();
  console.log("publish con login", r.ok, j.ad?.userId ? "has userId" : "no userId", j.error || "");

  r = await fetch(`${base}/api/my-ads`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  j = await r.json();
  console.log("my-ads cuenta", r.ok, (j.ads || []).length);

  if (j.ads?.[0]) {
    await fetch(`${base}/api/my-ads/${j.ads[0].id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}",
    });
  }
  console.log("auth flow done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
