/**
 * EscortBenidorm — cliente API real
 */
const API = {
  base: "",

  async get(path, { token } = {}) {
    const headers = {};
    let auth = token;
    if (auth === undefined) {
      if (path.startsWith("/api/admin") || path.includes("/admin/")) auth = this.token();
      else if (path.startsWith("/api/my-ads") || path.startsWith("/api/auth/me")) auth = this.userToken();
      else auth = "";
    }
    if (auth) headers.Authorization = `Bearer ${auth}`;
    const res = await fetch(`${this.base}${path}`, { headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  },

  async post(path, body, { formData = false, token } = {}) {
    const headers = {};
    const t = token !== undefined ? token : path.startsWith("/api/admin") ? this.token() : this.userToken() || this.token();
    // prefer explicit token; for admin paths use admin token
    let auth = token;
    if (auth === undefined) {
      if (path.startsWith("/api/admin") || path.includes("/admin/")) auth = this.token();
      else if (path.startsWith("/api/auth")) auth = "";
      else auth = this.userToken() || "";
    }
    if (auth) headers.Authorization = `Bearer ${auth}`;
    let payload = body;
    if (!formData) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body == null ? {} : body);
    }
    const res = await fetch(`${this.base}${path}`, {
      method: "POST",
      headers,
      body: formData ? payload : payload,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  },

  async patch(path, body, { formData = false, token } = {}) {
    const headers = {};
    let auth = token;
    if (auth === undefined) {
      if (path.startsWith("/api/admin") || path.includes("/admin/")) auth = this.token();
      else auth = this.userToken() || "";
    }
    if (auth) headers.Authorization = `Bearer ${auth}`;
    let payload = body;
    if (!formData) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    const res = await fetch(`${this.base}${path}`, {
      method: "PATCH",
      headers,
      body: payload,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  },

  async del(path, tokenOrOpts) {
    const headers = {};
    let body;
    if (typeof tokenOrOpts === "string") {
      headers.Authorization = `Bearer ${tokenOrOpts}`;
    } else if (tokenOrOpts && typeof tokenOrOpts === "object") {
      const auth =
        tokenOrOpts.token ||
        (path.startsWith("/api/admin") ? this.token() : this.userToken());
      if (auth) headers.Authorization = `Bearer ${auth}`;
      if (tokenOrOpts.body) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(tokenOrOpts.body);
      }
    } else {
      const auth = path.startsWith("/api/admin") ? this.token() : this.userToken();
      if (auth) headers.Authorization = `Bearer ${auth}`;
    }
    const res = await fetch(`${this.base}${path}`, {
      method: "DELETE",
      headers,
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  },

  token() {
    return localStorage.getItem("eb_admin_token") || "";
  },

  setToken(t) {
    if (t) localStorage.setItem("eb_admin_token", t);
    else localStorage.removeItem("eb_admin_token");
  },

  userToken() {
    return localStorage.getItem("eb_user_token") || "";
  },

  setUserToken(t) {
    if (t) localStorage.setItem("eb_user_token", t);
    else localStorage.removeItem("eb_user_token");
  },

  user() {
    try {
      return JSON.parse(localStorage.getItem("eb_user") || "null");
    } catch {
      return null;
    }
  },

  setUser(u) {
    if (u) localStorage.setItem("eb_user", JSON.stringify(u));
    else localStorage.removeItem("eb_user");
  },

  logoutUser() {
    this.setUserToken("");
    this.setUser(null);
  },

  /* Owner manage helpers */
  async myAds(phone, pin) {
    if (this.userToken() && !phone) {
      return this.get("/api/my-ads", { token: this.userToken() });
    }
    return this.post("/api/my-ads", { phone, pin }, { token: this.userToken() || "" });
  },

  async updateMyAd(id, formData) {
    return this.patch(`/api/my-ads/${encodeURIComponent(id)}`, formData, {
      formData: true,
      token: this.userToken() || undefined,
    });
  },

  async bumpMyAd(id, phone, pin) {
    return this.post(
      `/api/my-ads/${encodeURIComponent(id)}/bump`,
      phone ? { phone, pin } : {},
      { token: this.userToken() || undefined }
    );
  },

  async deleteMyAd(id, phone, pin) {
    return this.del(`/api/my-ads/${encodeURIComponent(id)}`, {
      token: this.userToken() || undefined,
      body: phone ? { phone, pin } : {},
    });
  },
};

const ZONE_MAP = {
  levante: "Playa de Levante",
  poniente: "Playa de Poniente",
  "rincon-de-loix": "Rincón de Loix",
  "casco-antiguo": "Casco Antiguo",
  "nueva-poniente": "Nueva Poniente",
  foietes: "Foietes",
};

const ZONES = [
  { slug: "levante", name: "Playa de Levante", nameEn: "Levante Beach", blurb: "La zona más animada de Benidorm", blurbEn: "Benidorm's busiest area" },
  { slug: "poniente", name: "Playa de Poniente", nameEn: "Poniente Beach", blurb: "Ambiente más relajado y residencial", blurbEn: "Calmer, residential vibe" },
  { slug: "rincon-de-loix", name: "Rincón de Loix", nameEn: "Rincón de Loix", blurb: "Zona británica y vida nocturna", blurbEn: "British area & nightlife" },
  { slug: "casco-antiguo", name: "Casco Antiguo", nameEn: "Old Town", blurb: "Centro histórico y bares", blurbEn: "Old town & bars" },
  { slug: "nueva-poniente", name: "Nueva Poniente", nameEn: "Nueva Poniente", blurb: "Residencial y tranquilo", blurbEn: "Quiet residential" },
  { slug: "foietes", name: "Foietes", nameEn: "Foietes", blurb: "Cerca de Cala de Finestrat", blurbEn: "Near Cala de Finestrat" },
];

const GRADIENTS = [
  "linear-gradient(160deg, #3d1a2a 0%, #1a1020 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #1a2a3d 0%, #101820 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #2a1a3d 0%, #181028 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #3d2a1a 0%, #201810 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #1a3d2a 0%, #102018 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #3d1a1a 0%, #201010 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #1a1a3d 0%, #101028 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #3d3a1a 0%, #202010 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #2a3d3a 0%, #102020 45%, #0e0e16 100%)",
  "linear-gradient(160deg, #3d1a35 0%, #201018 45%, #0e0e16 100%)",
];

function gradientFor(id) {
  let h = 0;
  const s = String(id || "");
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % GRADIENTS.length;
  return GRADIENTS[h];
}

// cache
let _cache = null;
let _cacheAt = 0;

async function fetchAds(params = {}) {
  const qs = new URLSearchParams();
  if (params.zone) qs.set("zone", params.zone);
  if (params.q) qs.set("q", params.q);
  if (params.online) qs.set("online", "1");
  if (params.maxPrice) qs.set("price", params.maxPrice);
  if (params.featured) qs.set("featured", "1");
  const data = await API.get(`/api/ads?${qs.toString()}`);
  return data.ads || [];
}

async function getAllEscorts(force = false) {
  const now = Date.now();
  if (!force && _cache && now - _cacheAt < 15000) return _cache;
  _cache = await fetchAds();
  _cacheAt = now;
  return _cache;
}

function invalidateCache() {
  _cache = null;
  _cacheAt = 0;
}

async function getEscortById(id) {
  try {
    const data = await API.get(`/api/ads/${encodeURIComponent(id)}`);
    return data.ad;
  } catch {
    const all = await getAllEscorts();
    return all.find((a) => a.id === id) || null;
  }
}

function zoneCount(slug, ads) {
  return (ads || []).filter((e) => e.zoneSlug === slug).length;
}
