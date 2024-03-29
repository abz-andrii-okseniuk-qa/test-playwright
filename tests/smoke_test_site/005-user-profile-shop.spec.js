const { test, expect } = require('@playwright/test');
require('dotenv').config({ path: ".env.development" })
const fs = require('fs');

const testData = require('../../utils/test-data');
const AuthPage = require("../../utils/auth-page")
const UserShopPage = require('../../pages/shop-profile-page')
const UserProfilePage = require("../../pages/user-profile-page")

const domain = process.env.SERVER
const shopDomain = testData.SHOP_CREATION_DATA.domain


test.describe('5.1 Search shop via API method GET /admin/shops + Deleting a shop via admin API method DELETE admin/shops/:id + Creating shop via site UI + Auto verifications shop via email', () => {

    test("5.1.1 Search and deleting shop via admin API methods", async ({ request }) => {

        test.skip(domain === 'prod', 'The test does not work on prod');

        const userShopPage = new UserShopPage(null, request)
        await userShopPage.deleteShop(shopDomain)

    }),


        test("5.1.2 Creating shop via site UI", async ({ browser, request }) => {

            const authPage = new AuthPage(browser, request)
            const page = await authPage.page()
            const userShopPage = new UserShopPage(page)

            await page.goto("/fr/boutique")

            await userShopPage.createShop(shopDomain)

            await Promise.all([
                page.waitForNavigation(),
                page.locator('text=Récupérer mon badge').click()
            ]);

            await Promise.all([
                page.waitForNavigation(),
                page.locator('text=Tableau de bord').click()
            ]);

            await page.locator(`text=Voici les statistiques de ${testData.SHOP_CREATION_DATA.domain} aujourd’hui`).click();

        })

});



test("5.2 Displaying feedback on the shop profile page", async ({ browser, request }) => {

    const authPage = new AuthPage(browser, request)
    const page = await authPage.page()

    await page.goto(`/fr/shops/${shopDomain}`)

    await page.locator("button", { hasText: "Répondre aux avis" }).click()
    await expect(page).toHaveURL(`/fr/shops/feedbacks/${shopDomain}`)

})


test("5.3 Premium plan payment", async ({ browser, request }) => {

    test.skip(process.env.SERVER === "prod", 'The test does not work on prod. Because payment is not tested on the prod-server');

    const authPage = new AuthPage(browser, request)
    const page = await authPage.page()
    const profilePage = new UserProfilePage(page)

    await page.goto(`/fr/shops/offers/${shopDomain}`)

    await page.locator('text=Premium15,99€HT/moissoit 191,88€ HTSouscrire >> button').click();
    await profilePage.fillStripeForm()
    await page.locator('button:has-text("Je m’abonne !")').click();
    await page.waitForTimeout(5000)
    await page.waitForNavigation('text=Aller sur mon profil')
    await page.locator('text=Aller sur mon profil').click();

    await expect(await page.locator(".info-current-subscription-plan")).toHaveText("Premium")

})

test("5.4 Shop verification via meta", async ({ browser, request }) => {

    test.skip(true, 'Тест пропущен из-за того что нужно добавить возможность верифицировать домен без https, так как на infinityfreeapp не получается настроить https');

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



test("5.5 Edit widget", async ({ browser, request }) => {

    const authPage = new AuthPage(browser, request)
    const page = await authPage.page()

    await page.goto(`/fr/shops/badge/${shopDomain}`)

    const badge_view = await page.$(".badge-view")
    await badge_view.scrollIntoViewIfNeeded()
    await page.waitForTimeout(3000)

    await expect(await page.locator(".badge-view >> nth=0")).toHaveScreenshot('widget-Le-badge.png');

    await page.locator("text=Le score IA").click()
    await badge_view.scrollIntoViewIfNeeded()
    await page.waitForTimeout(3000)
    await expect(await page.locator(".badge-view >> nth=0")).toHaveScreenshot('widget-Le-score-IA.png');

    await page.locator("text=Les avis clients").click()
    await badge_view.scrollIntoViewIfNeeded()
    await page.waitForTimeout(3000)
    await expect(await page.locator(".badge-view >> nth=0")).toHaveScreenshot('widget-Les-avis-clients.png');

    await page.locator("text=Le badge >> nth=0").click()
    await badge_view.scrollIntoViewIfNeeded()
    await page.waitForTimeout(3000)
    await expect(await page.locator(".badge-view >> nth=0")).toHaveScreenshot('widget-Les-avis-clients2.png');

})



test("5.6 Widget - 'Le badge' view on the site", async ({ browser, request }) => {

    const authPage = new AuthPage(browser, request)
    const page_fv = await authPage.page()
    const context = await browser.newContext()
    const page_infinityfree = await context.newPage()

    await page_fv.goto(`/fr/shops/badge/test-premium.infinityfreeapp.com/`)

    const textareaHead = await page_fv.locator(".badge-code-textarea >> nth=0")
    const headCode = await textareaHead.textContent()


    await page_fv.waitForTimeout(3000)
    const textareaBody = await page_fv.locator(".badge-code-textarea >> nth=1")
    const bodyCode = await textareaBody.textContent()

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Test site</title>
        ${headCode}
    </head>
    <body>
        <h1>Тест виджета</h1>
        <hr>
        <div id=widget-bloc>
        ${bodyCode}
        </div>
        <hr>
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
    await page_infinityfree.goto("https://filemanager.ai/new/#/c/185.27.134.11/epiz_32077013/eyJ0IjoiZnRwIiwiYyI6eyJwIjoibXJJcHA5Rk9XZmUiLCJpIjoiXC8ifX0=")
    await page_infinityfree.locator("text=htdocs").click()

    await page_infinityfree.locator("text=test-widget").click()


    //удаление текущего файла index.html
    await page_infinityfree.locator("text=index.html").click()
    await page_infinityfree.locator("#files >> text=Delete…").click()
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

    await page_infinityfree.goto("http://test-premium.infinityfreeapp.com/test-widget/")
    await page_infinityfree.waitForTimeout(3000) 

    await expect(await page_infinityfree.locator("#widget-bloc")).toHaveScreenshot('widget-Le-badge-view-on-site.png');

})


