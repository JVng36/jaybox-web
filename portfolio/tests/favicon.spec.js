import { test, expect } from '@playwright/test'

test('the portfolio uses a self-contained J favicon', async ({ page }) => {
  await page.goto('/')
  const icon = page.locator('link[rel="icon"]')
  await expect(icon).toHaveCount(1)
  await expect(icon).toHaveAttribute('type', 'image/svg+xml')
  await expect(icon).toHaveAttribute('href', /\/favicon-j[^/]*\.svg$/)
  const href = await icon.getAttribute('href')
  const response = await page.request.get(href)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('image/svg+xml')
  const svg = await response.text()
  const details = await page.evaluate(source => {
    const document = new DOMParser().parseFromString(source, 'image/svg+xml')
    return {
      error: document.querySelector('parsererror') !== null,
      title: document.querySelector('title')?.textContent,
      viewBox: document.documentElement.getAttribute('viewBox'),
      paths: document.querySelectorAll('path').length,
      external: document.querySelectorAll('script, image, use, foreignObject, text, [href]').length,
    }
  }, svg)
  expect(details).toEqual({ error: false, title: 'J', viewBox: '0 0 64 64', paths: 1, external: 0 })
  const decoded = await page.evaluate(async url => {
    const image = new Image()
    image.src = url
    await image.decode()
    return { width: image.naturalWidth, height: image.naturalHeight }
  }, href)
  expect(decoded).toEqual({ width: 64, height: 64 })
})
