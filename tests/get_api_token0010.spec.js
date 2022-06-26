const { test } = require('@playwright/test');

test('Getting Tooken via POST /auth/login', async ({ request }) => {

    // Create a repository.
    const response = await request.post('https://api-gateway-dev.franceverif.fr/auth/login', {
        data: {
            email: "andrii.okseniuk@abz.agency",
            password: "11111111"
        }
    });

    const res = await response.json()

    process.env.API_TOKEN = res.token

    console.log(process.env.API_TOKEN);

});

