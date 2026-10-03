import urllib.request

BASE_URL = "http://localhost:3000"

routes = [
    # Core pages
    "/",
    "/cart",
    "/checkout",
    "/login",
    "/register",
    "/wishlist",
    "/orders",
    "/product/1",
    "/privacy",
    "/terms",
    "/admin",
    "/admin/dashboard",
    "/admin/products",
    "/admin/orders",
    
    # Header & Mega-Menu categories
    "/category/all",
    "/category/boys-fashion",
    "/category/girls-fashion",
    "/category/footwear",
    "/category/toys",
    "/category/diapering",
    "/category/gear",
    "/category/feeding",
    "/category/bath-skincare",
    "/category/nursery",
    "/category/health-safety",
    "/category/school-essentials",
    
    # Mega-menu price filters & collections
    "/category/all?max_price=499",
    "/category/all?max_price=999",
    "/category/all?max_price=1499",
    "/category/all?max_price=2499",
    "/category/all?sort=popular",
    "/deals",
    "/deals?tab=new",
    "/deals?tab=combos",
    
    # Shop by Age links
    "/age/new-born",
    "/age/0-3-months",
    "/age/3-6-months",
    "/age/6-9-months",
    "/age/9-12-months",
    "/age/12-18-months",
    "/age/18-24-months",
    "/age/2-4-years",
    "/age/4-6-years",
    "/age/6-8-years",
    "/age/8-plus-years",
    
    # Account & auxiliary routes
    "/account/child",
    "/reorder",
    "/newborn-checklist",
    "/orders/1",
]

print(f"Testing {len(routes)} URLs against Next.js shell...")
results = []
all_ok = True

for r in routes:
    url = f"{BASE_URL}{r}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = resp.read().decode("utf-8", errors="ignore")
            # Verify the shell is rendered (header skyB logo and footer present)
            has_shell = "skyB" in body and "footer" in body.lower()
            results.append((r, status, "PASS" if (status == 200 and has_shell) else "FAIL (Missing shell)"))
            if status != 200 or not has_shell:
                all_ok = False
    except Exception as e:
        results.append((r, 500, f"FAIL: {str(e)}"))
        all_ok = False

print("\n| URL | Status | Result |")
print("| --- | --- | --- |")
for path, status, res in results:
    print(f"| `{path}` | {status} | {res} |")

print("\nOVERALL STATUS:", "ALL PASSED (0 errors, 0 404s)" if all_ok else "SOME FAILED")
