const GetToken = require('../utils/getToken')
const { URL_API_GETEWAY } = require("../utils/url-api-geteway")
const testData = require('../utils/test-data');

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


    async createShop(domain) {
        await this.page.locator('[placeholder="Nom Entreprise"]').fill(testData.SHOP_CREATION_DATA.name)
        await this.page.locator('[placeholder="Ma fonction"]').fill(testData.SHOP_CREATION_DATA.userPosition)
        await this.page.locator('[placeholder="\\37  allée de la vigne"]').fill(testData.SHOP_CREATION_DATA.address)
        await this.page.locator('[placeholder="\\39 4300"]').fill(testData.SHOP_CREATION_DATA.postalCode)
        await this.page.locator('[placeholder="Vincennes"]').fill(testData.SHOP_CREATION_DATA.city)
        await this.page.locator('text=Numéro de SiretLe numéro de Siret doit contenir 14 caractères >> [placeholder="\\30 00000000000000"]').fill(testData.SHOP_CREATION_DATA.siret);
        await this.page.locator('text=Numéro de TVALe numéro de TVA doit contenir entre 4 et 16 caractères >> [placeholder="\\30 00000000000000"]').fill(testData.SHOP_CREATION_DATA.tva);
        await this.page.locator('[placeholder="mail\\@gmail\\.com"]').fill(testData.SHOP_CREATION_DATA.email);
        await this.page.locator('[placeholder="\\30 0\\.00\\.00\\.00\\.00"]').fill(testData.SHOP_CREATION_DATA.phone);
        await this.page.locator('[placeholder="monentreprise\\.com"]').fill(domain);

        await this.page.locator('button:has-text("Je valide")').click();
    }
}

module.exports = UserShopPage;