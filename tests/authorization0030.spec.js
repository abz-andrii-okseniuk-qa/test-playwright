const { test } = require('@playwright/test');


test("Authorization in the site via email and password", async ({ page }) => {
    await page.goto("/");
    await page.locator('text=Connexion').click();
    await page.locator('text=Connectez-vous !').click();
    await page.locator('[placeholder="mail\\@gmail\\.com"]').fill(process.env.EMAIL);
    await page.locator('[placeholder="Mot de passe"]').fill(process.env.PASSWORD);
    await page.locator('button:has-text("Se connecter")').click();
    await page.locator('.auth-main').click();
    await page.locator('text=Mon espace').click()

})
