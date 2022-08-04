const { URL_API_GETEWAY } = require("./url-api-geteway")

class AdminToken {

    constructor(request, server) {
        this.request = request
        this.server = server
    }

    async getToken() {
        const responseGetAdmonToken = await this.request.post(`${URL_API_GETEWAY}/auth/login`, {
            data: {
                email: this.server === "dev" || "stage" ? "admin@gmail.com" : null,
                password: this.server === "dev" || "stage" ? "MK7bLn3Lp9BnnP" : null
            }
        })

        const responseBodyAdmonToken = await responseGetAdmonToken.json()

        return responseBodyAdmonToken.token
    }

}

module.exports = AdminToken;