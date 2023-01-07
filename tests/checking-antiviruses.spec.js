const { test, chromium, expect } = require('@playwright/test')


test.describe('Checking Site and Extension with antivirus Avast', () => {

    test.describe.configure({ mode: 'parallel' });
    
    test('001 Checking Site with Avast Online Security & Privacy', async ({},testInfo) => {
        const pathToExtensionAvast = require('path').join(__dirname, 'my-extensions/avast');
        const context = await chromium.launchPersistentContext('', {
            headless: true,
            args: [
                `--disable-extensions-except=${pathToExtensionAvast}`,
                `--load-extension=${pathToExtensionAvast}`
            ]
        });
      
        const page = await context.newPage();
        await page.goto("https://franceverif.fr")
        await page.waitForTimeout(3000)
        const screenshot = await page.screenshot();
        await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    
        await expect(page).toHaveURL("https://franceverif.fr")
        await expect(page.locator(".title-container")).toHaveText("Dis au revoir aux arnaques &  bonjour aux bons plans avec les Eden  !")
        
    });
    
    
    test('002 Checking Extension with Avast Online Security & Privacy', async ({},testInfo) => {
        const pathToExtensionFV = require('path').join(__dirname, 'my-extensions/FV_Extension_CHROME_PROD');
        const pathToExtensionAvast = require('path').join(__dirname, 'my-extensions/avast');
        const context = await chromium.launchPersistentContext('', {
            headless: true,
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
