import puppeteer from 'puppeteer';

const STORE_MAP = {
  'data-shop-wellcome': 'wellcome',
  'data-shop-parknshop': 'parknshop',
  'data-shop-jasons': 'jasons',
  'data-shop-watsons': 'watsons',
  'data-shop-mannings': 'mannings',
  'data-shop-aeon': 'aeon',
  'data-shop-dchfood': 'dchfood',
  'data-shop-sasa': 'sasa',
  'data-shop-lungfung': 'lungfung',
};

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('https://online-price-watch.consumer.org.hk/opw/list/001/002/001', { waitUntil: 'networkidle2', timeout: 30000 });
await page.waitForSelector('.labels[data-code]', { timeout: 10000 }).catch(() => {});

const products = await page.evaluate((storeMap) => {
  const elements = document.querySelectorAll('.labels[data-code]');
  const results = [];
  elements.forEach(el => {
    const code = el.getAttribute('data-code');
    if (!code) return;
    const name = el.getAttribute('data-name') || '';
    const stores = {};
    const storePrices = {};
    for (const [attr, key] of Object.entries(storeMap)) {
      stores[key] = el.getAttribute(attr) === '1';
    }
    el.querySelectorAll('[data-label]').forEach(cell => {
      const label = cell.getAttribute('data-label');
      const singleSpan = cell.querySelector('[data-price-type="single"]');
      const text = singleSpan ? singleSpan.textContent : cell.textContent;
      const priceMatch = (text || '').match(/\$(\d+\.?\d*)/);
      if (priceMatch) {
        const priceVal = parseFloat(priceMatch[1]);
        if (!isNaN(priceVal) && priceVal > 0) {
          const labelMap = {'惠康':'wellcome','百佳':'parknshop','Market Place':'jasons','屈臣氏':'watsons','萬寧':'mannings','AEON':'aeon','大昌食品':'dchfood','莎莎':'sasa','龍豐':'lungfung'};
          const key = labelMap[label];
          if (key) storePrices[key] = priceVal;
        }
      }
    });
    results.push({ code, name, storePrices });
  });
  return results;
}, STORE_MAP);

console.log(JSON.stringify(products.slice(0, 3), null, 2));
await browser.close();
