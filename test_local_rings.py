# -*- coding: utf-8 -*-
"""Test ScoreRing fix on localhost dev server."""
from playwright.sync_api import sync_playwright

LOCAL_URL = 'http://localhost:5174'

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})

        page.goto(LOCAL_URL)
        page.wait_for_load_state('networkidle')
        page.locator('text=Get My Plan').first.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(500)

        # Fill form
        page.locator('#age').fill('19')
        page.wait_for_timeout(200)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.locator('button:has-text("Community College")').first.click()
        page.wait_for_timeout(200)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.locator('button:has-text("Just aged out")').first.click()
        page.wait_for_timeout(200)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(500)

        # Click Get My Plan button
        page.locator('button:has-text("Get My Plan")').last.click()

        # Wait for dashboard content (not URL change - which was timing out)
        # Wait for the ReadinessSnapshot heading or a ScoreRing to appear
        print("Waiting for dashboard (up to 30s)...")
        page.wait_for_selector('text=Your Readiness Snapshot', timeout=30000)
        page.wait_for_timeout(3500)  # Let animations finish
        page.screenshot(path='/tmp/local_dashboard.png', full_page=True)
        print("Dashboard loaded!")

        def get_spans(p):
            return p.evaluate("""
                () => Array.from(document.querySelectorAll('span[style*="color"]'))
                    .filter(s => /^\\d+$/.test(s.textContent.trim()))
                    .map(s => ({text: s.textContent.trim(), cls: s.className.slice(0,35), color: s.style.color}))
            """)

        print("\nBEFORE click:")
        before = get_spans(page)
        for s in before:
            mark = 'RING' if 'text-2xl' in s['cls'] else 'BAR '
            print(f"  [{mark}] {s['text']:3} | {s['color']}")

        step_btns = page.locator('button[aria-label*="Mark step"]')
        count = step_btns.count()
        print(f"\nAction step buttons: {count}")
        if count == 0:
            print("No step buttons found!")
            browser.close()
            return

        label = step_btns.first.get_attribute('aria-label')
        print(f"Clicking: {label}")
        step_btns.first.click()
        page.wait_for_timeout(2000)

        print("\nAFTER click:")
        after = get_spans(page)
        for s in after:
            mark = 'RING' if 'text-2xl' in s['cls'] else 'BAR '
            print(f"  [{mark}] {s['text']:3} | {s['color']}")

        before_ring = [s['text'] for s in before if 'text-2xl' in s['cls']]
        after_ring = [s['text'] for s in after if 'text-2xl' in s['cls']]
        before_bar = [s['text'] for s in before if 'text-2xl' not in s['cls']]
        after_bar = [s['text'] for s in after if 'text-2xl' not in s['cls']]

        print(f"\nRing texts: {before_ring} -> {after_ring}  CHANGED={before_ring != after_ring}")
        print(f"Bar texts:  {before_bar} -> {after_bar}  CHANGED={before_bar != after_bar}")

        browser.close()

if __name__ == '__main__':
    run()
