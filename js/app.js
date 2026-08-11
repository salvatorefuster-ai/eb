/**
 * EscortBenidorm REAL + multi-idioma turistas
 * Requiere: api.js, i18n.js
 */

function basePath() {
  const path = location.pathname.replace(/\\/g, "/");
  // Clean ad URLs /a/:id use root-absolute assets (anuncio.html has <base href="/">)
  if (path.includes("/a/")) return "";
  if (
    path.includes("/zonas/") ||
    path.includes("/blog/") ||
    path.includes("/en/") ||
    path.includes("/de/")
  ) {
    return "../";
  }
  return "";
}

function isEn() {
  // legacy helper → non-Spanish UI uses EN descriptions when available
  return I18N_STATE.lang !== "es";
}

/* —— Age gate —— */
function initAgeGate() {
  const gate = document.getElementById("age-gate");
  if (!gate) return;
  if (localStorage.getItem("eb_age_ok") === "1") {
    gate.classList.add("hidden");
    return;
  }
  document.getElementById("age-yes")?.addEventListener("click", () => {
    localStorage.setItem("eb_age_ok", "1");
    gate.classList.add("hidden");
  });
  document.getElementById("age-no")?.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

function initMenu() {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-mobile");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

function showToast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3400);
}
window.showToast = showToast;

function photoHTML(e) {
  if (e.photo) {
    return `<img src="${e.photo}" alt="${e.name} escort Benidorm" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />`;
  }
  return `<div class="placeholder-avatar">${e.name.charAt(0)}</div>`;
}

function photoCount(e) {
  if (Array.isArray(e.photos) && e.photos.length) return e.photos.length;
  return e.photo ? 1 : 0;
}

const FAV_KEY = "eb_favs_v1";
function getFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}
function isFav(id) {
  return getFavs().includes(id);
}
function toggleFav(id) {
  let favs = getFavs();
  if (favs.includes(id)) favs = favs.filter((x) => x !== id);
  else favs.push(id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  updateFavBadges();
  return favs.includes(id);
}

function updateFavBadges() {
  const n = getFavs().length;
  document.querySelectorAll("[data-fav-count]").forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
  });
}

const RECENT_KEY = "eb_recent_v1";
const COMPARE_KEY = "eb_compare_v1";

function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(id) {
  if (!id) return;
  let list = getRecent().filter((x) => x !== id);
  list.unshift(id);
  list = list.slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

function getCompareIds() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setCompareIds(ids) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids.slice(0, 3)));
  updateCompareBar();
}

function updateCompareBar() {
  const ids = getCompareIds();
  let bar = document.getElementById("compare-bar");
  if (!ids.length) {
    if (bar) bar.remove();
    return;
  }
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "compare-bar";
    bar.className = "compare-bar";
    document.body.appendChild(bar);
  }
  const base = basePath();
  bar.innerHTML = `
    <span class="compare-bar-label">Comparar <strong>${ids.length}/3</strong></span>
    <a class="btn btn-primary btn-sm" href="${base}comparar.html">Ver comparación</a>
    <button type="button" class="btn btn-ghost btn-sm" id="compare-bar-clear">Vaciar</button>
  `;
  bar.querySelector("#compare-bar-clear")?.addEventListener("click", () => {
    setCompareIds([]);
    showToast("Comparación vacía");
  });
}

function adAbsoluteUrl(id) {
  // Prefer clean SEO path /a/:id at site root
  try {
    return new URL(`a/${encodeURIComponent(id)}`, location.origin + "/").href;
  } catch {
    return new URL(`${basePath()}a/${encodeURIComponent(id)}`, location.href).href;
  }
}

async function shareProfile(e) {
  const abs = adAbsoluteUrl(e.id);
  const title = `${e.name} — Escort Benidorm`;
  const text = `${e.name}, ${e.age} · ${e.zone || "Benidorm"} · ${e.price}€/h · EscortBenidorm`;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url: abs });
      showToast("Compartido");
      return;
    }
  } catch (err) {
    if (err && err.name === "AbortError") return;
  }
  try {
    await navigator.clipboard.writeText(abs);
    showToast(t("js_link_copied"));
  } catch {
    prompt("Copia el enlace:", abs);
  }
}

function gallerySlides(e) {
  const real = [];
  if (e.photo) real.push({ type: "img", src: e.photo });
  if (Array.isArray(e.photos)) {
    e.photos.forEach((p) => {
      if (p && p !== e.photo && !String(p).startsWith("__")) real.push({ type: "img", src: p });
    });
  }
  if (real.length) return real;
  // Synthetic exclusive gallery (no stock faces)
  return [0, 1, 2].map((i) => ({
    type: "synth",
    bg: gradientFor(e.id + "-" + i),
    letter: e.name.charAt(0),
    label: i === 0 ? "Principal" : i === 1 ? "Detalle" : "Ambiente",
  }));
}

function ico(name) {
  return typeof ICON !== "undefined" && ICON[name] ? ICON[name]("ico") : "";
}

function skeletonHTML(n = 4) {
  return Array.from({ length: n })
    .map(
      () => `<div class="skeleton-card" aria-hidden="true">
      <div class="sk-media sk-pulse"></div>
      <div class="sk-body">
        <div class="sk-line sk-pulse w60"></div>
        <div class="sk-line sk-pulse w40"></div>
        <div class="sk-line sk-pulse w80"></div>
        <div class="sk-line sk-pulse w50"></div>
      </div>
    </div>`
    )
    .join("");
}

function adPublicUrl(id) {
  const base = basePath();
  // URL limpia SEO: /a/slug
  if (!base || base === "" || base === "./") return `a/${encodeURIComponent(id)}`;
  return `${base}a/${encodeURIComponent(id)}`;
}

function cardHTML(e, view = "grid") {
  const base = basePath();
  const href = adPublicUrl(e.id);
  const isVip = (e.tags || []).includes("vip");
  const isNew = (e.tags || []).includes("new");
  const speaks = typeof profileSpeaksUILang === "function" ? profileSpeaksUILang(e) : false;
  const desc = isEn() && e.descEn ? e.descEn : e.desc;
  const zoneL = zoneLabel(e.zoneSlug, e.zone);
  const loc = e.locationDetail || zoneL;
  const title = e.title || `${e.name}, ${e.age}`;
  const nPhotos = photoCount(e);
  const phone = e.phone || "";
  const fav = isFav(e.id);

  const tags = [
    isVip ? `<span class="tag tag-vip">${ico("star")} TOP</span>` : "",
    isNew ? `<span class="tag tag-new">${t("new_tag")}</span>` : "",
    (e.tags || []).includes("verified") ? `<span class="tag tag-verified">${ico("check")} ${t("card_real")}</span>` : "",
    e.independent ? `<span class="tag tag-indep">${t("card_indep")}</span>` : "",
    e.available24h ? `<span class="tag tag-24">24h</span>` : "",
    speaks ? `<span class="tag tag-speak">${ico("chat")} ${t("speak_badge")}</span>` : "",
  ].join("");

  const langs = (e.languages || []).map((l) => `<span class="lang-pill">${l}</span>`).join("");
  const flags = [
    e.incall ? `<span class="flag-chip">${ico("home")} ${t("card_incall")}</span>` : "",
    e.outcall ? `<span class="flag-chip">${ico("car")} ${t("card_outcall")}</span>` : "",
    e.available24h ? `<span class="flag-chip">${ico("clock")} 24h</span>` : "",
  ].join("");

  const favBtn = `<button type="button" class="fav-btn ${fav ? "is-on" : ""}" data-fav="${e.id}" aria-label="${t("nav_favs")}">${fav ? ico("heartFill") : ico("heart")}</button>`;

  if (view === "list") {
    return `
    <article class="escort-row ${isVip ? "is-vip" : ""} ${speaks ? "speaks-match" : ""}">
      <a href="${href}" class="row-media" style="background:${gradientFor(e.id)}">
        ${photoHTML(e)}
        ${nPhotos ? `<span class="photo-count">${ico("cam")} ${nPhotos}</span>` : ""}
      </a>
      <div class="row-body">
        <div class="row-top">
          <div>
            <div class="card-badges static">${tags}</div>
            <h3><a href="${href}">${title}</a></h3>
            <div class="card-meta">
              <span class="meta-i">${ico("pin")} ${loc}</span>
              <span>${e.age}</span>
              <span class="meta-i">${ico("globe")} ${e.nationality || "—"}</span>
              ${e.height ? `<span>${e.height}</span>` : ""}
            </div>
          </div>
          <div class="row-price">
            <div class="price">${e.price}€ <small>/ ${t("hour")}</small></div>
            <div class="online-inline ${e.online ? "" : "off"}">${e.online ? t("online_now") : t("offline")}</div>
          </div>
        </div>
        <p class="card-desc">${desc || ""}</p>
        <div class="row-bottom">
          <div class="card-langs">${langs} ${flags}</div>
          <div class="row-actions">
            ${favBtn}
            <button type="button" class="btn btn-secondary btn-sm btn-reveal" data-phone="${phone}">${ico("phone")}</button>
            <a class="btn btn-whatsapp btn-sm" href="https://wa.me/${phone}?text=${encodeURIComponent(t("wa_msg", { name: e.name }))}" target="_blank" rel="noopener">${ico("wa")} WA</a>
            <a class="btn btn-primary btn-sm" href="${href}">${t("card_view")}</a>
          </div>
        </div>
      </div>
    </article>`;
  }

  return `
    <article class="escort-card ${isVip ? "is-vip" : ""} ${speaks ? "speaks-match" : ""}">
      <a href="${href}" class="card-media" aria-label="${e.name}" style="background:${gradientFor(e.id)}">
        ${photoHTML(e)}
        <div class="card-badges">${tags}</div>
        ${nPhotos ? `<span class="photo-count">${ico("cam")} ${nPhotos}</span>` : ""}
        <div class="online-dot ${e.online ? "" : "offline"}">${e.online ? t("online_now") : t("offline")}</div>
        ${favBtn}
      </a>
      <div class="card-body">
        <h3><a href="${href}">${e.name}, ${e.age}</a></h3>
        <p class="card-title-line">${title !== e.name && title !== `${e.name}, ${e.age}` ? title : ""}</p>
        <div class="card-meta">
          <span class="meta-i">${ico("pin")} ${loc}</span>
          <span class="meta-i">${ico("globe")} ${e.nationality || "—"}</span>
        </div>
        <div class="card-langs">${langs}</div>
        <div class="card-flags">${flags}</div>
        <p class="card-desc">${desc || ""}</p>
        <div class="card-footer card-footer-col">
          <div class="price">${e.price}€ <small>/ ${t("hour")}</small></div>
          <div class="card-actions">
            <button type="button" class="btn btn-ghost btn-sm btn-reveal" data-phone="${phone}">${ico("phone")}</button>
            <a class="btn btn-whatsapp btn-sm" href="https://wa.me/${phone}?text=${encodeURIComponent(t("wa_msg", { name: e.name }))}" target="_blank" rel="noopener">${ico("wa")}</a>
            <a class="btn btn-primary btn-sm" href="${href}">${t("card_view")}</a>
          </div>
        </div>
      </div>
    </article>
  `;
}

function applyUrlParams() {
  const params = new URLSearchParams(location.search);
  const zone = params.get("zone") || params.get("z");
  const q = params.get("q") || params.get("search");
  const price = params.get("price") || params.get("max");
  const lang = params.get("lang") || params.get("speak");
  if (zone && document.getElementById("filter-zone")) document.getElementById("filter-zone").value = zone;
  if (q && document.getElementById("filter-q")) document.getElementById("filter-q").value = q;
  if (price && document.getElementById("filter-price")) document.getElementById("filter-price").value = price;
  if (lang && document.getElementById("filter-lang") && !["es","en","de","fr","nl","it","pt","no","sv","ru","pl"].includes(lang.toLowerCase())) {
    document.getElementById("filter-lang").value = lang.toUpperCase();
  } else if (lang && ["ES","EN","DE","FR","NL","IT","PT","NO","SV","RU","PL"].includes(lang.toUpperCase()) && document.getElementById("filter-lang")) {
    // if lang is UI lang code from i18n, don't force filter; if speak code, ok
  }
  if (params.get("langFilter") && document.getElementById("filter-lang")) {
    document.getElementById("filter-lang").value = params.get("langFilter").toUpperCase();
  }
  if (params.get("myLang") === "1" && document.getElementById("filter-my-lang")) {
    document.getElementById("filter-my-lang").checked = true;
  }
  if (params.get("chip")) {
    const c = document.querySelector(`.quick-chip[data-chip="${params.get("chip")}"]`);
    if (c) c.classList.add("active");
  }
  if (zone && document.getElementById("hero-zone")) document.getElementById("hero-zone").value = zone;
}

function clientFilterSort(list) {
  let out = [...list];
  const zone = document.getElementById("filter-zone")?.value;
  const maxPrice = document.getElementById("filter-price")?.value;
  const minPrice = document.getElementById("filter-min-price")?.value;
  const q = document.getElementById("filter-q")?.value?.toLowerCase().trim();
  const sort = document.getElementById("filter-sort")?.value || "featured";
  const onlyOnline = document.getElementById("filter-online")?.checked;
  const myLang = document.getElementById("filter-my-lang")?.checked;
  const langFilter = document.getElementById("filter-lang")?.value;
  const nationality = document.getElementById("filter-nationality")?.value?.toLowerCase();
  const minAge = document.getElementById("filter-min-age")?.value;
  const maxAge = document.getElementById("filter-max-age")?.value;
  const independent = document.getElementById("filter-independent")?.checked;
  const outcall = document.getElementById("filter-outcall")?.checked;
  const incall = document.getElementById("filter-incall")?.checked;
  const h24 = document.getElementById("filter-24h")?.checked;
  const onlyNew = document.getElementById("filter-new")?.checked;
  const onlyTop = document.getElementById("filter-top")?.checked;
  const chip = document.querySelector(".quick-chip.active")?.dataset?.chip;

  if (zone) out = out.filter((e) => e.zoneSlug === zone);
  if (maxPrice) out = out.filter((e) => e.price <= Number(maxPrice));
  if (minPrice) out = out.filter((e) => e.price >= Number(minPrice));
  if (onlyOnline) out = out.filter((e) => e.online);
  if (independent) out = out.filter((e) => e.independent);
  if (outcall) out = out.filter((e) => e.outcall);
  if (incall) out = out.filter((e) => e.incall);
  if (h24) out = out.filter((e) => e.available24h);
  if (onlyNew) out = out.filter((e) => (e.tags || []).includes("new"));
  if (onlyTop) out = out.filter((e) => e.featured || (e.tags || []).includes("vip"));
  if (minAge) out = out.filter((e) => e.age >= Number(minAge));
  if (maxAge) out = out.filter((e) => e.age <= Number(maxAge));
  if (nationality) out = out.filter((e) => (e.nationality || "").toLowerCase().includes(nationality));
  if (myLang) out = out.filter((e) => profileSpeaksUILang(e));
  if (langFilter) {
    const lf = langFilter.toUpperCase();
    out = out.filter((e) => (e.languages || []).map((x) => String(x).toUpperCase()).includes(lf));
  }
  if (chip === "new") out = out.filter((e) => (e.tags || []).includes("new"));
  if (chip === "top") out = out.filter((e) => e.featured || (e.tags || []).includes("vip"));
  if (chip === "online") out = out.filter((e) => e.online);
  if (chip === "24h") out = out.filter((e) => e.available24h);
  if (chip === "outcall") out = out.filter((e) => e.outcall);
  if (chip === "independent") out = out.filter((e) => e.independent);

  if (q) {
    out = out.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.title || "").toLowerCase().includes(q) ||
        e.zone.toLowerCase().includes(q) ||
        (e.locationDetail || "").toLowerCase().includes(q) ||
        (e.nationality || "").toLowerCase().includes(q) ||
        (e.desc || "").toLowerCase().includes(q) ||
        (e.languages || []).some((l) => l.toLowerCase().includes(q))
    );
  }

  if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
  else if (sort === "online") out.sort((a, b) => Number(b.online) - Number(a.online));
  else if (sort === "new") out.sort((a, b) => Number((b.tags || []).includes("new")) - Number((a.tags || []).includes("new")));
  else if (sort === "age-asc") out.sort((a, b) => a.age - b.age);
  else if (sort === "lang") {
    out.sort((a, b) => Number(profileSpeaksUILang(b)) - Number(profileSpeaksUILang(a)));
  } else {
    out.sort((a, b) => {
      const sa =
        (a.featured ? 1000 : 0) +
        (a.online ? 100 : 0) +
        (profileSpeaksUILang(a) ? 200 : 0) +
        (a.views || 0) / 100;
      const sb =
        (b.featured ? 1000 : 0) +
        (b.online ? 100 : 0) +
        (profileSpeaksUILang(b) ? 200 : 0) +
        (b.views || 0) / 100;
      return sb - sa;
    });
  }

  return out;
}

let _allAds = [];
let _page = 1;
const PAGE_SIZE = 12;
let _viewMode = localStorage.getItem("eb_view") || "grid";

function bindRevealButtons(root) {
  root.querySelectorAll(".btn-reveal").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      const phone = btn.dataset.phone || "";
      if (!phone) return;
      if (btn.dataset.open === "1") {
        window.location.href = `tel:+${phone}`;
        return;
      }
      btn.dataset.open = "1";
      btn.innerHTML = phone;
      btn.classList.remove("btn-ghost", "btn-secondary");
      btn.classList.add("btn-primary");
    });
  });
  root.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const id = btn.dataset.fav;
      const on = toggleFav(id);
      btn.classList.toggle("is-on", on);
      btn.innerHTML = on ? ico("heartFill") : ico("heart");
      showToast(on ? t("js_fav_on") : t("js_fav_off"));
      // refresh favorites page if open
      if (document.getElementById("listings")?.dataset.favorites === "1") {
        renderListings({ force: false, resetPage: true });
      }
    });
  });
}

function renderPagination(total) {
  const el = document.getElementById("pagination");
  if (!el) return;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (_page > pages) _page = pages;
  if (pages <= 1) {
    el.innerHTML = "";
    return;
  }
  let html = `<button type="button" class="page-btn" data-page="${_page - 1}" ${_page <= 1 ? "disabled" : ""}>←</button>`;
  for (let i = 1; i <= pages; i++) {
    if (pages > 7 && Math.abs(i - _page) > 2 && i !== 1 && i !== pages) {
      if (i === 2 || i === pages - 1) html += `<span class="page-gap">…</span>`;
      continue;
    }
    html += `<button type="button" class="page-btn ${_page === i ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button type="button" class="page-btn" data-page="${_page + 1}" ${_page >= pages ? "disabled" : ""}>→</button>`;
  el.innerHTML = html;
  el.querySelectorAll(".page-btn[data-page]").forEach((b) => {
    b.addEventListener("click", () => {
      const p = Number(b.dataset.page);
      if (p >= 1 && p <= pages) {
        _page = p;
        renderListings();
        document.getElementById("listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

async function renderListings(opts = {}) {
  const el = document.getElementById("listings");
  if (!el) return;

  if (opts.resetPage) _page = 1;
  const view = document.getElementById("listings-view")?.dataset.view || _viewMode;
  _viewMode = view;
  el.classList.toggle("list-view", view === "list");
  el.classList.toggle("cards-grid", view !== "list");

  el.innerHTML = skeletonHTML(view === "list" ? 3 : 4);

  try {
    if (!_allAds.length || opts.force) {
      _allAds = await getAllEscorts(true);
    }
    let list = [..._allAds];
    if (opts.featuredOnly || el.dataset.featured === "1") list = list.filter((e) => e.featured);
    if (opts.zone || el.dataset.zone) list = list.filter((e) => e.zoneSlug === (opts.zone || el.dataset.zone));
    if (opts.favoritesOnly || el.dataset.favorites === "1") {
      const favs = getFavs();
      list = list.filter((e) => favs.includes(e.id));
    } else {
      list = clientFilterSort(list);
    }

    const countEl = document.getElementById("results-count") || document.getElementById("fav-count");
    if (countEl) {
      if (el.dataset.favorites === "1") {
        countEl.innerHTML = `<strong>${list.length}</strong> favorita${list.length !== 1 ? "s" : ""}`;
      } else {
        countEl.innerHTML = `<strong>${list.length}</strong> ${t("results")}`;
      }
    }

    if (!list.length) {
      const isFavPage = el.dataset.favorites === "1";
      const isFeatured = opts.featuredOnly || el.dataset.featured === "1";
      const isZone = !!(opts.zone || el.dataset.zone);
      let msg = t("no_results");
      let cta = t("clear_filters");
      let href = `${basePath()}anuncios.html`;
      if (isFavPage) {
        msg = "Aún no tienes favoritas. Explora anuncios y toca el corazón.";
        cta = "Explorar anuncios";
      } else if (isFeatured) {
        msg = "Aún no hay anuncios destacados. Sé la primera en publicar en Benidorm.";
        cta = "Publicar · 24h prueba";
        href = `${basePath()}publicar.html`;
      } else if (isZone) {
        msg = "Todavía no hay anuncios en esta zona. Vuelve pronto o publica el tuyo (24h de prueba).";
        cta = "Publicar en esta zona";
        href = `${basePath()}publicar.html`;
      } else {
        msg = "Catálogo listo: aún no hay anuncios activos. Publica el primero (24h de prueba, luego desde 5€/día).";
        cta = "Publicar el primer anuncio";
        href = `${basePath()}publicar.html`;
      }
      el.innerHTML = `<div class="empty-state">
        <div class="empty-ico">${ico(isFavPage ? "heart" : "spark")}</div>
        <p>${msg}</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-top:0.75rem">
          <a class="btn btn-primary btn-sm" href="${href}">${cta}</a>
          ${
            !isFavPage
              ? `<a class="btn btn-secondary btn-sm" href="${basePath()}precios.html">Precios desde 5€/día</a>
                 <a class="btn btn-ghost btn-sm" href="${basePath()}putas-benidorm.html">Putas Benidorm</a>`
              : ""
          }
        </div>
      </div>`;
      renderPagination(0);
      return;
    }

    // home featured: no pagination, show up to 8
    if (opts.featuredOnly || el.dataset.featured === "1") {
      el.innerHTML = list.slice(0, 8).map((e) => cardHTML(e, "grid")).join("");
      bindRevealButtons(el);
      renderPagination(0);
      return;
    }

    if (el.dataset.favorites === "1") {
      el.innerHTML = list.map((e) => cardHTML(e, "grid")).join("");
      bindRevealButtons(el);
      renderPagination(0);
      return;
    }

    const start = (_page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);
    el.innerHTML = pageItems.map((e) => cardHTML(e, view)).join("");
    bindRevealButtons(el);
    renderPagination(list.length);
  } catch (err) {
    console.error(err);
    el.innerHTML = `<div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--accent)">
      <p>${t("api_off")}</p>
      <p style="color:var(--text-dim);font-size:0.8rem;margin-top:0.5rem">${err.message}</p>
    </div>`;
  }
}

function initFilters() {
  const ids = [
    "filter-zone", "filter-price", "filter-min-price", "filter-q", "filter-sort",
    "filter-online", "filter-my-lang", "filter-lang", "filter-nationality",
    "filter-min-age", "filter-max-age", "filter-independent", "filter-outcall",
    "filter-incall", "filter-24h", "filter-new", "filter-top",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(ev, () => renderListings({ resetPage: true }));
  });

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const was = chip.classList.contains("active");
      document.querySelectorAll(".quick-chip").forEach((c) => c.classList.remove("active"));
      if (!was) chip.classList.add("active");
      renderListings({ resetPage: true });
    });
  });

  document.querySelectorAll("[data-set-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.setView;
      localStorage.setItem("eb_view", v);
      const wrap = document.getElementById("listings-view");
      if (wrap) wrap.dataset.view = v;
      document.querySelectorAll("[data-set-view]").forEach((b) => b.classList.toggle("active", b.dataset.setView === v));
      renderListings();
    });
  });
  document.querySelectorAll("[data-set-view]").forEach((b) => {
    b.classList.toggle("active", b.dataset.setView === _viewMode);
  });
  const wrap = document.getElementById("listings-view");
  if (wrap) wrap.dataset.view = _viewMode;

  initFilterDrawer();
}

function openFilterDrawer() {
  const panel = document.getElementById("filters-panel");
  const backdrop = document.getElementById("drawer-backdrop");
  const toggle = document.getElementById("filters-toggle");
  if (!panel) return;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  if (backdrop) {
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("show"));
  }
  document.body.classList.add("drawer-open");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("active");
  }
}

function closeFilterDrawer() {
  const panel = document.getElementById("filters-panel");
  const backdrop = document.getElementById("drawer-backdrop");
  const toggle = document.getElementById("filters-toggle");
  if (!panel) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  if (backdrop) {
    backdrop.classList.remove("show");
    setTimeout(() => {
      backdrop.hidden = true;
    }, 250);
  }
  document.body.classList.remove("drawer-open");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("active");
  }
}

function initFilterDrawer() {
  const toggle = document.getElementById("filters-toggle");
  const panel = document.getElementById("filters-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    if (panel.classList.contains("is-open")) closeFilterDrawer();
    else openFilterDrawer();
  });
  document.getElementById("filters-close")?.addEventListener("click", closeFilterDrawer);
  document.getElementById("drawer-backdrop")?.addEventListener("click", closeFilterDrawer);
  document.getElementById("filters-apply")?.addEventListener("click", () => {
    renderListings({ resetPage: true });
    closeFilterDrawer();
  });
  document.getElementById("filters-reset")?.addEventListener("click", () => {
    panel.querySelectorAll("select").forEach((s) => {
      s.selectedIndex = 0;
    });
    panel.querySelectorAll('input[type="checkbox"]').forEach((c) => {
      c.checked = false;
    });
    panel.querySelectorAll('input[type="search"]').forEach((i) => {
      i.value = "";
    });
    document.querySelectorAll(".quick-chip").forEach((c) => c.classList.remove("active"));
    renderListings({ resetPage: true });
  });
}

function fillLangFilterSelect() {
  const sel = document.getElementById("filter-lang");
  if (!sel || sel.dataset.filled) return;
  sel.dataset.filled = "1";
  const codes = ["ES", "EN", "DE", "FR", "NL", "IT", "PT", "NO", "SV", "RU", "PL"];
  const first = document.createElement("option");
  first.value = "";
  first.setAttribute("data-i18n", "all_langs");
  first.textContent = t("all_langs");
  sel.innerHTML = "";
  sel.appendChild(first);
  codes.forEach((c) => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    sel.appendChild(o);
  });
}

function fillZoneSelects() {
  document.querySelectorAll("select[data-zones-fill]").forEach((sel) => {
    const cur = sel.value;
    const keepFirst = sel.querySelector("option[value='']");
    const firstLabel = keepFirst ? keepFirst.textContent : t("search_zone");
    sel.innerHTML = "";
    const o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = t("search_zone");
    o0.setAttribute("data-i18n", "search_zone");
    sel.appendChild(o0);
    ZONES.forEach((z) => {
      const o = document.createElement("option");
      o.value = z.slug;
      o.textContent = zoneLabel(z.slug, z.name);
      sel.appendChild(o);
    });
    if (cur) sel.value = cur;
  });
}

function initHeroSearch() {
  const form = document.getElementById("hero-search-form");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const zone = document.getElementById("hero-zone")?.value || "";
    const q = document.getElementById("hero-q")?.value || "";
    const params = new URLSearchParams();
    if (zone) params.set("zone", zone);
    if (q) params.set("q", q);
    params.set("myLang", "1");
    location.href = `${basePath()}anuncios.html?${params.toString()}`;
  });
}

async function initProfile() {
  const root = document.getElementById("profile-root");
  if (!root) return;

  root.innerHTML = `<div class="container" style="padding:3rem 1rem;color:var(--text-muted)">${t("loading")}</div>`;

  let id = new URLSearchParams(location.search).get("id");
  if (!id) {
    const m = location.pathname.match(/\/a\/([^/]+)\/?$/);
    if (m) id = decodeURIComponent(m[1]);
  }
  let e = null;
  try {
    e = id ? await getEscortById(id) : null;
    if (!e) {
      const all = await getAllEscorts(true);
      e = all[0];
    }
  } catch (err) {
    root.innerHTML = `<div class="container" style="padding:3rem 1rem;color:var(--accent)">${err.message}</div>`;
    return;
  }
  if (!e) {
    root.innerHTML = `<div class="container" style="padding:3rem 1rem">Not found</div>`;
    return;
  }

  pushRecent(e.id);

  const base = basePath();
  const desc = isEn() && e.descEn ? e.descEn : e.desc;
  const zoneL = zoneLabel(e.zoneSlug, e.zone);
  const phone = e.phone || "34000000000";
  const waText = t("wa_msg", { name: e.name });
  const speaks = profileSpeaksUILang(e);

  document.title = `${e.name} · ${zoneL}, Benidorm | EscortBenidorm`;
  const metaDesc = `${e.name}, ${e.age} años · escort en ${zoneL}, Benidorm · ${e.price}€/h · ${(e.languages || []).join(", ")}. Contacto directo WhatsApp.`;
  setOrCreateMeta("description", metaDesc);
  setOrCreateMeta("og:title", `${e.name} — Escort ${zoneL}, Benidorm`, "property");
  setOrCreateMeta("og:description", metaDesc, "property");
  setOrCreateMeta("og:type", "profile", "property");
  if (e.photo) setOrCreateMeta("og:image", new URL(e.photo, location.origin).href, "property");
  const absUrl = adAbsoluteUrl(e.id);
  setOrCreateMeta("og:url", absUrl, "property");
  let can = document.querySelector('link[rel="canonical"]');
  if (!can) {
    can = document.createElement("link");
    can.rel = "canonical";
    document.head.appendChild(can);
  }
  can.href = absUrl;
  // Prefer clean URL in the address bar when opened via ?id=
  if (!location.pathname.includes("/a/") && e.id) {
    try {
      history.replaceState(null, "", `/a/${encodeURIComponent(e.id)}`);
    } catch (_) {}
  }

  let related = [];
  try {
    const all = await getAllEscorts();
    related = all.filter((x) => x.zoneSlug === e.zoneSlug && x.id !== e.id).slice(0, 4);
  } catch (_) {}

  const listPage = `${base}anuncios.html`;
  const zoneHref = `${base}zonas/${e.zoneSlug}.html`;
  const slides = gallerySlides(e);
  const fav = isFav(e.id);
  const slideHTML = slides
    .map((s, i) => {
      if (s.type === "img") {
        return `<div class="gallery-slide ${i === 0 ? "is-active" : ""}" data-slide="${i}"><img src="${s.src}" alt="${e.name} ${i + 1}" /></div>`;
      }
      return `<div class="gallery-slide ${i === 0 ? "is-active" : ""}" data-slide="${i}" style="background:${s.bg}"><span class="gallery-letter">${s.letter}</span><span class="gallery-label">${s.label}</span></div>`;
    })
    .join("");
  const dots = slides
    .map((_, i) => `<button type="button" class="gallery-dot ${i === 0 ? "is-active" : ""}" data-go="${i}" aria-label="Foto ${i + 1}"></button>`)
    .join("");
  const thumbs = slides
    .map((s, i) => {
      if (s.type === "img") {
        return `<button type="button" class="gallery-thumb ${i === 0 ? "is-active" : ""}" data-go="${i}" style="background-image:url('${s.src}')"></button>`;
      }
      return `<button type="button" class="gallery-thumb ${i === 0 ? "is-active" : ""}" data-go="${i}" style="background:${s.bg}"><span>${s.letter}</span></button>`;
    })
    .join("");

  root.innerHTML = `
    <div class="breadcrumb container">
      <a href="${base}index.html">${t("home")}</a> ·
      <a href="${listPage}">${t("nav_ads")}</a> ·
      <a href="${zoneHref}">${zoneL}</a> ·
      <span>${e.name}</span>
    </div>
    <div class="container profile-hero">
      <div class="profile-gallery-wrap">
        <div class="profile-gallery" id="profile-gallery">
          ${slideHTML}
          <div class="online-dot ${e.online ? "" : "offline"}">${e.online ? t("online_now") : t("offline")}</div>
          <button type="button" class="fav-btn ${fav ? "is-on" : ""}" data-fav="${e.id}" aria-label="Favorito">${fav ? ico("heartFill") : ico("heart")}</button>
          ${
            slides.length > 1
              ? `<button type="button" class="gallery-nav prev" data-dir="-1" aria-label="Anterior">‹</button>
                 <button type="button" class="gallery-nav next" data-dir="1" aria-label="Siguiente">›</button>
                 <div class="gallery-dots">${dots}</div>
                 <div class="gallery-counter"><span id="g-cur">1</span> / ${slides.length}</div>`
              : ""
          }
        </div>
        ${slides.length > 1 ? `<div class="gallery-thumbs">${thumbs}</div>` : ""}
      </div>
      <div class="profile-info">
        <div class="profile-tags">
          ${(e.tags || []).includes("vip") ? `<span class="tag tag-vip">${ico("star")} VIP</span>` : ""}
          ${(e.tags || []).includes("verified") ? `<span class="tag tag-verified">${ico("check")} Real</span>` : ""}
          ${(e.tags || []).includes("new") ? `<span class="tag tag-new">${t("new_tag")}</span>` : ""}
          ${speaks ? `<span class="tag tag-speak">${ico("chat")} ${t("speak_badge")}</span>` : ""}
        </div>
        <h1>${e.name}, ${e.age}</h1>
        <p class="profile-sub">${ico("pin")} ${e.locationDetail || zoneL} · Benidorm · ${e.nationality || ""}</p>
        <dl class="profile-stats">
          <div class="pstat"><dt>${t("area")}</dt><dd>${e.locationDetail || zoneL}</dd></div>
          <div class="pstat"><dt>${t("height")}</dt><dd>${e.height || "—"}</dd></div>
          <div class="pstat"><dt>${t("languages")}</dt><dd>${(e.languages || []).join(", ") || "—"}</dd></div>
          <div class="pstat"><dt>${t("rate")}</dt><dd style="color:var(--gold)">${e.price}€/h</dd></div>
          <div class="pstat"><dt>Nacionalidad</dt><dd>${e.nationality || "—"}</dd></div>
          <div class="pstat"><dt>Horario</dt><dd>${e.schedule || (e.available24h ? "24h" : "Flexible")}</dd></div>
          <div class="pstat"><dt>Modalidad</dt><dd>${[e.incall ? "Recibe" : "", e.outcall ? "Salidas" : ""].filter(Boolean).join(" · ") || "—"}</dd></div>
          <div class="pstat"><dt>Tipo</dt><dd>${e.independent ? "Independiente" : "—"}</dd></div>
          ${e.bodyType ? `<div class="pstat"><dt>Complexión</dt><dd>${e.bodyType}</dd></div>` : ""}
          ${e.hair ? `<div class="pstat"><dt>Cabello</dt><dd>${e.hair}</dd></div>` : ""}
          <div class="pstat"><dt>Fotos</dt><dd>${slides.filter((s) => s.type === "img").length || slides.length}</dd></div>
        </dl>
        <p style="color:var(--text-muted);margin-bottom:1rem;line-height:1.6">${desc || ""}</p>
        <h2 style="font-size:1rem;margin-bottom:0.5rem">${t("services")}</h2>
        <div class="profile-tags" style="margin-top:0">
          ${(e.services || []).map((s) => `<span class="chip">${s}</span>`).join("")}
        </div>
        <div class="profile-actions">
          <a class="btn btn-whatsapp" href="https://wa.me/${phone}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${ico("wa")} WhatsApp</a>
          <button type="button" class="btn btn-secondary btn-reveal" data-phone="${phone}">${ico("phone")} Ver teléfono</button>
          <a class="btn btn-primary" href="tel:+${phone}">${ico("phone")} ${t("call")}</a>
          <button type="button" class="btn btn-ghost" id="share-profile">${ico("spark")} Compartir</button>
          <button type="button" class="btn btn-ghost" id="compare-add" data-compare="${e.id}">Comparar</button>
          <a class="btn btn-ghost" href="${listPage}?zone=${e.zoneSlug}">${t("more_in")} ${zoneL}</a>
        </div>
        <p class="form-hint" style="margin-top:1rem">${e.views || 0} ${t("views")} · ${e.title || e.name}</p>
        <div class="share-box" id="share-box">
          <span class="share-label">Link del perfil</span>
          <code class="share-url" id="share-url"></code>
        </div>
        <button type="button" class="report-link" id="report-ad">Reportar anuncio</button>
      </div>
    </div>
    ${
      related.length
        ? `<section class="container">
            <div class="section-head"><div><h2>${t("more_in")} ${zoneL}</h2></div></div>
            <div class="cards-grid">${related.map(cardHTML).join("")}</div>
          </section>`
        : ""
    }
  `;

  const barWa = document.querySelector(".mobile-cta-bar .btn-whatsapp");
  if (barWa) barWa.href = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;
  bindRevealButtons(root);
  initGallery(root, slides.length);

  const shareUrl = adAbsoluteUrl(e.id);
  const shareBox = root.querySelector("#share-url");
  if (shareBox) shareBox.textContent = shareUrl;
  root.querySelector("#share-profile")?.addEventListener("click", () => shareProfile(e));
  root.querySelector("#compare-add")?.addEventListener("click", () => {
    let ids = getCompareIds();
    if (ids.includes(e.id)) {
      showToast("Ya está en comparar");
      return;
    }
    if (ids.length >= 3) {
      ids = ids.slice(1);
    }
    ids.push(e.id);
    setCompareIds(ids);
    showToast(`Comparar (${ids.length}/3)`);
  });
  root.querySelector("#report-ad")?.addEventListener("click", async () => {
    const reason = prompt("Motivo (spam, fake, otro):", "spam");
    if (reason == null) return;
    try {
      await API.post("/api/report", { adId: e.id, reason, detail: "" });
      showToast("Reporte enviado. Gracias.");
    } catch (err) {
      showToast(err.message || "Error al reportar");
    }
  });
  injectProfileSchema(e, shareUrl, zoneL, desc);
}

function setOrCreateMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function injectProfileSchema(e, url, zoneL, desc) {
  document.querySelectorAll("script[data-profile-schema]").forEach((n) => n.remove());
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-profile-schema", "1");
  const photos = Array.isArray(e.photos) && e.photos.length ? e.photos : e.photo ? [e.photo] : [];
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${e.name} — Escorts Benidorm`,
    url,
    mainEntity: {
      "@type": "Person",
      name: e.name,
      description: (desc || "").slice(0, 300),
      jobTitle: "Escort",
      image: photos.map((p) => new URL(p, location.origin).href),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Benidorm",
        addressRegion: "Alicante",
        addressCountry: "ES",
        streetAddress: e.locationDetail || zoneL,
      },
    },
  });
  document.head.appendChild(script);
}

function initGallery(root, total) {
  if (total <= 1) return;
  let cur = 0;
  const gallery = root.querySelector("#profile-gallery");
  if (!gallery) return;

  const setSlide = (i) => {
    cur = (i + total) % total;
    gallery.querySelectorAll(".gallery-slide").forEach((s, idx) => s.classList.toggle("is-active", idx === cur));
    root.querySelectorAll(".gallery-dot, .gallery-thumb").forEach((d) => {
      d.classList.toggle("is-active", Number(d.dataset.go) === cur);
    });
    const counter = root.querySelector("#g-cur");
    if (counter) counter.textContent = String(cur + 1);
  };

  gallery.querySelectorAll(".gallery-nav").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      setSlide(cur + Number(btn.dataset.dir));
    });
  });
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      setSlide(Number(btn.dataset.go));
    });
  });

  // swipe
  let x0 = null;
  gallery.addEventListener(
    "touchstart",
    (e) => {
      x0 = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  gallery.addEventListener(
    "touchend",
    (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) setSlide(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    },
    { passive: true }
  );
}

function currentPublishMaxPhotos() {
  const plan = document.getElementById("plan")?.value || "basic";
  if (plan === "top") return 8;
  if (plan === "vip") return 6;
  if (plan === "basic" || plan === "day") return 4;
  return 3;
}

function renderPhotoPreviews(input, container, max) {
  if (!input || !container) return;
  const limit = max != null ? max : currentPublishMaxPhotos();
  let files = Array.from(input.files || []);
  if (files.length > limit) {
    // trim FileList via DataTransfer
    const dt = new DataTransfer();
    files.slice(0, limit).forEach((f) => dt.items.add(f));
    input.files = dt.files;
    files = Array.from(input.files || []);
    showToast(`Máximo ${limit} fotos en este plan`);
  }
  container.innerHTML = files
    .map((f, i) => {
      const url = URL.createObjectURL(f);
      return `<div class="photo-preview-item"><img src="${url}" alt="Foto ${i + 1}" /><span>${i === 0 ? "Portada" : i + 1}</span></div>`;
    })
    .join("");
  const hint = document.getElementById("photo-count-hint");
  if (hint) {
    hint.textContent =
      files.length > 0
        ? `${files.length} / ${limit} fotos · la primera es portada`
        : `0 / ${limit} fotos · opcional pero muy recomendable`;
  }
  // live preview cover
  const media = document.getElementById("preview-media");
  const letter = document.getElementById("preview-letter");
  if (media && files[0]) {
    const url = URL.createObjectURL(files[0]);
    media.style.backgroundImage = `url('${url}')`;
    media.style.backgroundSize = "cover";
    media.style.backgroundPosition = "center";
    if (letter) letter.style.display = "none";
  } else if (media && letter) {
    media.style.backgroundImage = "";
    letter.style.display = "";
  }
}

function setFileInputFiles(input, fileList) {
  if (!input) return;
  const dt = new DataTransfer();
  Array.from(fileList).slice(0, 6).forEach((f) => dt.items.add(f));
  input.files = dt.files;
}

function initChipSelect(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const targetId = root.dataset.target;
  const hidden = document.getElementById(targetId);
  const sync = () => {
    if (!hidden) return;
    const vals = [...root.querySelectorAll(".chip-opt.is-on")].map((b) => b.dataset.val);
    hidden.value = vals.join(", ");
  };
  root.querySelectorAll(".chip-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-on");
      // languages: at least one
      if (rootId === "lang-chips" && !root.querySelector(".chip-opt.is-on")) {
        btn.classList.add("is-on");
      }
      sync();
      updatePublishPreview();
      updatePublishProgress();
    });
  });
  sync();
}

function suggestPublishTitle() {
  const name = document.getElementById("name")?.value?.trim() || "Escort";
  const nat = document.getElementById("nationality")?.value?.trim() || "";
  const zoneSel = document.getElementById("zone");
  const zoneText = zoneSel?.selectedOptions?.[0]?.text || "Benidorm";
  const zoneShort = zoneText.replace("Playa de ", "").replace(" / Cala", "");
  const bits = [name];
  if (nat) bits.push(nat.toLowerCase());
  bits.push("—");
  bits.push(zoneShort);
  bits.push("Benidorm");
  const title = bits.join(" ").replace(/\s+/g, " ").slice(0, 90);
  const input = document.getElementById("title");
  if (input) {
    input.value = title;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function updatePublishProgress() {
  const form = document.getElementById("publish-form");
  if (!form) return;
  const checks = [
    !!form.name?.value?.trim(),
    Number(form.age?.value) >= 18,
    !!form.zone?.value,
    Number(form.price?.value) >= 50,
    String(form.phone?.value || "").replace(/\D/g, "").length >= 9,
    !!API.userToken(),
    String(form.desc?.value || "").trim().length >= 20,
    !!form.legal?.checked,
  ];
  const done = checks.filter(Boolean).length;
  const pct = Math.round((done / checks.length) * 100);
  const bar = document.getElementById("publish-progress-bar");
  const label = document.getElementById("publish-progress-pct");
  if (bar) bar.style.width = pct + "%";
  if (label) label.textContent = String(pct);
}

function updatePublishPreview() {
  const name = document.getElementById("name")?.value?.trim() || "Tu nombre";
  const age = document.getElementById("age")?.value || "—";
  const title = document.getElementById("title")?.value?.trim() || "";
  const zoneSel = document.getElementById("zone");
  const zone = zoneSel?.value
    ? zoneSel.selectedOptions[0].text
    : "Zona Benidorm";
  const nat = document.getElementById("nationality")?.value?.trim() || "—";
  const price = document.getElementById("price")?.value || "—";
  const desc = document.getElementById("desc")?.value?.trim() || "Tu descripción aparecerá aquí…";
  const langs = (document.getElementById("languages")?.value || "ES")
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const plan = document.getElementById("plan")?.value || "free";

  const elName = document.getElementById("preview-name");
  const elTitle = document.getElementById("preview-title");
  const elZone = document.getElementById("preview-zone");
  const elNat = document.getElementById("preview-nat");
  const elPrice = document.getElementById("preview-price");
  const elDesc = document.getElementById("preview-desc");
  const elLangs = document.getElementById("preview-langs");
  const elLetter = document.getElementById("preview-letter");
  const elBadges = document.getElementById("preview-badges");

  if (elName) elName.textContent = `${name}${age !== "—" ? ", " + age : ""}`;
  if (elTitle) elTitle.textContent = title && title !== name ? title : "";
  if (elZone) elZone.textContent = zone;
  if (elNat) elNat.textContent = nat;
  if (elPrice) elPrice.textContent = price;
  if (elDesc) elDesc.textContent = desc.slice(0, 140) + (desc.length > 140 ? "…" : "");
  if (elLangs) {
    elLangs.innerHTML = langs.map((l) => `<span class="lang-pill">${l}</span>`).join("");
  }
  if (elLetter) elLetter.textContent = (name || "?").charAt(0).toUpperCase();
  if (elBadges) {
    const tags = [];
    if (plan === "vip" || plan === "top") tags.push(`<span class="tag tag-vip">TOP</span>`);
    if (plan === "top") tags.push(`<span class="tag tag-verified">Real</span>`);
    tags.push(`<span class="tag tag-new">Nueva</span>`);
    elBadges.innerHTML = tags.join("");
  }
}

function validatePublishForm(form) {
  const errors = [];
  const name = String(form.name?.value || "").trim();
  const age = Number(form.age?.value);
  const zone = form.zone?.value;
  const price = Number(form.price?.value);
  const phone = String(form.phone?.value || "").replace(/\D/g, "");
  const email = String(form.manageEmail?.value || form.email?.value || "").trim();
  const desc = String(form.desc?.value || "").trim();
  if (name.length < 2) errors.push("Nombre artístico demasiado corto.");
  if (!age || age < 18) errors.push(t("js_err_age"));
  if (!zone) errors.push(t("js_err_zone"));
  if (!price || price < 50) errors.push(t("js_err_price"));
  if (phone.length < 9) errors.push(t("js_err_phone"));
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push(t("js_err_phone"));
  }
  if (!API.userToken()) errors.push(t("js_err_login"));
  if (desc.length < 20) errors.push(t("js_err_desc"));
  if (!form.legal?.checked) errors.push(t("js_err_legal"));
  return errors;
}

function initAuthForms() {
  const reg = document.getElementById("register-form");
  if (reg && !reg.dataset.bound) {
    reg.dataset.bound = "1";
    reg.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const err = document.getElementById("reg-error");
      const email = document.getElementById("reg-email")?.value?.trim();
      const phone = document.getElementById("reg-phone")?.value;
      const password = document.getElementById("reg-pass")?.value || "";
      const password2 = document.getElementById("reg-pass2")?.value || "";
      const name = document.getElementById("reg-name")?.value?.trim() || "";
      if (password !== password2) {
        if (err) {
          err.hidden = false;
          err.innerHTML = `<strong>${t("js_error")}</strong><ul><li>${t("js_pass_mismatch")}</li></ul>`;
        }
        return;
      }
      const btn = reg.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = t("js_creating");
      }
      try {
        const data = await API.post(
          "/api/auth/register",
          { email, phone, password, name },
          { token: "" }
        );
        API.setUserToken(data.token);
        API.setUser(data.user);
        showToast(t("js_account_ok"));
        const next = new URLSearchParams(location.search).get("next") || "publicar.html";
        location.href = next;
      } catch (e) {
        if (err) {
          err.hidden = false;
          err.innerHTML = `<strong>${t("js_error")}</strong><ul><li>${e.message}</li></ul>`;
        }
        showToast(e.message);
        if (btn) {
          btn.disabled = false;
          btn.textContent = t("reg_btn");
        }
      }
    });
  }

  const login = document.getElementById("login-form");
  if (login && !login.dataset.bound) {
    login.dataset.bound = "1";
    login.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const err = document.getElementById("login-error");
      const email = document.getElementById("login-email")?.value?.trim();
      const password = document.getElementById("login-pass")?.value || "";
      const btn = login.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = t("js_entering");
      }
      try {
        const body = email.includes("@")
          ? { email, password }
          : { phone: email, password };
        const data = await API.post("/api/auth/login", body, { token: "" });
        API.setUserToken(data.token);
        API.setUser(data.user);
        showToast(t("js_session_ok"));
        const next = new URLSearchParams(location.search).get("next") || "publicar.html";
        location.href = next;
      } catch (e) {
        if (err) {
          err.hidden = false;
          err.innerHTML = `<strong>${t("js_error")}</strong><ul><li>${e.message}</li></ul>`;
        }
        showToast(e.message);
        if (btn) {
          btn.disabled = false;
          btn.textContent = t("login_btn");
        }
      }
    });
  }
}

function requireUserForPublish() {
  const form = document.getElementById("publish-form");
  const bar = document.getElementById("publish-auth-bar");
  if (!form && !bar) return true;
  if (!API.userToken()) {
    if (bar) {
      bar.innerHTML = `
        <div class="publish-auth-box">
          <p><strong data-i18n="pub_need_auth_strong">${t("pub_need_auth_strong")}</strong> <span data-i18n="pub_need_auth_rest">${t("pub_need_auth_rest")}</span></p>
          <div class="pin-actions" style="justify-content:flex-start;margin-top:0.75rem">
            <a class="btn btn-primary" href="registro.html?next=publicar.html" data-i18n="create_account">${t("create_account")}</a>
            <a class="btn btn-secondary" href="login.html?next=publicar.html" data-i18n="nav_login">${t("nav_login")}</a>
          </div>
        </div>`;
    }
    if (form) form.hidden = true;
    return false;
  }
  const u = API.user();
  if (bar && u) {
    bar.innerHTML = `
      <div class="publish-auth-box is-ok">
        <span><span data-i18n="pub_logged_as">${t("pub_logged_as")}</span> <strong>${u.email || ""}</strong> · ${u.phone || ""}</span>
        <button type="button" class="btn btn-ghost btn-sm" id="pub-logout" data-i18n="pub_logout">${t("pub_logout")}</button>
      </div>`;
    bar.querySelector("#pub-logout")?.addEventListener("click", () => {
      API.logoutUser();
      location.reload();
    });
  }
  if (u) {
    const phone = document.getElementById("phone");
    const email = document.getElementById("manageEmail");
    if (phone && !phone.value) phone.value = u.phone || "";
    if (email) email.value = u.email || "";
  }
  return true;
}

function initPublishForm() {
  const form = document.getElementById("publish-form");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  if (!requireUserForPublish()) return;

  const photoInput =
    form.querySelector('input[type="file"][name="photos"]') ||
    form.querySelector('input[type="file"][name="photo"]');
  const preview = document.getElementById("photo-preview");
  const dropzone = document.getElementById("photo-dropzone");

  photoInput?.addEventListener("change", () => {
    renderPhotoPreviews(photoInput, preview, currentPublishMaxPhotos());
    updatePublishPreview();
  });

  if (dropzone && photoInput) {
    dropzone.addEventListener("click", () => photoInput.click());
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        photoInput.click();
      }
    });
    ["dragenter", "dragover"].forEach((ev) => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.add("is-drag");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.remove("is-drag");
      });
    });
    dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer?.files;
      if (!files?.length) return;
      const images = Array.from(files).filter((f) => /^image\//.test(f.type));
      setFileInputFiles(photoInput, images.slice(0, currentPublishMaxPhotos()));
      renderPhotoPreviews(photoInput, preview, currentPublishMaxPhotos());
      updatePublishPreview();
    });
  }

  initChipSelect("lang-chips");
  initChipSelect("service-chips");

  // plan cards + load prices from API
  const urlPlan = new URLSearchParams(location.search).get("plan");
  document.getElementById("plan-cards")?.querySelectorAll(".plan-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#plan-cards .plan-card").forEach((c) => c.classList.remove("is-selected"));
      card.classList.add("is-selected");
      const planInput = document.getElementById("plan");
      if (planInput) planInput.value = card.dataset.plan || "free";
      updatePublishPreview();
    });
  });
  if (urlPlan && ["free", "basic", "day", "vip", "top"].includes(urlPlan)) {
    const map = urlPlan === "day" || urlPlan === "free" ? "basic" : urlPlan;
    const card = document.querySelector(`#plan-cards .plan-card[data-plan="${map}"]`);
    if (card) card.click();
  }
  const planLimits = { free: 3, basic: 4, day: 4, vip: 6, top: 8 };
  function updatePhotoLimitHint() {
    const plan = document.getElementById("plan")?.value || "free";
    const max = planLimits[plan] || 3;
    const hint = document.getElementById("photo-count-hint");
    const n = document.querySelector('#publish-form input[name="photos"]')?.files?.length || 0;
    if (hint && !document.getElementById("photo-preview")?.querySelector("img")) {
      /* keep renderPhotoPreviews text when files selected */
    }
    const dropHint = document.querySelector(".dropzone-inner span");
    if (dropHint && dropHint.textContent.includes("máx")) {
      dropHint.textContent = `o toca para elegir · JPG/PNG/WEBP · máx. ${max} (plan ${plan.toUpperCase()}) · 5 MB c/u`;
    }
    const payHint = document.getElementById("plan-pay-hint");
    if (payHint) {
      if (plan === "free") {
        payHint.textContent = `Prueba 24h · hasta ${max} fotos. Luego pagas el día (5–10€) para seguir visible.`;
      } else {
        payHint.textContent = `Plan ${plan.toUpperCase()}: hasta ${max} fotos. 24h de prueba; luego gasta créditos (recarga en Precios).`;
      }
    }
  }
  API.get("/api/plans")
    .then((data) => {
      (data.plans || []).forEach((p) => {
        const el = document.querySelector(`[data-plan-price="${p.id}"]`);
        if (!el) return;
        el.textContent =
          p.price === 0 ? "0€ · 24h prueba" : `${p.price}€ ${p.periodLabel || "/ día"}`;
        planLimits[p.id] = p.maxPhotos || planLimits[p.id];
      });
      updatePhotoLimitHint();
    })
    .catch(() => updatePhotoLimitHint());
  document.getElementById("plan-cards")?.addEventListener("click", () => setTimeout(updatePhotoLimitHint, 0));

  document.getElementById("title-suggest")?.addEventListener("click", suggestPublishTitle);

  const titleIn = document.getElementById("title");
  const descIn = document.getElementById("desc");
  const titleCount = document.getElementById("title-count");
  const descCount = document.getElementById("desc-count");
  titleIn?.addEventListener("input", () => {
    if (titleCount) titleCount.textContent = `${titleIn.value.length}/90`;
    updatePublishPreview();
  });
  descIn?.addEventListener("input", () => {
    if (descCount) descCount.textContent = `${descIn.value.length}/600`;
    updatePublishPreview();
    updatePublishProgress();
  });

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => {
      updatePublishPreview();
      updatePublishProgress();
    });
    el.addEventListener("change", () => {
      updatePublishPreview();
      updatePublishProgress();
    });
  });

  // 24h → schedule helper
  document.getElementById("chk-24h")?.addEventListener("change", (e) => {
    const sch = document.getElementById("schedule");
    if (e.target.checked && sch && !sch.value) sch.value = "24h";
  });

  updatePublishPreview();
  updatePublishProgress();

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const errBox = document.getElementById("publish-errors");
    const errors = validatePublishForm(form);
    if (errors.length) {
      if (errBox) {
        errBox.hidden = false;
        errBox.innerHTML = `<strong>Revisa el formulario</strong><ul>${errors.map((e) => `<li>${e}</li>`).join("")}</ul>`;
        errBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      showToast(errors[0]);
      return;
    }
    if (errBox) errBox.hidden = true;

    // merge service chips + extra
    const extra = document.getElementById("services-extra")?.value?.trim() || "";
    const servicesEl = document.getElementById("services");
    if (servicesEl) {
      const base = servicesEl.value
        .split(/[,;/|]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (extra) {
        extra.split(/[,;/|]+/).forEach((s) => {
          const t = s.trim();
          if (t && !base.includes(t)) base.push(t);
        });
      }
      servicesEl.value = base.join(", ");
    }

    const btn = form.querySelector("#publish-submit") || form.querySelector('[type="submit"]');
    const prev = btn?.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = t("js_publishing");
    }
    try {
      const fd = new FormData(form);
      // strip non-server fields
      fd.delete("legal");
      // ensure unchecked booleans are explicit false
      ["independent", "incall", "outcall", "available24h"].forEach((k) => {
        if (!fd.has(k)) fd.set(k, "false");
      });
      // ensure email from account
      const u = API.user();
      if (u?.email && !fd.get("manageEmail")) fd.set("manageEmail", u.email);
      if (u?.phone && !fd.get("phone")) fd.set("phone", u.phone);
      const data = await API.post("/api/ads", fd, { formData: true, token: API.userToken() });
      invalidateCache();
      showToast(t("js_published"));

      const pin = data.managePin || "";
      const adId = data.ad?.id || "";
      if (pin) {
        try {
          localStorage.setItem(
            "eb_manage_creds",
            JSON.stringify({ phone: String(fd.get("phone") || ""), pin, adId })
          );
        } catch (_) {}
      }

      const success = document.getElementById("publish-success");
      const workspace = document.getElementById("publish-workspace");
      if (success && pin) {
        if (workspace) workspace.hidden = true;
        form.hidden = true;
        success.hidden = false;
        const box = document.getElementById("publish-pin-box");
        if (box) box.textContent = pin;
        const manage = document.getElementById("publish-manage-link");
        if (manage) manage.href = `mi-anuncio.html?id=${encodeURIComponent(adId)}`;
        const view = document.getElementById("publish-view-link");
        if (view) view.href = adId ? adPublicUrl(adId) : "anuncios.html";
        document.getElementById("publish-copy-pin")?.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(pin);
            showToast(t("js_pin_copied"));
          } catch {
            prompt("PIN:", pin);
          }
        });
        // créditos CTA (modelo actual)
        const payCta = document.getElementById("publish-pay-cta");
        const payLink = document.getElementById("publish-checkout-link");
        const payText = document.getElementById("publish-pay-text");
        if (payCta) {
          payCta.hidden = false;
          if (payLink) {
            payLink.href = data.creditsHint?.buyUrl || "precios.html#creditos";
            payLink.textContent = t("pub_topup");
          }
          if (payText) {
            payText.textContent = t("pub_next_credits_p");
          }
        }
        applyI18n(success);
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        location.href = `anuncio.html?id=${encodeURIComponent(adId)}`;
      }
    } catch (err) {
      showToast(err.message || t("js_error"));
      if (errBox) {
        errBox.hidden = false;
        errBox.innerHTML = `<strong>${t("js_publish_fail")}</strong><ul><li>${err.message || t("js_error")}</li></ul>`;
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = prev || t("pub_submit");
      }
    }
  });
}

const MANAGE_KEY = "eb_manage_creds";

function getManageCreds() {
  try {
    return JSON.parse(localStorage.getItem(MANAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function setManageCreds(creds) {
  if (creds) localStorage.setItem(MANAGE_KEY, JSON.stringify(creds));
  else localStorage.removeItem(MANAGE_KEY);
}

function formatBumpDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const now = Date.now();
    const diff = now - d.getTime();
    if (diff < 60 * 60 * 1000) return "Ahora";
    if (diff < 24 * 60 * 60 * 1000) return "Hoy";
    if (diff < 48 * 60 * 60 * 1000) return "Ayer";
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  } catch {
    return "—";
  }
}

function initManageAd() {
  const login = document.getElementById("manage-login");
  const panel = document.getElementById("manage-panel");
  const form = document.getElementById("manage-form");
  if (!login || !panel || !form) return;
  if (login.dataset.bound) return;
  login.dataset.bound = "1";

  let currentAd = null;
  let phone = "";
  let pin = "";
  let useAccount = !!API.userToken();

  const params = new URLSearchParams(location.search);
  const saved = getManageCreds();
  if (saved?.phone && document.getElementById("m-phone")) document.getElementById("m-phone").value = saved.phone;
  if (saved?.pin && document.getElementById("m-pin")) document.getElementById("m-pin").value = saved.pin;

  // Session account: skip PIN login
  if (useAccount) {
    openPanelAccount().catch((err) => {
      showToast(err.message || "Sesión inválida");
      API.logoutUser();
    });
  }

  async function openPanelAccount() {
    const data = await API.myAds();
    const ads = data.ads || [];
    if (!ads.length) {
      login.hidden = true;
      panel.hidden = false;
      document.getElementById("manage-title").textContent = t("js_no_ads");
      document.getElementById("manage-status").textContent = t("js_no_ads_p");
      form.hidden = true;
      const up = document.getElementById("manage-upgrade");
      if (up) {
        up.innerHTML = `<a class="btn btn-primary" href="publicar.html" data-i18n="js_publish_ad">${t("js_publish_ad")}</a>
          <button type="button" class="btn btn-ghost btn-sm" id="manage-logout-acc" data-i18n="pub_logout">${t("pub_logout")}</button>`;
        up.querySelector("#manage-logout-acc")?.addEventListener("click", () => {
          API.logoutUser();
          location.href = "login.html";
        });
      }
      return;
    }
    phone = ads[0].phone || API.user()?.phone || "";
    pin = ads[0].editPin || "";
    login.hidden = true;
    panel.hidden = false;
    form.hidden = false;
    // pick preferred id
    const preferred = params.get("id");
    const ad = (preferred && ads.find((a) => a.id === preferred)) || ads[0];
    fillForm(ad);
    // list switcher if multiple — show paid visibility
    if (ads.length > 1) {
      const title = document.getElementById("manage-status");
      if (title) {
        const sel = document.createElement("select");
        sel.className = "form-group";
        sel.style.marginTop = "0.5rem";
        sel.style.width = "100%";
        const now = Date.now();
        sel.innerHTML = ads
          .map((a) => {
            const u = a.paidUntil || a.planExpiresAt;
            const live = u && new Date(u).getTime() > now && a.status === "active";
            const mark = live ? "✓" : "✗";
            return `<option value="${a.id}" ${a.id === ad.id ? "selected" : ""}>${mark} ${a.name} · ${a.zone || ""} · ${(a.plan || "free").toUpperCase()}</option>`;
          })
          .join("");
        title.after(sel);
        sel.addEventListener("change", () => {
          const next = ads.find((a) => a.id === sel.value);
          if (next) {
            phone = next.phone || phone;
            pin = next.editPin || pin;
            fillForm(next);
          }
        });
      }
    }
  }

  document.getElementById("pin-toggle")?.addEventListener("click", () => {
    const input = document.getElementById("m-pin");
    const btn = document.getElementById("pin-toggle");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    if (btn) btn.textContent = show ? "Ocultar" : "Ver";
  });

  const recForm = document.getElementById("pin-recovery-form");
  document.getElementById("show-pin-recovery")?.addEventListener("click", () => {
    login.hidden = true;
    if (recForm) recForm.hidden = false;
  });
  document.getElementById("hide-pin-recovery")?.addEventListener("click", () => {
    if (recForm) recForm.hidden = true;
    login.hidden = false;
  });
  recForm?.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const msg = document.getElementById("pin-recovery-msg");
    const btn = recForm.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Enviando…";
    }
    try {
      const data = await API.post("/api/pin-recovery", {
        phone: document.getElementById("rec-phone")?.value,
        email: document.getElementById("rec-email")?.value,
      });
      if (msg) {
        msg.hidden = false;
        msg.textContent = data.message || "Solicitud enviada";
      }
      showToast(data.sentToOwner ? "Revisa tu email" : "Solicitud registrada");
    } catch (err) {
      showToast(err.message || "Error");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Solicitar PIN";
      }
    }
  });

  function fillForm(ad) {
    currentAd = ad;
    document.getElementById("mf-phone").value = phone;
    document.getElementById("mf-pin").value = pin;
    document.getElementById("mf-title").value = ad.title || "";
    document.getElementById("mf-name").value = ad.name || "";
    document.getElementById("mf-age").value = ad.age || "";
    document.getElementById("mf-zone").value = ad.zoneSlug || "levante";
    document.getElementById("mf-price").value = ad.price || "";
    document.getElementById("mf-nationality").value = ad.nationality || "";
    document.getElementById("mf-height").value = ad.height || "";
    document.getElementById("mf-languages").value = (ad.languages || []).join(", ");
    document.getElementById("mf-schedule").value = ad.schedule || "";
    document.getElementById("mf-locationDetail").value = ad.locationDetail || "";
    document.getElementById("mf-services").value = (ad.services || []).join(", ");
    document.getElementById("mf-desc").value = ad.desc || "";
    document.getElementById("mf-online").checked = !!ad.online;
    document.getElementById("mf-incall").checked = ad.incall !== false;
    document.getElementById("mf-outcall").checked = ad.outcall !== false;
    document.getElementById("mf-24h").checked = !!ad.available24h;
    document.getElementById("mf-ind").checked = ad.independent !== false;
    document.getElementById("mf-status").value =
      ad.status === "hidden" || ad.status === "paused" ? "hidden" : "active";

    const isActive = ad.status === "active" || (!ad.status && ad.status !== "hidden");
    const statusLabel = !isActive || ad.status === "hidden" ? "Pausado" : ad.online ? "En línea" : "Activo · offline";
    document.getElementById("manage-title").textContent = `${ad.name} · ${ad.zone || "Benidorm"}`;
    document.getElementById("manage-status").textContent =
      `${ad.title || ad.name} · plan ${ad.plan || "free"} · id ${ad.id}`;
    const pill = document.getElementById("manage-status-pill");
    if (pill) {
      pill.textContent = statusLabel;
      pill.className =
        "manage-status-pill" +
        (ad.status === "hidden" ? " is-paused" : ad.online ? " is-online" : "");
    }
    const nPhotos = Array.isArray(ad.photos) && ad.photos.length ? ad.photos.length : ad.photo ? 1 : 0;
    const elV = document.getElementById("ms-views");
    const elP = document.getElementById("ms-price");
    const elPh = document.getElementById("ms-photos");
    const elB = document.getElementById("ms-bump");
    if (elV) elV.textContent = String(ad.views || 0);
    if (elP) elP.textContent = String(ad.price || "—");
    if (elPh) elPh.textContent = String(nPhotos);
    if (elB) elB.textContent = formatBumpDate(ad.lastBump || ad.updatedAt);
    const bumpBtn = document.getElementById("manage-bump");
    if (bumpBtn) {
      const day = new Date().toISOString().slice(0, 10);
      const used =
        ad.bumpsToday && ad.bumpsToday.day === day ? ad.bumpsToday.count || 0 : 0;
      const bumpLimits = { free: 1, basic: 2, day: 2, vip: 5, top: 99 };
      const max = bumpLimits[ad.plan] != null ? bumpLimits[ad.plan] : 2;
      bumpBtn.title = `Renovaciones hoy: ${used}/${max}`;
    }

    const btnOnline = document.getElementById("manage-toggle-online");
    if (btnOnline) btnOnline.textContent = ad.online ? "● En línea" : "○ Marcar en línea";
    const btnPause = document.getElementById("manage-toggle-pause");
    if (btnPause) btnPause.textContent = ad.status === "hidden" ? "Reactivar anuncio" : "Pausar anuncio";

    const untilRaw = ad.paidUntil || ad.planExpiresAt;
    const untilMs = untilRaw ? new Date(untilRaw).getTime() : 0;
    const hoursLeft = untilMs ? (untilMs - Date.now()) / 3600000 : 0;
    const isVisible = ad.status === "active" && hoursLeft > 0;
    const planLabel = document.getElementById("manage-plan-label");
    if (planLabel) {
      const exp = untilRaw
        ? ` · visible hasta ${new Date(untilRaw).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}`
        : "";
      const pending = ad.pendingPlan ? ` · pago pendiente: ${ad.pendingPlan.toUpperCase()}` : "";
      planLabel.textContent = `Plan actual: ${(ad.plan || "free").toUpperCase()}${exp}${pending}`;
    }
    const visBox = document.getElementById("manage-visibility");
    const visTitle = document.getElementById("manage-vis-title");
    const visText = document.getElementById("manage-vis-text");
    if (visBox && visTitle && visText) {
      visBox.hidden = false;
      visBox.classList.remove("is-ok", "is-warn", "is-bad");
      if (ad.status === "hidden") {
        visBox.classList.add("is-bad");
        visTitle.textContent = t("js_paused");
        visText.textContent = t("js_paused_p");
      } else if (!isVisible) {
        visBox.classList.add("is-bad");
        visTitle.textContent = t("js_off_list");
        visText.textContent = t("js_renew_soon");
      } else if (hoursLeft <= 6) {
        visBox.classList.add("is-warn");
        visTitle.textContent = `~${Math.max(1, Math.ceil(hoursLeft))}h`;
        visText.textContent = t("js_renew_soon");
      } else {
        visBox.classList.add("is-ok");
        visTitle.textContent = t("js_visible");
        visText.textContent = `${Math.floor(hoursLeft)}h · ${(ad.plan || "free").toUpperCase()}`;
      }
    }

    const view = document.getElementById("manage-view");
    if (view) view.href = adPublicUrl(ad.id);

    const photosEl = document.getElementById("manage-photos");
    const photos = Array.isArray(ad.photos) && ad.photos.length ? ad.photos : ad.photo ? [ad.photo] : [];
    const maxPh = ad.plan === "top" ? 8 : ad.plan === "vip" ? 6 : ad.plan === "basic" || ad.plan === "day" ? 4 : 3;
    const photosHint = document.getElementById("manage-photos-hint");
    if (photosHint) {
      photosHint.textContent = `${photos.length} / ${maxPh} fotos (límite plan ${(ad.plan || "free").toUpperCase()})`;
    }
    if (photosEl) {
      photosEl.innerHTML = photos.length
        ? photos
            .map(
              (p, i) =>
                `<div class="photo-preview-item">
                  <img src="${p}" alt="Foto ${i + 1}" />
                  <span>${i === 0 ? "Portada" : i + 1}</span>
                  <button type="button" class="photo-remove-btn" data-remove-photo="${p}" title="Quitar">×</button>
                  <div class="photo-order-btns">
                    <button type="button" class="photo-order-btn" data-photo-up="${p}" title="Subir">↑</button>
                    <button type="button" class="photo-order-btn" data-photo-down="${p}" title="Bajar">↓</button>
                  </div>
                </div>`
            )
            .join("")
        : `<p class="form-hint">Sin fotos aún — súbelas abajo</p>`;
      photosEl.querySelectorAll("[data-remove-photo]").forEach((btn) => {
        btn.addEventListener("click", async (ev) => {
          ev.preventDefault();
          if (!currentAd) return;
          if (!confirm("¿Quitar esta foto?")) return;
          try {
            const data = await API.post(`/api/my-ads/${encodeURIComponent(currentAd.id)}/remove-photo`, {
              phone,
              pin,
              photo: btn.dataset.removePhoto,
            });
            fillForm(data.ad);
            invalidateCache();
            showToast("Foto eliminada");
          } catch (err) {
            showToast(err.message || "Error");
          }
        });
      });
      const reorder = async (src, dir) => {
        if (!currentAd) return;
        let photos = Array.isArray(currentAd.photos) ? [...currentAd.photos] : currentAd.photo ? [currentAd.photo] : [];
        const i = photos.indexOf(src);
        if (i < 0) return;
        const j = i + dir;
        if (j < 0 || j >= photos.length) return;
        [photos[i], photos[j]] = [photos[j], photos[i]];
        try {
          const data = await API.post(`/api/my-ads/${encodeURIComponent(currentAd.id)}/reorder-photos`, {
            phone,
            pin,
            photos,
          });
          fillForm(data.ad);
          invalidateCache();
          showToast("Orden actualizado");
        } catch (err) {
          showToast(err.message || "Error");
        }
      };
      photosEl.querySelectorAll("[data-photo-up]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          reorder(btn.dataset.photoUp, -1);
        });
      });
      photosEl.querySelectorAll("[data-photo-down]").forEach((btn) => {
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          reorder(btn.dataset.photoDown, 1);
        });
      });
    }
  }

  async function openPanel(p, pinVal, preferredId, remember = true) {
    phone = String(p || "").replace(/\D/g, "");
    pin = String(pinVal || "").trim();
    const data = await API.myAds(phone, pin);
    let ads = data.ads || [];
    if (!ads.length) throw new Error("No hay anuncios con ese teléfono y PIN");
    let ad = preferredId ? ads.find((a) => a.id === preferredId) : null;
    if (!ad) ad = ads[0];
    if (remember) setManageCreds({ phone, pin, adId: ad.id });
    else setManageCreds(null);
    login.hidden = true;
    panel.hidden = false;
    fillForm(ad);
  }

  async function quickPatch(patch) {
    if (!currentAd) return;
    const fd = new FormData();
    fd.set("phone", phone);
    fd.set("pin", pin);
    Object.entries(patch).forEach(([k, v]) => fd.set(k, String(v)));
    const data = await API.updateMyAd(currentAd.id, fd);
    fillForm(data.ad);
    invalidateCache();
  }

  login.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const p = document.getElementById("m-phone").value;
    const pinVal = document.getElementById("m-pin").value;
    const remember = document.getElementById("m-remember")?.checked !== false;
    const btn = login.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = t("js_entering");
    }
    try {
      await openPanel(p, pinVal, params.get("id"), remember);
      showToast(t("js_access_ok"));
    } catch (err) {
      showToast(err.message || t("js_error"));
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = t("my_access");
      }
    }
  });

  const photosInput = document.getElementById("mf-photos");
  photosInput?.addEventListener("change", () =>
    renderPhotoPreviews(photosInput, document.getElementById("mf-photos-preview"), 6)
  );

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!currentAd) return;
    const errBox = document.getElementById("manage-errors");
    const btn = form.querySelector('[type="submit"]');
    const prev = btn?.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = t("js_saving");
    }
    try {
      const fd = new FormData(form);
      ["online", "incall", "outcall", "available24h", "independent"].forEach((k) => {
        if (!fd.has(k)) fd.set(k, "false");
      });
      const data = await API.updateMyAd(currentAd.id, fd);
      fillForm(data.ad);
      invalidateCache();
      if (errBox) errBox.hidden = true;
      showToast(t("my_save") + " ✓");
    } catch (err) {
      showToast(err.message || t("js_error"));
      if (errBox) {
        errBox.hidden = false;
        errBox.innerHTML = `<strong>${t("js_error")}</strong><ul><li>${err.message || t("js_error")}</li></ul>`;
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = prev;
      }
    }
  });

  document.getElementById("manage-bump")?.addEventListener("click", async () => {
    if (!currentAd) return;
    const btn = document.getElementById("manage-bump");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Renovando…";
    }
    try {
      const data = await API.bumpMyAd(currentAd.id, phone, pin);
      fillForm(data.ad);
      invalidateCache();
      const left = data.quota ? data.quota.remaining : null;
      showToast(
        left != null
          ? `✓ Renovado · te quedan ${left} hoy (plan ${(data.ad.plan || "free").toUpperCase()})`
          : "✓ Renovado — sube en el listado"
      );
    } catch (err) {
      showToast(err.message || "Error");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "↑ Renovar / subir listado";
      }
    }
  });

  document.getElementById("manage-toggle-online")?.addEventListener("click", async () => {
    if (!currentAd) return;
    const nextOnline = !currentAd.online;
    try {
      await quickPatch({ online: nextOnline });
      showToast(nextOnline ? "● En línea" : "Marcado offline");
    } catch (err) {
      showToast(err.message || "Error");
    }
  });

  document.getElementById("manage-toggle-pause")?.addEventListener("click", async () => {
    if (!currentAd) return;
    try {
      const next = currentAd.status === "hidden" ? "active" : "hidden";
      await quickPatch({ status: next, online: next === "active" ? true : false });
      showToast(next === "hidden" ? "Anuncio pausado" : "Anuncio reactivado");
    } catch (err) {
      showToast(err.message || "Error");
    }
  });

  document.getElementById("manage-delete")?.addEventListener("click", async () => {
    if (!currentAd) return;
    if (!confirm("¿Eliminar el anuncio de forma permanente? No se puede deshacer.")) return;
    const ok = prompt('Escribe ELIMINAR para confirmar:');
    if (ok !== "ELIMINAR") {
      showToast("Cancelado");
      return;
    }
    try {
      await API.deleteMyAd(currentAd.id, phone, pin);
      setManageCreds(null);
      invalidateCache();
      showToast("Anuncio eliminado");
      setTimeout(() => {
        location.href = "publicar.html";
      }, 800);
    } catch (err) {
      showToast(err.message || "Error");
    }
  });

  document.getElementById("manage-logout")?.addEventListener("click", () => {
    setManageCreds(null);
    if (API.userToken()) {
      API.logoutUser();
      location.href = "login.html";
      return;
    }
    location.href = "mi-anuncio.html";
  });

  document.querySelectorAll("[data-upgrade]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentAd) return;
      const plan = btn.dataset.upgrade;
      const days = Math.min(30, Math.max(1, Number(btn.dataset.days) || 1));
      btn.disabled = true;
      try {
        // Prefer gastar créditos (modelo principal)
        const data = await API.post("/api/credits/spend", {
          adId: currentAd.id,
          plan,
          days,
          phone,
          pin,
        });
        showToast(data.message || `−${data.spent} créditos`);
        if (data.ad) fillForm(data.ad);
        if (data.credits != null) {
          const u = API.user() || {};
          API.setUser({ ...u, credits: data.credits });
          const bal = document.getElementById("manage-credits-bal");
          if (bal) bal.textContent = `${data.credits} créditos`;
        }
      } catch (err) {
        showToast(err.message || "Error al gastar créditos");
        if (err.message && /insuficiente|créditos|cuenta|saldo/i.test(err.message)) {
          if (confirm(err.message + "\n\n¿Ir a recargar créditos?")) {
            location.href = "precios.html#creditos";
          }
        }
      } finally {
        btn.disabled = false;
      }
    });
  });

  // load plan prices as créditos
  API.get("/api/plans")
    .then((data) => {
      const byId = Object.fromEntries((data.plans || []).map((p) => [p.id, p]));
      document.querySelectorAll("[data-upgrade]").forEach((b) => {
        const p = byId[b.dataset.upgrade];
        if (!p || p.id === "free") return;
        const days = Math.max(1, Number(b.dataset.days) || 1);
        const cost = p.creditCost || p.price;
        const total = Math.round(cost * days * 100) / 100;
        if (days === 1) b.textContent = `${p.name} · ${cost} créd.`;
        else b.textContent = `${p.name} · ${days}d · ${total} créd.`;
      });
    })
    .catch(() => {});

  // saldo + historial créditos
  if (API.userToken()) {
    API.get("/api/credits/me")
      .then((me) => {
        API.setUser(me.user);
        let el = document.getElementById("manage-credits-bal");
        if (!el) {
          const box = document.getElementById("manage-upgrade");
          if (box) {
            el = document.createElement("p");
            el.id = "manage-credits-bal";
            el.className = "form-hint";
            el.style.margin = "0 0 0.5rem";
            box.insertBefore(el, box.firstChild.nextSibling);
          }
        }
        if (el) {
          el.innerHTML = `Saldo: <strong style="color:var(--gold)">${me.credits} créditos</strong> · <a href="precios.html#creditos" style="color:var(--accent)">Recargar</a>`;
        }
        // historial
        let hist = document.getElementById("manage-credits-ledger");
        if (!hist) {
          const box = document.getElementById("manage-upgrade");
          if (box) {
            hist = document.createElement("div");
            hist.id = "manage-credits-ledger";
            hist.className = "form-hint";
            hist.style.marginTop = "0.75rem";
            box.appendChild(hist);
          }
        }
        if (hist) {
          const rows = (me.ledger || []).slice(0, 8);
          if (!rows.length) {
            hist.innerHTML = "<small>Sin movimientos de créditos aún.</small>";
          } else {
            hist.innerHTML =
              "<strong>Últimos movimientos</strong><ul style='margin:0.35rem 0 0;padding-left:1.1rem'>" +
              rows
                .map((e) => {
                  const d = Number(e.amount) || 0;
                  const sign = d > 0 ? "+" : "";
                  const when = (e.createdAt || "").slice(0, 16).replace("T", " ");
                  return `<li><small>${when} · ${e.type || "—"} · <b>${sign}${d}</b> → ${e.balanceAfter ?? "—"}</small></li>`;
                })
                .join("") +
              "</ul>";
          }
        }
      })
      .catch(() => {});
  }

  if (!useAccount && saved?.phone && saved?.pin) {
    openPanel(saved.phone, saved.pin, params.get("id") || saved.adId, true).catch(() => {});
  }
}

async function renderZones() {
  const el = document.getElementById("zones-grid");
  const map = document.getElementById("zones-map");
  const base = basePath();
  let ads = [];
  try {
    ads = await getAllEscorts();
  } catch (_) {}

  if (map) {
    map.innerHTML = ZONES.map((z) => {
      const n = zoneCount(z.slug, ads);
      return `<a class="zone-map-item" href="${base}anuncios.html?zone=${z.slug}">
        <strong>${zoneLabel(z.slug, z.name)}</strong>
        <span>${n} anuncios · filtrar →</span>
      </a>`;
    }).join("");
  }

  if (!el) return;
  el.innerHTML = ZONES.map((z) => {
    const n = zoneCount(z.slug, ads);
    return `
    <a class="zone-card" href="${base}zonas/${z.slug}.html">
      <h3>${zoneLabel(z.slug, z.name)}</h3>
      <p>${I18N_STATE.lang === "es" ? z.blurb : z.blurbEn}</p>
      <div class="zone-meta">${n} · →</div>
    </a>`;
  }).join("");
}

async function initLiveStats() {
  try {
    const s = await API.get("/api/stats");
    const elOnline = document.querySelector("[data-stat=online]");
    const elTotal = document.querySelector("[data-stat=total]");
    const elZones = document.querySelector("[data-stat=zones]");
    const elLangs = document.querySelector("[data-stat=langs]");
    if (elOnline) elOnline.textContent = String(s.online);
    if (elTotal) elTotal.textContent = String(s.total);
    if (elZones) elZones.textContent = String(s.zones);
    if (elLangs) elLangs.textContent = String(I18N.langs.length);
  } catch (_) {
    const elLangs = document.querySelector("[data-stat=langs]");
    if (elLangs) elLangs.textContent = String(I18N.langs.length);
  }
}

function initMobileBar() {
  if (document.querySelector(".mobile-cta-bar")) document.body.classList.add("has-mobile-bar");
}

function adminShowTab(name) {
  const ads = document.getElementById("admin-ads-section");
  const contacts = document.getElementById("admin-contacts-section");
  const reports = document.getElementById("admin-reports-section");
  const payments = document.getElementById("admin-payments-section");
  const users = document.getElementById("admin-users-section");
  if (ads) ads.hidden = name !== "ads";
  if (contacts) contacts.hidden = name !== "contacts";
  if (reports) reports.hidden = name !== "reports";
  if (payments) payments.hidden = name !== "payments";
  if (users) users.hidden = name !== "users";
}

function initAdmin() {
  const root = document.getElementById("admin-root");
  if (!root) return;

  const loginBox = document.getElementById("admin-login");
  const panel = document.getElementById("admin-panel");

  async function showPanel() {
    if (loginBox) loginBox.hidden = true;
    if (panel) panel.hidden = false;
    await renderAdminTable();
    await renderAdminContacts();
    await renderAdminReports();
  }

  if (API.token()) {
    API.get("/api/admin/me")
      .then(() => showPanel())
      .catch(() => API.setToken(""));
  }

  document.getElementById("admin-login-form")?.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const user = document.getElementById("admin-user")?.value || "admin";
    const password = document.getElementById("admin-pass")?.value || "";
    try {
      const data = await API.post("/api/admin/login", { user, password });
      API.setToken(data.token);
      showToast("Admin OK");
      await showPanel();
    } catch (err) {
      showToast(err.message);
    }
  });

  document.getElementById("admin-logout")?.addEventListener("click", () => {
    API.setToken("");
    location.reload();
  });

  document.getElementById("admin-export")?.addEventListener("click", async () => {
    try {
      const data = await API.get("/api/admin/ads");
      const blob = new Blob([JSON.stringify(data.ads, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `escortbenidorm-${Date.now()}.json`;
      a.click();
    } catch (err) {
      showToast(err.message);
    }
  });

  document.getElementById("admin-expire")?.addEventListener("click", async () => {
    if (
      !confirm(
        "¿Caducar anuncios de usuario sin renovar en 30 días? (limpieza de abandonados; la visibilidad diaria se controla con paidUntil)"
      )
    ) {
      return;
    }
    try {
      const data = await API.post("/api/admin/expire", { days: 30 }, { token: API.token() });
      showToast(`Caducados: ${data.expired || 0}`);
      invalidateCache();
      await renderAdminTable();
    } catch (err) {
      showToast(err.message);
    }
  });

  document.getElementById("admin-search")?.addEventListener("input", () => renderAdminTable());

  document.getElementById("admin-tab-ads")?.addEventListener("click", () => {
    adminShowTab("ads");
    renderAdminTable();
  });
  document.getElementById("admin-tab-contacts")?.addEventListener("click", () => {
    adminShowTab("contacts");
    renderAdminContacts();
  });
  document.getElementById("admin-tab-reports")?.addEventListener("click", () => {
    adminShowTab("reports");
    renderAdminReports();
  });
  document.getElementById("admin-tab-payments")?.addEventListener("click", () => {
    adminShowTab("payments");
    renderAdminPayments();
  });
  document.getElementById("admin-tab-users")?.addEventListener("click", () => {
    adminShowTab("users");
    renderAdminUsers();
  });

  document.getElementById("admin-cred-grant")?.addEventListener("click", async () => {
    const email = document.getElementById("admin-cred-email")?.value?.trim() || "";
    const amount = Number(document.getElementById("admin-cred-amount")?.value);
    const note = document.getElementById("admin-cred-note")?.value?.trim() || "admin";
    if (!email || !Number.isFinite(amount) || amount === 0) {
      showToast("Email y cantidad obligatorios");
      return;
    }
    try {
      const data = await API.post(
        "/api/admin/credits/grant",
        { email, amount, note },
        { token: API.token() }
      );
      showToast(`Saldo actualizado: ${data.credits} créd.`);
      await renderAdminUsers();
    } catch (err) {
      showToast(err.message || "Error");
    }
  });

  document.getElementById("admin-purge-payments")?.addEventListener("click", async () => {
    try {
      const data = await API.post("/api/admin/payments/purge-orphans", {}, { token: API.token() });
      showToast(`Huérfanos eliminados: ${data.removed || 0}`);
      await renderAdminPayments();
      await renderAdminTable();
    } catch (err) {
      showToast(err.message);
    }
  });
}

async function renderAdminTable() {
  const tbody = document.getElementById("admin-tbody");
  if (!tbody) return;
  const token = API.token();

  try {
    const [data, stats] = await Promise.all([
      fetch("/api/admin/ads", { headers: { Authorization: `Bearer ${token}` } }).then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Error");
        return j;
      }),
      API.get("/api/stats").catch(() => ({ contacts: 0, reports: 0, expired: 0 })),
    ]);

    let ads = data.ads || [];
    const q = (document.getElementById("admin-search")?.value || "").toLowerCase().trim();
    if (q) {
      ads = ads.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(q) ||
          (a.id || "").toLowerCase().includes(q) ||
          (a.zone || "").toLowerCase().includes(q) ||
          (a.phone || "").includes(q) ||
          (a.title || "").toLowerCase().includes(q)
      );
    }

    const all = data.ads || [];
    const active = all.filter((a) => a.status === "active").length;
    const user = all.filter((a) => a.source === "user").length;
    const now = Date.now();
    const fmtUntil = (a) => {
      const u = a.paidUntil || a.planExpiresAt;
      if (!u) return "sin paidUntil";
      const t = new Date(u).getTime();
      const live = t > now;
      const label = new Date(u).toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      return live ? `✓ hasta ${label}` : `✗ caducó ${label}`;
    };

    const statsEl = document.getElementById("admin-stats");
    if (statsEl) {
      statsEl.style.gridTemplateColumns = "repeat(auto-fit, minmax(90px, 1fr))";
      statsEl.style.maxWidth = "720px";
      statsEl.innerHTML = `
      <div class="stat"><strong>${stats.visibleNow ?? active}</strong><span>Visibles hoy</span></div>
      <div class="stat"><strong>${all.length}</strong><span>Total DB</span></div>
      <div class="stat"><strong>${user}</strong><span>De usuarios</span></div>
      <div class="stat"><strong>${stats.paidToday || 0}</strong><span>Pagos hoy</span></div>
      <div class="stat"><strong>${stats.revenueToday || 0}€</strong><span>€ hoy</span></div>
      <div class="stat"><strong>${stats.paymentsPending || 0}</strong><span>Pagos pend.</span></div>
      <div class="stat"><strong>${stats.reports || 0}</strong><span>Reportes</span></div>
      <div class="stat"><strong>${stats.contacts || 0}</strong><span>Mensajes</span></div>
    `;
    }

    if (!ads.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="color:var(--text-muted)">${q ? "Sin coincidencias" : "Sin anuncios"}</td></tr>`;
      return;
    }

    tbody.innerHTML = ads
      .map((a) => {
        const until = a.paidUntil || a.planExpiresAt;
        const live = until ? new Date(until).getTime() > now : false;
        const visBadge = live
          ? `<span style="color:#6d6;font-weight:600">VISIBLE</span>`
          : `<span style="color:var(--accent);font-weight:600">OCULTO</span>`;
        return `<tr>
        <td>
          <strong>${a.name}</strong>
          ${a.photo ? `<br><img src="${a.photo}" alt="" style="width:48px;height:64px;object-fit:cover;border-radius:6px;margin-top:4px" />` : ""}
          <br><small style="color:var(--text-dim)">${a.id}</small>
          ${a.editPin ? `<br><small style="color:var(--gold)">PIN: ${a.editPin}</small>` : ""}
          <br><small style="color:var(--text-dim)">${a.phone || ""} · ${(a.photos || []).length || (a.photo ? 1 : 0)} fotos</small>
        </td>
        <td>${a.zone}<br><small>${(a.languages || []).join(", ")}</small></td>
        <td>${a.price}€<br><small>${(a.plan || "free").toUpperCase()}</small></td>
        <td>${(a.tags || []).join(", ") || "—"}</td>
        <td>${visBadge}<br>${a.status}${a.online ? " · on" : " · off"}
          <br><small>${fmtUntil(a)}</small>
          ${a.pendingPlan ? `<br><small style="color:var(--gold)">pend: ${a.pendingPlan}</small>` : ""}
          <br><small>${a.source || ""} · ${a.views || 0} views</small>
        </td>
        <td class="admin-actions">
          <a class="btn btn-sm btn-ghost" href="a/${encodeURIComponent(a.id)}" target="_blank">Ver</a>
          <button type="button" class="btn btn-sm btn-primary" data-act="day" data-id="${a.id}" title="Sumar 24h de visibilidad">+1 día</button>
          <button type="button" class="btn btn-sm btn-secondary" data-act="bump" data-id="${a.id}">Subir</button>
          <button type="button" class="btn btn-sm btn-secondary" data-act="vip" data-id="${a.id}">VIP</button>
          <button type="button" class="btn btn-sm btn-secondary" data-act="online" data-id="${a.id}">Online</button>
          <button type="button" class="btn btn-sm btn-ghost" data-act="cut" data-id="${a.id}" title="Quitar visibilidad del día">Cortar día</button>
          <button type="button" class="btn btn-sm btn-ghost" data-act="hide" data-id="${a.id}">${a.status === "active" ? "Ocultar" : "Activar"}</button>
          <button type="button" class="btn btn-sm btn-ghost" data-act="del" data-id="${a.id}">Borrar</button>
        </td>
      </tr>`;
      })
      .join("");

    tbody.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const act = btn.dataset.act;
        try {
          if (act === "del") {
            if (!confirm("¿Borrar?")) return;
            await API.del(`/api/ads/${encodeURIComponent(id)}`, token);
          } else if (act === "bump") {
            await API.post(`/api/ads/${encodeURIComponent(id)}/bump`, {}, { token });
            showToast("Anuncio renovado / subido");
          } else if (act === "vip") {
            await API.patch(`/api/ads/${encodeURIComponent(id)}`, { toggleVip: true }, { token });
          } else if (act === "online") {
            await API.patch(`/api/ads/${encodeURIComponent(id)}`, { toggleOnline: true }, { token });
          } else if (act === "day") {
            await API.patch(`/api/ads/${encodeURIComponent(id)}`, { grantDays: 1 }, { token });
            showToast("+1 día de visibilidad");
          } else if (act === "cut") {
            if (!confirm("¿Cortar visibilidad ahora (sale del listado público)?")) return;
            await API.patch(`/api/ads/${encodeURIComponent(id)}`, { cutVisibility: 1 }, { token });
            showToast("Visibilidad cortada");
          } else if (act === "hide") {
            const row = (data.ads || []).find((x) => x.id === id);
            await API.patch(
              `/api/ads/${encodeURIComponent(id)}`,
              { status: row?.status === "active" ? "hidden" : "active" },
              { token }
            );
          }
          invalidateCache();
          await renderAdminTable();
        } catch (err) {
          showToast(err.message);
        }
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:var(--accent)">${err.message}</td></tr>`;
  }
}

async function renderAdminContacts() {
  const tbody = document.getElementById("admin-contacts-tbody");
  if (!tbody) return;
  const token = API.token();
  try {
    const data = await fetch("/api/admin/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (r) => {
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      return j;
    });
    const contacts = data.contacts || [];
    if (!contacts.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="color:var(--text-muted)">Sin mensajes todavía.</td></tr>`;
      return;
    }
    tbody.innerHTML = contacts
      .map(
        (c) => `<tr>
        <td><small>${(c.createdAt || "").slice(0, 16).replace("T", " ")}</small></td>
        <td><a href="mailto:${c.email}" style="color:var(--accent)">${c.email}</a></td>
        <td>${c.subject || "—"}</td>
        <td style="max-width:280px;white-space:pre-wrap;font-size:0.82rem;color:var(--text-muted)">${(c.message || "").slice(0, 400)}</td>
        <td><button type="button" class="btn btn-sm btn-ghost" data-del-contact="${c.id}">Borrar</button></td>
      </tr>`
      )
      .join("");
    tbody.querySelectorAll("[data-del-contact]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Borrar mensaje?")) return;
        try {
          await API.del(`/api/admin/contacts/${encodeURIComponent(btn.dataset.delContact)}`, token);
          showToast("Mensaje borrado");
          await renderAdminContacts();
          await renderAdminTable();
        } catch (err) {
          showToast(err.message);
        }
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:var(--accent)">${err.message}</td></tr>`;
  }
}

async function renderAdminReports() {
  const tbody = document.getElementById("admin-reports-tbody");
  if (!tbody) return;
  const token = API.token();
  try {
    const data = await fetch("/api/admin/reports", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (r) => {
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      return j;
    });
    const reports = data.reports || [];
    if (!reports.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="color:var(--text-muted)">Sin reportes.</td></tr>`;
      return;
    }
    tbody.innerHTML = reports
      .map(
        (r) => `<tr>
        <td><small>${(r.createdAt || "").slice(0, 16).replace("T", " ")}</small></td>
        <td><a href="anuncio.html?id=${encodeURIComponent(r.adId || "")}" style="color:var(--accent)">${r.adId || "—"}</a></td>
        <td>${r.reason || "—"}<br><small>${r.status || "open"}</small></td>
        <td style="max-width:280px;font-size:0.82rem;color:var(--text-muted)">${(r.detail || "—").slice(0, 300)}</td>
        <td class="admin-actions">
          ${
            (r.status || "open") === "open"
              ? `<button type="button" class="btn btn-sm btn-secondary" data-resolve-report="${r.id}">Resolver</button>`
              : ""
          }
          <button type="button" class="btn btn-sm btn-ghost" data-del-report="${r.id}">Borrar</button>
        </td>
      </tr>`
      )
      .join("");
    tbody.querySelectorAll("[data-resolve-report]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await API.patch(
            `/api/admin/reports/${encodeURIComponent(btn.dataset.resolveReport)}`,
            { status: "resolved" },
            { token }
          );
          showToast("Reporte resuelto");
          await renderAdminReports();
        } catch (err) {
          showToast(err.message);
        }
      });
    });
    tbody.querySelectorAll("[data-del-report]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Borrar reporte?")) return;
        try {
          await API.del(`/api/admin/reports/${encodeURIComponent(btn.dataset.delReport)}`, token);
          showToast("Reporte borrado");
          await renderAdminReports();
        } catch (err) {
          showToast(err.message);
        }
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:var(--accent)">${err.message}</td></tr>`;
  }
}

async function renderAdminPayments() {
  const tbody = document.getElementById("admin-payments-tbody");
  if (!tbody) return;
  const token = API.token();
  try {
    const data = await fetch("/api/admin/payments", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (r) => {
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      return j;
    });
    const payments = data.payments || [];
    if (!payments.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="color:var(--text-muted)">Sin pedidos de pago.</td></tr>`;
      return;
    }
    tbody.innerHTML = payments
      .map(
        (p) => `<tr>
        <td><code>${p.id}</code><br><small>${(p.createdAt || "").slice(0, 16).replace("T", " ")}</small></td>
        <td>${
          p.kind === "credits" || p.type === "credits"
            ? `CRÉDITOS · ${p.credits || "?"}<br><small>${p.packId || ""}</small>`
            : `${(p.plan || "").toUpperCase()}${p.days ? `<br><small>${p.days}d</small>` : "<br><small>1d</small>"}`
        }</td>
        <td><strong>${p.amount}€</strong> ${p.currency || "EUR"}</td>
        <td>${p.status}${p.method ? " · " + p.method : ""}${
          p.paidAt ? `<br><small>${String(p.paidAt).slice(0, 16).replace("T", " ")}</small>` : ""
        }</td>
        <td>${
          p.kind === "credits" || p.type === "credits"
            ? `<small>user ${p.userId || "—"}</small>`
            : `<a href="a/${encodeURIComponent(p.adId || "")}" style="color:var(--accent)">${p.adName || p.adId || "—"}</a>`
        }</td>
        <td class="admin-actions">
          ${
            p.status !== "paid"
              ? `<button type="button" class="btn btn-sm btn-primary" data-activate-pay="${p.id}">${
                  p.kind === "credits" || p.type === "credits" ? "Activar créditos" : "Activar plan"
                }</button>`
              : `<span style="color:var(--text-dim);font-size:0.8rem">Pagado ✓</span>`
          }
        </td>
      </tr>`
      )
      .join("");
    tbody.querySelectorAll("[data-activate-pay]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Confirmar pago y activar (créditos o plan)?")) return;
        try {
          await API.post(
            `/api/admin/payments/${encodeURIComponent(btn.dataset.activatePay)}/activate`,
            {},
            { token }
          );
          showToast("Pago activado");
          await renderAdminPayments();
          await renderAdminTable();
        } catch (err) {
          showToast(err.message);
        }
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:var(--accent)">${err.message}</td></tr>`;
  }
}

async function renderAdminUsers() {
  const tbody = document.getElementById("admin-users-tbody");
  const ledgerBody = document.getElementById("admin-ledger-tbody");
  if (!tbody) return;
  const token = API.token();
  try {
    const data = await API.get("/api/admin/users");
    const users = data.users || [];
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="color:var(--text-muted)">Sin usuarios</td></tr>`;
    } else {
      tbody.innerHTML = users
        .map(
          (u) => `<tr>
          <td><strong>${u.email || "—"}</strong><br><small>${u.name || ""}</small><br><code style="font-size:0.7rem">${u.id}</code></td>
          <td>${u.phone || "—"}</td>
          <td><strong style="color:var(--gold)">${u.credits ?? 0}</strong></td>
          <td><small>${(u.createdAt || "").slice(0, 10)}</small></td>
        </tr>`
        )
        .join("");
    }
    if (ledgerBody) {
      const ledger = data.ledger || [];
      if (!ledger.length) {
        ledgerBody.innerHTML = `<tr><td colspan="6" style="color:var(--text-muted)">Sin movimientos</td></tr>`;
      } else {
        ledgerBody.innerHTML = ledger
          .map((e) => {
            const meta = e.meta ? JSON.stringify(e.meta).slice(0, 80) : "";
            const delta = Number(e.amount) || 0;
            const color = delta >= 0 ? "#6d6" : "var(--accent)";
            return `<tr>
              <td><small>${(e.createdAt || "").slice(0, 16).replace("T", " ")}</small></td>
              <td><code style="font-size:0.7rem">${e.userId || "—"}</code></td>
              <td>${e.type || "—"}</td>
              <td style="color:${color};font-weight:600">${delta > 0 ? "+" : ""}${delta}</td>
              <td>${e.balanceAfter ?? "—"}</td>
              <td><small>${meta}</small></td>
            </tr>`;
          })
          .join("");
      }
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:var(--accent)">${err.message}</td></tr>`;
  }
}

async function initOperatorLegal() {
  const nodes = document.querySelectorAll("[data-operator]");
  if (!nodes.length) return;
  try {
    const cfg = await API.get("/api/config");
    const op = cfg.operator || {};
    const map = {
      name: op.name || "—",
      nif: op.nif || "—",
      email: op.email || "—",
      address: op.address || "—",
      site: cfg.siteUrl || location.origin,
      sitename: cfg.siteName || "EscortBenidorm",
    };
    nodes.forEach((el) => {
      const key = el.getAttribute("data-operator");
      if (map[key] != null) {
        if (key === "email" && map.email.includes("@") && !map.email.startsWith("[")) {
          el.innerHTML = `<a href="mailto:${map.email}">${map.email}</a>`;
        } else {
          el.textContent = map[key];
        }
      }
    });
    const banner = document.getElementById("legal-incomplete");
    if (banner) {
      const incomplete = [op.name, op.nif, op.email].some(
        (v) => !v || String(v).includes("[RELLENAR") || String(v).includes("RELLENAR")
      );
      banner.hidden = !incomplete;
    }
  } catch (_) {}
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const btn = form.querySelector('[type="submit"]');
    const prev = btn?.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Enviando…";
    }
    try {
      await API.post("/api/contact", {
        email: fd.get("email"),
        subject: fd.get("asunto") || fd.get("subject"),
        message: fd.get("msg") || fd.get("message"),
      });
      showToast("Mensaje enviado");
      form.reset();
      const success = document.getElementById("contact-success");
      if (success) {
        form.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      showToast(err.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = prev;
      }
    }
  });
}

function onLangChange() {
  // Full re-paint so no leftover strings from the previous language
  applyI18n();
  fillZoneSelects();
  fillLangFilterSelect();
  const firstOpt = document.querySelector("#filter-lang option[value='']");
  if (firstOpt) firstOpt.textContent = t("all_langs");
  renderZones();
  initLiveStats();
  if (document.getElementById("listings")) renderListings({ force: false });
  if (document.getElementById("profile-root")) initProfile();
  updateTicker();
  // Dynamic injectors (publish auth bar, etc.) — rebuild in the new language
  if (document.getElementById("publish-auth-bar") || document.getElementById("publish-form")) {
    requireUserForPublish();
  }
  // Re-apply data-i18n after injectors wrote new DOM
  applyI18n();
  injectStaticIcons();
  document.documentElement.lang = I18N_STATE.lang;
  document.documentElement.setAttribute("data-lang", I18N_STATE.lang);
}

function updateTicker() {
  const track = document.querySelector(".top-ticker-track");
  if (!track) return;
  const bits = [
    `<span><i class="dot-live"></i> ${t("js_ticker_1")}</span>`,
    `<span>${t("js_ticker_2")}</span>`,
    `<span>${t("js_ticker_3")}</span>`,
    `<span>Levante · Poniente · Rincón de Loix</span>`,
    `<span>${t("js_ticker_4")}</span>`,
    `<span>${t("rank_pill")}</span>`,
  ];
  track.innerHTML = bits.concat(bits).join("");
}

function injectStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (typeof ICON !== "undefined" && ICON[name]) {
      el.innerHTML = ICON[name]("ico ico-lg");
    }
  });
}

function initFavClear() {
  document.getElementById("fav-clear")?.addEventListener("click", () => {
    if (!getFavs().length) return;
    if (!confirm("¿Vaciar todos los favoritos?")) return;
    localStorage.setItem(FAV_KEY, "[]");
    updateFavBadges();
    renderListings({ resetPage: true });
    showToast("Favoritos vacíos");
  });
}

async function renderRecent() {
  const el = document.getElementById("recent-listings");
  if (!el) return;
  const ids = getRecent();
  if (!ids.length) {
    const wrap = document.getElementById("recent-home");
    if (wrap) wrap.hidden = true;
    el.innerHTML = "";
    return;
  }
  try {
    if (!_allAds.length) _allAds = await getAllEscorts(true);
    const map = new Map(_allAds.map((a) => [a.id, a]));
    const list = ids.map((id) => map.get(id)).filter(Boolean).slice(0, 4);
    if (!list.length) {
      const wrap = document.getElementById("recent-home");
      if (wrap) wrap.hidden = true;
      return;
    }
    const wrap = document.getElementById("recent-home");
    if (wrap) wrap.hidden = false;
    el.innerHTML = list.map((e) => cardHTML(e, "grid")).join("");
    bindRevealButtons(el);
  } catch (_) {}
}

async function initComparePage() {
  const picker = document.getElementById("compare-picker");
  const board = document.getElementById("compare-table");
  if (!picker || !board) return;

  try {
    if (!_allAds.length) _allAds = await getAllEscorts(true);
  } catch (err) {
    board.innerHTML = `<p class="empty-state">${err.message}</p>`;
    return;
  }

  const favIds = getFavs();
  let pool = _allAds.filter((a) => favIds.includes(a.id));
  if (!pool.length) pool = _allAds.filter((a) => a.featured).slice(0, 8);

  let selected = getCompareIds().filter((id) => pool.some((p) => p.id === id));
  if (!selected.length && pool.length) {
    selected = pool.slice(0, Math.min(2, pool.length)).map((p) => p.id);
  }

  const render = () => {
    setCompareIds(selected);
    picker.innerHTML = `
      <p class="compare-hint">${favIds.length ? "Elige hasta 3 favoritas" : "Añade favoritas o compara destacadas (demo)"} · ${selected.length}/3</p>
      <div class="compare-pick-grid">
        ${pool
          .map((p) => {
            const on = selected.includes(p.id);
            return `<button type="button" class="compare-pick ${on ? "is-on" : ""}" data-id="${p.id}">
              <span class="cp-avatar" style="background:${gradientFor(p.id)}">${p.name.charAt(0)}</span>
              <span class="cp-meta">
                <strong>${p.name}</strong>
                <small>${p.age} · ${p.price}€ · ${zoneLabel(p.zoneSlug, p.zone)}</small>
              </span>
              <span class="cp-check">${on ? "✓" : "+"}</span>
            </button>`;
          })
          .join("")}
      </div>
      ${
        !favIds.length
          ? `<p class="form-hint" style="margin-top:0.75rem"><a href="anuncios.html" style="color:var(--accent)">Guarda favoritas</a> para comparar las que te interesan de verdad.</p>`
          : ""
      }
    `;

    const cols = selected.map((id) => pool.find((p) => p.id === id) || _allAds.find((p) => p.id === id)).filter(Boolean);
    if (!cols.length) {
      board.innerHTML = `<div class="empty-state"><p>Selecciona al menos un perfil para comparar.</p><a class="btn btn-primary btn-sm" href="anuncios.html">Explorar</a></div>`;
      return;
    }

    const rows = [
      { k: "Foto", render: (p) => `<div class="cmp-avatar" style="background:${gradientFor(p.id)}">${p.name.charAt(0)}</div>` },
      { k: "Nombre", render: (p) => `<strong>${p.name}</strong>` },
      { k: "Edad", render: (p) => `${p.age} años` },
      { k: "Tarifa", render: (p) => `<span class="price" style="font-size:1.1rem">${p.price}€</span>` },
      { k: "Zona", render: (p) => p.locationDetail || zoneLabel(p.zoneSlug, p.zone) },
      { k: "Nacionalidad", render: (p) => p.nationality || "—" },
      { k: "Idiomas", render: (p) => (p.languages || []).join(", ") || "—" },
      { k: "Altura", render: (p) => p.height || "—" },
      { k: "Recibe", render: (p) => (p.incall ? "Sí" : "No") },
      { k: "Salidas", render: (p) => (p.outcall ? "Sí" : "No") },
      { k: "24h", render: (p) => (p.available24h ? "Sí" : "No") },
      { k: "Indep.", render: (p) => (p.independent ? "Sí" : "No") },
      { k: "En línea", render: (p) => (p.online ? "Ahora" : "No") },
      { k: "TOP", render: (p) => (p.featured || (p.tags || []).includes("vip") ? "Sí" : "—") },
      {
        k: "Contacto",
        render: (p) =>
          `<div class="cmp-actions">
            <a class="btn btn-whatsapp btn-sm" href="https://wa.me/${p.phone}?text=${encodeURIComponent(t("wa_msg", { name: p.name }))}" target="_blank" rel="noopener">WA</a>
            <a class="btn btn-primary btn-sm" href="anuncio.html?id=${encodeURIComponent(p.id)}">Ver</a>
          </div>`,
      },
    ];

    board.innerHTML = `
      <div class="compare-scroll">
        <table class="compare-matrix">
          <thead>
            <tr>
              <th></th>
              ${cols.map((p) => `<th><a href="anuncio.html?id=${encodeURIComponent(p.id)}">${p.name}</a></th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `<tr>
              <th scope="row">${r.k}</th>
              ${cols.map((p) => `<td>${r.render(p)}</td>`).join("")}
            </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    picker.querySelectorAll(".compare-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (selected.includes(id)) selected = selected.filter((x) => x !== id);
        else if (selected.length < 3) selected = [...selected, id];
        else {
          showToast("Máximo 3 perfiles");
          return;
        }
        render();
      });
    });
  };

  render();
}

function registerPWA() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    // Purge every pre-v6 shell so FAQ/nav language never sticks mid-update
    try {
      if (!localStorage.getItem("eb_sw_v9")) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
        if (typeof caches !== "undefined") {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
        localStorage.setItem("eb_sw_v9", "1");
      }
    } catch (_) {}
    navigator.serviceWorker
      .register("/sw.js?v=9")
      .then((reg) => {
        if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
        reg.update().catch(() => {});
      })
      .catch(() => {});
  });
}

function loadAnalyticsIfConsented() {
  if (localStorage.getItem("eb_cookies_mode") !== "all") return;
  if (window.__ebAnalyticsLoaded) return;
  API.get("/api/config")
    .then((cfg) => {
      const id = (cfg.analyticsId || "").trim();
      if (!id || !/^G-|UA-|GTM-/.test(id)) return;
      window.__ebAnalyticsLoaded = true;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", id, { anonymize_ip: true });
    })
    .catch(() => {});
}

function initCookieBanner() {
  if (localStorage.getItem("eb_cookies_ok") === "1") {
    loadAnalyticsIfConsented();
    return;
  }
  if (document.getElementById("cookie-banner")) return;
  const el = document.createElement("div");
  el.id = "cookie-banner";
  el.className = "cookie-banner";
  el.innerHTML = `
    <div class="cookie-inner">
      <p>Usamos cookies técnicas y, si las activas, de medición para mejorar EscortBenidorm. Al continuar aceptas la <a href="${basePath()}privacidad.html">política de privacidad</a>.</p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-ghost btn-sm" id="cookie-reject">Solo técnicas</button>
        <button type="button" class="btn btn-primary btn-sm" id="cookie-accept">Aceptar</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  const close = (mode) => {
    localStorage.setItem("eb_cookies_ok", "1");
    localStorage.setItem("eb_cookies_mode", mode);
    el.classList.add("hide");
    setTimeout(() => el.remove(), 300);
    if (mode === "all") loadAnalyticsIfConsented();
  };
  el.querySelector("#cookie-accept")?.addEventListener("click", () => close("all"));
  el.querySelector("#cookie-reject")?.addEventListener("click", () => close("essential"));
}

function initScrollTop() {
  if (document.getElementById("scroll-top")) return;
  const btn = document.createElement("button");
  btn.id = "scroll-top";
  btn.className = "scroll-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Subir");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);
  const onScroll = () => {
    btn.classList.toggle("show", window.scrollY > 420);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();
}

function ensureManifestLink() {
  if (document.querySelector('link[rel="manifest"]')) return;
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = (basePath() || "") + "manifest.webmanifest";
  // fix for subfolders
  if (
    location.pathname.includes("/zonas/") ||
    location.pathname.includes("/blog/") ||
    location.pathname.includes("/en/") ||
    location.pathname.includes("/de/")
  ) {
    link.href = "../manifest.webmanifest";
  } else {
    link.href = "manifest.webmanifest";
  }
  document.head.appendChild(link);
}

/** Show Cuenta / Entrar + saldo de créditos en header */
function initAuthNav() {
  if (typeof API === "undefined" || !API.userToken) return;
  const logged = !!API.userToken();
  const base = basePath();
  const navs = document.querySelectorAll(".nav-desktop, .nav-mobile");
  navs.forEach((nav) => {
    if (nav.querySelector("[data-auth-nav]")) return;
    // skip if page already has login / mi-anuncio link
    if (!logged && nav.querySelector('a[href*="login.html"]')) return;
    if (logged && nav.querySelector('a[href*="mi-anuncio.html"]')) return;
    const a = document.createElement("a");
    a.setAttribute("data-auth-nav", "1");
    if (logged) {
      a.href = `${base}mi-anuncio.html`;
      a.textContent = t("nav_myad");
      a.setAttribute("data-i18n", "nav_myad");
    } else {
      a.href = `${base}login.html`;
      a.textContent = t("nav_login");
      a.setAttribute("data-i18n", "nav_login");
    }
    nav.appendChild(a);
  });

  if (logged) {
    API.get("/api/credits/me")
      .then((me) => {
        API.setUser(me.user);
        const credits = me.credits ?? 0;
        document.querySelectorAll(".nav-desktop").forEach((nav) => {
          if (nav.querySelector("[data-credits-nav]")) return;
          const c = document.createElement("a");
          c.setAttribute("data-credits-nav", "1");
          c.href = `${base}precios.html#creditos`;
          c.textContent = `${credits} cr.`;
          c.title = t("nav_prices");
          c.style.color = "var(--gold)";
          nav.appendChild(c);
        });
      })
      .catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // language first (also self-boots from i18n.js; call again for safety)
  document.documentElement.lang = I18N_STATE.lang;
  try {
    if (typeof bootI18nUI === "function") bootI18nUI();
    else {
      initLangSwitcher();
      applyI18n();
    }
  } catch (_) {
    try {
      initLangSwitcher();
      applyI18n();
    } catch (__) {}
  }
  injectStaticIcons();
  updateFavBadges();
  fillZoneSelects();
  fillLangFilterSelect();
  updateTicker();
  ensureManifestLink();
  registerPWA();
  initCookieBanner();
  initScrollTop();
  initAuthNav();

  window.addEventListener("eb:lang", onLangChange);

  initAgeGate();
  initMenu();
  applyUrlParams();
  initFilters();
  initHeroSearch();
  initAuthForms();
  initPublishForm();
  initManageAd();
  initMobileBar();
  initAdmin();
  initContactForm();
  initFavClear();
  updateCompareBar();
  initOperatorLegal();

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  await Promise.all([initLiveStats(), renderZones(), initProfile()]);

  const listings = document.getElementById("listings");
  if (listings) {
    await renderListings({
      featuredOnly: listings.dataset.featured === "1",
      zone: listings.dataset.zone || null,
      favoritesOnly: listings.dataset.favorites === "1",
    });
  }

  await renderRecent();
  await initComparePage();
});
