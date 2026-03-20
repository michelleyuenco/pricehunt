import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, limit } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyAq5XST6Ur_ZNJ9VwAE6et1OkUTOCoGFgg",
  authDomain: "gaak-gaa.firebaseapp.com",
  projectId: "gaak-gaa",
});
const db = getFirestore(app);

const q = query(collection(db, 'officialPrices'), limit(5));
const snap = await getDocs(q);
console.log(`Found ${snap.size} docs`);
snap.docs.forEach(d => {
  const data = d.data();
  console.log(`${d.id}: ${data.name} - $${data.minPrice} - updatedAt: ${data.updatedAt}`);
});
