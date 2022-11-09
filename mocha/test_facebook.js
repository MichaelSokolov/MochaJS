// -----------------------------------------------------
// To execute all mocha tests sequentially run `npm run test` in the terminal
// To execute all mocha tests in parallel run `npm run parallel` in the terminal
// To open a report after tests execution run `npm run report` in the terminal
// -----------------------------------------------------

const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const should = require("chai").should();
require("chromedriver");
let fs = require('fs');
const addContext = require('mochawesome/addContext');

//describe block
describe("Test Facebook Sign In", function () {
    let driver;
    this.timeout(60000);

    beforeEach(async function () {
        // open the browser
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().setTimeouts({ implicit: 10000 });
        // navigate to the web app under the test
        await driver.get("https://www.facebook.com");

        // this part is for accepting a cookies pop up, which is not displayed in all countries
        try {
            await driver.wait(until.elementLocated(By.xpath('//*[contains(@title,"Allow essential")]')), 1000).click();
        } catch {
            console.log('The cookies pop-up is not displayed in your country')
        }

    })

    afterEach(async function () {
        // make a screenshot on failure
        if (this.currentTest.state == 'failed') {
            const image = await driver.takeScreenshot();
            //Save a screenshot to the root project folder
            fs.writeFileSync(`./screenshot_${this.currentTest.title}.png`, image, 'base64');
            //Add screenshot to the Mochawesome HTML report
            addContext(this, `../screenshot_${this.currentTest.title}.png`)
        }
        // close the browser
        await driver.quit();
    })

    // it block
    it("user creating a new account", async function () {
        await driver.findElement(By.css('a[data-testid*="registration"]')).click()
        await driver.findElement(By.css('input[name="firstname"]')).sendKeys("Michael")
        await driver.findElement(By.css('input[name="lastname"]')).sendKeys("Portnov")
        await driver.findElement(By.css('input[name="reg_email__"]')).sendKeys("michael.portnov@gmail.com")
        await driver.findElement(By.css('input[name*="email_conf"]')).sendKeys("michael.portnov@gmail.com")
        await driver.findElement(By.css('input#password_step_input')).sendKeys("topSecret")
        {
            const dropdown = await driver.findElement(By.css('select#day'))
            await dropdown.findElement(By.xpath('//option[. = "31"]')).click()
        }
        {
            const dropdown = await driver.findElement(By.css('select#month'))
            await dropdown.findElement(By.xpath('//option[. = "Dec"]')).click()
        }
        {
            const dropdown = await driver.findElement(By.css("select#year"))
            await dropdown.findElement(By.xpath('//option[. = "1990"]')).click()
        }
        await driver.findElement(By.css('input[name="sex"][value="2"]')).click()
    })
    it("user enters different emails", async function () {
        await driver.findElement(By.css('a[data-testid*="registration"]')).click()
        await driver.findElement(By.css('input[name="firstname"]')).sendKeys("Michael")
        await driver.findElement(By.css('input[name="lastname"]')).sendKeys("Portnov")
        await driver.findElement(By.css('input[name="reg_email__"]')).sendKeys("portnov.michael@gmail.com")
        await driver.findElement(By.css('input[name*="email_conf"]')).sendKeys("michael.portnov@gmail.com")
        await driver.findElement(By.css('input#password_step_input')).sendKeys("topSecret")
        await driver.findElement(By.id('password_step_input')).click()
        {
            const elements = await driver.findElements(By.xpath('(//div[3]/div/div/i)[1]'));
            elements.should.have.lengthOf(1);
        }
    })
})