const { test, expect } = require('@playwright/test');

const VerifierSiteWeb = require('../../pages/verifier-site-web.js')


test.use({
    storageState: {
        cookies: [{
            name: "_iub_cs-69562122",
            value: "%7B%22timestamp%22%3A%222022-07-30T15%3A14%3A49.734Z%22%2C%22version%22%3A%221.40.1%22%2C%22consent%22%3Atrue%2C%22id%22%3A69562122%2C%22cons%22%3A%7B%22rand%22%3A%22977021%22%7D%7D",
            domain: ".franceverif.fr",
            path: "/"
        }
        ]
    }
})

test('2.1 Site analysis through input in the field', async ({ page }) => {

    const verifierSitePage = new VerifierSiteWeb(page, 'malindo.fr')

    await verifierSitePage.open()
    await verifierSitePage.runSiteAnalysis()
    await verifierSitePage.confirmationPopup()

    await page.waitForSelector(".bannerTitle", { hasText: "Avis sur malindo.fr" })
    await expect(page.locator(".bannerTitle")).toHaveText("Avis sur malindo.fr")

});


test('2.2 Analysis of a non-ecom site', async ({ page }) => {

    const verifierSitePage = new VerifierSiteWeb(page, 'wikipedia.org')

    await verifierSitePage.open()
    await verifierSitePage.runSiteAnalysis()
    await verifierSitePage.confirmationPopup()

    await page.waitForSelector('text=FranceVerif vérifie uniquement la fiabilité des sites e-commerce')
    await expect(page.locator('text=FranceVerif vérifie uniquement la fiabilité des sites e-commerce')).toHaveText("FranceVerif vérifie uniquement la fiabilité des sites e-commerce")
    await page.locator('text=J’ai compris').click()

})

test('2.3 Testing autocomplete in the search field', async ({ page }) => {

    const verifierSitePage = new VerifierSiteWeb(page)
    await verifierSitePage.open()
    await page.locator('[placeholder="Entrez une URL"]').fill('mal');
    await page.locator('text=malindo.fr').click();
    await verifierSitePage.confirmationPopup()
    await page.waitForSelector(".bannerTitle", { hasText: "Avis sur malindo.fr" })
    await expect(page.locator(".bannerTitle")).toHaveText("Avis sur malindo.fr")

})


test.describe("Test mobile viewport", () => {

    test.use({
        viewport: { width: 390, height: 844 },
        storageState: {
            cookies: [{
                name: "_iub_cs-69562122",
                value: "%7B%22timestamp%22%3A%222022-07-30T15%3A14%3A49.734Z%22%2C%22version%22%3A%221.40.1%22%2C%22consent%22%3Atrue%2C%22id%22%3A69562122%2C%22cons%22%3A%7B%22rand%22%3A%22977021%22%7D%7D",
                domain: ".franceverif.fr",
                path: "/"
            }
            ]
        }
    })


    test('2.4 Site analysis through input in the field - mobile', async ({ page }) => {

        const verifierSitePage = new VerifierSiteWeb(page, 'malindo.fr')

        await verifierSitePage.open()
        await verifierSitePage.runSiteAnalysis()
        await verifierSitePage.confirmationPopup()

        await page.waitForSelector(".bannerTitle", { hasText: "Avis sur malindo.fr" })
        await expect(page.locator(".bannerTitle")).toHaveText("Avis sur malindo.fr")

    });


    test('2.5 Analysis of a non-ecom site - mobile', async ({ page }) => {

        const verifierSitePage = new VerifierSiteWeb(page, 'wikipedia.org')

        await verifierSitePage.open()
        await verifierSitePage.runSiteAnalysis()
        await verifierSitePage.confirmationPopup()

        await page.waitForSelector('text=FranceVerif vérifie uniquement la fiabilité des sites e-commerce')
        await expect(page.locator('text=FranceVerif vérifie uniquement la fiabilité des sites e-commerce')).toHaveText("FranceVerif vérifie uniquement la fiabilité des sites e-commerce")
        await page.locator('text=J’ai compris').click()

    })

    test('2.6 Testing autocomplete in the search field - mobile', async ({ page }) => {

        const verifierSitePage = new VerifierSiteWeb(page)
        await verifierSitePage.open()
        await page.locator('[placeholder="Entrez une URL"]').fill('mal');
        await page.locator('text=malindo.fr').click();
        await verifierSitePage.confirmationPopup()
        await page.waitForSelector(".bannerTitle", { hasText: "Avis sur malindo.fr" })
        await expect(page.locator(".bannerTitle")).toHaveText("Avis sur malindo.fr")

    })

})






