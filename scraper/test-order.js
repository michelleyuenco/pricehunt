import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyAq5XST6Ur_ZNJ9VwAE6et1OkUTOCoGFgg",
  authDomain: "gaak-gaa.firebaseapp.com",
  projectId: "gaak-gaa",
});
const db = getFirestore(app);

try {
  const q = query(collection(db, 'officialPrices'), orderBy('updatedAt', 'desc'), limit(5));
  const snap = await getDocs(q);
  console.log(`OrderBy query: Found ${snap.size} docs`);
  snap.docs.forEach(d => console.log(`  ${d.id}: ${d.data().name}`));
} catch (err) {
  console.error('OrderBy ERROR:', err.message);
}

process.exit(0);
