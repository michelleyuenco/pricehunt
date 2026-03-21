import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, orderBy, limit,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { useAuth } from '../context/AuthContext';
import type { PriceRecord } from '../../shared/types/priceRecord';

export function useMyRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, 'priceRecords'),
      where('userId', '==', user.uid),
      orderBy('recordedAt', 'desc'),
      limit(100),
    );
    const unsub = onSnapshot(q, (snap) => {
      setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PriceRecord)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  return { records, loading };
}

export function useProductRecords(productCode: string) {
  const [records, setRecords] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productCode) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, 'priceRecords'),
      where('productCode', '==', productCode),
      orderBy('recordedAt', 'desc'),
      limit(50),
    );
    const unsub = onSnapshot(q, (snap) => {
      setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PriceRecord)));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [productCode]);

  return { records, loading };
}

export function useCreateRecord() {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const create = useCallback(async (data: Omit<PriceRecord, 'id' | 'userId' | 'userName' | 'userPhoto' | 'recordedAt'>) => {
    if (!user) throw new Error('Not authenticated');
    setCreating(true);
    try {
      const record = {
        ...data,
        userId: user.uid,
        userName: user.displayName ?? 'Anonymous',
        userPhoto: user.photoURL ?? '',
        recordedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, 'priceRecords'), record);
      return ref.id;
    } finally {
      setCreating(false);
    }
  }, [user]);

  return { create, creating };
}

export function useDeleteRecord() {
  const { user } = useAuth();

  const deleteRecord = useCallback(async (recordId: string) => {
    if (!user) throw new Error('Not authenticated');
    await deleteDoc(doc(db, 'priceRecords', recordId));
  }, [user]);

  return { deleteRecord };
}

export function useUpdateRecord() {
  const { user } = useAuth();

  const updateRecord = useCallback(async (recordId: string, data: Partial<PriceRecord>) => {
    if (!user) throw new Error('Not authenticated');
    await updateDoc(doc(db, 'priceRecords', recordId), data as Record<string, unknown>);
  }, [user]);

  return { updateRecord };
}

export function useRecentStores() {
  const { records } = useMyRecords();
  const seen = new Set<string>();
  const recent: string[] = [];
  for (const r of records) {
    if (r.storeId && !seen.has(r.storeId)) {
      seen.add(r.storeId);
      recent.push(r.storeId);
    }
  }
  return recent.slice(0, 5);
}

export function useRecentProducts() {
  const { records } = useMyRecords();
  const seen = new Set<string>();
  const recent: string[] = [];
  for (const r of records) {
    if (r.productCode && !seen.has(r.productCode)) {
      seen.add(r.productCode);
      recent.push(r.productCode);
    }
  }
  return recent.slice(0, 5);
}
