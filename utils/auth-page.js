const Options = require('./options-storageState-auth');
const GetToken = require('./getToken')

class AuthPage {
    constructor(browser, request){
        this.browser = browser
        this.request = request
    }

    async page (){
        const siteToken = new GetToken(this.request, process.env.SERVER)
        const token = await siteToken.site()
        const options = new Options(process.env.SERVER, token)
        const context = await this.browser.newContext(options.data)
        const page = await context.newPage()

        return page
    }
}


module.exports = AuthPage;