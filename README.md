## Tests with Playwright

1. Clone this repository
2. Make sure you have `node.js` installed. If you don't, please visit [official website](https://nodejs.org/en/download/) for instructions 
3. Run `npm install` to install node modules
4. Run tests with `SERVER=dev EMAIL=test.mail9565@gmail.com PASSWORD=11111111 npx playwright test --headed` 
 - You do not need to specify `--headed` to run tests in headless mode.
 - To select a server, you need to specify in the variable `SERVER` `dev` or `stage` or `prod`