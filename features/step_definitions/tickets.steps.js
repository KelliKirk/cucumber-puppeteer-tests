const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

When('Kasutaja valib avalehelt filmi', async function () {
  const movieLink = await this.page.waitForFunction(() => {
    const link = [...document.querySelectorAll('a[href*="/event/"]')].find((anchor) => {
      const text = anchor.textContent.trim();
      return (
        text.length > 3 &&
        anchor.offsetParent !== null &&
        !/salaseanss|eriseanss|kudumisklubi/i.test(text) &&
        !anchor.closest('nav, footer, .navigation')
      );
    });
    return link ? link.href : null;
  }, { timeout: 15000 });

  const href = await movieLink.jsonValue();
  expect(href).to.be.a('string');

  await this.page.goto(href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

When('Vajutab {string} nuppu', async function (buttonText) {
  const clicked = await this.page.evaluate((text) => {
    const match = [...document.querySelectorAll('a, button')].find((el) =>
      new RegExp(`^${text}$`, 'i').test(el.textContent.trim())
    );
    if (!match) return false;
    match.click();
    return true;
  }, buttonText);

  expect(clicked).to.be.true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

Then('Kõik seansid peaksid olema nähtavad', async function () {
  const hasSessions = await this.page.waitForFunction(
    () => {
      const section = document.querySelector('#section-shows');
      if (!section) return false;
      return /osta pileteid/i.test(section.innerText);
    },
    { timeout: 15000 }
  );

  expect(hasSessions).to.be.ok;
});

When('Kasutaja valib seansi ja vajutab {string} nuppu', async function (buttonText) {
  const clicked = await this.page.evaluate(() => {
    const buyLink = document.querySelector('#section-shows a.screening-card__button');
    if (buyLink) {
      buyLink.click();
      return true;
    }

    const fallback = [...document.querySelectorAll('#section-shows a')]
      .find((anchor) => /osta pileteid/i.test(anchor.textContent));
    if (fallback) {
      fallback.click();
      return true;
    }

    return false;
  });

  expect(clicked).to.be.true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

When('Valib modaalis {string}', async function (optionText) {
  const clicked = await this.page.evaluate((text) => {
    const match = [...document.querySelectorAll('a, button')].find((el) =>
      el.textContent.trim() === text
    );
    if (!match) return false;
    match.click();
    return true;
  }, optionText);

  expect(clicked).to.be.true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
});

Then('Avaneb pileti ostmise ja kohtade valimise lehekülg', async function () {
  const url = this.page.url();
  expect(url).to.include('/websales/show/');

  const hasTicketPage = await this.page.evaluate(() => {
    const bodyText = document.body.innerText;
    return /piletid/i.test(bodyText) && /istekohad|vali toolitüüp/i.test(bodyText);
  });

  expect(hasTicketPage).to.be.true;
});
