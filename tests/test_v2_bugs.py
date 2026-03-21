import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

PASS = "[PASS]"
FAIL = "[FAIL]"
results = []

def log(icon, msg):
    line = f"{icon} {msg}"
    results.append(line)
    print(line)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

    # ── 1. Homepage ──────────────────────────────────────────────────────────
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")

    hero_text = page.locator("h1").first.inner_text()
    has_get_plan = page.get_by_text("Get My Plan").count() > 0
    has_try_demo = page.get_by_text("Try Demo").count() > 0

    log(PASS if "Path" in hero_text or "வழி" in hero_text else FAIL,
        f"Homepage hero: '{hero_text[:60]}'")
    log(PASS if has_get_plan else FAIL, f"'Get My Plan →' button present: {has_get_plan}")
    log(PASS if has_try_demo else FAIL, f"'Try Demo' button present: {has_try_demo}")

    # ── 2. Try Demo ──────────────────────────────────────────────────────────
    page.get_by_text("Try Demo").first.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)

    url_is_dashboard = "/dashboard" in page.url
    has_key_insight = page.get_by_text("Key Insight", exact=False).count() > 0
    has_readiness = page.get_by_text("Readiness", exact=False).count() > 0
    has_school = page.get_by_text("School Match", exact=False).count() > 0
    has_demo_banner = page.get_by_text("Demo Mode", exact=False).count() > 0

    log(PASS if url_is_dashboard else FAIL, f"Try Demo → /dashboard: {page.url}")
    log(PASS if has_demo_banner else FAIL, f"Demo Mode banner visible: {has_demo_banner}")
    log(PASS if has_key_insight else FAIL, f"Key Insight section present: {has_key_insight}")
    log(PASS if has_readiness else FAIL, f"Readiness section present: {has_readiness}")
    log(PASS if has_school else FAIL, f"School Matches present: {has_school}")

    # ── 3. Intake Step 1 ─────────────────────────────────────────────────────
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.get_by_text("Get My Plan").first.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(500)

    on_intake = "/intake" in page.url
    log(PASS if on_intake else FAIL, f"Navigated to /intake: {page.url}")

    # Set age to 20
    age_input = page.locator("input[type='number']").first
    age_input.fill("20")
    page.wait_for_timeout(300)

    # Click Continue
    page.get_by_text("Continue").click()
    page.wait_for_timeout(500)

    step2_visible = page.get_by_text("education", exact=False).count() > 0 or \
                    page.get_by_text("goal", exact=False).count() > 0 or \
                    page.get_by_text("Step 2", exact=False).count() > 0
    log(PASS if step2_visible else FAIL, f"Moved to Step 2: {step2_visible}")

    # ── 4. Step 2 — Pick education goal ──────────────────────────────────────
    # Click first available option card
    option_btns = page.locator("button").filter(has_text="college").all()
    if not option_btns:
        option_btns = page.locator("button").all()
    if len(option_btns) > 1:
        # Skip Back button, click first option card
        option_btns[1].click()
    page.wait_for_timeout(300)
    page.get_by_text("Continue").click()
    page.wait_for_timeout(500)

    step3_visible = page.get_by_text("process", exact=False).count() > 0 or \
                    page.get_by_text("aged", exact=False).count() > 0 or \
                    page.get_by_text("Step 3", exact=False).count() > 0
    log(PASS if step3_visible else FAIL, f"Moved to Step 3: {step3_visible}")

    # ── 5. Step 3 — Timeline pre-selection bug check ──────────────────────────
    page.wait_for_timeout(300)

    # Check Continue button state before selecting anything
    continue_btn = page.get_by_text("Continue →").first
    is_disabled_before = continue_btn.is_disabled()

    # Check if any option appears selected (border-[#0F6E56] class indicates selected)
    selected_options = page.locator("button.border-\\[\\#0F6E56\\]").count()

    log(PASS if is_disabled_before else FAIL,
        f"BUG 2: Continue DISABLED before selection: {is_disabled_before}")
    log(PASS if selected_options == 0 else FAIL,
        f"BUG 2: No option pre-selected (selected count = {selected_options})")

    # Now click "Just aged out"
    page.get_by_text("Just aged out", exact=False).click()
    page.wait_for_timeout(300)

    is_enabled_after = not continue_btn.is_disabled()
    log(PASS if is_enabled_after else FAIL,
        f"Continue ENABLED after selecting 'Just aged out': {is_enabled_after}")

    page.get_by_text("Continue →").click()
    page.wait_for_timeout(500)

    # ── 6. Steps 4 & 5 — Skip ────────────────────────────────────────────────
    page.get_by_text("Continue →").click()
    page.wait_for_timeout(300)
    page.get_by_text("Continue →").click()
    page.wait_for_timeout(300)

    on_review = page.get_by_text("Review", exact=False).count() > 0 or \
                page.get_by_text("Get My Plan", exact=False).count() > 0
    log(PASS if on_review else FAIL, f"Reached Review step: {on_review}")

    # ── 7. Submit & check real API vs demo ───────────────────────────────────
    console_logs.clear()
    page.get_by_text("Get My Plan →").last.click()

    # Wait for loading skeleton to appear
    page.wait_for_timeout(1000)
    skeleton_visible = page.locator("[class*='animate-pulse']").count() > 0 or \
                       page.get_by_text("Building", exact=False).count() > 0
    log(PASS if skeleton_visible else FAIL, f"Loading skeleton appeared: {skeleton_visible}")

    # Wait up to 45s for dashboard
    try:
        page.wait_for_url("**/dashboard", timeout=130000)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1000)
    except:
        pass

    on_dashboard = "/dashboard" in page.url
    api_succeeded = any("[Vazhi] API call succeeded" in l for l in console_logs)
    used_demo = any("demo fallback" in l for l in console_logs)
    has_demo_banner_real = page.get_by_text("Demo Mode", exact=False).count() > 0

    log(PASS if on_dashboard else FAIL, f"Dashboard loaded: {page.url}")
    log(PASS if api_succeeded else FAIL, f"BUG 1: Real API succeeded (not demo): {api_succeeded}")
    log(PASS if not has_demo_banner_real else FAIL,
        f"No demo banner on real result: {not has_demo_banner_real}")

    # Print relevant console logs
    vazhi_logs = [l for l in console_logs if "Vazhi" in l or "vazhi" in l.lower()]
    if vazhi_logs:
        print("\n--- [Vazhi] Console logs ---")
        for l in vazhi_logs:
            print(" ", l)
    else:
        print("\n--- No [Vazhi] console logs captured ---")

    browser.close()

print("\n" + "="*50)
print("SUMMARY")
print("="*50)
for r in results:
    print(r)

failures = [r for r in results if r.startswith("❌")]
print(f"\n{len(results) - len(failures)}/{len(results)} checks passed")
if failures:
    sys.exit(1)
