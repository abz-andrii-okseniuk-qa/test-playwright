const { test, expect } = require('@playwright/test')
const { MailSlurp } = require("mailslurp-client")
require('dotenv').config({ path: ".env.development" })

const AuthPage = require("../../utils/auth-page")
const UserProfilePage = require("../../pages/user-profile-page")


test("4.1 Auth and logout in the site", async ({ browser }) => {

    const context = await browser.newContext({
        storageState: {
            cookies: [{
                name: "_iub_cs-69562122",
                value: "%7B%22timestamp%22%3A%222022-07-30T15%3A14%3A49.734Z%22%2C%22version%22%3A%221.40.1%22%2C%22consent%22%3Atrue%2C%22id%22%3A69562122%2C%22cons%22%3A%7B%22rand%22%3A%22977021%22%7D%7D",
                domain: ".franceverif.fr",
                path: "/"
            }
            ]
        }
    });

    const page = await context.newPage();

    const profilePage = new UserProfilePage(page)

    await page.goto('/')
    await profilePage.auth()
    await expect(page).toHaveURL("/fr/dashboard")
    await profilePage.logout()
    await expect(page).toHaveURL("/")

})



test("4.2 Auth via Facebook", async ({ page }) => {

    test.skip(process.env.SERVER !== "prod", 'The test does not work on stage and dev. Because need to add an account to the FB test app.');

    const email = "qat6695@yahoo.com"
    const pass = process.env.FB_PASS

    await page.goto('/')
    await page.locator('text=Connexion').click()
    await page.locator('text=Connectez-vous !').click()

    const [page2] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator('button:has-text("S’inscrire via Facebook")').click()
    ]);
    await page2.locator('input[name="email"]').click()
    await page2.locator('input[name="email"]').fill(email)
    await page2.locator('input[name="pass"]').click()
    await page2.locator('input[name="pass"]').fill(pass)
    await page2.locator('text=Log In').click()

    await page.waitForSelector(".auth-main")
    await expect(page.locator(".auth-main")).toHaveText("Test QA Andrey")
    await page.goto("/fr/dashboard")
    await expect(page).toHaveURL("/fr/dashboard")

})



test.describe("4.3 Registration via email and reset pasword", async () => {

    const password = "11111111"
    const newPassword = "LVquMDz1zXxSSCw0OOJ"
    const apiKey = process.env.API_KEY_MAILSLURP

    test('4.3.1 Registration and verify email address with mailslurp', async ({ page }) => {

        const mailslurp = new MailSlurp({ apiKey })
        const { id, emailAddress } = await mailslurp.createInbox()

        process.env.emailAddress_mailslurp_1 = emailAddress
        process.env.id_mailslurp_1 = id

        await page.goto("/")

        await page.locator('text=Connexion').click();
        await page.waitForSelector("text=S’inscrire avec Email")

        await page.locator("text=S’inscrire avec Email").click()

        //fill form
        await page.locator("#firstName").fill("Andrey")
        await page.locator("#lastName").fill("Tester")
        await page.locator("#email").fill(emailAddress)
        await page.locator("#pass").fill(password)
        await page.locator("#passConfirm").fill(password)
        await page.locator("label", { hasText: "J’accepte la charte France Verif & les CGU de France Verif*" }).click()
        await page.locator("button", { hasText: "S'inscrire" }).click()

        await expect(page.locator(".confirm-title")).toHaveText("Un code vous a été envoyé !")

        // wait for verification code
        const emailMailslurp = await mailslurp.waitController.waitForLatestEmail({
            inboxId: id,
            timeout: 60000,
            unreadOnly: true,
        })

        const emailBody = await emailMailslurp.body;
        const index = emailBody.indexOf("code=")

        const code_1 = emailBody[index + 5]
        const code_2 = emailBody[index + 6]
        const code_3 = emailBody[index + 7]
        const code_4 = emailBody[index + 9]
        const code_5 = emailBody[index + 10]
        const code_6 = emailBody[index + 11]

        //fill verivication code
        await page.locator('input').first().fill(code_1)
        await page.locator('input:nth-child(2)').first().fill(code_2)
        await page.locator('input:nth-child(3)').first().fill(code_3)
        await page.locator('.confirm-code-right > input').first().fill(code_4)
        await page.locator('.confirm-code-right > input:nth-child(2)').fill(code_5)
        await page.locator('.confirm-code-right > input:nth-child(3)').fill(code_6)

        await page.locator(".confirm-button").click()

        await expect(page.locator(".auth-main")).toHaveText("Andrey Tester")

    });


    test("4.3.2 Reset password", async ({ page }) => {

        const userProfilePage = await new UserProfilePage(page)
        const mailslurp = new MailSlurp({ apiKey })

        await page.goto("/")

        await userProfilePage.auth(process.env.emailAddress_mailslurp_1, password)
        await expect(page).toHaveURL("/fr/dashboard")
        await userProfilePage.logout()

        await page.goto("/")
        await page.waitForSelector('text=Connexion')
        await page.locator('text=Connexion').click();
        await page.locator('text=Connectez-vous !').click();
        await page.locator('text=Mot de passe oublié ?').click();
        await page.waitForSelector(".forgot-password")
        await page.locator('[placeholder="mail\\@gmail\\.com"]').fill(process.env.emailAddress_mailslurp_1);
        await page.locator("button", { hasText: "Envoyer" }).click()
        await page.waitForSelector(".forgot-title")
        await expect(page.locator(".forgot-title")).toHaveText("Un email vous a été envoyé")
        await page.locator('.popup-close-handler').click();


        const emailResetPassword = await mailslurp.waitController.waitForLatestEmail({
            inboxId: process.env.id_mailslurp_1,
            timeout: 60000,
            unreadOnly: true,
        })

        const emailBody = emailResetPassword.body

        const r = /((class="link-main">)[^\s]+)/g
        const results = r.exec(emailBody)
        const url = decodeURIComponent(results)

        const urlResetPassword = url.replace('class="link-main">', '').replace("</a>", "").split(",")[0]

        await page.goto(urlResetPassword)

        await page.waitForSelector("#pass1")
        await page.locator("#pass1").fill(newPassword)
        await page.locator("#pass2").fill(newPassword)
        await page.locator("button", { hasText: "Réinitialiser le mot de passe" }).click()

        await page.goto("/")

        await userProfilePage.auth(process.env.emailAddress_mailslurp_1, newPassword)
        await expect(page).toHaveURL("/fr/dashboard")
        await userProfilePage.logout()

    });


    test("4.3.3 Reset password in user profile", async ({ page }) => {

        const userProfilePage = await new UserProfilePage(page)

        await page.goto("/")

        const email = process.env.emailAddress_mailslurp_1 ? process.env.emailAddress_mailslurp_1 : "test.mail9565@gmail.com"
        const currentPassword = email === "test.mail9565@gmail.com" ? "11111111" : newPassword

        await userProfilePage.auth(email, currentPassword)
        await page.goto("/fr/security")
        await userProfilePage.sendPasswordResetForm(currentPassword, "1234567QWER")

        await userProfilePage.logout()
        await page.goto("/")
        await userProfilePage.auth(email, "1234567QWER")
        await page.goto("/fr/security")
        await userProfilePage.sendPasswordResetForm("1234567QWER", "11111111")

    })


})


test("4.4 Edit user profile data", async ({ request, browser }) => {

    const authPage = new AuthPage(browser, request)
    const page = await authPage.page()

    await page.goto('/fr/profile')

    await page.locator('[placeholder="Albert"]').fill('Tester')
    await page.locator('[placeholder="Dupont"]').fill('QA')
    await page.locator('[placeholder="\\37  allée de la vigne"]').fill('kuvifedo@mailinator.com')
    await page.locator('[placeholder="\\39 4300"]').fill('1111111111111')
    await page.locator('[placeholder="Vincennes"]').fill('222222222222')
    await page.locator('[placeholder="\\+33хххххххххх"]').fill('+33333333333333')
    await page.locator('text=J’accepte de recevoir les informations et offres commerciales de France Verif').click()
    await page.locator('button:has-text("Je valide")').click()
    await expect(page.locator('text=Profil complété')).toHaveText("Profil complété")
    await page.locator('[placeholder="\\37  allée de la vigne"]').fill('')
    await page.locator('button:has-text("Je valide")').click()
    await expect(page.locator('text=Profil incomplet')).toHaveText("Profil incomplet")

})


