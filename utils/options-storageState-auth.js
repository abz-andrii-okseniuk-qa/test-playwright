class Options {
    constructor(domain, token) {
        this.domain = domain;
        this.url = process.env.SERVER === "dev" ? "https://franceverif-dev.franceverif.fr" : process.env.SERVER === "stage" ? "https://franceverif-stage.franceverif.fr" : process.env.SERVER === "prod" ? "https://franceverif.fr" : "https://franceverif-dev.franceverif.fr"
        this.token = token

        this.data = {
            baseURL: this.url,
            storageState: {
                cookies: [{
                    name: "isAuth",
                    value: "true",
                    domain,
                    path: "/"
                },
                {
                    name: "token",
                    value: this.token,
                    domain,
                    path: "/"
                }
                ],
                origins: [{
                    origin: this.url,
                    localStorage: [{
                        name: "token",
                        value: this.token
                    },
                    {
                        name: "isOldToken",
                        value: this.token
                    }
                    ]
                }]
            }
        }

    }

}

module.exports = Options;