class UserProfilePage {

    constructor(page) {
        this.page = page
    }

    async auth(email=process.env.EMAIL, pass=process.env.PASSWORD) {
        await this.page.locator('text=Connexion').click();
        await this.page.locator('text=Connectez-vous !').click();
        await this.page.locator('[placeholder="mail\\@gmail\\.com"]').fill(email);
        await this.page.locator('[placeholder="Mot de passe"]').fill(pass);
        await this.page.locator('button:has-text("Se connecter")').click();
        await this.page.locator('.auth-main').click();
        await this.page.locator('text=Mon espace').click()
    }

    async logout() {
        await this.page.waitForSelector(".auth-main")
        await this.page.locator(".auth-main").click()
        await this.page.locator(".auth-content > li", { hasText: "Se déconnecter" }).click()
        await this.page.locator("button", {hasText: "Je ferme"}).click()
    }

    async sendPasswordResetForm (currentPassword, newPasword) {
        await this.page.locator("label:text('Ancien mot de passe') ~ input").fill(currentPassword)
        await this.page.locator('[placeholder="\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*"]').fill(newPasword)
        await this.page.locator("label:text('Confirmer le nouveau mot de passe') ~ input").fill(newPasword)
        await this.page.locator('.formButtonWrapper').click();
        await this.page.locator('.formButtonWrapper').click();
    }

    async fillStripeForm(){
        const card = process.env.SERVER === "prod" ? JSON.parse(process.env.CARD_PROD) : JSON.parse(process.env.CARD_TEST)

        await this.page.frameLocator('iframe[title="Cadre sécurisé pour la saisie du numéro de carte"]').locator('[name="cardnumber"]').fill(card.number);
        await this.page.frameLocator(`iframe[title="Cadre sécurisé pour la saisie de la date d'expiration"]`).locator('[name="exp-date"]').fill(card.expired);
        await this.page.frameLocator('iframe[title="Cadre sécurisé pour la saisie du code de sécurité CVC"]').locator('[name="cvc"]').fill(card.cvv);
    }

}

module.exports = UserProfilePage;