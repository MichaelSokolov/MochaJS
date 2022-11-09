// -----------------------------------------------------
// To execute this test run `node 02_waits` in the terminal
// To enable implicit wait uncomment lines #19 and #25
// -----------------------------------------------------

const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require('assert');
require('chromedriver');
require('geckodriver');

async function waits() {
    // 1. Start the session 
    const driver = await new Builder().forBrowser('chrome').build();
    // maximize the browser window 
    await driver.manage().window().maximize();
    // await driver.manage().window().setRect({ width: 640, height: 480 });

    // 2. Establish Waiting Strategy - implicit wait
    // await driver.manage().setTimeouts({ implicit: 10000 });

    // 3. Navigating to a web page
    await driver.get('https://www.portnov.com/load-image.html');

    //Try to locate image. Will fail without implicit wait
    // await driver.findElement(By.id('image'));

    //Try to locate image using explicit wait
    const imageLocator = By.id('image');
    await driver.wait(until.elementLocated(imageLocator), 6000);

    //check isElementVisible
    await driver.wait(until.elementIsVisible(await driver.findElement(imageLocator)), 6000);
    console.log("The visibility of the element: " + await driver.findElement(imageLocator).isDisplayed());

    //check titleIs
    await driver.wait(until.titleIs('Selenium test'), 1000);
    const title = await driver.getTitle();
    console.log("Title of the page is: " + title);

    // 8. End the session 
    await driver.quit();
}

waits();
