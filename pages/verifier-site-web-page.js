class VerifierSiteWebPage {

    constructor(page, domain) {
        this.page = page
        this.domain = domain
    }

    
    async open() {
        await this.page.goto("/fr/verifier-site-web");
    }

    async runSiteAnalysis() {
        await this.page.locator('[placeholder="Entrez une URL"]').click();
        await this.page.locator('[placeholder="Entrez une URL"]').fill(this.domain);
        await this.page.locator('text=Analyser le site').click();
    }

    async confirmationPopup (){
        await this.page.locator('text=J’accepte la charte France Verif').click();
        await this.page.locator('text=J’accepte les CGU de France Verif').click();
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.locator('button:has-text("Suivant")').click()
        ]);
    }

}

module.exports = VerifierSiteWebPage;