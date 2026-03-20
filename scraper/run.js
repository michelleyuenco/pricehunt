/**
 * GaakGaa Consumer Council Price Scraper
 * Scrapes https://online-price-watch.consumer.org.hk/opw/
 * and writes products to Firestore collection: officialPrices/{productCode}
 *
 * Usage:
 *   node run.js          -- full scrape
 *   node run.js --test   -- scrape only first 3 leaf categories
 */

import puppeteer from 'puppeteer';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ── Firebase setup ──────────────────────────────────────────────────────────
initializeApp({ projectId: 'gaak-gaa' });
const db = getFirestore();

const BASE_URL = 'https://online-price-watch.consumer.org.hk';
const isTest = process.argv.includes('--test');
const isDryRun = process.argv.includes('--dry-run');

// Store data-attribute name → canonical key mapping
const STORE_MAP = {
  'data-shop-wellcome':   'wellcome',
  'data-shop-parknshop':  'parknshop',
  'data-shop-jasons':     'jasons',
  'data-shop-watsons':    'watsons',
  'data-shop-mannings':   'mannings',
  'data-shop-aeon':       'aeon',
  'data-shop-dchfood':    'dchfood',
  'data-shop-sasa':       'sasa',
  'data-shop-lungfung':   'lungfung',
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Collect all leaf-level category URLs from the sidebar.
 * The sidebar structure is: top-level → sub → leaf (/opw/list/XXX/YYY/ZZZ)
 */
async function collectCategoryUrls(page) {
  console.log('📡 Loading main page to collect category URLs...');
  await page.goto(`${BASE_URL}/opw/`, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for sidebar links
  await page.waitForSelector('a[href*="/opw/list/"]', { timeout: 15000 }).catch(() => {});

  const urls = await page.evaluate((base) => {
    const links = Array.from(document.querySelectorAll('a[href*="/opw/list/"]'));
    const hrefs = links.map(a => a.getAttribute('href')).filter(Boolean);

    // Keep only hrefs that look like leaf-level: /opw/list/XXX/YYY/ZZZ (3 segments after /list/)
    const leaf = hrefs.filter(h => {
      const parts = h.replace('/opw/list/', '').split('/').filter(Boolean);
      return parts.length >= 3;
    });

    // Deduplicate
    return [...new Set(leaf.map(h => base + h))];
  }, BASE_URL);

  console.log(`✅ Found ${urls.length} leaf categories`);
  return urls;
}

/**
 * Extract all products from a category page.
 */
async function extractProducts(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for product elements (or timeout gracefully)
    await page.waitForSelector('.labels[data-code]', { timeout: 10000 }).catch(() => {});

    const products = await page.evaluate((storeMap) => {
      const elements = document.querySelectorAll('.labels[data-code]');
      const results = [];

      elements.forEach(el => {
        const code = el.getAttribute('data-code');
        if (!code) return;

        const brand = el.getAttribute('data-brand') || '';
        const name = el.getAttribute('data-name') || '';
        const minPriceRaw = el.getAttribute('data-min-single-price');
        const minPrice = minPriceRaw ? parseFloat(minPriceRaw) : null;
        const cat1 = el.getAttribute('data-cat1') || '';
        const cat2 = el.getAttribute('data-cat2') || '';
        const cat3 = el.getAttribute('data-cat3') || '';

        const stores = {};
        const storePrices = {};
        const storeOrder = ['wellcome', 'parknshop', 'jasons', 'watsons', 'mannings', 'aeon', 'dchfood', 'sasa', 'lungfung'];
        
        for (const [attr, key] of Object.entries(storeMap)) {
          stores[key] = el.getAttribute(attr) === '1';
        }

        // Extract per-store prices from child cells with data-label
        el.querySelectorAll('[data-label]').forEach(cell => {
          const label = cell.getAttribute('data-label');
          const singleSpan = cell.querySelector('[data-price-type="single"]');
          const text = singleSpan ? singleSpan.textContent : cell.textContent;
          const priceMatch = (text || '').match(/\$([\d.]+)/);
          if (priceMatch) {
            const priceVal = parseFloat(priceMatch[1]);
            if (!isNaN(priceVal) && priceVal > 0) {
              // Map Chinese store labels to English keys
              const labelMap = {'惠康':'wellcome','百佳':'parknshop','Market Place':'jasons','屈臣氏':'watsons','萬寧':'mannings','AEON':'aeon','大昌食品':'dchfood','莎莎':'sasa','龍豐':'lungfung'};
              const key = labelMap[label];
              if (key) storePrices[key] = priceVal;
            }
          }
        });

        results.push({ code, brand, name, minPrice, cat1, cat2, cat3, stores, storePrices });
      });

      return results;
    }, STORE_MAP);

    return products;
  } catch (err) {
    console.warn(`  ⚠️  Failed to scrape ${url}: ${err.message}`);
    return [];
  }
}

/**
 * Write a batch of products to Firestore.
 * Uses batched writes (max 500 per batch).
 */
async function writeToFirestore(products) {
  const MAX_BATCH = 400;
  let written = 0;

  const entries = Object.entries(products);
  for (let i = 0; i < entries.length; i += MAX_BATCH) {
    const chunk = entries.slice(i, i + MAX_BATCH);
    const batch = db.batch();

    for (const [code, product] of chunk) {
      const ref = db.collection('officialPrices').doc(code);
      batch.set(ref, {
        ...product,
        source: 'consumer.org.hk',
        scrapedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    await batch.commit();
    written += chunk.length;
    console.log(`  💾 Written ${written}/${entries.length} products...`);
  }

  return written;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 GaakGaa Consumer Council Scraper starting...');
  if (isDryRun) console.log('🔍 DRY-RUN MODE — will NOT write to Firestore');
  console.log(isTest ? '🧪 TEST MODE — scraping only 3 categories' : '🌐 FULL MODE — scraping all categories');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  let categoryUrls;
  try {
    categoryUrls = await collectCategoryUrls(page);
  } catch (err) {
    console.error('❌ Failed to collect categories:', err.message);
    await browser.close();
    process.exit(1);
  }

  if (categoryUrls.length === 0) {
    console.warn('⚠️  No leaf categories found. Trying fallback approach...');
    // Fallback: common known category patterns
    categoryUrls = [];
    for (let i = 1; i <= 20; i++) {
      const padded = String(i).padStart(3, '0');
      categoryUrls.push(`${BASE_URL}/opw/list/${padded}`);
    }
    console.log(`  Using ${categoryUrls.length} fallback category URLs`);
  }

  if (isTest) {
    categoryUrls = categoryUrls.slice(0, 3);
    console.log('🧪 Test URLs:', categoryUrls);
  }

  const allProducts = {}; // code → product data (deduplicated)
  let totalScraped = 0;

  for (let i = 0; i < categoryUrls.length; i++) {
    const url = categoryUrls[i];
    console.log(`📂 Scraping category ${i + 1}/${categoryUrls.length}: ${url}`);

    const products = await extractProducts(page, url);
    console.log(`  Found ${products.length} products`);

    for (const p of products) {
      if (!allProducts[p.code]) {
        allProducts[p.code] = {
          code: p.code,
          brand: p.brand,
          name: p.name,
          minPrice: p.minPrice,
          currency: 'HK$',
          category: [p.cat1, p.cat2, p.cat3].filter(Boolean).join('/'),
          stores: p.stores,
          storePrices: p.storePrices || {},
        };
      }
    }

    totalScraped += products.length;
    console.log(`  📊 Total unique products so far: ${Object.keys(allProducts).length}`);

    // Rate limiting: 2 second delay between pages
    if (i < categoryUrls.length - 1) {
      await sleep(2000);
    }
  }

  await browser.close();

  const uniqueCount = Object.keys(allProducts).length;
  console.log(`\n✅ Scraping complete!`);
  console.log(`  Categories scraped: ${categoryUrls.length}`);
  console.log(`  Total product entries: ${totalScraped}`);
  console.log(`  Unique products: ${uniqueCount}`);

  if (uniqueCount === 0) {
    console.warn('⚠️  No products found — check selectors or site structure');
    process.exit(0);
  }

  if (isDryRun) {
    console.log('\n🔍 DRY-RUN: Skipping Firestore write. Sample product:');
    const sample = Object.values(allProducts)[0];
    if (sample) console.log(JSON.stringify(sample, null, 2));
    // Save to JSON file
    const fs = await import('fs');
    const outPath = './scraped-products.json';
    fs.writeFileSync(outPath, JSON.stringify(Object.values(allProducts), null, 2));
    console.log(`\n📁 Saved ${uniqueCount} products to ${outPath}`);
    console.log(`\n🎉 Dry-run complete! ${uniqueCount} products would be written.`);
    return;
  }

  console.log(`\n💾 Writing ${uniqueCount} products to Firestore...`);
  const written = await writeToFirestore(allProducts);

  console.log(`\n🎉 Done! Summary:`);
  console.log(`  Categories scraped : ${categoryUrls.length}`);
  console.log(`  Total entries found: ${totalScraped}`);
  console.log(`  Unique products    : ${uniqueCount}`);
  console.log(`  Written to Firestore: ${written}`);
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
