/**
 * Upload scraped products to Firestore using Firebase Web SDK
 * (Rules temporarily opened for this upload)
 */
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAq5XST6Ur_ZNJ9VwAE6et1OkUTOCoGFgg",
  authDomain: "gaak-gaa.firebaseapp.com",
  projectId: "gaak-gaa",
  storageBucket: "gaak-gaa.firebasestorage.app",
  messagingSenderId: "879291051334",
  appId: "1:879291051334:web:48ecc802399ddc52c24947",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = JSON.parse(readFileSync('./scraped-products.json', 'utf8'));
console.log(`📦 Loaded ${products.length} products`);

const BATCH_SIZE = 400; // Firestore batch limit is 500
let uploaded = 0;
let errors = 0;

for (let i = 0; i < products.length; i += BATCH_SIZE) {
  const batch = writeBatch(db);
  const chunk = products.slice(i, i + BATCH_SIZE);

  for (const product of chunk) {
    const ref = doc(db, 'officialPrices', product.code);
    batch.set(ref, {
      code: product.code,
      brand: product.brand || '',
      name: product.name || '',
      minPrice: product.minPrice || 0,
      currency: product.currency || 'HK$',
      category: product.category || '',
      stores: product.stores || {},
      source: 'consumer.org.hk',
      scrapedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }, { merge: true });
  }

  try {
    await batch.commit();
    uploaded += chunk.length;
    console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} products (${uploaded}/${products.length})`);
  } catch (err) {
    errors += chunk.length;
    console.error(`❌ Batch error:`, err.message);
  }
}

console.log(`\n🎉 Done! ${uploaded} uploaded, ${errors} errors.`);
process.exit(0);
