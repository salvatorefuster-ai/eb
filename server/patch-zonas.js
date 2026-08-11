/**
 * Patch zone landing pages: results meta, full filters link, Mi anuncio nav
 */
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "zonas");

const zones = [
  { file: "levante.html", slug: "levante", name: "Playa de Levante" },
  { file: "poniente.html", slug: "poniente", name: "Playa de Poniente" },
  { file: "rincon-de-loix.html", slug: "rincon-de-loix", name: "Rincón de Loix" },
  { file: "casco-antiguo.html", slug: "casco-antiguo", name: "Casco Antiguo" },
  { file: "nueva-poniente.html", slug: "nueva-poniente", name: "Nueva Poniente" },
  { file: "foietes.html", slug: "foietes", name: "Foietes" },
];

for (const z of zones) {
  const p = path.join(dir, z.file);
  let html = fs.readFileSync(p, "utf8");

  // Nav: add Mi anuncio if missing
  if (!html.includes("mi-anuncio.html")) {
    html = html.replace(
      /(<a href="\.\.\/publicar\.html">Publicar<\/a>\s*)\n(\s*<\/nav>)/g,
      `$1\n        <a href="../mi-anuncio.html">Mi anuncio</a>\n$2`
    );
  }

  // Listings block: add results meta + toolbar if missing
  if (!html.includes("results-count") && html.includes(`id="listings" data-zone="${z.slug}"`)) {
    html = html.replace(
      `<div class="cards-grid" id="listings" data-zone="${z.slug}"></div>`,
      `<div class="results-meta">
        <div id="results-count"><strong>—</strong> en ${z.name}</div>
        <div class="view-toggle">
          <a class="btn btn-secondary btn-sm" href="../anuncios.html?zone=${z.slug}">Filtros avanzados</a>
          <a class="btn btn-ghost btn-sm" href="../publicar.html">Publicar aquí</a>
        </div>
      </div>
      <div class="cards-grid" id="listings" data-zone="${z.slug}"></div>
      <p class="form-hint" style="text-align:center;margin:1.25rem 0 0">
        ¿Eres anunciante en ${z.name}?
        <a href="../mi-anuncio.html" style="color:var(--accent)">Gestiona con tu PIN</a>
      </p>`
    );
  }

  fs.writeFileSync(p, html, "utf8");
  console.log("patched", z.file);
}
console.log("done");
