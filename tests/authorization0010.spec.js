const { test } = require('@playwright/test');

//SERVER=dev EMAIL=test.mail9565@gmail.com PASSWORD=11111111 npx playwright test authorization0010.spec.js --headed

test("Authorization in the site via email and password", async ({ browser }) => {

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

    await page.goto("/");

    await page.locator('text=Connexion').click();
    await page.locator('text=Connectez-vous !').click();
    await page.locator('[placeholder="mail\\@gmail\\.com"]').fill(process.env.EMAIL);
    await page.locator('[placeholder="Mot de passe"]').fill(process.env.PASSWORD);
    await page.locator('button:has-text("Se connecter")').click();
    await page.locator('.auth-main').click();
    await page.locator('text=Mon espace').click()

})
