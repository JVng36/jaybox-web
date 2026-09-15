import { test, expect } from '@playwright/test'

for (const width of [320, 390, 761, 1440]) {
  test(`project actions share a row with notes open or closed at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const projects = page.locator('#work article')
    await expect(projects).toHaveCount(3)
    for (const project of await projects.all()) {
      const toggle = project.getByRole('button', { name: 'Read my notes', exact: true })
      const link = project.getByRole('link')
      for (const open of [false, true]) {
        if (open) await toggle.click()
        await expect(toggle).toHaveAttribute('aria-expanded', String(open))
        const notesId = await toggle.getAttribute('aria-controls')
        expect(notesId).toBeTruthy()
        const notes = project.locator(`[id="${notesId}"]`)
        await expect(notes).toHaveCount(1)
        if (open) {
          await expect(notes).toBeVisible()
          const notesBox = await notes.boundingBox()
          const projectBox = await project.boundingBox()
          expect(notesBox.width).toBeCloseTo(projectBox.width, 0)
        } else await expect(notes).toBeHidden()
        const noteBox = await toggle.boundingBox()
        const linkBox = await link.boundingBox()
        expect(noteBox.y).toBeCloseTo(linkBox.y, 0)
        expect(linkBox.x).toBeGreaterThanOrEqual(noteBox.x + noteBox.width + 12)
        expect(noteBox.height).toBeGreaterThanOrEqual(44)
        expect(linkBox.height).toBeGreaterThanOrEqual(44)
        expect(linkBox.x + linkBox.width).toBeLessThanOrEqual(width)
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
