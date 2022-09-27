const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const service = new chrome.ServiceBuilder('./chromedriver.exe');

async function build(URL) {
  let driver = await new Builder().forBrowser('chrome').setChromeService(service).setChromeOptions(new chrome.Options().headless().addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")).build();
  //await driver.get('https://www.amazon.ca/LG-27GL83A-B-27-Inch-Led-Lit-14700510/dp/B07YGZL8XF');
  await driver.get(URL);
  const price_locations = [By.className('a-price'), By.id('price')];
  for (price_location of price_locations) {
    let price = await driver.findElement(price_location).getText();
    if (price !== "") { // If true, element exists, otherwise element doesn't exist.
      price = price.split('\n').join('.');
      console.log(`Debug: (${price})`);
      await driver.quit();
      return price;
    }
  }
  await driver.quit();
  return "Cannot find price";
};

module.exports.build = build;

/*
Example links:
https://www.amazon.ca/Real-Book-6th-Leonard-Corp/dp/0634060384 - id price
https://www.amazon.ca/LG-UltraGear-34GP83A-B-Adaptive-Sync-Compatible/dp/B08DWD38VX - className a-price
*/
