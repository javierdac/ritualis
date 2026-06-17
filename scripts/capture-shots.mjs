// Captura screenshots reales de Ritualis para la landing.
// Uso: node scripts/capture-shots.mjs  (requiere el dev server en :3001 y puppeteer-core)
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "public/shots";

const SHOTS = [
  { path: "/app", file: "dashboard.png" },
  { path: "/app/dinamicas", file: "dinamicas.png" },
  { path: "/app/metricas", file: "metricas.png" },
  { path: "/app/sesiones", file: "sesiones.png" },
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  args: ["--no-sandbox", "--hide-scrollbars"],
});

const page = await browser.newPage();

// Login
await page.goto(`${BASE}/login`, { waitUntil: "networkidle2" });
await page.type("#email", "test@ritualis.dev");
await page.type("#password", "secret123");
await Promise.all([
  page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {}),
  page.click('button[type="submit"]'),
]);
console.log("URL tras login:", page.url());

for (const { path, file } of SHOTS) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900)); // settle animations/fonts
  await page.screenshot({ path: `${OUT}/${file}` });
  console.log("✓", file);
}

await browser.close();
console.log("listo");
