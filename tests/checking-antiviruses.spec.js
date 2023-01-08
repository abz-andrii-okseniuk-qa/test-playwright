const { test, chromium, expect } = require('@playwright/test')


const isHeadless = true

class checkingSiteWithAntivirus {

    constructor(context, testInfo) {
        this.context = context
        this.testInfo = testInfo
    }

    async checkingSite (){
        const page = await this.context.newPage();

        await page.waitForTimeout(2000)
        await page.goto("https://franceverif.fr")
        await page.waitForTimeout(3000)
        await expect(page).toHaveURL("https://franceverif.fr/")
        await expect(page.locator(".title-container")).toHaveText("Dis au revoir aux arnaques &  bonjour aux bons plans avec les Eden  !")

        const screenshot = await page.screenshot();
        await this.testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });

        await page.getByRole('button', { name: 'Accepter' }).click();
        await page.getByRole('link', { name: 'Catégories' }).first().click();
        await expect(page).toHaveURL("https://franceverif.fr/fr/categories")
        await page.getByRole('link', { name: 'Eden' }).click();
        await expect(page).toHaveURL("https://franceverif.fr/fr/eden")
    }
}

test.describe.configure({ mode: 'parallel' });

test.describe('Checking Site and Extension with antivirus Avast', () => {
    
    test('001 Checking Site with Avast Online Security & Privacy', async ({},testInfo) => {
        const pathToExtensionAvast = require('path').join(__dirname, 'my-extensions/avast');
        const context = await chromium.launchPersistentContext('', {
            headless: isHeadless,
            args: [
                `--disable-extensions-except=${pathToExtensionAvast}`,
                `--load-extension=${pathToExtensionAvast}`
            ]
        });
        
        const site = new checkingSiteWithAntivirus(context,testInfo)
        await site.checkingSite()
        
    });
    
    
    test('002 Checking Extension with Avast Online Security & Privacy', async ({},testInfo) => {
        test.skip(true,"Temporarily extension tests don't work in headless mode");
        const pathToExtensionFV = require('path').join(__dirname, 'my-extensions/FV_Extension_CHROME_PROD');
        const pathToExtensionAvast = require('path').join(__dirname, 'my-extensions/avast');
        const context = await chromium.launchPersistentContext('', {
            headless: isHeadless,
            args: [
                `--disable-extensions-except=${pathToExtensionFV},${pathToExtensionAvast}`,
                `--load-extension=${pathToExtensionFV},${pathToExtensionAvast}`
            ]
        });
      
        const page = await context.newPage();
        await page.waitForTimeout(3000)
        await page.goto("https://www.amazon.fr/Apple-iPhone-11-Rouge-Reconditionn%C3%A9/dp/B082DN7RVM")
        await page.waitForTimeout(3000)
        await page.getByText('Vérifier l\'authenticité').click();
        await page.waitForTimeout(3000)
        const screenshot = await page.screenshot();
        await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
        await page.waitForTimeout(1000)
        await expect(page.locator(".greenText")).toHaveText("Excellente !")
        
    });

});


test('003 Checking Site with AVG Online Security', async ({},testInfo) => {
    const pathToExtensionAVG = require('path').join(__dirname, 'my-extensions/AVG_Online_Security');
    const context = await chromium.launchPersistentContext('', {
        headless: isHeadless,
        args: [
            `--disable-extensions-except=${pathToExtensionAVG}`,
            `--load-extension=${pathToExtensionAVG}`
        ]
    });
  
    const site = new checkingSiteWithAntivirus(context,testInfo)
    await site.checkingSite()
    
});

test('004 Checking Site with Online Security Pro', async ({},testInfo) => {
    const pathToExtensionSecurityPro = require('path').join(__dirname, 'my-extensions/Online-Security-Pro');
    const context = await chromium.launchPersistentContext('', {
        headless: isHeadless,
        args: [
            `--disable-extensions-except=${pathToExtensionSecurityPro}`,
            `--load-extension=${pathToExtensionSecurityPro}`
        ]
    });
  
    const site = new checkingSiteWithAntivirus(context,testInfo)
    await site.checkingSite()
    
});

test('005 Checking Site with WOT Website Security & Privacy Protection', async ({},testInfo) => {
    const pathToExtensionWOT = require('path').join(__dirname, 'my-extensions/WOT-Website-Security');
    const context = await chromium.launchPersistentContext('', {
        headless: isHeadless,
        args: [
            `--disable-extensions-except=${pathToExtensionWOT}`,
            `--load-extension=${pathToExtensionWOT}`
        ]
    });
  
    const site = new checkingSiteWithAntivirus(context,testInfo)
    await site.checkingSite()
    
});