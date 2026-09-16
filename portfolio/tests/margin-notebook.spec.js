import { test, expect } from '@playwright/test'

for (const width of [320, 390, 761, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`margin notebook styling in ${theme} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 950 })
      await page.emulateMedia({ colorScheme: theme })
      await page.goto('/')
      const style = await page.evaluate(() => {
        const main = document.querySelector('main')
        const paper = getComputedStyle(main)
        const margin = getComputedStyle(main, '::before')
        const entry = getComputedStyle(document.querySelector('.project'))
        const tab = getComputedStyle(document.querySelector('[role="tab"][aria-selected="true"]'))
        const context = document.createElement('canvas').getContext('2d')
        const color = value => { context.fillStyle = value; return context.fillStyle }
        return {
          content: margin.content, width: margin.width, left: margin.left,
          pointerEvents: margin.pointerEvents, marginColor: color(margin.backgroundColor),
          entryRule: color(entry.borderTopColor), padding: paper.paddingLeft,
          shadow: paper.boxShadow, background: paper.backgroundImage,
          tabLeft: tab.borderLeftWidth, tabTop: tab.borderTopWidth,
        }
      })
      expect(style.content).toBe('""')
      expect(style.width).toBe('1px')
      expect(style.pointerEvents).toBe('none')
      expect(style.marginColor).toBe(theme === 'light' ? '#d7aaa1' : '#815c52')
      expect(style.entryRule).toBe(theme === 'light' ? '#ccdce3' : '#455158')
      expect(style.left).toBe(width <= 760 ? '13px' : '25px')
      expect(parseFloat(style.padding)).toBeGreaterThan(parseFloat(style.left) + 12)
      expect(style.shadow).not.toBe('none')
      expect(style.background).toBe('none')
      expect(width <= 760 ? style.tabTop : style.tabLeft).toBe('3px')

      // Decorative rules must not obstruct reading or the existing controls.
      const notes = page.getByRole('button', { name: 'Read my notes', exact: true }).first()
      await notes.click()
      await expect(page.locator('.project-notes').first()).toBeVisible()
      for (const section of ['About me', 'Contact', 'Projects']) {
        await page.getByRole('tab', { name: section, exact: true }).click()
        await expect(page.getByRole('tabpanel', { name: section, exact: true })).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      }
      await expect(page.locator('.project-notes').first()).toBeVisible()
    })
  }
}
