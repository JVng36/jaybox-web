import { test, expect } from '@playwright/test'

test('Contact introduces the page with Contact me', async ({ page }) => {
  await page.goto('/#contact')
  await expect(page.getByRole('heading', { name: 'Contact me', exact: true })).toBeVisible()
})

test('Contact uses matching icons with labeled profile and email links', async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#contact')
    const contact = page.getByRole('tabpanel', { name: 'Contact', exact: true })
    for (const [name, href] of [
      ['LinkedIn', 'https://www.linkedin.com/in/jvang75/'],
      ['GitHub', 'https://github.com/JVng36'],
      ['vangjay36@gmail.com', 'mailto:vangjay36@gmail.com'],
    ]) {
      const link = contact.getByRole('link', { name, exact: true })
      await expect(link).toHaveAttribute('href', href)
      const icon = link.locator('svg')
      await expect(icon).toBeVisible()
      await expect(icon).toHaveAttribute('aria-hidden', 'true')
      await expect(icon).toHaveAttribute('focusable', 'false')
      const bounds = await icon.boundingBox()
      expect(bounds.width).toBeGreaterThanOrEqual(20)
      expect(bounds.height).toBeGreaterThanOrEqual(20)
      await link.focus()
      await expect(link).toBeFocused()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('the sidebar note is blank until Jay supplies new copy', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.small-note')).toHaveText('')
  await expect(page.getByText('Built a little at a time.', { exact: true })).toHaveCount(0)
})
