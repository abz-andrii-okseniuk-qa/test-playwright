const { test, expect } = require('@playwright/test')
const { URL_API_GETEWAY } = require("../../utils/url-api-geteway")
require('dotenv').config({ path: ".env.development" })

const DomainPage = require('../../pages/domain-page')
const Options = require('../../utils/options-storageState-auth');
const GetToken = require('../../utils/getToken')

test('3.1 Cheking results for a GREEN site', async ({ page }) => {

    const domainPage = new DomainPage(page, "test-premium.infinityfreeapp.com")
    await domainPage.open()

    const locator = page.locator('.resultHeader')
    await expect(locator).toHaveClass('resultHeader green')
    await expect(locator).toHaveText(/Ce site est évalué comme fiable par les IA de France VerifExcellent/)

    await expect(page.locator(".greenText")).toHaveCSS('background', "rgb(131, 205, 27) none repeat scroll 0% 0% / auto padding-box border-box");

});



test('3.2 Cheking results for a ORANGE site', async ({ page }) => {

    const domainPage = new DomainPage(page, "test-shop-pro-12.infinityfreeapp.com")
    await domainPage.open()

    const locator = page.locator('.resultHeader')
    await expect(locator).toHaveClass('resultHeader orange')
    await expect(locator).toHaveText(/Certaines données manquentou ne sont pas satisfaisantes...Moyen/)
    await expect(page.locator(".orangeText")).toHaveCSS('background', "rgb(239, 118, 7) none repeat scroll 0% 0% / auto padding-box border-box");

});



test('3.3 Cheking results for a RED site', async ({ page }) => {

    const domainPage = new DomainPage(page, "test-shop23-qa.000webhostapp.com")
    await domainPage.open()

    const locator = page.locator('.resultHeader')
    await expect(locator).toHaveClass('resultHeader red')
    await expect(locator).toHaveText(/Les résultats incitentà la vigilanceFaible/)
    await expect(page.locator(".redText")).toHaveCSS('background', "rgb(210, 28, 16) none repeat scroll 0% 0% / auto padding-box border-box");

});



test("3.4 Test affiliate redirect", async ({ page, request, context }) => {

    const domain = "test-premium.infinityfreeapp.com"

    const response = await (await request.post(`${URL_API_GETEWAY}/check-url`, {
        data: {
            url: domain
        }
    })).json()

    if (response.affiliate) {

        const domainPage = new DomainPage(page, domain)
        await domainPage.open()

        // process.env.URL === "stage" || "prod" ? await page.locator('button[role="button"]:has-text("Accepter")').click() : null

        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            await page.locator('button:has-text("Visitez ce site web")').click()
        ])
        await newPage.waitForLoadState()
        await expect(newPage).toHaveURL(response.affiliate)

    } else {
        test.info().annotations.push({ type: 'Message', description: `Domain ${domain} has no affiliate link` });
        test.fixme("Error", console.warn(`Domain ${domain} has no affiliate link`))
    }

})



test("3.5 Opening/closing information about metrics", async ({ page }) => {

    const domainPage = new DomainPage(page, "amazon.fr")
    await domainPage.open()

    const elements = await page.locator(".checkIconButton").first()
    await expect(elements).toHaveText("Voir plus")
    await elements.click()
    await expect(elements).toHaveText("Réduire")

})



// test("3.6 For domains with feedbacks, a list of feedbacks is displayed", async ({ page, request }) => {

//     const adminToken = new GetToken(request, process.env.SERVER)
//     const token = await adminToken.admin()

//     const responseFeedbackList = await request.get(`${URL_API_GETEWAY}/admin/users/feedbacks?filter=active&page=1&limit=10`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         }
//     })

//     const activeFeedbackList = await responseFeedbackList.json()
//     const activeFeedback = activeFeedbackList.data[Math.floor(Math.random() * 9)]
//     const responseFeedbackId = await request.get(`${URL_API_GETEWAY}/users/feedbacks/domain/${activeFeedback.domainName}`)

//     let feedbackData = await responseFeedbackId.json()
//     feedbackData = feedbackData.feedbacks.data
//     feedbackData = feedbackData[Math.floor(Math.random() * feedbackData.length)]

//     //open domain page
//     const domainPage = new DomainPage(page, activeFeedback.domainName)
//     await domainPage.open()

//     const commentBody = await page.locator(".commentBody", { hasText: feedbackData.text })

//     test.info().annotations.push({ type: 'Domain', description: activeFeedback.domainName });

//     let name = feedbackData.name.split(" ")
//     name = name.length > 1 ? `${name[0]} ${name[1].split("")[0]}.` : name

//     const text = feedbackData.text === null ? "" : feedbackData.text

//     await expect(await commentBody.locator(".commentText")).toHaveText(text)
//     await expect(await commentBody.locator(".commentTitle")).toHaveText(name)

// })



test("3.7 For a domain without feedback, an empty block is displayed (checks for authorized users)", async ({ page }) => {

    test.info().annotations.push({ type: 'Domain', description: "test-website-0000000.000webhostapp.com" });

    const domainPage = new DomainPage(page, "test-website-0000000.000webhostapp.com")
    await domainPage.open()

    await expect(page.locator(".no-comments-text")).toHaveText("Vous devez être connecté pour poster un commentaire")

})



test("3.8 For a domain without feedback, an empty block is displayed (checks for unauthorized users)", async ({ browser, request }) => {

    test.info().annotations.push({ type: 'Domain', description: "test-website-0000000.000webhostapp.com" });

    const siteToken = new GetToken(request, process.env.SERVER)
    const token = await siteToken.site()

    const options = new Options(process.env.SERVER, token)

    const context = await browser.newContext(options.data);
    const page = await context.newPage();

    const domainPage = new DomainPage(page, "test-website-0000000.000webhostapp.com")
    await domainPage.open()

    await expect(page.locator(".no-comments-text")).toHaveText("Soyez le premier à donner votre avis sur test-website-0000000.000webhostapp.com")

})

test.describe("3.9 Feedback tests on Domain Page", async () => {

    test.use({
        viewport: { width: 1920, height: 1080 }
    })

    test("3.9.1 An authorization form opens for an unauthorized user with userLogged=true", async ({ browser }) => {

        const context = await browser.newContext({
            storageState: {
                origins: [{
                    origin: "/",
                    localStorage: [{
                        name: "userLogged",
                        value: "true"
                    }
                    ]
                }]
            }

        });
        const page = await context.newPage();

        const domainPage = new DomainPage(page, "test-website-0000000.000webhostapp.com")
        await domainPage.open()
        await domainPage.openFeedbackForm()

        await page.waitForSelector(".main-log-title")
        await expect(page.locator(".main-log-title")).toHaveText("Inscrivez-vous")

    });



    test("3.9.2 For user with userLogged=false, a feedback form opens with the fields Prénom and Email and add Feedback for an unauthorized user", async ({ page }) => {

        const domainPage = new DomainPage(page, "test-boutique-01.000webhostapp.com")
        await domainPage.open()
        await domainPage.openFeedbackForm()

        await expect(await page.locator("label", { hasText: 'Prénom' })).toHaveText("Prénom")
        await expect(await page.locator("label", { hasText: 'Email' })).toHaveText("Email")

        await domainPage.addFeedbackNotAuthUser()

        await page.waitForSelector(".merci-top-text")
        await expect(await page.locator(".merci-top-text")).toHaveText("Rejoignez la communauté France Vérif et enregistrez votre compte ! ")
        await page.locator("button", { hasText: "S’inscrire" }).click()
        await expect(await page.locator(".main-log-description")).toHaveText("Créez votre compte")

    });



    test("3.9.3 Add feedback for authorized user and feedback form without the Prénom and Email fields", async ({ request, browser }) => {

        const siteToken = new GetToken(request, process.env.SERVER)
        const token = await siteToken.site()
        const options = new Options(process.env.SERVER, token)
        const context = await browser.newContext(options.data);

        const page = await context.newPage();

        const domainPage = new DomainPage(page, "test-boutique-01.000webhostapp.com")
        await domainPage.open()
        await domainPage.openFeedbackForm()

        const prenom = await page.locator("label", { hasText: 'Prénom' })
        await expect(prenom).toBeHidden()

        const email = await page.locator("label", { hasText: 'Email' })
        await expect(email).toBeHidden()

        const submitBtn = await page.locator("button", { hasText: "Envoyer" })
        await expect(submitBtn).toBeDisabled()

        await domainPage.addFeedbackAuthUser()

        await page.waitForSelector(".merci-body")
        await expect(page.locator(".merci-body")).toHaveText("Merci !Votre commentaire a bien été pris en compteFermer")
        await page.locator("button", { hasText: "Fermer" }).click()

    });

})


