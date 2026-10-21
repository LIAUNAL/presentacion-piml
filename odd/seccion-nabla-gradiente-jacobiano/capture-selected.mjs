import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Captura acotada para revisión visual: sólo los índices pedidos (1-based).
 * Uso: node odd/seccion-nabla-gradiente-jacobiano/capture-selected.mjs 4 5 6 ...
 * No forma parte del pipeline de entrega; vive en odd/ y no se commitea.
 */
const DECK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(DECK_ROOT, 'odd', 'seccion-nabla-gradiente-jacobiano', 'captures');
const PORT = Number(process.env.CAPTURE_PORT || 4183);
const URL_ = `http://localhost:${PORT}/presentacion-piml/`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const indices = process.argv.slice(2).map((n) => Number(n));
if (!indices.length) throw new Error('Indica al menos un número de diapositiva (1-based).');
if (!existsSync(path.join(DECK_ROOT, 'dist', 'index.html'))) throw new Error('Falta dist/: ejecuta npm run build.');

const server = spawn(
  process.execPath,
  [path.join(DECK_ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PORT), '--strictPort'],
  { cwd: DECK_ROOT, stdio: 'ignore' },
);

const deadline = Date.now() + 30000;
let up = false;
while (Date.now() < deadline) {
  try {
    if ((await fetch(URL_)).ok) {
      up = true;
      break;
    }
  } catch {
    /* aún no */
  }
  await sleep(400);
}
if (!up) {
  server.kill();
  throw new Error('vite preview no respondió.');
}

const browser = await chromium.launch();
try {
  await mkdir(OUT, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  for (const n of indices) {
    const idx = n - 1;
    await page.goto(URL_, { waitUntil: 'networkidle' });
    await page.evaluate((i) => localStorage.setItem('deck-slide-piml', String(i)), idx);
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => document.body.classList.add('focus-mode'));
    await page.waitForSelector('#viewport .is-active', { timeout: 10000 });
    await page.evaluate(() => document.fonts.ready);
    await page
      .waitForFunction(() => document.querySelectorAll('#viewport .is-active mjx-container').length > 0, { timeout: 7000 })
      .catch(() => {});
    await page.waitForTimeout(1800);
    const overflow = await page.evaluate(() => {
      const box = document.querySelector('#viewport .is-active .slide-content');
      if (!box) return null;
      return { scroll: box.scrollHeight, client: box.clientHeight, hidden: box.scrollHeight - box.clientHeight };
    });
    const file = path.join(OUT, `slide-${String(n).padStart(2, '0')}.png`);
    await page.screenshot({ path: file });
    console.log(`slide ${n}: ${file} · overflow=${overflow ? overflow.hidden : 'n/a'}px`);
  }
} finally {
  await browser.close();
  server.kill();
}
