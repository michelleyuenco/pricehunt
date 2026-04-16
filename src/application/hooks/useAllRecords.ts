import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, limit, onSnapshot,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import type { PriceRecord } from '../../shared/types/priceRecord';

export function useAllRecords(pageLimit = 30) {
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'priceRecords'),
      orderBy('recordedAt', 'desc'),
      limit(pageLimit),
    );
    const unsub = onSnapshot(q, (snap) => {
      setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PriceRecord)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [pageLimit]);

  return { records, loading };
}
