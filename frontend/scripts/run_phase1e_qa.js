const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3005";
const QA_DIR = path.join(__dirname, "../../docs/design-qa/phase-1");

if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function runPhase1EQA() {
  console.log("=== STARTING PHASE 1E PLAYWRIGHT QA ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    categoryResolution: {},
    unknownCategoryEmptyState: false,
    megaMenuAndTabs: false,
    productDetailStickyMobile: false,
    skybotCartBadgeLiveUpdate: false,
  };

  try {
    // ----------------------------------------------------
    // 1. Verify 3 Category Slugs (toys, bath-skincare, school-essentials)
    // ----------------------------------------------------
    console.log("\n--- Testing Category Slugs & Dynamic ID Resolution ---");
    const testSlugs = [
      { slug: "toys", expectedKeywords: ["toy", "wooden", "puzzle", "blocks", "rings"] },
      { slug: "bath-skincare", expectedKeywords: ["lotion", "bath", "skin", "wash", "soap"] },
      { slug: "school-essentials", expectedKeywords: ["backpack", "school", "lunch", "stationery"] },
    ];

    for (const item of testSlugs) {
      console.log(`Navigating to /category/${item.slug}...`);
      await page.goto(`${BASE_URL}/category/${item.slug}`, { waitUntil: "networkidle" });
      await page.waitForSelector("#product-count-label", { timeout: 10000 });
      const countText = await page.textContent("#product-count-label");
      console.log(`  ${item.slug} count label: ${countText}`);

      const cardTitles = await page.$$eval("article h3, .product-card h3", (els) => els.map((e) => e.textContent.toLowerCase()));
      console.log(`  Loaded ${cardTitles.length} product cards. First 3 titles:`, cardTitles.slice(0, 3));

      const matchesCategory = cardTitles.some((title) =>
        item.expectedKeywords.some((kw) => title.includes(kw))
      );
      results.categoryResolution[item.slug] = {
        totalLabel: countText,
        cardsCount: cardTitles.length,
        matchesCategory,
      };
      if (!matchesCategory) {
        throw new Error(`Category ${item.slug} did not contain expected keywords in product titles`);
      }
    }

    // ----------------------------------------------------
    // 2. Test Unknown Category Slug (EmptyState verification)
    // ----------------------------------------------------
    console.log("\n--- Testing Unknown Category Slug Empty State ---");
    await page.goto(`${BASE_URL}/category/non-existent-category`, { waitUntil: "networkidle" });
    const emptyStateTitle = await page.locator("h3:has-text('Category Not Found')").first();
    const emptyStateVisible = await emptyStateTitle.isVisible();
    console.log(`  EmptyState 'Category Not Found' visible: ${emptyStateVisible}`);
    results.unknownCategoryEmptyState = emptyStateVisible;

    // ----------------------------------------------------
    // 3. Test Mega-Menu Links and Header Tabs
    // ----------------------------------------------------
    console.log("\n--- Testing Desktop Mega-Menu Hover and Tab Navigation ---");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Hover over Toys tab to open mega-menu
    const toysTab = page.locator("#category-tab-toys");
    await toysTab.hover();
    await page.waitForTimeout(300);

    const megaMenu = page.locator("#desktop-megamenu");
    const megaMenuVisible = await megaMenu.isVisible();
    console.log(`  Mega-menu opened on hover: ${megaMenuVisible}`);

    // Click a subcategory link inside the mega-menu
    const softToysLink = megaMenu.locator("a:has-text('Soft Toys')").first();
    await softToysLink.click();
    await page.waitForURL(/subcategory=Soft%20Toys/, { timeout: 10000 });
    console.log(`  Successfully navigated to: ${page.url()}`);
    results.megaMenuAndTabs = megaMenuVisible && page.url().includes("Soft%20Toys");

    // ----------------------------------------------------
    // 4. Product Detail Mobile (390px) Bottom Nav Hidden & Sticky Bar Visible
    // ----------------------------------------------------
    console.log("\n--- Testing Product Detail at 390px (Mobile Sticky Bar & Hidden Bottom Nav) ---");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/product/1`, { waitUntil: "networkidle" });

    // Verify Mobile Bottom Nav is completely hidden
    const bottomNav = page.locator("nav[aria-label='Mobile Navigation']");
    const bottomNavCount = await bottomNav.count();
    console.log(`  BottomNav element count on /product/1: ${bottomNavCount} (expected 0)`);

    // Verify Sticky Action Bar is visible
    const stickyBar = page.locator("#product-sticky-action-bar");
    await stickyBar.waitFor({ state: "visible", timeout: 5000 });
    const stickyBarVisible = await stickyBar.isVisible();
    console.log(`  Sticky Action Bar visible: ${stickyBarVisible}`);

    const stickyWishlist = page.locator("#sticky-btn-wishlist");
    const stickyBargain = page.locator("#sticky-btn-bargain");
    const stickyAddCart = page.locator("#sticky-btn-add-cart");

    const wishlistVisible = await stickyWishlist.isVisible();
    const bargainVisible = await stickyBargain.isVisible();
    const addCartVisible = await stickyAddCart.isVisible();
    console.log(`  Sticky Bar buttons visible -> Wishlist: ${wishlistVisible}, Bargain: ${bargainVisible}, Add: ${addCartVisible}`);

    // Capture screenshot of mobile product detail
    const productMobileScreenshot = path.join(QA_DIR, "product_detail_mobile_390px.png");
    await page.screenshot({ path: productMobileScreenshot });
    console.log(`  Saved mobile product detail screenshot to: ${productMobileScreenshot}`);

    results.productDetailStickyMobile = bottomNavCount === 0 && stickyBarVisible && wishlistVisible && bargainVisible && addCartVisible;

    // ----------------------------------------------------
    // 5. SkyBot -> Live Cart Badge Realtime Update Without Reload
    // ----------------------------------------------------
    console.log("\n--- Testing SkyBot -> Cart Badge Live Update (Header & Bottom Nav) ---");
    // Log in as customer
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", "parent@skyb.com");
    await page.fill("#password", "Parent@123");
    await page.click("#login-submit-btn");
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    // Clear any existing cart items to ensure clean 0 -> 1 -> 2 badge progression
    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" });
    let removeBtnCount = await page.locator("button[title='Remove item']").count();
    while (removeBtnCount > 0) {
      await page.locator("button[title='Remove item']").first().click();
      await page.waitForTimeout(600);
      removeBtnCount = await page.locator("button[title='Remove item']").count();
    }
    console.log("  Cleared existing cart items for clean badge count test.");

    // Part A: Desktop Header Cart Badge Test
    console.log("  Testing Desktop Header Cart Badge...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/category/toys`, { waitUntil: "networkidle" });

    const headerCartBadge = page.locator("#header-cart-count-badge");
    const initialHeaderBadgeText = (await headerCartBadge.isVisible()) ? (await headerCartBadge.textContent())?.trim() : "0";
    console.log(`  Initial header cart count: ${initialHeaderBadgeText}`);

    // Capture desktop before screenshot
    const headerBeforePath = path.join(QA_DIR, "skybot_badge_before.png");
    await page.screenshot({ path: headerBeforePath });
    console.log(`  Saved header before screenshot to: ${headerBeforePath}`);

    // Open SkyBot on product card
    const bargainBtn = page.locator(".btn-bargain-action").first();
    await bargainBtn.click();

    // Wait for SkyBot panel to open
    const skybotPanel = page.locator("#skybot-panel");
    await skybotPanel.waitFor({ state: "visible", timeout: 10000 });
    console.log("  SkyBot slide-over opened.");

    // Submit an offer
    const offerInput = skybotPanel.locator("input[type='number']");
    await offerInput.fill("600");
    await page.click("#skybot-submit-offer-btn");
    console.log("  Submitted offer of ₹600.");

    // Wait for bot response with Apply to Cart button
    const applyBtn = page.locator("#skybot-apply-to-cart-btn");
    await applyBtn.waitFor({ state: "visible", timeout: 10000 });
    console.log("  Apply to Cart button is visible. Clicking Apply to Cart...");

    await applyBtn.click();
    await page.waitForTimeout(1200);

    // Verify header badge updated immediately without reload
    await headerCartBadge.waitFor({ state: "visible", timeout: 5000 });
    const afterHeaderBadgeText = (await headerCartBadge.textContent())?.trim();
    console.log(`  Header cart badge after Apply to Cart: ${afterHeaderBadgeText}`);

    // Close SkyBot panel to reveal full desktop header with badge
    await page.click("#skybot-close-btn").catch(() => {});
    await page.waitForTimeout(500);

    // Capture desktop after screenshot
    const headerAfterPath = path.join(QA_DIR, "skybot_badge_after.png");
    await page.screenshot({ path: headerAfterPath });
    console.log(`  Saved header after screenshot to: ${headerAfterPath}`);

    const headerBadgeIncremented = parseInt(afterHeaderBadgeText || "0") > parseInt(initialHeaderBadgeText || "0");
    console.log(`  Header badge incremented in real-time: ${headerBadgeIncremented}`);

    // Part B: Mobile Bottom Nav Badge Test
    console.log("  Testing Mobile (390px) Bottom Nav Cart Badge...");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/category/toys`, { waitUntil: "networkidle" });

    const bottomCartBadge = page.locator("#bottom-cart-count-badge");
    const initialBottomBadgeText = (await bottomCartBadge.isVisible()) ? (await bottomCartBadge.textContent())?.trim() : "0";
    console.log(`  Initial bottom-nav cart count: ${initialBottomBadgeText}`);

    // Capture mobile before screenshot (showing count 1)
    const mobileBeforePath = path.join(QA_DIR, "skybot_bottom_nav_badge_before.png");
    await page.screenshot({ path: mobileBeforePath });
    console.log(`  Saved mobile before screenshot to: ${mobileBeforePath}`);

    // Open SkyBot on mobile for second product
    const mobileBargainBtn = page.locator(".btn-bargain-action").nth(1);
    await mobileBargainBtn.click();

    await skybotPanel.waitFor({ state: "visible", timeout: 10000 });
    await offerInput.fill("500");
    await page.click("#skybot-submit-offer-btn");

    await applyBtn.waitFor({ state: "visible", timeout: 10000 });
    await applyBtn.click();
    await page.waitForTimeout(1200);

    // Close SkyBot panel to reveal bottom nav bar
    await page.click("#skybot-close-btn").catch(() => {});
    await page.waitForTimeout(500);

    const afterBottomBadgeText = (await bottomCartBadge.isVisible()) ? (await bottomCartBadge.textContent())?.trim() : "0";
    console.log(`  Bottom-nav cart badge after Apply to Cart: ${afterBottomBadgeText}`);

    // Capture mobile after screenshot (showing count 2)
    const mobileAfterPath = path.join(QA_DIR, "skybot_bottom_nav_badge_after.png");
    await page.screenshot({ path: mobileAfterPath });
    console.log(`  Saved mobile after screenshot to: ${mobileAfterPath}`);

    const bottomBadgeIncremented = parseInt(afterBottomBadgeText || "0") > parseInt(initialBottomBadgeText || "0");

    results.skybotCartBadgeLiveUpdate = headerBadgeIncremented && bottomBadgeIncremented;
    results.headerCartBadge = { before: initialHeaderBadgeText, after: afterHeaderBadgeText, success: headerBadgeIncremented };
    results.bottomNavCartBadge = { before: initialBottomBadgeText, after: afterBottomBadgeText, success: bottomBadgeIncremented };

    console.log("\n=== ALL PLAYWRIGHT TESTS COMPLETE ===");
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(QA_DIR, "phase1e_results.json"), JSON.stringify(results, null, 2));
    await browser.close();
    return results;
  } catch (err) {
    console.error("QA Execution Error:", err);
    await page.screenshot({ path: path.join(QA_DIR, "qa_error.png") });
    await browser.close();
    process.exit(1);
  }
}

runPhase1EQA();
