const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://www.apollokino.ee', { waitUntil: 'networkidle2', timeout: 60000 });

  const cookieBtns = await page.evaluate(() =>
    [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean)
  );
  console.log('Buttons:', cookieBtns.slice(0, 25));

  const searchElements = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('[aria-label], button, a, input').forEach((el) => {
      const text = (el.textContent || el.getAttribute('aria-label') || el.placeholder || '').trim();
      if (/otsi|search/i.test(text) || el.type === 'search') {
        results.push({
          tag: el.tagName,
          text: text.slice(0, 60),
          class: (el.className || '').toString().slice(0, 80),
          aria: el.getAttribute('aria-label'),
        });
      }
    });
    return results;
  });
  console.log('Search elements:', JSON.stringify(searchElements, null, 2));

  const navLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a')]
      .map((a) => ({ text: a.textContent.trim(), href: a.href }))
      .filter((l) => /kinokava|kava/i.test(l.text + l.href))
  );
  console.log('Kinokava links:', JSON.stringify(navLinks, null, 2));

  const minecraft = await page.evaluate(() =>
    [...document.querySelectorAll('a, h1, h2, h3, span')]
      .map((el) => el.textContent.trim())
      .filter((t) => /minecraft/i.test(t))
  );
  console.log('Minecraft mentions:', minecraft);

  const headerLinks = await page.evaluate(() =>
    [...document.querySelectorAll('header a, nav a')]
      .map((a) => ({ text: a.textContent.trim(), href: a.href }))
      .filter((l) => l.text)
  );
  console.log('Header/nav links:', JSON.stringify(headerLinks.slice(0, 20), null, 2));

  await browser.close();
})();
