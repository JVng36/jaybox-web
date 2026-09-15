import { test, expect } from '@playwright/test'

const workTitle = 'Projects'

test('shares the work title between the tab and its heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('tab', { name: workTitle, exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: workTitle, level: 2 })).toBeVisible()
})

test('project notes stay open when switching away and back', async ({ page }) => {
  await page.goto('/')
  const detail = page.locator('.project-notes').first()
  const summary = page.getByRole('button', { name: 'Read my notes', exact: true }).first()
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(detail).toBeVisible()
  await expect(summary).toHaveAttribute('aria-expanded', 'true')

  await page.getByRole('tab', { name: 'About me' }).click()
  await expect(summary).toBeHidden()
  await page.getByRole('tab', { name: workTitle, exact: true }).click()
  await expect(detail).toBeVisible()
  await expect(summary).toHaveAttribute('aria-expanded', 'true')
  await summary.click()
  await expect(detail).toBeHidden()
  await expect(summary).toHaveAttribute('aria-expanded', 'false')
})

test('the skip link leads into the selected page', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('tabpanel', { name: workTitle, exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('.notes-toggle').first()).toBeFocused()
})

for (const [width, height] of [
  [320, 800], [390, 844], [760, 900], [761, 900],
  [1024, 768], [1440, 1000], [1920, 1080], [1280, 450],
]) {
  test(`all pages fit a ${width} by ${height} window`, async ({ page }, testInfo) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height })
    await page.goto('/')

    for (const name of [workTitle, 'About me', 'Contact']) {
      await page.getByRole('tab', { name, exact: true }).click()
      await expect(page.getByRole('tabpanel', { name, exact: true })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const profile = await page.locator('.profile').boundingBox()
      const main = await page.getByRole('main').boundingBox()
      if (width <= 760) expect(main.y).toBeGreaterThanOrEqual(profile.y + profile.height)
      else expect(main.x).toBeGreaterThan(profile.x + profile.width)

      for (const tab of await page.getByRole('tab').all()) {
        const bounds = await tab.boundingBox()
        expect(bounds.width).toBeGreaterThanOrEqual(44)
        expect(bounds.height).toBeGreaterThanOrEqual(44)
      }
      if (width === 390 || width === 1440) {
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true })
      }
    }
    expect(errors).toEqual([])
  })
}

for (const [fragment, name] of [
  ['work', workTitle],
  ['about', 'About me'],
  ['contact', 'Contact'],
  ['not-a-section', workTitle],
]) {
  test(`opening #${fragment} selects ${name}`, async ({ page }) => {
    await page.goto(`/#${fragment}`)
    await expect(page.getByRole('tab', { name, exact: true })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name, exact: true })).toBeVisible()
  })
}

test('opens the notebook with the work section selected', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Jay Vang', level: 1 })).toBeVisible()
  await expect(page.getByRole('tablist', { name: 'Notebook sections' })).toBeVisible()
  await expect(page.getByRole('tab', { name: workTitle, exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
  await expect(page.getByRole('tabpanel', { name: workTitle, exact: true })).toBeVisible()
  await expect(page.locator('#work article').first()).toBeVisible()
})

test('selecting a tab shows only its matching page', async ({ page }) => {
  await page.goto('/')

  for (const name of ['About me', 'Contact', workTitle]) {
    const tab = page.getByRole('tab', { name, exact: true })
    await tab.click()
    await expect(tab).toHaveAttribute('aria-selected', 'true')
    await expect(tab).toHaveAttribute('tabindex', '0')
    await expect(page.getByRole('tabpanel')).toHaveCount(1)
    await expect(page.getByRole('tabpanel', { name, exact: true })).toBeVisible()
    await expect(page.getByRole('tab', { selected: false })).toHaveCount(2)
  }
})

for (const layout of [
  { width: 1280, orientation: 'vertical', next: 'ArrowDown', previous: 'ArrowUp', ignored: 'ArrowRight' },
  { width: 390, orientation: 'horizontal', next: 'ArrowRight', previous: 'ArrowLeft', ignored: 'ArrowDown' },
]) {
  test(`keyboard navigation follows the ${layout.orientation} tabs`, async ({ page }) => {
    await page.setViewportSize({ width: layout.width, height: 900 })
    await page.goto('/')
    const tablist = page.getByRole('tablist')
    await expect(tablist).toHaveAttribute('aria-orientation', layout.orientation)
    await page.getByRole('tab', { name: workTitle, exact: true }).focus()

    for (const [key, name] of [
      [layout.next, 'About me'],
      [layout.next, 'Contact'],
      [layout.next, workTitle],
      [layout.previous, 'Contact'],
      ['Home', workTitle],
      ['End', 'Contact'],
      [layout.ignored, 'Contact'],
    ]) {
      await page.keyboard.press(key)
      const tab = page.getByRole('tab', { name, exact: true })
      await expect(tab).toBeFocused()
      await expect(tab).toHaveAttribute('aria-selected', 'true')
      await expect(page.getByRole('tabpanel', { name, exact: true })).toBeVisible()
    }

    // Changing window width must also update the keyboard direction, without reload.
    const resizedWidth = layout.width === 390 ? 1280 : 390
    await page.setViewportSize({ width: resizedWidth, height: 900 })
    await expect(tablist).toHaveAttribute('aria-orientation', resizedWidth === 390 ? 'horizontal' : 'vertical')
    await page.keyboard.press(resizedWidth === 390 ? 'ArrowRight' : 'ArrowDown')
    await expect(page.getByRole('tab', { name: workTitle, exact: true })).toBeFocused()
    await expect(page.getByRole('tab', { name: workTitle, exact: true })).toHaveAttribute('aria-selected', 'true')
  })
}
