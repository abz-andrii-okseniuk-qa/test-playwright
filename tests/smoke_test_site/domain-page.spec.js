const { test, expect } = require('@playwright/test');

const DomainPage = require('../../pages/domain-page')

test('3.1 Cheking results for a GREEN site', async ({ page }) => {

    const domainPage = new DomainPage(page, "test-premium.infinityfreeapp.com")
    await domainPage.open()

    const locator = page.locator('.resultHeader');
    await expect(locator).toHaveClass('resultHeader green');
    await expect(locator).toHaveText(/Ce site est évalué comme fiable par les IA de France VerifExcellent/)

    await expect(page.locator(".greenText")).toHaveCSS('background', "rgb(131, 205, 27) none repeat scroll 0% 0% / auto padding-box border-box");

});

test('3.2 Cheking results for a ORANGE site', async ({ page }) => {

    const domainPage = new DomainPage(page, "test-shop-pro-12.infinityfreeapp.com")
    await domainPage.open()

    const locator = page.locator('.resultHeader');
    await expect(locator).toHaveClass('resultHeader orange');
    await expect(locator).toHaveText(/Certaines données manquentou ne sont pas satisfaisantes...Moyen/)
    await expect(page.locator(".orangeText")).toHaveCSS('background', "rgb(239, 118, 7) none repeat scroll 0% 0% / auto padding-box border-box");

});

test('3.3 Cheking results for a RED site', async ({ page }) => {

    const domainPage = new DomainPage(page, "test-shop23-qa.000webhostapp.com")
    await domainPage.open()

    const locator = page.locator('.resultHeader');
    await expect(locator).toHaveClass('resultHeader red');
    await expect(locator).toHaveText(/Les résultats incitentà la vigilanceFaible/)
    await expect(page.locator(".redText")).toHaveCSS('background', "rgb(210, 28, 16) none repeat scroll 0% 0% / auto padding-box border-box");

});