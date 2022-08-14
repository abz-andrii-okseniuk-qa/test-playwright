const { test, expect } = require('@playwright/test')
const { MailSlurp } = require("mailslurp-client");

test('can login and verify email address with mailslurp', async ({ page }) => {

    const apiKey = "4eee89e31a26c91f30c951371be6f59e333a6c25362a0dd14db3f4089a7e821f";

    const mailslurp = new MailSlurp({ apiKey })
    const { id, emailAddress } = await mailslurp.createInbox()

    await page.goto("/")

    await page.locator('text=Connexion').click();
    await page.waitForSelector("text=S’inscrire avec Email")

    await page.locator("text=S’inscrire avec Email").click()

    //fill form
    await page.locator("#firstName").fill("Andrey")
    await page.locator("#lastName").fill("Tester")
    await page.locator("#email").fill(emailAddress)
    await page.locator("#pass").fill("11111111")
    await page.locator("#passConfirm").fill("11111111")
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
    await page.locator('input').first().fill(code_1);
    await page.locator('input:nth-child(2)').first().fill(code_2);
    await page.locator('input:nth-child(3)').first().fill(code_3);
    await page.locator('.confirm-code-right > input').first().fill(code_4);
    await page.locator('.confirm-code-right > input:nth-child(2)').fill(code_5);
    await page.locator('.confirm-code-right > input:nth-child(3)').fill(code_6);

    await page.screenshot({ path: 'screenshot.png' })
    await page.locator(".confirm-button").click()

    await expect(page.locator(".auth-main")).toHaveText("Andrey Tester")

});