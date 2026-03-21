import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy, limit,
  getDocs, addDoc, updateDoc, doc, increment,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { STORE_LOCATIONS } from '../../domain/constants/storeLocations';
import type { UnifiedStore, UnifiedProduct } from '../../shared/types/priceRecord';

// ── Store search ──────────────────────────────────────────────────────────────

export function useStoreSearch(queryStr: string) {
  const [results, setResults] = useState<UnifiedStore[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryStr.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    const q = queryStr.toLowerCase().trim();

    // Search Firestore unifiedStores
    const fetchFirestore = getDocs(
      query(
        collection(db, 'unifiedStores'),
        orderBy('fullName'),
        limit(20),
      )
    );

    fetchFirestore.then(snap => {
      const firestoreResults: UnifiedStore[] = snap.docs
        .map(d => d.data() as UnifiedStore)
        .filter(s =>
          s.fullName?.toLowerCase().includes(q) ||
          s.brandName?.toLowerCase().includes(q) ||
          s.branchName?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)
        );

      // Also search static storeLocations
      const staticResults: UnifiedStore[] = STORE_LOCATIONS
        .filter(s =>
          s.brandZh?.toLowerCase().includes(q) ||
          s.brandEn?.toLowerCase().includes(q) ||
          s.name?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)
        )
        .slice(0, 10)
        .map(s => ({
          id: s.id,
          brand: s.brand,
          brandName: s.brandZh,
          branchName: s.name,
          fullName: `${s.brandZh} ${s.name}`,
          address: s.address,
          district: s.district,
          region: s.region,
          lat: s.lat ?? null,
          lng: s.lng ?? null,
          isVerified: true,
          createdBy: null,
          recordCount: 0,
        }));

      // Merge, dedup by id
      const seen = new Set<string>();
      const merged: UnifiedStore[] = [];
      for (const r of [...firestoreResults, ...staticResults]) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          merged.push(r);
        }
      }

      setResults(merged.slice(0, 15));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [queryStr]);

  return { results, loading };
}

// ── Product search ────────────────────────────────────────────────────────────

export interface ProductSearchResult {
  code: string;
  name: string;
  brand: string;
  category: string;
  isOfficial: boolean;
  minPrice?: number | null;
  currency?: string;
}

export function useProductSearch(queryStr: string) {
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryStr.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);

    const q = queryStr.toLowerCase().trim();

    // Search unifiedProducts
    const fetchUnified = getDocs(
      query(
        collection(db, 'unifiedProducts'),
        orderBy('name'),
        limit(30),
      )
    );

    // Search officialPrices as fallback
    const fetchOfficial = getDocs(
      query(
        collection(db, 'officialPrices'),
        orderBy('name'),
        limit(30),
      )
    );

    Promise.all([fetchUnified, fetchOfficial]).then(([unifiedSnap, officialSnap]) => {
      const unifiedResults: ProductSearchResult[] = unifiedSnap.docs
        .map(d => d.data() as UnifiedProduct)
        .filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.aliases?.some(a => a.toLowerCase().includes(q))
        )
        .map(p => ({
          code: p.code,
          name: p.name,
          brand: p.brand,
          category: p.category,
          isOfficial: p.isOfficial,
        }));

      const unifiedCodes = new Set(unifiedResults.map(r => r.code));

      const officialResults: ProductSearchResult[] = officialSnap.docs
        .map(d => ({ code: d.id, ...d.data() } as { code: string; name: string; brand: string; category: string; minPrice: number; currency: string }))
        .filter(p =>
          !unifiedCodes.has(p.code) &&
          (p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q))
        )
        .map(p => ({
          code: p.code,
          name: p.name,
          brand: p.brand ?? '',
          category: p.category ?? '',
          isOfficial: true,
          minPrice: p.minPrice ?? null,
          currency: p.currency ?? 'HK$',
        }));

      setResults([...unifiedResults, ...officialResults].slice(0, 15));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [queryStr]);

  return { results, loading };
}

// ── Add store to Firestore ────────────────────────────────────────────────────

export async function addUnifiedStore(store: Omit<UnifiedStore, 'recordCount'>, userId: string): Promise<string> {
  const id = store.id || `user_store_${Date.now()}`;
  const data: UnifiedStore = { ...store, id, createdBy: userId, recordCount: 0, isVerified: false };
  await addDoc(collection(db, 'unifiedStores'), data);
  return id;
}

// ── Add product to Firestore ──────────────────────────────────────────────────

export async function addUnifiedProduct(product: Omit<UnifiedProduct, 'recordCount' | 'lastRecordedPrice' | 'lastRecordedAt'>, userId: string): Promise<string> {
  const code = `U_${Date.now()}`;
  const data: UnifiedProduct = {
    ...product,
    code,
    createdBy: userId,
    isOfficial: false,
    aliases: product.aliases ?? [],
    recordCount: 0,
    lastRecordedPrice: null,
    lastRecordedAt: null,
  };
  await addDoc(collection(db, 'unifiedProducts'), data);
  return code;
}

// ── Increment record count on store/product ───────────────────────────────────

export async function incrementStoreRecordCount(storeId: string) {
  try {
    const q = query(collection(db, 'unifiedStores'), where('id', '==', storeId), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'unifiedStores', snap.docs[0].id), { recordCount: increment(1) });
    }
  } catch (_) { /* ignore */ }
}

export async function incrementProductRecordCount(productCode: string, price: number) {
  try {
    const q = query(collection(db, 'unifiedProducts'), where('code', '==', productCode), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'unifiedProducts', snap.docs[0].id), {
        recordCount: increment(1),
        lastRecordedPrice: price,
      });
    }
  } catch (_) { /* ignore */ }
}
