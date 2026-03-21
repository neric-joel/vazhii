# -*- coding: utf-8 -*-
"""Reconnaissance: step through the entire intake form."""
from playwright.sync_api import sync_playwright

LIVE_URL = 'https://vazhii.vercel.app'

def dump_form_state(page, label):
    elements = page.evaluate("""
        () => {
            const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
                text: b.textContent.trim().slice(0, 60),
                disabled: b.disabled,
            }));
            const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
                tag: el.tagName.toLowerCase(),
                type: el.type || '',
                id: el.id || '',
                options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => o.value).slice(0, 5) : []
            }));
            // Also grab any clickable option cards (divs with onClick behavior)
            const cards = Array.from(document.querySelectorAll('[role="button"], label[class*="cursor"], div[class*="cursor-pointer"]')).map(el => ({
                text: el.textContent.trim().slice(0, 60),
                tag: el.tagName.toLowerCase(),
                role: el.getAttribute('role') || ''
            }));
            const h2 = document.querySelector('h2, h3')?.textContent?.trim() || '';
            const step = document.querySelector('[class*="step"], [class*="Step"]')?.textContent?.trim() || '';
            return { buttons, inputs, cards, h2, step };
        }
    """)
    print(f"\n--- {label} ---")
    print(f"  Heading: {elements['h2']}")
    print(f"  Buttons: {[(b['text'], b['disabled']) for b in elements['buttons']]}")
    print(f"  Inputs: {[(i['tag'], i['type'], i['id']) for i in elements['inputs']]}")
    if elements['cards']:
        print(f"  Cards/Labels: {[c['text'][:40] for c in elements['cards'][:6]]}")
    return elements

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})

        page.goto(LIVE_URL + '/intake')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(800)

        dump_form_state(page, "Step 1 (initial)")

        # Fill age and state
        page.fill('#age', '19')
        # Select first non-empty state
        page.select_option('#state', 'AZ')
        page.wait_for_timeout(300)
        dump_form_state(page, "Step 1 (filled)")
        page.screenshot(path='/tmp/r2_step1.png')

        # Click Continue
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(800)
        dump_form_state(page, "Step 2")
        page.screenshot(path='/tmp/r2_step2.png')

        # Try clicking the first clickable option card
        try:
            first_card = page.locator('label[class*="cursor"], div[class*="cursor-pointer"]').first
            first_card.click()
            page.wait_for_timeout(300)
        except:
            pass

        dump_form_state(page, "Step 2 (after selection)")
        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(800)
        dump_form_state(page, "Step 3")
        page.screenshot(path='/tmp/r2_step3.png')

        try:
            first_card = page.locator('label[class*="cursor"], div[class*="cursor-pointer"]').first
            first_card.click()
            page.wait_for_timeout(300)
        except:
            pass

        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(800)
        dump_form_state(page, "Step 4")
        page.screenshot(path='/tmp/r2_step4.png')

        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(800)
        dump_form_state(page, "Step 5")
        page.screenshot(path='/tmp/r2_step5.png')

        page.locator('button:has-text("Continue")').click()
        page.wait_for_timeout(800)
        dump_form_state(page, "Step 6 / Review")
        page.screenshot(path='/tmp/r2_step6.png')

        browser.close()
        print("\nDone. Screenshots at /tmp/r2_*.png")

if __name__ == '__main__':
    run()
