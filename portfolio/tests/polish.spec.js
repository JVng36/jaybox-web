import { test, expect } from '@playwright/test'

test('the page describes the work directly without tentative filler', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.bio')).toHaveText('Software projects, hardware experiments, and AI tools.')
  await expect(page.locator('#work .page-label')).toHaveText("What I've built")
  await expect(page.locator('#work h2')).toHaveText('Projects')
  await expect(page.locator('#work')).not.toContainText('From my notebook')
  await expect(page.locator('#work .intro')).toHaveText('Projects I’ve built, with notes on how they work and the decisions behind them.')
  await page.getByRole('tab', { name: 'About me', exact: true }).click()
  await expect(page.locator('#about')).toContainText('I built this site with React and plain CSS, using a notebook layout to keep the focus on the projects.')
  await expect(page.locator('.notebook')).not.toContainText(/things I.m learning|slightly longer version|for now|still figuring out/)
})

test('the introduction identifies Jay Vang and his availability', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jay Vang')
  await expect(page).toHaveTitle('Jay Vang · Projects & notes')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Jay Vang/)
  await expect(page.locator('.profile')).toContainText('Open to new opportunities.')
})
