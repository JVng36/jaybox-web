import { test, expect } from '@playwright/test'

test('the labeled theme button toggles by keyboard without changing the selected page', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/#contact')
  const toggle = page.getByRole('button', { name: 'Switch to dark mode', exact: true })
  await expect(toggle).toHaveText('Dark mode')
  await expect(toggle.locator('svg')).toHaveAttribute('aria-hidden', 'true')
  await expect(toggle.locator('svg')).toHaveAttribute('focusable', 'false')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const lightToggle = page.getByRole('button', { name: 'Switch to light mode', exact: true })
  await expect(lightToggle).toHaveText('Light mode')
  await expect(lightToggle).toBeFocused()
  await expect(page.getByRole('heading', { name: 'Contact me', exact: true })).toBeVisible()
  await page.keyboard.press('Space')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

for (const theme of ['light', 'dark']) {
  test(`theme toggle has a visible keyboard focus ring in the ${theme} palette`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    await page.getByRole('tab', { selected: true }).focus()
    await page.keyboard.press('Tab')
    const toggle = page.locator('.theme-toggle')
    await expect(toggle).toBeVisible()
    await expect(toggle).toBeFocused()
    expect(await toggle.evaluate(button => button.matches(':focus-visible'))).toBe(true)
    await expect(toggle).toHaveCSS('outline-style', 'solid')
    await expect(toggle).toHaveCSS('outline-width', '2px')
    await expect(toggle).toHaveCSS('outline-offset', '4px')
    await expect(toggle).toHaveCSS('outline-color', theme === 'dark' ? 'rgb(223, 175, 143)' : 'rgb(116, 68, 46)')
  })
}

for (const width of [320, 390, 1440]) {
  test(`theme button sits below the menu at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const button = page.locator('.theme-toggle')
    const bounds = await button.boundingBox()
    expect(bounds, 'the theme button exists').not.toBeNull()
    const tabs = await page.getByRole('tablist').boundingBox()
    expect(bounds.y).toBeGreaterThan(tabs.y + tabs.height)
    expect(bounds.height).toBeGreaterThanOrEqual(44)
    if (width <= 760) expect(bounds.x + bounds.width).toBeCloseTo(tabs.x + tabs.width, 0)
    else expect(bounds.x).toBeCloseTo(tabs.x, 0)
    await expect(page.getByRole('tablist').getByRole('button')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

for (const systemTheme of ['light', 'dark']) {
  test(`a manual choice overrides ${systemTheme} system mode and survives reload`, async ({ page }) => {
    const chosenTheme = systemTheme === 'dark' ? 'light' : 'dark'
    await page.emulateMedia({ colorScheme: systemTheme })
    await page.goto('/')
    await page.getByRole('button', { name: `Switch to ${chosenTheme} mode`, exact: true }).click()
    expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe(chosenTheme)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', chosenTheme)
    await expect(page.getByRole('button', { name: `Switch to ${systemTheme} mode`, exact: true })).toBeVisible()
  })
}

test('device theme changes apply only until the visitor makes a choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Switch to dark mode', exact: true })).toBeVisible()
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('a first visit follows the device color scheme', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await expect(page.locator('html')).toHaveCSS('color-scheme', theme)
    await expect(page.locator('body')).toHaveCSS('background-color', theme === 'dark' ? 'rgb(29, 27, 25)' : 'rgb(238, 234, 228)')
    await expect(page.locator('main')).toHaveCSS('background-color', theme === 'dark' ? 'rgb(40, 37, 34)' : 'rgb(255, 254, 251)')
  }
})
