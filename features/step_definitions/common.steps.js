const { Given } = require('@cucumber/cucumber');

const BASE_URL = 'https://www.apollokino.ee';

Given('Kasutaja avab Apollo Kino veebilehe', async function () {
  await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await this.page.waitForSelector('header', { timeout: 15000 });
});
