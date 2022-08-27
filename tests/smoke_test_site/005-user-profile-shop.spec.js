const { test, expect } = require('@playwright/test');
require('dotenv').config({ path: ".env.development" })

const testData = require('../../utils/test-data');
const AuthPage = require("../../utils/auth-page")
const UserShopPage = require('../../pages/shop-profile-page')

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

            await page.goto("/fr/boutique")

            await page.locator('[placeholder="Nom Entreprise"]').fill(testData.SHOP_CREATION_DATA.name)
            await page.locator('[placeholder="Ma fonction"]').fill(testData.SHOP_CREATION_DATA.userPosition)
            await page.locator('[placeholder="\\37  allée de la vigne"]').fill(testData.SHOP_CREATION_DATA.address)
            await page.locator('[placeholder="\\39 4300"]').fill(testData.SHOP_CREATION_DATA.postalCode)
            await page.locator('[placeholder="Vincennes"]').fill(testData.SHOP_CREATION_DATA.city)
            await page.locator('text=Numéro de SiretLe numéro de Siret doit contenir 14 caractères >> [placeholder="\\30 00000000000000"]').fill(testData.SHOP_CREATION_DATA.siret);
            await page.locator('text=Numéro de TVALe numéro de TVA doit contenir entre 4 et 16 caractères >> [placeholder="\\30 00000000000000"]').fill(testData.SHOP_CREATION_DATA.tva);
            await page.locator('[placeholder="mail\\@gmail\\.com"]').fill(testData.SHOP_CREATION_DATA.email);
            await page.locator('[placeholder="\\30 0\\.00\\.00\\.00\\.00"]').fill(testData.SHOP_CREATION_DATA.phone);
            await page.locator('[placeholder="monentreprise\\.com"]').fill(shopDomain);

            await page.locator('button:has-text("Je valide")').click();

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



test.describe('5.3 Search shop via API method GET /admin/shops + Deleting a shop via admin API method DELETE admin/shops/:id + Creating shop via site UI + Auto verifications shop via email', () => {

    test("5.3.1 Premium plan payment", async ({ browser, request }) => {

        test.skip(process.env.SERVER === "prod", 'The test does not work on prod. Because payment is not tested on the prod-server');

        const authPage = new AuthPage(browser, request)
        const page = await authPage.page()
        const card = '424242 424242 424242 424242'

        await page.goto(`/fr/shops/offers/${shopDomain}`)

        await page.locator('text=Premium15,99€HT/moissoit 191,88€ HTSouscrire >> button').click();
        await page.frameLocator('iframe[title="Cadre sécurisé pour la saisie du numéro de carte"]').locator('[name="cardnumber"]').fill(card);
        await page.frameLocator(`iframe[title="Cadre sécurisé pour la saisie de la date d'expiration"]`).locator('[name="exp-date"]').fill('10 / 24');
        await page.frameLocator('iframe[title="Cadre sécurisé pour la saisie du code de sécurité CVC"]').locator('[name="cvc"]').fill('1234');
        await page.locator('button:has-text("Je m’abonne !")').click();
        await page.waitForTimeout(5000)
        await page.waitForNavigation('text=Aller sur mon profil')
        await page.locator('text=Aller sur mon profil').click();

        await expect(await page.locator(".info-current-subscription-plan")).toHaveText("Premium")

    })

})
