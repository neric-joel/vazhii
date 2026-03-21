# -*- coding: utf-8 -*-
"""Reconnaissance: inspect the live intake form DOM structure."""
from playwright.sync_api import sync_playwright

LIVE_URL = 'https://vazhii.vercel.app'

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})

        # Landing
        page.goto(LIVE_URL)
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/recon_01_landing.png')
        print("Landing page loaded")

        # Click CTA
        cta = page.locator('text=Get My Plan').first
        cta.click()
        page.wait_for_url('**/intake')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
        page.screenshot(path='/tmp/recon_02_intake.png')
        print("Intake page loaded")

        # Dump all buttons and inputs
        elements = page.evaluate("""
            () => {
                const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
                    tag: 'button',
                    text: b.textContent.trim().slice(0, 60),
                    type: b.type,
                    disabled: b.disabled,
                    class: b.className.slice(0, 80)
                }));
                const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
                    tag: el.tagName.toLowerCase(),
                    type: el.type || '',
                    name: el.name || '',
                    placeholder: el.placeholder || '',
                    id: el.id || '',
                    value: el.value || ''
                }));
                return { buttons, inputs };
            }
        """)

        print("\n=== BUTTONS ===")
        for b in elements['buttons']:
            print(f"  [{b['type']}] '{b['text']}' disabled={b['disabled']}")

        print("\n=== INPUTS ===")
        for inp in elements['inputs']:
            print(f"  <{inp['tag']} type={inp['type']} id={inp['id']} placeholder={inp['placeholder']}>")

        browser.close()

if __name__ == '__main__':
    run()
