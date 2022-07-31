class DomainPage {

    constructor(page, domain){
        this.page = page
        this.domain = domain
    }

    async open (){
        await this.page.goto(`/fr/site/${this.domain}`)
    }

}

module.exports = DomainPage;