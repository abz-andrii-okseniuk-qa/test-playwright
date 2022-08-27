const { test } = require('@playwright/test');

test.use({
    viewport: { width: 1440, height: 980 }
})
test("00000 test", async ({ browser }) => {

    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' });
    const page = await context.newPage();

    await page.goto("https://app.infinityfree.net/login")

    await page.locator("#email").fill("xotamo4747@gmail.com")
    await page.locator('[name="password"]').fill(process.env.PASS_INFINITYFREE)

    await page.locator("button", { hasText: "Sign in" }).click()

    await page.waitForTimeout(5000)

    await page.goto("https://filemanager.ai/new/#/c/185.27.134.11/epiz_32077013/eyJ0IjoiZnRwIiwiYyI6eyJwIjoibXJJcHA5Rk9XZmUiLCJpIjoiXC8ifX0=")

    await page.locator("text=htdocs").click()
    await page.locator("text=index.html").click()




    await page.pause()

})



