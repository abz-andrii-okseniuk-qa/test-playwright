const { test } = require('@playwright/test');

class Options {
    constructor(domain, url, token) {
        this.domain = domain;
        this.url = url
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