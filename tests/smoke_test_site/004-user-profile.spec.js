const { test, expect } = require('@playwright/test')

const UserProfilePage = require("../../pages/user-profile")


//SERVER=dev EMAIL=test.mail9565@gmail.com PASSWORD=11111111 npx playwright test 004-user-profile.spec.js --headed

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

    await profilePage.open()
    await profilePage.auth()
    await expect(page).toHaveURL("/fr/dashboard")
    await profilePage.logout()
    await expect(page).toHaveURL("/")

})