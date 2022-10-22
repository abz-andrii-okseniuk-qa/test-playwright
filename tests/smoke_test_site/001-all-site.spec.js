const { test, expect } = require('@playwright/test')



test('1.1 The registration form is available via a direct link', async ({ page }) => {

    await page.goto('/fr/verifier-site-web?state=registration')
    await expect(page.locator(".registration-forms-title")).toHaveText("Rejoins la famille France Vérif !")
    
});

test('1.2 The reset password form is available via a direct link', async ({ page }) => {

    await page.goto('/fr/verifier-site-web?state=forgot-password')
    await expect(page.locator(".forgot-title")).toHaveText("Mot de passe oublié ?")

});

test.describe("1.3 Testing layout public pages", () => {

    test("1.3.1 Main page", async ({ page }) => {
        await page.goto('/')
        await expect(await page.locator("main")).toHaveScreenshot('main-page.png');
    });
    
    test("1.3.2 Eden landing", async ({ page }) => {
        await page.goto('/fr/eden')
        await expect(await page.locator("main")).toHaveScreenshot('eden-landing-page.png');
    });

    test("1.3.4 Marchands landing", async ({ page }) => {
        await page.goto('/fr/marchands')
        await expect(await page.locator("main")).toHaveScreenshot('marchands-page.png');
    });
    
    test("1.3.5 signaler-arnaque page", async ({ page }) => {
        await page.goto('/fr/signaler-arnaque')
        await expect(await page.locator("main")).toHaveScreenshot('signaler-arnaque-page.png');
    });

    test("1.3.6 comment-ca-marche page", async ({ page }) => {
        await page.goto('/fr/comment-ca-marche')
        await expect(await page.locator("body")).toHaveScreenshot('comment-ca-marche-page.png');
    });

    test("1.3.7 categories page", async ({ page }) => {
        await page.goto('/fr/categories')
        await expect(await page.locator("main")).toHaveScreenshot('categories-page.png');
    });

    test("1.3.8 verifier-site-web page", async ({ page }) => {
        await page.goto('/fr/verifier-site-web')
        await expect(await page.locator("main")).toHaveScreenshot('verifier-site-web-page.png');
    });

    test("1.3.9 cgu page", async ({ page }) => {
        await page.goto('/fr/cgu')
        await expect(await page.locator("main")).toHaveScreenshot('cgu-page.png');
    });

    test("1.3.10 politique-confidentialite page", async ({ page }) => {
        await page.goto('/fr/politique-confidentialite')
        await expect(await page.locator("main")).toHaveScreenshot('politique-confidentialite-page.png');
    });

    test("1.3.11 mentions-legales page", async ({ page }) => {
        await page.goto('/fr/mentions-legales')
        await expect(await page.locator("main")).toHaveScreenshot('mentions-legales-page.png');
    });

    test("1.3.12 cgv-marchands page", async ({ page }) => {
        await page.goto('/fr/cgv-marchands')
        await expect(await page.locator("main")).toHaveScreenshot('cgv-marchands-page.png');
    });

    test("1.3.12 footer", async ({ page }) => {
        await page.goto('/')
        await expect(await page.locator("footer")).toHaveScreenshot('footer.png');
    });

})



test.describe("1.4 Testing 301 redirects", () => {

    test("1.4.1 redirect from https://franceverif.fr/ads.txt to https://srv.adstxtmanager.com/19390/franceverif.fr", async ({ page }) => {
        await page.goto('/ads.txt')
        await expect(page).toHaveURL("https://srv.adstxtmanager.com/19390/franceverif.fr")
    });

    test("1.4.2 redirect /fr/", async ({ page }) => {
        await page.goto('/verifier-site-web')
        await expect(page).toHaveURL("/fr/verifier-site-web")

        await page.goto('/categories')
        await expect(page).toHaveURL("/fr/categories")
    });

    test("1.4.3 redirect from /search to /fr/verifier-site-web", async ({ page }) => {
        await page.goto('/search')
        await expect(page).toHaveURL("/fr/verifier-site-web")
    });

})