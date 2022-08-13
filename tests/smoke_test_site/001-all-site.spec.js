const { test, expect } = require('@playwright/test')



test('1.1 The registration form is available via a direct link', async ({ page }) => {

    await page.goto('/fr/verifier-site-web?state=registration')
    await expect(page.locator(".registration-forms-title")).toHaveText("Rejoins la famille France Vérif !")
    
});

test('1.2 The reset password form is available via a direct link', async ({ page }) => {

    await page.goto('/fr/verifier-site-web?state=forgot-password')
    await expect(page.locator(".forgot-title")).toHaveText("Mot de passe oublié ?")

});
