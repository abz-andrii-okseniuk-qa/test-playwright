const { test } = require('@playwright/test');

const Options = require('../utils/options-storageState-auth');
const testData = require('../utils/test-data');


const domain = process.env.SERVER

const URL = process.env.SERVER === "dev" ? "https://franceverif-dev.franceverif.fr" : process.env.SERVER === "stage" ? "https://franceverif-stage.franceverif.fr" : process.env.SERVER === "prod" ? "https://franceverif.fr" : "https://franceverif-dev.franceverif.fr"

const URL_API_GETEWAY = process.env.SERVER === "dev" ? "https://api-gateway-dev.franceverif.fr" : process.env.SERVER === "stage" ? "https://api-gateway-stage.franceverif.fr" : "https://api-gateway-franceverif.fr"


const email = process.env.EMAIL
const password = process.env.PASSWORD

//SERVER=stage EMAIL=test.mail9565@gmail.com PASSWORD=11111111 npx playwright test create_shop0020.spec.js --headed
//SERVER=dev or stage or prod

test.describe('1 page multiple tests', () => {

    test("Add shop", async ({
        browser, request
    }) => {


        const response = await request.post(URL_API_GETEWAY + "/auth/login", {
            data: {
                email,
                password
            }
        });

        const responseBody = await response.json()

        const options = new Options(domain, URL, responseBody.token)

        const context = await browser.newContext(options.data);
        const page = await context.newPage();

        await page.goto("/dashboard");

        await page.locator('.userDataDropdown').click();

        await Promise.all([
            page.waitForNavigation( /*{ url: 'https://franceverif-dev.franceverif.fr/fr/boutique' }*/),
            page.locator('text=Ajouter une boutique').click()
        ]);

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
            page.waitForNavigation(/*{ url: 'https://franceverif-dev.franceverif.fr/fr/shops/offers/gmail.com' }*/),
            page.locator('text=Récupérer mon badge').click()
        ]);

        await Promise.all([
            page.waitForNavigation(/*{ url: 'https://franceverif-dev.franceverif.fr/fr/shops/gmail.com' }*/),
            page.locator('text=Tableau de bord').click()
        ]);

        await page.locator('text=Voici les statistiques de gmail.com aujourd’hui').click();

    })

});