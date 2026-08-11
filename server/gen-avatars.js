/**
 * Generate demo SVG avatars for seed ads
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const people = [
  { id: "sofia-levante", name: "Sofía", c1: "#3d1a2a", c2: "#1a1020" },
  { id: "luna-rincon", name: "Luna", c1: "#1a2a3d", c2: "#101820" },
  { id: "valentina-poniente", name: "Valentina", c1: "#2a1a3d", c2: "#181028" },
  { id: "mia-casco", name: "Mía", c1: "#3d2a1a", c2: "#201810" },
  { id: "carla-nueva-poniente", name: "Carla", c1: "#1a3d2a", c2: "#102018" },
  { id: "nina-levante", name: "Nina", c1: "#3d1a1a", c2: "#201010" },
  { id: "aisha-foietes", name: "Aisha", c1: "#1a1a3d", c2: "#101028" },
  { id: "emma-poniente", name: "Emma", c1: "#3d3a1a", c2: "#202010" },
  { id: "isabella-levante", name: "Isabella", c1: "#2a3d3a", c2: "#102020" },
  { id: "chloe-rincon", name: "Chloe", c1: "#3d1a35", c2: "#201018" },
  { id: "laura-casco", name: "Laura", c1: "#1a3d3d", c2: "#102020" },
  { id: "daria-levante", name: "Daria", c1: "#3d2a40", c2: "#1a1028" },
];

const gold = "#c9a96e";

function svg(letter, c1, c2, variant) {
  const g = variant === 0 ? c1 : variant === 1 ? c2 : "#0e0e16";
  const g2 = variant === 0 ? c2 : variant === 1 ? c1 : c1;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${g}"/>
      <stop offset="100%" stop-color="${g2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="45%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect width="800" height="1000" fill="url(#glow)"/>
  <circle cx="400" cy="380" r="140" fill="none" stroke="${gold}" stroke-opacity="0.25" stroke-width="2"/>
  <circle cx="400" cy="340" r="70" fill="${gold}" fill-opacity="0.12"/>
  <ellipse cx="400" cy="520" rx="110" ry="130" fill="${gold}" fill-opacity="0.1"/>
  <text x="400" y="390" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="${gold}" fill-opacity="0.85" font-weight="600">${letter}</text>
  <text x="400" y="920" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="${gold}" fill-opacity="0.45" letter-spacing="4">BENIDORM</text>
  <rect x="40" y="40" width="720" height="920" fill="none" stroke="${gold}" stroke-opacity="0.15" stroke-width="1" rx="8"/>
</svg>`;
}

let n = 0;
for (const p of people) {
  for (let v = 0; v < 3; v++) {
    const file = `demo-${p.id}-${v + 1}.svg`;
    fs.writeFileSync(path.join(dir, file), svg(p.name.charAt(0).toUpperCase(), p.c1, p.c2, v));
    n++;
  }
}
console.log(`Created ${n} SVG avatars in ${dir}`);
