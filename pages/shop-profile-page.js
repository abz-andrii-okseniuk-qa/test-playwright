const GetToken = require('../utils/getToken')
const { URL_API_GETEWAY } = require("../utils/url-api-geteway")

class UserShopPage {
    constructor(page, request = null) {
        this.page = page
        this.request = request
    }

    async deleteShop(domain) {
        const getAdminToken = new GetToken(this.request, process.env.SERVER)
        const adminToken = await getAdminToken.admin()


        const responseGetShop = await this.request.get(`${URL_API_GETEWAY}/admin/shops?search=${domain}`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            }
        })

        const responseGetShopBody = await responseGetShop.json()

        let shopID

        for (const key of responseGetShopBody.data) {
            if (key.domain === domain) {
                shopID = key.id
            }
        }

        if (shopID) {
            await this.request.delete(`${URL_API_GETEWAY}/admin/shops/${shopID}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                }
            })
        }
    }
}

module.exports = UserShopPage;