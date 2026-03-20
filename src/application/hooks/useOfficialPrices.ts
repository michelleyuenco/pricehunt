import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';

export interface OfficialPrice {
  code: string;
  brand: string;
  name: string;
  minPrice: number | null;
  currency: string;
  category: string;
  stores: {
    wellcome: boolean;
    parknshop: boolean;
    jasons: boolean;
    watsons: boolean;
    mannings: boolean;
    aeon: boolean;
    dchfood: boolean;
    sasa: boolean;
    lungfung: boolean;
  };
  storePrices?: Record<string, number>; // e.g. { wellcome: 10.5, parknshop: 10 }
  source: string;
  scrapedAt?: Timestamp;
  updatedAt?: Timestamp;
}

function countStores(stores: OfficialPrice['stores']): number {
  return Object.values(stores).filter(Boolean).length;
}

/** Fetch latest official prices (paginated, newest first) */
export function useOfficialPrices(pageLimit = 12) {
  const [prices, setPrices] = useState<OfficialPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'officialPrices'),
      orderBy('updatedAt', 'desc'),
      limit(pageLimit)
    );
    getDocs(q)
      .then(snap => {
        const data = snap.docs.map(d => ({ code: d.id, ...d.data() } as OfficialPrice));
        setPrices(data);
      })
      .catch(err => {
        console.error('useOfficialPrices error:', err);
      })
      .finally(() => setLoading(false));
  }, [pageLimit]);

  return { prices, loading, countStores };
}

/** Search official prices by keyword */
export function useOfficialPriceSearch(keyword: string) {
  const [results, setResults] = useState<OfficialPrice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword || keyword.trim().length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);
    // Firestore doesn't support full-text search, so we fetch and filter client-side.
    // For production, use Algolia or Firestore full-text extension.
    const q = query(
      collection(db, 'officialPrices'),
      limit(200)
    );
    getDocs(q)
      .then(snap => {
        const kw = keyword.toLowerCase();
        const data = snap.docs
          .map(d => ({ code: d.id, ...d.data() } as OfficialPrice))
          .filter(p =>
            p.name?.toLowerCase().includes(kw) ||
            p.brand?.toLowerCase().includes(kw) ||
            p.code?.toLowerCase().includes(kw)
          )
          .slice(0, 10);
        setResults(data);
      })
      .catch(err => {
        console.error('useOfficialPriceSearch error:', err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [keyword]);

  return { results, loading };
}
