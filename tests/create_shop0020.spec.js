const { test } = require('@playwright/test');

const Options = require('../utils/options-storageState-auth');
const testData = require('../utils/test-data');
const AdminToken = require('../utils/getAdminToken')
const { URL_API_GETEWAY } = require("../utils/url-api-geteway")

const domain = process.env.SERVER


//run test
//SERVER=dev EMAIL=test.mail9565@gmail.com PASSWORD=11111111 npx playwright test create_shop0020.spec.js --headed
//SERVER=dev or stage or prod

test.describe('Search shop via API method GET /admin/shops + Deleting a shop via admin API method DELETE admin/shops/:id + Creating shop via site UI + Auto verifications shop via email', () => {

    test("Search and deleting shop via admin API methods", async ({ request }) => {

        test.skip(domain === 'prod', 'The test does not work on prod');

        const getAdminToken = new AdminToken(request, process.env.SERVER)
        const adminToken = await getAdminToken.getToken()


        const responseGetShop = await request.get(`${URL_API_GETEWAY}/admin/shops?search=${testData.SHOP_CREATION_DATA.domain}`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })

        const responseGetShopBody = await responseGetShop.json()

        let shopID

        for (const key of responseGetShopBody.data) {
            if (key.domain === testData.SHOP_CREATION_DATA.domain) {
                shopID = key.id
            }
        }

        if (shopID) {
            await request.delete(`${URL_API_GETEWAY}/admin/shops/${shopID}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                }
            })
        }

    }),


        test("Creating shop via site UI", async ({ browser, request }) => {

            const adminToken = new AdminToken(request, process.env.SERVER)
            const token = await adminToken.getToken()

            const options = new Options(domain, token)

            const context = await browser.newContext(options.data);
            const page = await context.newPage();

            await page.goto("/fr/boutique");

            await page.locator('[placeholder="Nom Entreprise"]').fill(testData.SHOP_CREATION_DATA.name);
            await page.locator('[placeholder="Ma fonction"]').fill(testData.SHOP_CREATION_DATA.userPosition);
            await page.locator('[placeholder="\\37  allée de la vigne"]').fill(testData.SHOP_CREATION_DATA.address);
            await page.locator('[placeholder="\\39 4300"]').fill(testData.SHOP_CREATION_DATA.postalCode);
            await page.locator('[placeholder="Vincennes"]').fill(testData.SHOP_CREATION_DATA.city);
            await page.locator('text=Numéro de SiretLe numéro de Siret doit contenir 14 caractères >> [placeholder="\\30 00000000000000"]').fill(testData.SHOP_CREATION_DATA.siret);
            await page.locator('text=Numéro de TVALe numéro de TVA doit contenir entre 4 et 16 caractères >> [placeholder="\\30 00000000000000"]').fill(testData.SHOP_CREATION_DATA.tva);
            await page.locator('[placeholder="mail\\@gmail\\.com"]').fill(testData.SHOP_CREATION_DATA.email);
            await page.locator('[placeholder="\\30 0\\.00\\.00\\.00\\.00"]').fill(testData.SHOP_CREATION_DATA.phone);
            await page.locator('[placeholder="monentreprise\\.com"]').fill(testData.SHOP_CREATION_DATA.domain);

            await page.locator('button:has-text("Je valide")').click();

            await Promise.all([
                page.waitForNavigation(),
                page.locator('text=Récupérer mon badge').click()
            ]);

            await Promise.all([
                page.waitForNavigation(),
                page.locator('text=Tableau de bord').click()
            ]);

            await page.locator('text=Voici les statistiques de gmail.com aujourd’hui').click();

        })

});