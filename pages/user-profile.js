class UserProfilePage {

    constructor(page) {
        this.page = page
    }

    async open() {
        await this.page.goto(`/`)
    }

    async auth() {
        await this.page.locator('text=Connexion').click();
        await this.page.locator('text=Connectez-vous !').click();
        await this.page.locator('[placeholder="mail\\@gmail\\.com"]').fill(process.env.EMAIL);
        await this.page.locator('[placeholder="Mot de passe"]').fill(process.env.PASSWORD);
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

}

module.exports = UserProfilePage;