// -----------------------------------------------------
// To execute this test run `node 03_chai` in the terminal
// -----------------------------------------------------

const assert = require('assert');
const { Builder, By, Key } = require("selenium-webdriver");
const should = require('chai').should();
require('chromedriver');

async function chaiTest() {
    const driver = await new Builder().forBrowser('chrome').build();

    await driver.manage().setTimeouts({ implicit: 10000 });

    //navigate to the web app
    await driver.get('https://skryabin.com/market/quote.html');

    //make actions - type the password
    await driver.findElement(By.id('password')).sendKeys('123', Key.TAB);

    //check the error msg is available
    const errorMessage = await driver.findElement(By.id('password-error'));

    const isErrorMessageDisplayed = await errorMessage.isDisplayed();
    console.log(isErrorMessageDisplayed);

    //assert that error msg is displayed using Node JS assertion library
    assert.equal(isErrorMessageDisplayed, true)

    //assert that error msg is displayed using ChaiJS assertion library
    isErrorMessageDisplayed.should.be.true;

    // getting the error msg text
    const errorMessageText = await errorMessage.getText();
    console.log(errorMessageText);

    //check the text of the error msg using Node JS assertion library
    assert.strictEqual(errorMessageText, 'Please enter at least 5 characters.');

    //check the text of the error msg using Chai JS assertion library
    errorMessageText.should.equal('Please enter at least 5 characters.');
    errorMessageText.should.include('5 characters', 'There is no such phrase in the error message');

    //close the browser
    await driver.quit();

}

chaiTest();
