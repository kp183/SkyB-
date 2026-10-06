const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../frontend/node_modules/playwright'));

async function testGuestBargain() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  // Helper to ensure clean guest state
  async function makeContext(viewport) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3005/');
    await page.evaluate(() => localStorage.clear());
    return { ctx, page };
  }

  // 1. Desktop Header Bargain Bot
  {
    const { ctx, page } = await makeContext({ width: 1440, height: 900 });
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });
    const btn = page.locator('#header-bargain-bot-btn');
    await btn.click();
    await page.waitForURL(url => url.pathname === '/login', { timeout: 5000 });
    const panelOpen = await page.locator('#skybot-panel').count();
    const currentUrl = page.url();
    results.push({ trigger: 'Desktop Header Bargain Bot', redirected: currentUrl.includes('/login'), panelNeverOpened: panelOpen === 0, url: currentUrl });
    await ctx.close();
  }

  // 2. Mobile Header Bargain Bot
  {
    const { ctx, page } = await makeContext({ width: 390, height: 844 });
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });
    const btn = page.locator('#mobile-bargain-bot-btn');
    await btn.click();
    await page.waitForURL(url => url.pathname === '/login', { timeout: 5000 });
    const panelOpen = await page.locator('#skybot-panel').count();
    const currentUrl = page.url();
    results.push({ trigger: 'Mobile Header Bargain Bot', redirected: currentUrl.includes('/login'), panelNeverOpened: panelOpen === 0, url: currentUrl });
    await ctx.close();
  }

  // 3. Product Card Bargain button
  {
    const { ctx, page } = await makeContext({ width: 1440, height: 900 });
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });
    await page.waitForSelector('article.product-card button.btn-bargain-action');
    const bargainBtn = page.locator('article.product-card button.btn-bargain-action').first();
    await bargainBtn.click();
    await page.waitForURL(url => url.pathname === '/login', { timeout: 5000 });
    const panelOpen = await page.locator('#skybot-panel').count();
    const currentUrl = page.url();
    results.push({ trigger: 'Product Card Bargain Button', redirected: currentUrl.includes('/login'), panelNeverOpened: panelOpen === 0, url: currentUrl });
    await ctx.close();
  }

  // 4. Product Detail Page Desktop CTA
  {
    const { ctx, page } = await makeContext({ width: 1440, height: 900 });
    await page.goto('http://localhost:3005/product/1', { waitUntil: 'networkidle' });
    const btn = page.locator('button:has-text("Bargain with Bot")');
    await btn.click();
    await page.waitForURL(url => url.pathname === '/login', { timeout: 5000 });
    const panelOpen = await page.locator('#skybot-panel').count();
    const currentUrl = page.url();
    results.push({ trigger: 'Product Detail Desktop CTA', redirected: currentUrl.includes('/login?next=%2Fproduct%2F1'), panelNeverOpened: panelOpen === 0, url: currentUrl });
    await ctx.close();
  }

  // 5. Product Detail Page Mobile Sticky Bar
  {
    const { ctx, page } = await makeContext({ width: 390, height: 844 });
    await page.goto('http://localhost:3005/product/1', { waitUntil: 'networkidle' });
    const btn = page.locator('#sticky-btn-bargain');
    await btn.click();
    await page.waitForURL(url => url.pathname === '/login', { timeout: 5000 });
    const panelOpen = await page.locator('#skybot-panel').count();
    const currentUrl = page.url();
    results.push({ trigger: 'Product Detail Mobile Sticky Bar', redirected: currentUrl.includes('/login?next=%2Fproduct%2F1'), panelNeverOpened: panelOpen === 0, url: currentUrl });
    await ctx.close();
  }

  // 6. Category Drawer Bargain Finder
  {
    const { ctx, page } = await makeContext({ width: 390, height: 844 });
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Open Navigation Drawer"]').click();
    const drawerBargainBtn = page.locator('#drawer-bargain-btn');
    await drawerBargainBtn.click();
    await page.waitForURL(url => url.pathname === '/login', { timeout: 5000 });
    const panelOpen = await page.locator('#skybot-panel').count();
    const currentUrl = page.url();
    const outDir = path.resolve('docs/design-qa/phase-1');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    await page.screenshot({ path: path.join(outDir, 'guest_bargain_redirect_login.png'), fullPage: true });
    results.push({ trigger: 'Category Drawer Bargain Finder', redirected: currentUrl.includes('/login'), panelNeverOpened: panelOpen === 0, url: currentUrl });
    await ctx.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

testGuestBargain().catch(e => { console.error(e); process.exit(1); });
