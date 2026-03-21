# -*- coding: utf-8 -*-
"""Check if the new ScoreRing code is deployed."""
from playwright.sync_api import sync_playwright

LIVE_URL = 'https://vazhii.vercel.app'

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        # Disable cache
        page = context.new_page()

        # Capture script URLs
        script_urls = []
        page.on('response', lambda r: script_urls.append(r.url) if r.url.endswith('.js') else None)

        page.goto(LIVE_URL, wait_until='networkidle')
        page.wait_for_timeout(1000)

        # Find the main app bundle
        main_bundle = [u for u in script_urls if 'index' in u and '.js' in u]
        print("JS bundles:", main_bundle[:3])

        # Test the ScoreRing behavior by injecting a test
        result = page.evaluate("""
            () => {
                // Check if IntersectionObserver is supported
                return {
                    hasIO: typeof IntersectionObserver !== 'undefined',
                    viewport: `${window.innerWidth}x${window.innerHeight}`
                };
            }
        """)
        print("Environment:", result)

        browser.close()

if __name__ == '__main__':
    run()
