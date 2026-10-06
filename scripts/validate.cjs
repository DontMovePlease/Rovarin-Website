const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.ROVARIN_PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const routes = ['/', '/security/', '/download/', '/faq/', '/404.html'];
const widths = [320, 375, 390, 430, 768, 1024, 1440];
const errors = [];

for (const file of routes.map(route => route === '/' ? 'index.html' : route.slice(1) + (route.endsWith('/') ? 'index.html' : ''))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const required of ['<title>', 'name="description"', 'rel="canonical"', 'name="viewport"', 'property="og:title"', 'property="og:description"', 'property="og:image"', 'property="og:type"', 'property="og:url"', 'name="twitter:card"']) {
    if (!html.includes(required)) errors.push(`${file}: missing ${required}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${file}: invalid JSON-LD: ${error.message}`); }
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.ROVARIN_BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const page = await browser.newPage();
  for (const route of routes) {
    const response = await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) errors.push(`${route}: HTTP ${response?.status()}`);
    const broken = await page.locator('a[href^="/"]').evaluateAll(async links => {
      const paths = [...new Set(links.map(link => link.getAttribute('href')).filter(Boolean))];
      const bad = [];
      for (const href of paths) {
        const res = await fetch(href, { method: 'HEAD' });
        if (!res.ok) bad.push(`${href} (${res.status})`);
      }
      return bad;
    });
    if (broken.length) errors.push(`${route}: broken internal links ${broken.join(', ')}`);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.reload({ waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (overflow) errors.push(`${route} overflows at ${width}px`);
    }
  }
  await page.goto('http://127.0.0.1:4173/');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator('[data-menu]').focus();
  await page.keyboard.press('Enter');
  if (await page.locator('[data-menu]').getAttribute('aria-expanded') !== 'true') errors.push('Mobile menu keyboard activation failed');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!reduced) errors.push('Reduced-motion media emulation failed');
  const screenshot=page.locator('#showcase-image');
  await page.locator('[data-view="mobile"]').click();
  if(!((await screenshot.getAttribute('src')) || '').includes('phone-dashboard')) errors.push('Phone screenshot switch failed');
  await page.locator('#expand-shot').click();
  if(!await page.locator('#screenshot-dialog').evaluate(el=>el.open)) errors.push('Screenshot dialog failed');
  await page.keyboard.press('Escape');
  if(await page.locator('#screenshot-dialog').evaluate(el=>el.open)) errors.push('Dialog Escape failed');
  await page.locator('[data-view="desktop"]').click();
  if(!((await screenshot.getAttribute('src')) || '').includes('desktop-dashboard')) errors.push('Desktop screenshot switch failed');
  await page.locator('[data-view="maintenance"]').click();
  if(!((await screenshot.getAttribute('src')) || '').includes('desktop-maintenance')) errors.push('Maintenance screenshot switch failed');
  const brokenImages=await page.locator('img').evaluateAll(images=>images.filter(img=>img.complete&&!img.naturalWidth).map(img=>img.getAttribute('src')));
  if(brokenImages.length) errors.push('Broken screenshot assets');
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`PASS: ${routes.length} routes, ${widths.length} viewport widths, internal links, metadata, JSON-LD, keyboard menu and reduced motion.`);
}

run().catch(error => { console.error(error); process.exit(1); });
