/**
 * Upload scraped products to Firestore
 * Uses Firebase client SDK approach via REST API (no gcloud needed)
 */
import { readFileSync } from 'fs';

const PROJECT_ID = 'gaak-gaa';
const COLLECTION = 'officialPrices';

// Read scraped data
const products = JSON.parse(readFileSync('./scraped-products.json', 'utf8'));
console.log(`📦 Loaded ${products.length} products from scraped-products.json`);

// Firestore REST API endpoint
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Convert product to Firestore document format
function toFirestoreDoc(product) {
  return {
    fields: {
      code: { stringValue: product.code },
      brand: { stringValue: product.brand || '' },
      name: { stringValue: product.name || '' },
      minPrice: { doubleValue: product.minPrice || 0 },
      currency: { stringValue: product.currency || 'HK$' },
      category: { stringValue: product.category || '' },
      source: { stringValue: 'consumer.org.hk' },
      stores: {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(product.stores || {}).map(([k, v]) => [k, { booleanValue: !!v }])
          ),
        },
      },
      scrapedAt: { timestampValue: new Date().toISOString() },
      updatedAt: { timestampValue: new Date().toISOString() },
    },
  };
}

// Batch upload using Firestore REST API (no auth needed for public write — but our rules require auth)
// Instead, use firebase-admin with project default
async function uploadWithAdmin() {
  const { initializeApp, applicationDefault } = await import('firebase-admin/app');
  const { getFirestore, FieldValue } = await import('firebase-admin/firestore');

  try {
    initializeApp({ projectId: PROJECT_ID });
  } catch (e) {
    // Already initialized
  }
  
  const db = getFirestore();
  
  let uploaded = 0;
  let errors = 0;
  const BATCH_SIZE = 500;
  
  // Process in batches
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = products.slice(i, i + BATCH_SIZE);
    
    for (const product of chunk) {
      const ref = db.collection(COLLECTION).doc(product.code);
      batch.set(ref, {
        code: product.code,
        brand: product.brand || '',
        name: product.name || '',
        minPrice: product.minPrice || 0,
        currency: product.currency || 'HK$',
        category: product.category || '',
        stores: product.stores || {},
        source: 'consumer.org.hk',
        scrapedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    
    try {
      await batch.commit();
      uploaded += chunk.length;
      console.log(`✅ Batch ${Math.floor(i/BATCH_SIZE) + 1}: uploaded ${chunk.length} products (${uploaded}/${products.length})`);
    } catch (err) {
      errors += chunk.length;
      console.error(`❌ Batch error:`, err.message);
    }
  }
  
  console.log(`\n🎉 Upload complete! ${uploaded} uploaded, ${errors} errors.`);
}

uploadWithAdmin().catch(err => {
  console.error('Upload failed:', err.message);
  console.log('\n💡 If auth error, try: gcloud auth application-default login');
  console.log('   Or set GOOGLE_APPLICATION_CREDENTIALS to a service account key file');
});
