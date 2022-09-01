const { test } = require('@playwright/test');
const fs = require('fs');
const AuthPage = require("../utils/auth-page")
const UserShopPage = require('../pages/shop-profile-page')


test("1 Shop verification via meta", async ({ browser, request }) => {



    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' });
    const page_infinityfree = await context.newPage();

    const authPage = new AuthPage(browser, request)
    const page_fv = await authPage.page()
    const userShopPage = new UserShopPage(page_fv)
    const domainForVerification = "site-for-shop-verification.infinityfreeapp.com"

    await page_fv.goto("/fr/boutique")

    await userShopPage.createShop(domainForVerification)
    await page_fv.goto(`/fr/boutique/${domainForVerification}`)
    await page_fv.locator("text=Ajouter une balise <meta>").click()

    const metaField = await page_fv.locator('input[type="text"]')
    const meta = await metaField.getAttribute("value")

    //Добавление кода верификации в html
    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Test site</title>
            ${meta}
        </head>
        <body>
            <h1>Сайт для теста верификации через meta</h1>
        </body>
        </html>`

    fs.writeFile('utils/index.html', html, function (err) {
        if (err) throw err;
    });

    //открытие файлового менеджера на infinityfree.net
    await page_infinityfree.goto("https://app.infinityfree.net/login")
    await page_infinityfree.locator("#email").fill("xotamo4747@gmail.com")
    await page_infinityfree.locator('[name="password"]').fill(process.env.PASS_INFINITYFREE)
    await page_infinityfree.locator("button", { hasText: "Sign in" }).click()
    await page_infinityfree.waitForTimeout(5000)
    await page_infinityfree.goto("https://filemanager.ai/new/#/c/185.27.134.11/epiz_32483814/eyJ0IjoiZnRwIiwiYyI6eyJwIjoiaUdXVTZoT0tEVTFlTG4iLCJpIjoiXC8ifX0=")
    await page_infinityfree.locator("text=htdocs").click()


    //удаление текущего файла index.html
    await page_infinityfree.locator("text=index.html").click()
    await page_infinityfree.locator("text=Delete… >> nth=2").click()
    await page_infinityfree.waitForSelector('text=Are you sure you want to delete 1 item?')
    await page_infinityfree.locator('text=Confirm').click();

    //Загрузка файла с кодом верификации
    await page_infinityfree.locator('[title="Upload…"]').click()

    const [fileChooser] = await Promise.all([
        page_infinityfree.waitForEvent('filechooser'),
        page_infinityfree.locator('text="Upload File…"').click()
    ]);
    await fileChooser.setFiles('utils/index.html');
    await page_infinityfree.waitForTimeout(5000)


    await page_fv.locator("button", { hasText: "Vérifier" }).click()

})


