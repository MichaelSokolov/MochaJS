// -----------------------------------------------------
// To execute this test run `node 01_firstTest` in the terminal
// -----------------------------------------------------

const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require('assert');
require('chromedriver');

async function googleTest() {
    // 1. Start the session 
    const driver = await new Builder().forBrowser('chrome').build();

    // 2. Establish Waiting Strategy
    await driver.manage().setTimeouts({ implicit: 2000 });

    // 3. Navigating to a web page
    await driver.get('https://www.google.com');

    // this part is for accepting a cookies pop up, which is not displayed in all countries
    try {
        await driver.wait(until.elementLocated(By.id('L2AGLb')), 1000).click();
    } catch {
        console.log('The cookies pop-up is not displayed in your country')
    }

    // 4. Find an element (search input field)
    const searchField = await driver.findElement(By.name('q'));

    // 5. Take action on element (type "Portnov" to the search field)
    await searchField.sendKeys('Portnov', Key.ENTER);

    // 6. Request browser information   
    // verify the title is correct
    let titleText = await driver.getTitle();
    assert.strictEqual(titleText, "Portnov - Google Search");

    // 7. Request element information (assertions)
    // verify that result with content is displayed
    const isResultDisplayed = await driver.findElement(By.id('search')).isDisplayed();
    assert.equal(isResultDisplayed, true);

    // 8. End the session 
    await driver.quit();
}

googleTest();
