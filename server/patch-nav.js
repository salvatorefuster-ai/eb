const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const files = [
  "anuncios.html",
  "favoritos.html",
  "comparar.html",
  "zonas.html",
  "contacto.html",
  "anuncio.html",
];

for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  let h = fs.readFileSync(p, "utf8");
  if (h.includes("precios.html")) {
    console.log("ok", f);
    continue;
  }
  // insert after publicar link in nav
  if (h.includes('href="publicar.html"')) {
    h = h.replace(
      /(<a href="publicar\.html"[^>]*>[\s\S]*?<\/a>)(\s*)/g,
      (m, a, sp, offset) => {
        // only first few in header area
        return `${a}${sp}<a href="precios.html">Precios</a>${sp}`;
      }
    );
    // avoid doubling if already in footer multiple - check count
    const count = (h.match(/precios\.html/g) || []).length;
    // if too many, leave it
    fs.writeFileSync(p, h);
    console.log("patched", f, "precios x", count || "new");
  } else {
    console.log("no publicar link", f);
  }
}
