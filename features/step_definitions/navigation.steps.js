const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

When('Kasutaja vajutab menüüs nupule {string}', async function (menuItem) {
  const clicked = await this.page.evaluate((text) => {
    const match = [...document.querySelectorAll('a, button')].find((el) =>
      el.textContent.trim() === text
    );
    if (!match) return false;
    match.click();
    return true;
  }, menuItem);

  expect(clicked).to.be.true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

When('Kasutaja ootab lehe laadimist', async function () {
  await this.page.waitForFunction(
    () => document.readyState === 'complete' || document.readyState === 'interactive',
    { timeout: 15000 }
  );
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

Then('Kasutaja peaks nägema kinoseansside nimekirja', async function () {
  const url = this.page.url();
  expect(url).to.include('/schedule');

  const hasSessions = await this.page.evaluate(() => {
    const bodyText = document.body.innerText;
    return /osta pileteid/i.test(bodyText) && /kinokava|seanss/i.test(bodyText);
  });

  expect(hasSessions).to.be.true;
});
