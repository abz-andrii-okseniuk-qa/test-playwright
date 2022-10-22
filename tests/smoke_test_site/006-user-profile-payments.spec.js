const { test, expect } = require('@playwright/test')
require('dotenv').config({ path: ".env.development" })

const AuthPage = require("../../utils/auth-page")
const UserProfilePage = require("../../pages/user-profile-page")

test("6.1 Adding payment card", async ({ browser, request }) => {

    const authPage = new AuthPage(browser, request)
    const page = await authPage.page()
    const profilePage = new UserProfilePage(page)

    const cardName = "Test Card"

    await page.goto('/fr/payments')

    await page.locator('button:has-text("Ajouter une carte")').click();

    await profilePage.fillStripeForm()

    await page.locator('[placeholder="John Doe"]').fill(cardName);
    await page.locator('text=Enregistrer pour les paiements futures').click();
    await page.locator('button:has-text("Ajouter cette carte")').click();

    await expect(await page.locator(".robot-result-text")).toHaveText("Carte ajoutée avec succès")
    await expect(await page.locator(".robot-result-description")).toHaveText("Cette carte peut maintenant être utilisée.")

    await page.locator('text=Retourner').click();
    await expect(await page.locator(".payments-page-cards-item-name")).toHaveText(cardName)

    await page.locator('.payments-page-cards-item-close').click();
    await page.locator('text=Es tu sûr de vouloir effacer ce moyen de paiement ?').click();

    await expect(await page.locator(".remove-card-title")).toHaveText("Es tu sûr de vouloir effacer ce moyen de paiement ?")
    await expect(await page.locator(".remove-card-text")).toHaveText("La carte sera retirée de la liste des méthodes de paiements du compte.")

    await page.locator('text=Effacer la carte').click();

})
