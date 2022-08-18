const { URL_API_GETEWAY } = require("./url-api-geteway")

class GetToken {

    constructor(request, server) {
        this.request = request
        this.server = server
    }

    async admin() {
        const response = await this.request.post(`${URL_API_GETEWAY}/auth/login`, {
            data: {
                email: this.server === "dev" || "stage" ? process.env.LOGIN_ADMIN_DEV : null,
                password: this.server === "dev" || "stage" ? process.env.PASSWORD_ADMIN_DEV : null
            }
        })

        const responseBody = await response.json()

        return responseBody.token
    }

    async site() {
        const response = await this.request.post(`${URL_API_GETEWAY}/auth/login`, {
            data: {
                email: this.server === "dev" || "stage" ? process.env.EMAIL : null,
                password: this.server === "dev" || "stage" ? process.env.PASSWORD : null
            }
        })

        const responseBody = await response.json()

        return responseBody.token
    }

}

module.exports = GetToken;