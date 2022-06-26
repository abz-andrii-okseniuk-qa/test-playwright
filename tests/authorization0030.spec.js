const { test } = require('@playwright/test');

const baseUrl = 'https://franceverif-dev.franceverif.fr'
const email = 'qat6695@outlook.com'
const pass = '11111111'


test("Authorization in the site via email and password", async ({ page }) => {
    await page.goto(baseUrl);
    await page.locator('text=Connexion').click();
    await page.locator('text=Connectez-vous !').click();
    await page.locator('[placeholder="mail\\@gmail\\.com"]').fill(email);
    await page.locator('[placeholder="Mot de passe"]').fill(pass);
    await page.locator('button:has-text("Se connecter")').click();
    await page.locator('text=Mariam MarshMon espaceSe déconnecter >> div').click();
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://franceverif-dev.franceverif.fr/fr/dashboard' }*/),
        page.locator('text=Mon espace').click()
    ]);
})
