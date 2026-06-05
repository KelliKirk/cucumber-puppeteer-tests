const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { launchBrowser } = require('./browser');

setDefaultTimeout(60 * 1000);

Before(async function () {
  this.browser = await launchBrowser();
  this.page = await this.browser.newPage();
  await this.page.setViewport({ width: 1280, height: 800 });
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});
