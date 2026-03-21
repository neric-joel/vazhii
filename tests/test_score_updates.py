# -*- coding: utf-8 -*-
"""
Vazhi score update test on https://vazhii.vercel.app
Verifies that checking action steps changes scores, and unchecking reverts them.
"""
from playwright.sync_api import sync_playwright

LIVE_URL = 'https://vazhii.vercel.app'

def get_scores(page):
    """Extract score ring values and score bar values from the dashboard."""
    return page.evaluate("""
        () => {
            // Score rings: text-2xl font-bold spans inside the SVG containers
            const ringSpans = Array.from(document.querySelectorAll('span'))
                .filter(s => s.style.color && /^\\d+$/.test(s.textContent.trim())
                    && s.className && s.className.includes('text-2xl'));
            const rings = ringSpans.map(s => ({
                value: parseInt(s.textContent.trim()),
                label: s.closest('div[class*="flex flex-col"]')
                    ?.querySelector('p')?.textContent?.trim() || ''
            }));

            // Score bars: text-sm font-bold spans with inline color
            const barSpans = Array.from(document.querySelectorAll('span'))
                .filter(s => s.style.color && /^\\d+$/.test(s.textContent.trim())
                    && s.className && s.className.includes('font-bold')
                    && !s.className.includes('text-2xl'));
            const bars = barSpans.map(s => ({
                value: parseInt(s.textContent.trim()),
                label: ''
            }));

            return { rings, bars,
                ringsTotal: rings.reduce((a,b) => a+b.value, 0),
                barsTotal: bars.reduce((a,b) => a+b.value, 0)
            };
        }
    """)

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})

        print("=== VAZHI SCORE UPDATE TEST ===\n")

        # ── Landing page ───────────────────────────────────────────────────
        print("1. Loading landing page...")
        page.goto(LIVE_URL)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)
        page.screenshot(path='/tmp/t01_landing.png')
        print("   OK: Landing page loaded")

        # ── Navigate to intake via CTA ─────────────────────────────────────
        print("2. Clicking CTA to enter intake form...")
        page.locator('text=Get My Plan').first.click()
        page.wait_for_url('**/intake')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)
        print("   OK: On intake form")

        # ── Step 1: Age + State ─────────────────────────────────────────────
        print("3. Step 1 — filling age (19)...")
        page.locator('#age').fill('19')
        # State defaults to Arizona — don't need to change
        page.wait_for_timeout(200)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.screenshot(path='/tmp/t02_step2.png')
        print("   OK: Advanced to step 2")

        # ── Step 2: Education goal ──────────────────────────────────────────
        print("4. Step 2 — selecting Community College...")
        page.locator('button:has-text("Community College")').first.click()
        page.wait_for_timeout(200)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.screenshot(path='/tmp/t03_step3.png')
        print("   OK: Advanced to step 3")

        # ── Step 3: Timeline ────────────────────────────────────────────────
        print("5. Step 3 — selecting 'Just aged out'...")
        page.locator('button:has-text("Just aged out")').first.click()
        page.wait_for_timeout(200)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        print("   OK: Advanced to step 4")

        # ── Step 4: Documents (optional) ───────────────────────────────────
        print("6. Step 4 — skipping documents (optional)...")
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        print("   OK: Advanced to step 5")

        # ── Step 5: Benefits (optional) ────────────────────────────────────
        print("7. Step 5 — skipping benefits (optional)...")
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.screenshot(path='/tmp/t04_review.png')
        print("   OK: On review step")

        # ── Step 6: Submit ──────────────────────────────────────────────────
        print("8. Submitting form — waiting for Claude API or demo fallback...")
        submit_btn = page.locator('button:has-text("Get My Plan"), button:has-text("Submit"), button[type="submit"]').first
        submit_btn.click()

        print("   Waiting for dashboard (up to 45s)...")
        page.wait_for_url('**/dashboard', timeout=50000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(3500)  # Wait for score animations to complete
        page.screenshot(path='/tmp/t05_dashboard.png', full_page=True)
        print("   OK: Dashboard loaded")

        # ── Record initial scores ───────────────────────────────────────────
        print("\n9. Recording initial scores...")
        initial = get_scores(page)
        print(f"   Rings: {initial['rings']}")
        print(f"   Bars: {initial['bars']}")
        print(f"   Ring total: {initial['ringsTotal']}  Bar total: {initial['barsTotal']}")

        # Check there's something to test — action steps use buttons with aria-label
        step_btns = page.locator('button[aria-label*="Mark step"]')
        btn_count = step_btns.count()
        print(f"   Action step toggle buttons: {btn_count}")

        if btn_count == 0:
            # Dump all buttons for debugging
            all_btns = page.evaluate("""
                () => Array.from(document.querySelectorAll('button')).map(b => ({
                    text: b.textContent.trim().slice(0, 40),
                    aria: b.getAttribute('aria-label') || ''
                }))
            """)
            print(f"   All buttons on page: {all_btns[:20]}")
            print("\n   FAIL: No step toggle buttons found on dashboard")
            browser.close()
            return False

        # ── Click first step toggle (mark complete) ─────────────────────────
        print("\n10. Clicking first step toggle (mark complete)...")
        step_btns.first.click()
        page.wait_for_timeout(2000)  # Wait for animation
        page.screenshot(path='/tmp/t06_checked.png', full_page=True)

        after_check = get_scores(page)
        print(f"    Rings: {after_check['rings']}")
        print(f"    Bars: {after_check['bars']}")
        print(f"    Ring total: {after_check['ringsTotal']}  Bar total: {after_check['barsTotal']}")

        rings_changed = initial['ringsTotal'] != after_check['ringsTotal']
        bars_changed = initial['barsTotal'] != after_check['barsTotal']

        if rings_changed:
            delta = after_check['ringsTotal'] - initial['ringsTotal']
            print(f"    PASS: Ring scores changed (delta={delta:+d})")
        else:
            print("    FAIL: Ring scores did NOT change")

        if bars_changed:
            delta = after_check['barsTotal'] - initial['barsTotal']
            print(f"    PASS: Bar scores changed (delta={delta:+d})")
        else:
            print("    FAIL: Bar scores did NOT change")

        # ── Click again to unmark and verify revert ─────────────────────────
        print("\n11. Clicking step toggle again (mark incomplete) — verifying revert...")
        # After clicking, aria-label changes to "Mark step N incomplete"
        step_btns_updated = page.locator('button[aria-label*="Mark step"]')
        step_btns_updated.first.click()
        page.wait_for_timeout(2000)
        page.screenshot(path='/tmp/t07_unchecked.png', full_page=True)

        after_uncheck = get_scores(page)
        print(f"    Rings: {after_uncheck['rings']}")
        print(f"    Bars: {after_uncheck['bars']}")

        rings_reverted = initial['ringsTotal'] == after_uncheck['ringsTotal']
        bars_reverted = initial['barsTotal'] == after_uncheck['barsTotal']

        if rings_reverted:
            print("    PASS: Ring scores reverted correctly")
        else:
            print(f"    FAIL: Ring scores did not revert (expected {initial['ringsTotal']}, got {after_uncheck['ringsTotal']})")

        if bars_reverted:
            print("    PASS: Bar scores reverted correctly")
        else:
            print(f"    FAIL: Bar scores did not revert (expected {initial['barsTotal']}, got {after_uncheck['barsTotal']})")

        # ── Final verdict ───────────────────────────────────────────────────
        print("\n=== RESULT ===")
        changed = rings_changed or bars_changed
        reverted = rings_reverted and bars_reverted
        passed = changed and reverted

        if passed:
            print("ALL TESTS PASSED -- Score updates working correctly on https://vazhii.vercel.app")
        else:
            if not changed:
                print("FAIL: Scores did not change when checking a step")
            if not reverted:
                print("FAIL: Scores did not revert when unchecking")

        browser.close()
        return passed

if __name__ == '__main__':
    ok = run_test()
    print("\nScreenshots: /tmp/t0*.png")
    exit(0 if ok else 1)
