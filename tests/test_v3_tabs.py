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

    # 1. Homepage
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    has_get_plan = page.get_by_text("Get My Plan").count() > 0
    has_try_demo = page.get_by_text("Try Demo").count() > 0
    log(PASS if has_get_plan else FAIL, f"Homepage: Get My Plan present: {has_get_plan}")
    log(PASS if has_try_demo else FAIL, f"Homepage: Try Demo present: {has_try_demo}")

    # 2. Try Demo - all 5 tabs should be pre-populated
    page.get_by_text("Try Demo").first.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)

    url_is_dashboard = "/dashboard" in page.url
    has_tab_bar = page.get_by_text("Overview").count() > 0
    has_funding_tab = page.get_by_text("Funding").count() > 0
    has_schools_tab = page.get_by_text("Schools").count() > 0
    has_action_tab = page.get_by_text("Action Plan").count() > 0
    has_roadmap_tab = page.get_by_text("Roadmap").count() > 0
    has_key_insight = page.get_by_text("Key Insight", exact=False).count() > 0
    has_readiness = page.get_by_text("Readiness", exact=False).count() > 0
    has_demo_banner = page.get_by_text("Demo Mode", exact=False).count() > 0

    log(PASS if url_is_dashboard else FAIL, f"Try Demo -> /dashboard: {page.url}")
    log(PASS if has_tab_bar else FAIL, f"Overview tab visible: {has_tab_bar}")
    log(PASS if has_funding_tab else FAIL, f"Funding tab visible: {has_funding_tab}")
    log(PASS if has_schools_tab else FAIL, f"Schools tab visible: {has_schools_tab}")
    log(PASS if has_action_tab else FAIL, f"Action Plan tab visible: {has_action_tab}")
    log(PASS if has_roadmap_tab else FAIL, f"Roadmap tab visible: {has_roadmap_tab}")
    log(PASS if has_demo_banner else FAIL, f"Demo Mode banner: {has_demo_banner}")
    log(PASS if has_key_insight else FAIL, f"Key Insight on Overview: {has_key_insight}")
    log(PASS if has_readiness else FAIL, f"Readiness Snapshot on Overview: {has_readiness}")

    # 3. Demo: Funding tab shows programs
    page.get_by_text("Funding").first.click()
    page.wait_for_timeout(500)
    funding_loaded = (
        page.get_by_text("Pell Grant", exact=False).count() > 0 or
        page.get_by_text("ETV", exact=False).count() > 0 or
        page.get_by_text("Tuition Waiver", exact=False).count() > 0
    )
    log(PASS if funding_loaded else FAIL, f"Demo Funding tab shows programs: {funding_loaded}")

    # 4. Demo: Schools tab shows matches
    page.get_by_text("Schools").first.click()
    page.wait_for_timeout(500)
    schools_loaded = (
        page.get_by_text("Mesa Community College", exact=False).count() > 0 or
        page.get_by_text("Strong match", exact=False).count() > 0 or
        page.get_by_text("Good match", exact=False).count() > 0
    )
    log(PASS if schools_loaded else FAIL, f"Demo Schools tab shows matches: {schools_loaded}")

    # 5. Demo: Roadmap tab shows phases
    page.get_by_text("Roadmap").first.click()
    page.wait_for_timeout(500)
    roadmap_loaded = (
        page.get_by_text("Pre-enrollment", exact=False).count() > 0 or
        page.get_by_text("Semester", exact=False).count() > 0
    )
    log(PASS if roadmap_loaded else FAIL, f"Demo Roadmap tab shows phases: {roadmap_loaded}")

    # 6. Real intake - no API call on submit (instant navigation)
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.get_by_text("Get My Plan").first.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(300)

    page.locator("input[type='number']").first.fill("20")
    page.wait_for_timeout(200)
    page.get_by_text("Continue").click()
    page.wait_for_timeout(300)

    # Step 2 - education goal
    btns = page.locator("button").all()
    for btn in btns:
        txt = btn.inner_text().lower()
        if "college" in txt or "university" in txt or "trade" in txt:
            btn.click()
            break
    page.wait_for_timeout(200)
    page.get_by_text("Continue").click()
    page.wait_for_timeout(300)

    # Step 3 - timeline
    page.get_by_text("Just aged out", exact=False).first.click()
    page.wait_for_timeout(200)
    page.get_by_text("Continue").click()
    page.wait_for_timeout(200)

    # Steps 4 and 5 - skip
    page.get_by_text("Continue").click()
    page.wait_for_timeout(200)
    page.get_by_text("Continue").click()
    page.wait_for_timeout(200)

    # Step 6 - submit (V3: no API call, instant navigation)
    console_logs.clear()
    t0 = __import__("time").time()
    page.get_by_text("Get My Plan").last.click()
    page.wait_for_timeout(800)
    navigate_time = __import__("time").time() - t0

    on_dashboard = "/dashboard" in page.url
    log(PASS if on_dashboard else FAIL, f"V3: Instant navigate to /dashboard in {navigate_time:.1f}s: {page.url}")
    log(PASS if navigate_time < 3.0 else FAIL, f"V3: Navigation was instant (<3s): {navigate_time:.1f}s")

    # Overview should be loading
    has_skeleton = page.locator("[class*='animate-pulse']").count() > 0
    loading_text = page.get_by_text("Analyzing", exact=False).count() > 0
    log(PASS if (has_skeleton or loading_text) else FAIL,
        f"V3: Overview skeleton visible: skeleton={has_skeleton}, text={loading_text}")

    # Wait up to 60s for overview to complete
    try:
        page.wait_for_selector("text=Key Insight", timeout=60000)
    except Exception:
        pass
    page.wait_for_timeout(1000)

    overview_content = (
        page.get_by_text("Key Insight", exact=False).count() > 0 or
        page.get_by_text("Readiness Snapshot", exact=False).count() > 0 or
        page.get_by_text("Funding You May Qualify", exact=False).count() > 0
    )
    api_ok = any("[Vazhi] Overview succeeded" in l for l in console_logs)

    log(PASS if overview_content else FAIL, f"V3: Overview content rendered: {overview_content}")
    log(PASS if api_ok else FAIL, f"V3: Overview API call succeeded: {api_ok}")

    vazhi_logs = [l for l in console_logs if "Vazhi" in l or "vazhi" in l.lower()]
    if vazhi_logs:
        print("\n--- [Vazhi] Console logs ---")
        for l in vazhi_logs:
            print(" ", l)

    # 7. On-demand Funding tab shows SectionIntro (not yet generated)
    page.get_by_text("Funding").first.click()
    page.wait_for_timeout(500)
    has_section_cta = (
        page.get_by_text("Show My Funding Details", exact=False).count() > 0 or
        page.get_by_text("Your Funding Details", exact=False).count() > 0
    )
    log(PASS if has_section_cta else FAIL, f"V3: Funding tab shows SectionIntro: {has_section_cta}")

    # 8. Roadmap tab is gated on Schools
    page.get_by_text("Roadmap").first.click()
    page.wait_for_timeout(500)
    has_gate = (
        page.get_by_text("Generate your School Matches first", exact=False).count() > 0 or
        page.get_by_text("School Matches first", exact=False).count() > 0 or
        page.get_by_text("school matches first", exact=False).count() > 0
    )
    log(PASS if has_gate else FAIL, f"V3: Roadmap gated without school matches: {has_gate}")

    browser.close()

print("\n" + "="*50)
print("SUMMARY")
print("="*50)
for r in results:
    print(r)

failures = [r for r in results if r.startswith("[FAIL]")]
print(f"\n{len(results) - len(failures)}/{len(results)} checks passed")
if failures:
    sys.exit(1)
