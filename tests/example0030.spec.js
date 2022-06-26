const { test, expect } = require('@playwright/test');


test('test', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.locator('input[name="search"]').click();
  await page.locator('input[name="search"]').fill('test');
  await page.locator('button:has-text("Search")').click();
  await expect(page).toHaveURL('https://en.wikipedia.org/wiki/Test');
});

