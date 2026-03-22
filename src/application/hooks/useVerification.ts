import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp, getDoc,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { useAuth } from '../context/AuthContext';

export interface ProductConsistency {
  totalReports: number;
  priceRange: { min: number; max: number };
  mostCommonPrice: number;
  isConsistent: boolean;   // true if 80%+ agree within 10% range
  verifierCount: number;
}

export function useProductConsistency(productCode: string | undefined) {
  const [consistency, setConsistency] = useState<ProductConsistency | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productCode) return;
    setLoading(true);

    const q = query(collection(db, 'priceRecords'), where('productCode', '==', productCode));
    getDocs(q)
      .then(snap => {
        const prices = snap.docs.map(d => d.data().price as number).filter(p => typeof p === 'number' && !isNaN(p));
        if (prices.length === 0) {
          setConsistency(null);
          return;
        }
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        // Most common price (mode)
        const freq: Record<number, number> = {};
        for (const p of prices) {
          const rounded = Math.round(p * 2) / 2; // round to nearest 0.5
          freq[rounded] = (freq[rounded] ?? 0) + 1;
        }
        const mostCommonPrice = Number(
          Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
        );

        // Consistency: 80%+ within 10% of median
        const median = mostCommonPrice;
        const threshold = median * 0.1;
        const withinRange = prices.filter(p => Math.abs(p - median) <= threshold).length;
        const isConsistent = prices.length > 0 && withinRange / prices.length >= 0.8;

        // verifierCount: records that have been confirmed (sum of confirmations)
        const verifierCount = snap.docs.reduce((sum, d) => sum + ((d.data().confirmations ?? 0) as number), 0);

        setConsistency({ totalReports: prices.length, priceRange: { min, max }, mostCommonPrice, isConsistent, verifierCount });
      })
      .catch(() => setConsistency(null))
      .finally(() => setLoading(false));
  }, [productCode]);

  return { consistency, loading };
}

/** Per-store consistency for a product */
export interface StoreConsistency {
  storeId: string;
  storeName: string;
  storeBranch?: string;
  reports: number;
  priceRange: { min: number; max: number };
  mostCommonPrice: number;
  isConsistent: boolean;
  verifierCount: number;
}

export function useStoreConsistency(productCode: string | undefined): { storeData: StoreConsistency[]; loading: boolean } {
  const [storeData, setStoreData] = useState<StoreConsistency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productCode) return;
    setLoading(true);

    const q = query(collection(db, 'priceRecords'), where('productCode', '==', productCode));
    getDocs(q)
      .then(snap => {
        // Group by storeId
        const groups: Record<string, { storeName: string; storeBranch?: string; prices: number[]; confirmations: number }> = {};
        for (const d of snap.docs) {
          const data = d.data();
          const key = data.storeId as string;
          if (!groups[key]) {
            groups[key] = { storeName: data.storeName, storeBranch: data.storeBranch, prices: [], confirmations: 0 };
          }
          groups[key].prices.push(data.price as number);
          groups[key].confirmations += (data.confirmations ?? 0) as number;
        }

        const result: StoreConsistency[] = Object.entries(groups).map(([storeId, g]) => {
          const { prices } = g;
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const freq: Record<number, number> = {};
          for (const p of prices) {
            const r = Math.round(p * 2) / 2;
            freq[r] = (freq[r] ?? 0) + 1;
          }
          const mostCommonPrice = Number(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]);
          const threshold = mostCommonPrice * 0.1;
          const withinRange = prices.filter(p => Math.abs(p - mostCommonPrice) <= threshold).length;
          const isConsistent = prices.length > 0 && withinRange / prices.length >= 0.8;

          return {
            storeId,
            storeName: g.storeName,
            storeBranch: g.storeBranch,
            reports: prices.length,
            priceRange: { min, max },
            mostCommonPrice,
            isConsistent,
            verifierCount: g.confirmations,
          };
        });

        setStoreData(result.sort((a, b) => b.reports - a.reports));
      })
      .catch(() => setStoreData([]))
      .finally(() => setLoading(false));
  }, [productCode]);

  return { storeData, loading };
}

/** Hook to confirm/verify a price record */
export function useVerifyRecord() {
  const { user } = useAuth();
  const [confirming, setConfirming] = useState<string | null>(null);

  const confirmRecord = useCallback(async (recordId: string, recordOwnerId: string): Promise<boolean> => {
    if (!user || user.uid === recordOwnerId) return false;
    setConfirming(recordId);
    try {
      // Check if already confirmed
      const checkQ = query(
        collection(db, 'priceConfirmations'),
        where('recordId', '==', recordId),
        where('userId', '==', user.uid),
      );
      const existing = await getDocs(checkQ);
      if (!existing.empty) {
        setConfirming(null);
        return false; // already confirmed
      }

      // Add confirmation record
      await addDoc(collection(db, 'priceConfirmations'), {
        recordId,
        userId: user.uid,
        confirmedAt: serverTimestamp(),
      });

      // Increment confirmations on the record
      await updateDoc(doc(db, 'priceRecords', recordId), {
        confirmations: increment(1),
      });

      // Increment verifiedRecords on the original recorder
      const repRef = doc(db, 'userReputation', recordOwnerId);
      const repSnap = await getDoc(repRef);
      if (repSnap.exists()) {
        await updateDoc(repRef, { verifiedRecords: increment(1) });
      }

      return true;
    } catch (err) {
      console.error('Failed to confirm record:', err);
      return false;
    } finally {
      setConfirming(null);
    }
  }, [user]);

  return { confirmRecord, confirming };
}
