import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1366]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.locator('#build-main').waitFor({timeout:15000});
    assert.equal(await page.locator('.terrain-card').count(),5);
    assert.equal(await page.locator('img.terrain-img, .terrain-art img').count(),5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),true,'Horizontal overflow at '+width);
    const images = await page.locator('.terrain-art img').evaluateAll(images=>images.map(image=>({complete:image.complete,width:image.naturalWidth})));
    assert.ok(images.every(x=>x.complete&&x.width>0),'Terrain image decode failed: '+JSON.stringify(images));
    await page.locator('#build-main').click();
    await page.locator('.builder-shell').waitFor({timeout:20000});
    assert.equal(await page.locator('#combat-spells-panel').isVisible(),false,'Spells leaked into Build Mode');
    assert.deepEqual(errors,[],'Page errors: '+errors.join('; '));
    await page.close();
  }
  const page=await browser.newPage();
  const help=await page.goto(new URL('how-to-play.html',base).href);
  assert.equal(help.status(),200);
  assert.match(await page.title(),/How to Play/);
  console.log('Browser smoke: homepage, 5 images, responsive layouts, builder and help PASS');
} finally {
  await browser.close();
}
