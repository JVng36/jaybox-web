import { test, expect } from '@playwright/test'

for (const preference of [null, 'dark', 'light', 'invalid-theme']) {
  test(`theme is resolved before React loads with saved preference ${preference}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    if (preference !== null) {
      await page.addInitScript(value => localStorage.setItem('portfolio-theme', value), preference)
    }
    await page.route('**/src/main.jsx', route => route.abort())
    await page.goto('/')
    await expect(page.locator('#root')).toBeEmpty()
    await expect(page.locator('html')).toHaveAttribute('data-theme', preference === 'light' ? 'light' : 'dark')
  })
}

for (const initialTheme of ['light', 'dark']) {
  for (const preference of [null, initialTheme]) {
    test(`device theme changes before React loads from ${initialTheme} with saved preference ${preference}`, async ({ page }) => {
      const currentTheme = initialTheme === 'light' ? 'dark' : 'light'
      await page.emulateMedia({ colorScheme: initialTheme })
      if (preference !== null) {
        await page.addInitScript(value => localStorage.setItem('portfolio-theme', value), preference)
      }
      let resumeReact
      const reactPaused = new Promise(resolve => { resumeReact = resolve })
      await page.route('**/src/main.jsx', async route => {
        await reactPaused
        await route.continue()
      })
      try {
        await page.goto('/', { waitUntil: 'commit' })
        await expect(page.locator('html')).toHaveAttribute('data-theme', initialTheme)
        await expect(page.locator('#root')).toBeEmpty()
        await page.emulateMedia({ colorScheme: currentTheme })
        expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)).toBe(currentTheme === 'dark')
        // Let the media change event finish while React is still paused.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        await expect(page.locator('html')).toHaveAttribute('data-theme', initialTheme)
      } finally {
        resumeReact()
      }
      const expectedTheme = preference ?? currentTheme
      const actionTheme = expectedTheme === 'dark' ? 'light' : 'dark'
      await expect(page.locator('.theme-toggle')).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('data-theme', expectedTheme)
      await expect(page.locator('html')).toHaveCSS('color-scheme', expectedTheme)
      await expect(page.locator('body')).toHaveCSS('background-color', expectedTheme === 'dark' ? 'rgb(29, 27, 25)' : 'rgb(238, 234, 228)')
      await expect(page.getByRole('button', { name: `Switch to ${actionTheme} mode`, exact: true })).toHaveText(actionTheme === 'dark' ? 'Dark mode' : 'Light mode')
      await expect(page.locator('html')).toHaveAttribute('data-theme-preference', preference ?? 'system')
      expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe(preference)
    })
  }
}

for (const failure of ['read', 'write']) {
  test(`theme switching works when storage ${failure} is blocked`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(mode => {
      if (mode === 'read') {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
      } else {
        Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError') }
      }
    }, failure)
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.emulateMedia({ colorScheme: 'light' })
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })
}

for (const width of [320, 390, 1440]) {
  test(`dark pages retain content and layout at ${width}px`, async ({ page }, testInfo) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.locator('.notes-toggle').first().click()
    for (const section of ['About me', 'Contact', 'Projects']) {
      await page.getByRole('tab', { name: section, exact: true }).click()
      await expect(page.getByRole('tabpanel', { name: section, exact: true })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    await expect(page.locator('.project-notes').first()).toBeVisible()
    await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
    await expect(page.locator('.project-notes').first()).toBeVisible()
    await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
    await page.getByRole('tab', { name: 'Contact', exact: true }).click()
    await expect(page.locator('#contact a svg')).toHaveCount(3)
    await page.screenshot({ path: testInfo.outputPath('dark-contact.png'), fullPage: true })
    expect(errors).toEqual([])
  })
}

for (const theme of ['light', 'dark']) {
  test(`${theme} palette text colors meet normal-text contrast`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    const ratios = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      function luminance(name) {
        const hex = style.getPropertyValue(`--${name}`).trim()
        const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
      }
      // These are the foreground/background combinations used by the page.
      return [['ink', 'paper'], ['muted', 'paper'], ['accent', 'paper'],
        ['muted', 'desk'], ['accent', 'desk'], ['ink', 'selection'], ['accent', 'selection']]
        .map(([foreground, background]) => {
          const [low, high] = [luminance(foreground), luminance(background)].sort((a, b) => a - b)
          return { foreground, background, ratio: (high + 0.05) / (low + 0.05) }
        })
    })
    for (const { foreground, background, ratio } of ratios) {
      expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })
}
