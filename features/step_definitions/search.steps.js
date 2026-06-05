const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

When('Kasutaja vajutab otsinguikoonile', async function () {
  const searchOpened = await this.page.evaluate(() => {
    const toggle = document.querySelector('.header__search-toggle');
    if (toggle) {
      toggle.click();
      return true;
    }
    return false;
  });

  if (!searchOpened) {
    await this.page.focus('input[name="query"]');
  }

  await this.page.waitForSelector('input[name="query"]', { visible: true });
});

When('Kasutaja sisestab filmi nime {string}', async function (movieName) {
  this.searchQuery = movieName;
  const input = await this.page.waitForSelector('input[name="query"]');
  await input.click({ clickCount: 3 });
  await input.type(movieName, { delay: 30 });
});

When('Vajutab Enter', async function () {
  await this.page.evaluate((query) => {
    const input = document.querySelector('input[name="query"]');
    if (!input) return;
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const form = input.closest('form');
    if (form) form.submit();
  }, this.searchQuery);

  await this.page.waitForFunction(
    () => document.readyState === 'complete' || document.readyState === 'interactive',
    { timeout: 15000 }
  );
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

Then('Otsingutulemused peaksid sisaldama filmi {string}', async function (movieName) {
  const url = this.page.url();
  expect(url).to.include('/search/events');

  const bodyText = await this.page.evaluate(() => document.body.innerText);
  expect(bodyText).to.match(new RegExp(movieName, 'i'));
});
