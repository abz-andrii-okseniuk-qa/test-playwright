const { email } = require("../utils/test-data")

class DomainPage {

    constructor(page, domain) {
        this.page = page
        this.domain = domain
    }

    async open() {
        await this.page.goto(`/fr/site/${this.domain}`)
    }

    async openFeedbackForm() {
        await this.page.waitForSelector(".commentTopButton")
        await this.page.locator(".commentTopButton").click()
    }

    async addFeedbackAuthUser(text="Test message - Lorem ipsum dolor sit amet, co") {
        await this.page.locator(".rating-list").first().click()
        await this.page.locator("label", { hasText: "Je n'ai jamais acheté sur ce site" }).click()
        await this.page.locator("label", { hasText: "Autre" }).click()
        await this.page.locator(`[name='message']`).fill(text)
        await this.page.locator("button", { hasText: "Envoyer" }).click()
    }

    async addFeedbackNotAuthUser(text="Test message - Lorem ipsum dolor sit amet, co") {
        await this.page.locator(".rating-list").first().click()
        await this.page.locator("label", { hasText: "Je n'ai jamais acheté sur ce site" }).click()
        await this.page.locator("label", { hasText: "Autre" }).click()
        await this.page.locator(`[name='message']`).fill(text)
        await this.page.locator("label", { hasText: 'Prénom' }).fill("Isabelle")
        await this.page.locator("label", { hasText: 'Email' }).fill(email)
        await this.page.locator("button", { hasText: "Envoyer" }).click()
    }

}

module.exports = DomainPage;