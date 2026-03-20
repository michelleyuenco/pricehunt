import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('https://online-price-watch.consumer.org.hk/opw/search/雞蛋', { waitUntil: 'networkidle2', timeout: 30000 });
await page.waitForSelector('.labels[data-code]', { timeout: 10000 });

const result = await page.evaluate(() => {
  const el = document.querySelector('.labels[data-code]');
  if (!el) return { error: 'no element' };
  
  const dlCells = el.querySelectorAll('[data-label]');
  const prices = {};
  
  dlCells.forEach(cell => {
    const label = cell.getAttribute('data-label');
    const singleSpan = cell.querySelector('[data-price-type="single"]');
    const text = singleSpan ? singleSpan.textContent : cell.textContent;
    const match = (text || '').match(/\$(\d+\.?\d*)/);
    if (match) prices[label] = parseFloat(match[1]);
  });
  
  return {
    code: el.getAttribute('data-code'),
    name: el.getAttribute('data-name'),
    dlCount: dlCells.length,
    prices,
    firstCellHTML: dlCells[0]?.outerHTML?.substring(0, 300),
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
