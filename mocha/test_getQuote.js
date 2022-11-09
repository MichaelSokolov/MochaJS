// -----------------------------------------------------
// To execute all mocha tests sequentially run `npm run test` in the terminal
// To execute all mocha tests in parallel run `npm run parallel` in the terminal
// To open a report after tests execution run `npm run report` in the terminal
// -----------------------------------------------------

const { Builder, By, Key } = require("selenium-webdriver");
const should = require('chai').should();
require('chromedriver');
const addContext = require('mochawesome/addContext');
const fs = require('fs');

// describe block
describe('GetQuote - Tests password functionality', function () {
    let driver;
    this.retries(3);
    this.timeout(60000);

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({ implicit: 10000 });
        //navigate to the web app
        await driver.get('https://skryabin.com/market/quote.html');
    })

    afterEach(async function () {
        if (this.currentTest.state == 'failed') {
            //make a screenshot
            const image = await driver.takeScreenshot();
            //Save a screenshot to the root project folder
            fs.writeFileSync(`./screenshot_${this.currentTest.title}.png`, image, 'base64');
            //Add screenshot to the Mochawesome HTML report
            addContext(this, `../screenshot_${this.currentTest.title}.png`)
        }
        //close the browser
        await driver.quit();
    })

    //it block
    it('user enters a short password', async function () {
        //make actions - type password
        await driver.findElement(By.id('password')).sendKeys('123', Key.TAB);

        //check the error msg is displayed
        const errorMessage = await driver.findElement(By.id('password-error'));
        const isErrorMessageDisplayed = await errorMessage.isDisplayed();

        //assert that error msg is displayed using ChaiJS assertion library
        isErrorMessageDisplayed.should.be.true;

        // getting the error msg tex
        const errorMessageText = await errorMessage.getText();

        //check the text of the error msg using Chai JS assertion library
        errorMessageText.should.equal('Please enter at least 5 characters.');
        errorMessageText.should.include('5 characters', 'There is no such phrase in the error message');
    })
    it('user enters different passwords', async function () {
        //make actions - type password and confirm password
        await driver.findElement(By.id('password')).sendKeys('12345');
        await driver.findElement(By.id('confirmPassword')).sendKeys('54321', Key.TAB)

        //check the error msg is available
        const errorMessage = await driver.findElement(By.id('confirmPassword-error'));
        const isErrorMessageDisplayed = await errorMessage.isDisplayed();

        //assert that error msg is displayed using ChaiJS assertion library
        isErrorMessageDisplayed.should.be.true;

        // getting the error msg tex
        const errorMessageText = await errorMessage.getText();

        //check the text of the error msg using Chai JS assertion library
        errorMessageText.should.equal('Passwords do not match!');
    })
})
