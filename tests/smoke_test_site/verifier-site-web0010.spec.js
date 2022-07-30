const { test, expect } = require('@playwright/test');

const VerifierSiteWeb = require('../../pages/verifier-site-web.js')


test('2.1 Site analysis through input in the field', async ({ page }) => {

    const verifierSitePage = new VerifierSiteWeb(page, 'amazon.fr')

    await verifierSitePage.open()
    await verifierSitePage.runSiteAnalysis()
    await verifierSitePage.confirmationPopup()

    await page.waitForSelector(".bannerTitle", { hasText: "Avis sur amazon.fr" })
    await expect(page.locator(".bannerTitle")).toHaveText("Avis sur amazon.fr")

});


test('2.4 Analysis of a non-ecom site', async ({page}) => {
    const verifierSitePage = new VerifierSiteWeb(page, 'wikipedia.org')

    await verifierSitePage.open()
    await verifierSitePage.runSiteAnalysis()
    await verifierSitePage.confirmationPopup()

  await page.waitForSelector('text=FranceVerif vérifie uniquement la fiabilité des sites e-commerce')
  await expect(page.locator('text=FranceVerif vérifie uniquement la fiabilité des sites e-commerce')).toHaveText("FranceVerif vérifie uniquement la fiabilité des sites e-commerce")

  await page.locator('text=J’ai compris').click()

})