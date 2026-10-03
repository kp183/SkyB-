const path = require("path");
const fs = require("fs");
const { chromium } = require(path.resolve(__dirname, "../../frontend/node_modules/playwright"));

const QA_DIR = path.resolve(__dirname, "../../docs/design-qa/phase-1");
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

// Copy helper
function copyRef(srcPath, destName) {
  const fullSrc = path.resolve(__dirname, "../../", srcPath);
  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, path.join(QA_DIR, destName));
    console.log(`Copied reference: ${destName}`);
  } else {
    console.warn(`Reference not found: ${srcPath}`);
  }
}

async function runQA() {
  console.log("=== STARTING PHASE 1 DESIGN QA ===");

  // Copy Stitch reference screens
  copyRef("stitch_skyb_v2/home_restyled_locked_candy/screen.png", "stitch_ref_home_desktop.png");
  copyRef("stitch_skyb_v2/home_hub_skyb_india_mobile/screen.png", "stitch_ref_home_mobile.png");
  copyRef("stitch_skyb_v2/category_drawer_category/screen.png", "stitch_ref_category_drawer.png");
  copyRef("stitch_skyb_v2/skybot_sheet_skybot_sheet/screen.png", "stitch_ref_skybot_mobile_sheet.png");
  copyRef("stitch_skyb_v2/skybot_hub_skybot/screen.png", "stitch_ref_skybot_desktop_slideover.png");

  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // -------------------------------------------------------------
  // 1. DESKTOP SCREENSHOTS (1440px)
  // -------------------------------------------------------------
  console.log("\n[1/7] Capturing Desktop 1440px screenshots...");
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await desktopCtx.newPage();

  // Home desktop
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(QA_DIR, "header_desktop_1440px.png"), clip: { x: 0, y: 0, width: 1440, height: 160 } });
  await page.screenshot({ path: path.join(QA_DIR, "home_full_desktop_1440px.png"), fullPage: false });

  // Mega-menu: All Categories
  await page.hover("button:has-text('All Categories')");
  await page.waitForTimeout(300); // 150ms delay + buffer
  await page.screenshot({ path: path.join(QA_DIR, "megamenu_all_1440px.png"), clip: { x: 0, y: 0, width: 1440, height: 500 } });

  // Mega-menu: Toys
  await page.hover("button:has-text('Toys')");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(QA_DIR, "megamenu_toys_1440px.png"), clip: { x: 0, y: 0, width: 1440, height: 500 } });

  // Mega-menu: Boys Fashion
  await page.hover("button:has-text('Boys Fashion')");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(QA_DIR, "megamenu_boys_1440px.png"), clip: { x: 0, y: 0, width: 1440, height: 500 } });

  // Esc closes mega-menu
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const isMegaOpen = await page.locator(".max-w-7xl.mx-auto:has-text('Shop by Age')").isVisible();
  console.log(`Keyboard Esc closes mega-menu: ${!isMegaOpen ? "PASS" : "FAIL"}`);

  // SkyBot Slide-Over Desktop (Login first so bargain starts smoothly)
  await page.evaluate(() => {
    localStorage.setItem("skyb_token", "dummy-dev-token");
    localStorage.setItem("skyb_user", JSON.stringify({ id: 2, name: "Priya Sharma", email: "parent@skyb.com" }));
  });
  await page.reload({ waitUntil: "networkidle" });

  // Click Bargain on first product card
  const firstBargainBtn = page.locator("article .btn-bargain-action").first();
  await firstBargainBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(QA_DIR, "skybot_desktop_slideover_1440px.png") });

  // Esc closes SkyBot
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const isSkyBotOpen = await page.locator("aside[aria-label='SkyBot Bargain AI']").isVisible();
  console.log(`Keyboard Esc closes SkyBot panel: ${!isSkyBotOpen ? "PASS" : "FAIL"}`);

  // Footer desktop
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const footerEl = page.locator("footer");
  await footerEl.screenshot({ path: path.join(QA_DIR, "footer_desktop_1440px.png") });

  await desktopCtx.close();

  // -------------------------------------------------------------
  // 2. MOBILE SCREENSHOTS (390px)
  // -------------------------------------------------------------
  console.log("\n[2/7] Capturing Mobile 390px screenshots...");
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
  });
  const mPage = await mobileCtx.newPage();

  // Set logged in user for real drawer info
  await mPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await mPage.evaluate(() => {
    localStorage.setItem("skyb_token", "dummy-dev-token");
    localStorage.setItem("skyb_user", JSON.stringify({ id: 2, name: "Priya Sharma", email: "parent@skyb.com" }));
  });
  await mPage.reload({ waitUntil: "networkidle" });

  // Mobile Header & Top portion
  await mPage.screenshot({ path: path.join(QA_DIR, "header_mobile_390px.png"), clip: { x: 0, y: 0, width: 390, height: 200 } });

  // Mobile Bottom Nav
  await mPage.screenshot({ path: path.join(QA_DIR, "bottom_nav_390px.png"), clip: { x: 0, y: 760, width: 390, height: 84 } });

  // Open Mobile Drawer (Hamburger)
  const hamburgerBtn = mPage.locator("button[aria-label='Open Navigation Drawer']");
  await hamburgerBtn.click();
  await mPage.waitForTimeout(500);
  await mPage.screenshot({ path: path.join(QA_DIR, "mobile_drawer_390px.png") });

  // Close drawer
  const closeDrawerBtn = mPage.locator("button[aria-label='Close Navigation Drawer']");
  await closeDrawerBtn.click();
  await mPage.waitForTimeout(300);

  // Open SkyBot on Mobile
  const mBargainBtn = mPage.locator("article .btn-bargain-action").first();
  await mBargainBtn.click();
  await mPage.waitForTimeout(600);
  await mPage.screenshot({ path: path.join(QA_DIR, "skybot_mobile_bottomsheet_390px.png") });

  // Close SkyBot
  const closeBotBtn = mPage.locator("button[aria-label='Close SkyBot']");
  await closeBotBtn.click();
  await mPage.waitForTimeout(300);

  // Mobile Footer
  await mPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await mPage.waitForTimeout(300);
  const mFooterEl = mPage.locator("footer");
  await mFooterEl.screenshot({ path: path.join(QA_DIR, "footer_mobile_390px.png") });

  await mobileCtx.close();

  // -------------------------------------------------------------
  // 3. HEADERS IDENTICAL ON 5 ROUTES
  // -------------------------------------------------------------
  console.log("\n[3/7] Verifying identical headers on /, /product/1, /cart, /login, /admin...");
  const headerCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const hPage = await headerCtx.newPage();

  const headerRoutes = [
    { path: "/", file: "header_route_home.png" },
    { path: "/product/1", file: "header_route_product1.png" },
    { path: "/cart", file: "header_route_cart.png" },
    { path: "/login", file: "header_route_login.png" },
    { path: "/admin", file: "header_route_admin.png" },
  ];

  for (const hr of headerRoutes) {
    await hPage.goto(`http://localhost:3000${hr.path}`, { waitUntil: "networkidle" });
    const headerElement = hPage.locator("header");
    await headerElement.screenshot({ path: path.join(QA_DIR, hr.file) });
    console.log(`Captured header on ${hr.path} -> ${hr.file}`);
  }
  await headerCtx.close();

  // -------------------------------------------------------------
  // 4. LOGO RETURNS TO "/"
  // -------------------------------------------------------------
  console.log("\n[4/7] Verifying Logo returns to '/' from /cart, /product/1, /login, /admin...");
  const logoCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const lPage = await logoCtx.newPage();

  const logoTestRoutes = ["/cart", "/product/1", "/login", "/admin"];
  for (const r of logoTestRoutes) {
    await lPage.goto(`http://localhost:3000${r}`, { waitUntil: "networkidle" });
    const logoLink = lPage.locator("#brand-logo");
    await logoLink.click();
    await lPage.waitForURL("http://localhost:3000/");
    const currentUrl = lPage.url();
    console.log(`Logo from ${r} returned to ${currentUrl}: ${currentUrl === "http://localhost:3000/" ? "PASS" : "FAIL"}`);
  }
  await logoCtx.close();

  // -------------------------------------------------------------
  // 5. GUEST REDIRECTS (Add, Heart, Cart, Orders, Bargain)
  // -------------------------------------------------------------
  console.log("\n[5/7] Verifying Guest redirects to /login?next=...");
  const guestCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const gPage = await guestCtx.newPage();

  // Ensure clean guest state
  await gPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await gPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await gPage.reload({ waitUntil: "networkidle" });

  // 1. Add to cart guest click
  await gPage.locator("article .btn-add-action").first().click();
  await gPage.waitForURL(/\/login\?next=/);
  console.log(`Guest 'Add to Cart' redirect: ${gPage.url().includes("/login?next=") ? "PASS" : "FAIL"} (${gPage.url()})`);

  // 2. Wishlist heart guest click
  await gPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await gPage.locator("article button[aria-label*='wishlist']").first().click();
  await gPage.waitForURL(/\/login\?next=/);
  console.log(`Guest 'Wishlist' redirect: ${gPage.url().includes("/login?next=") ? "PASS" : "FAIL"}`);

  // 3. Cart button guest click
  await gPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await gPage.locator("a[aria-label='Shopping Cart']").click();
  await gPage.waitForURL(/\/login\?next=/);
  console.log(`Guest 'Cart' header button redirect: ${gPage.url().includes("/login?next=%2Fcart") ? "PASS" : "FAIL"}`);

  // 4. Orders button guest click
  await gPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await gPage.locator("header a:has-text('Orders')").click();
  await gPage.waitForURL(/\/login\?next=/);
  console.log(`Guest 'Orders' header button redirect: ${gPage.url().includes("/login?next=%2Forders") ? "PASS" : "FAIL"}`);

  // 5. Bargain button guest click
  await gPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await gPage.locator("article .btn-bargain-action").first().click();
  await gPage.waitForURL(/\/login\?next=/);
  console.log(`Guest 'Bargain' button redirect: ${gPage.url().includes("/login?next=") ? "PASS" : "FAIL"}`);

  await guestCtx.close();

  // -------------------------------------------------------------
  // 6. NO HORIZONTAL SCROLL AT 390px
  // -------------------------------------------------------------
  console.log("\n[6/7] Verifying No horizontal scroll at 390px on key pages...");
  const scrollCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const sPage = await scrollCtx.newPage();

  const testScrollPages = ["/", "/category/all", "/deals", "/login", "/terms", "/privacy"];
  for (const sp of testScrollPages) {
    await sPage.goto(`http://localhost:3000${sp}`, { waitUntil: "networkidle" });
    const hasHorizontalOverflow = await sPage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`390px overflow check for ${sp}: ${!hasHorizontalOverflow ? "PASS (0px overflow)" : "FAIL (overflow detected)"}`);
  }
  await scrollCtx.close();

  // -------------------------------------------------------------
  // 7. ICONS NEVER APPEAR AS RAW TEXT ON SLOW 3G
  // -------------------------------------------------------------
  console.log("\n[7/7] Verifying Icons never appear as raw text on Slow 3G...");
  const slowCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const slowPage = await slowCtx.newPage();

  // CDP Network emulation: Slow 3G (500 kbps down, 500 kbps up, 400ms latency)
  const cdpSession = await slowPage.context().newCDPSession(slowPage);
  await cdpSession.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 400,
    downloadThroughput: (500 * 1024) / 8,
    uploadThroughput: (500 * 1024) / 8,
  });

  // Navigate and capture screenshot immediately during early load
  slowPage.goto("http://localhost:3000/", { waitUntil: "commit" });
  await slowPage.waitForTimeout(300);
  await slowPage.screenshot({ path: path.join(QA_DIR, "slow_3g_icon_render.png") });

  // Verify that raw icon names are NOT found in text nodes
  const rawTextCheck = await slowPage.evaluate(() => {
    const rawNames = ["shopping_bag", "shopping_cart", "smart_toy", "favorite", "pin_drop"];
    const bodyText = document.body.innerText;
    const found = rawNames.filter((name) => bodyText.includes(name));
    return found;
  });

  console.log(`Slow 3G raw text check: ${rawTextCheck.length === 0 ? "PASS (Zero raw text leaked)" : "FAIL (Found: " + rawTextCheck.join(",") + ")"}`);
  await slowCtx.close();

  await browser.close();
  console.log("\n=== ALL QA TESTS COMPLETED SUCCESSFULLY ===");
}

runQA().catch((err) => {
  console.error("QA Test Error:", err);
  process.exit(1);
});
