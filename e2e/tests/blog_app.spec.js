const { test, expect, beforeEach, describe } = require('@playwright/test')
import { createBlog, loginWith } from './helpers'

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('/api/testing/reset')
      await request.post('/api/users', {
        data: {
          name: 'Nart Kosova',
          username: 'nart',
          password: 'dardha'
        }
    })
    await page.goto('/')
      })
  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'nart', 'dardha')
        await expect(page.getByText('Nart Kosova is logged in')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'nart', 'gabim')
        await expect(page.getByText('Nart Kosova is logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'nart', 'dardha')
    })
    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'My Blog', 'Nart Kosova', 'firstblog.com')
        const viewBlog = await page.getByText('My Blog Nart Kosova')
        await expect(viewBlog).toBeVisible()
    })
    test('blog can be liked', async ({ page }) => {
        await createBlog(page, 'My Blog', 'Nart Kosova', 'firstblog.com')
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1 likes')).toBeVisible()
    })
    test('blog can be deleted', async ({ page }) => {
      await createBlog(page, 'My Blog to Delete', 'Nart Kosova', 'deleteblog.com')
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('My Blog to Delete Nart')).not.toBeVisible()
  })
  })
})