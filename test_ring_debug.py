# -*- coding: utf-8 -*-
"""Debug rings on production domain after redeployment."""
from playwright.sync_api import sync_playwright

LIVE_URL = 'https://vazhii.vercel.app'

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})

        page.goto(LIVE_URL, wait_until='networkidle')
        page.wait_for_timeout(1000)

        # Navigate to intake
        page.locator('text=Get My Plan').first.click()
        page.wait_for_url('**/intake', timeout=15000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)

        # Step 1
        page.locator('#age').fill('19')
        page.wait_for_timeout(300)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(600)

        # Step 2
        page.locator('button:has-text("Community College")').first.click()
        page.wait_for_timeout(300)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(600)

        # Step 3
        page.locator('button:has-text("Just aged out")').first.click()
        page.wait_for_timeout(300)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(600)

        # Steps 4 & 5 (optional)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(600)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(600)

        # Submit
        page.locator('button:has-text("Get My Plan")').last.click()
        page.wait_for_url('**/dashboard', timeout=50000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(4000)  # Wait for animations

        def get_spans(p):
            return p.evaluate("""
                () => Array.from(document.querySelectorAll('span[style*="color"]'))
                    .filter(s => /^\\d+$/.test(s.textContent.trim()))
                    .map(s => ({text: s.textContent.trim(), cls: s.className.slice(0,35), color: s.style.color}))
            """)

        print("BEFORE click:")
        before = get_spans(page)
        for s in before:
            mark = 'RING' if 'text-2xl' in s['cls'] else 'BAR '
            print(f"  [{mark}] {s['text']:3} | {s['color']}")

        step_btn = page.locator('button[aria-label*="Mark step"]').first
        label = step_btn.get_attribute('aria-label')
        print(f"\nClicking: {label}")
        step_btn.click()
        page.wait_for_timeout(2500)

        print("\nAFTER click:")
        after = get_spans(page)
        for s in after:
            mark = 'RING' if 'text-2xl' in s['cls'] else 'BAR '
            print(f"  [{mark}] {s['text']:3} | {s['color']}")

        print("\n=== VERDICT ===")
        before_ring = [(s['text']) for s in before if 'text-2xl' in s['cls']]
        after_ring = [(s['text']) for s in after if 'text-2xl' in s['cls']]
        before_bar = [(s['text']) for s in before if 'text-2xl' not in s['cls']]
        after_bar = [(s['text']) for s in after if 'text-2xl' not in s['cls']]

        print(f"Ring texts: {before_ring} -> {after_ring}  CHANGED={before_ring != after_ring}")
        print(f"Bar texts:  {before_bar} -> {after_bar}  CHANGED={before_bar != after_bar}")

        browser.close()

if __name__ == '__main__':
    run()
