import { test, expect } from '@playwright/test'

const expectedProjects = [
  { title: 'OBSBOT Camera', url: 'https://github.com/JVng36/obsbot-shared-camera-bridge' },
  { title: 'Game Backlogger', url: 'https://github.com/JVng36/game_backlogger' },
  { title: 'Dailies Reminder Mobile App', url: 'https://github.com/JVng36/Dailies_Reminder_Mobile_App' },
]

test('Dailies notes keep the capstone context and leave tutorial citations to the report', async ({ page }) => {
  await page.goto('/')
  const project = page.getByRole('article', { name: 'Dailies Reminder Mobile App', exact: true })
  await project.locator('summary').click()
  await expect(project).toContainText('Android / Capstone project')
  await expect(project.locator('details')).toContainText('original project report')
  await expect(project).not.toContainText(/data[\s-]*flair|tutorial/i)
})

test('phone tabs stay on one row', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    const tabs = await page.getByRole('tab').all()
    const first = await tabs[0].boundingBox()
    for (const tab of tabs) {
      const bounds = await tab.boundingBox()
      expect(bounds.y).toBeCloseTo(first.y, 0)
      expect(bounds.height).toBeGreaterThanOrEqual(44)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width)
    }
  }
})

test('the notebook uses personal metadata and no illustrative-copy footer', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Jay · Projects & notes')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /OBSBOT.*game backlog tracker.*Android reminder app/)
  await expect(page.locator('.bio')).toContainText('hardware experiments')
  await expect(page.locator('footer')).toContainText('React and plain CSS')
  await expect(page.locator('footer')).not.toContainText(/draft|illustrative/i)
})

test('project and contact links have comfortable touch targets on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')
  for (const link of await page.locator('#work a').all()) {
    const bounds = await link.boundingBox()
    expect(bounds.height).toBeGreaterThanOrEqual(44)
    expect(bounds.width).toBeGreaterThanOrEqual(44)
  }
  await page.getByRole('tab', { name: 'Contact', exact: true }).click()
  for (const link of await page.locator('#contact a').all()) {
    const bounds = await link.boundingBox()
    expect(bounds.height).toBeGreaterThanOrEqual(44)
    expect(bounds.width).toBeGreaterThanOrEqual(44)
  }
})

test('Contact uses the supplied LinkedIn and email without a dummy form', async ({ page }) => {
  await page.goto('/#contact')
  const contact = page.getByRole('tabpanel', { name: 'Contact' })
  const expectedLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jvang75/' },
    { label: 'vangjay36@gmail.com', url: 'mailto:vangjay36@gmail.com' },
  ]
  for (const { label, url } of expectedLinks) {
    const link = contact.getByRole('link', { name: label, exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', url)
  }
  await expect(contact.getByRole('link')).toHaveCount(expectedLinks.length)
  await expect(contact.locator('form, input, textarea')).toHaveCount(0)
  await expect(contact).not.toContainText(/belongs here|Your chosen|Keep this page/)
})

test('About uses Jay\'s gamedev and hardware introduction without editing prompts', async ({ page }) => {
  await page.goto('/#about')
  const about = page.getByRole('tabpanel', { name: 'About me' })
  await expect(about).toContainText("I'm Jay. I'm interested in gamedev, hardware, AI, and making small tools for everyday use.")
  await expect(about.getByRole('heading', { name: 'About this site' })).toBeVisible()
  await expect(about).not.toContainText(/This is where|Replace these prompts|Something you/)
})

test('features the three requested projects in order with their source links', async ({ page }) => {
  await page.goto('/')
  const projects = page.locator('#work article')
  await expect(projects.getByRole('heading', { level: 3 })).toHaveText(expectedProjects.map((project) => project.title))

  for (const [index, project] of expectedProjects.entries()) {
    const link = projects.nth(index).getByRole('link', { name: `View on GitHub: ${project.title}`, exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', project.url)
  }
})
