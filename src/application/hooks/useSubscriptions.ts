import { useState, useEffect, useCallback } from 'react';
import {
  doc, onSnapshot, setDoc, updateDoc, Timestamp, getDoc,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { useAuth } from '../context/AuthContext';

export interface SubscriptionData {
  subscribedProducts: string[];
  preferredCategories: string[];
  preferredStores: string[];
  onboardingComplete: boolean;
  updatedAt?: Timestamp;
}

const DEFAULT_DATA: SubscriptionData = {
  subscribedProducts: [],
  preferredCategories: [],
  preferredStores: [],
  onboardingComplete: false,
};

const LS_KEY = 'gaakgaa-subs';
const MAX_LS_PRODUCTS = 5;

function readLS(): SubscriptionData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function writeLS(data: SubscriptionData) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function useSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // localStorage fallback
      setSubscriptions(readLS());
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = doc(db, 'userSubscriptions', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setSubscriptions({ ...DEFAULT_DATA, ...(snap.data() as SubscriptionData) });
      } else {
        setSubscriptions({ ...DEFAULT_DATA });
      }
      setLoading(false);
    }, (err) => {
      console.error('useSubscriptions error:', err);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const saveToFirestore = useCallback(async (data: Partial<SubscriptionData>) => {
    if (!user) return;
    const ref = doc(db, 'userSubscriptions', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { ...data, updatedAt: Timestamp.now() });
    } else {
      await setDoc(ref, { ...DEFAULT_DATA, ...data, updatedAt: Timestamp.now() });
    }
  }, [user]);

  const subscribe = useCallback(async (productCode: string) => {
    if (!user) {
      // localStorage fallback (max 5)
      const current = readLS();
      if (!current.subscribedProducts.includes(productCode)) {
        if (current.subscribedProducts.length >= MAX_LS_PRODUCTS) {
          alert('登入後可關注更多產品！Sign in to watch more products!');
          return;
        }
        const updated = {
          ...current,
          subscribedProducts: [...current.subscribedProducts, productCode],
        };
        writeLS(updated);
        setSubscriptions(updated);
      }
      return;
    }
    const updated = [...(subscriptions.subscribedProducts ?? [])];
    if (!updated.includes(productCode)) {
      updated.push(productCode);
      await saveToFirestore({ subscribedProducts: updated });
    }
  }, [user, subscriptions.subscribedProducts, saveToFirestore]);

  const unsubscribe = useCallback(async (productCode: string) => {
    if (!user) {
      const current = readLS();
      const updated = {
        ...current,
        subscribedProducts: current.subscribedProducts.filter(c => c !== productCode),
      };
      writeLS(updated);
      setSubscriptions(updated);
      return;
    }
    const updated = (subscriptions.subscribedProducts ?? []).filter(c => c !== productCode);
    await saveToFirestore({ subscribedProducts: updated });
  }, [user, subscriptions.subscribedProducts, saveToFirestore]);

  const isSubscribed = useCallback((productCode: string) => {
    return (subscriptions.subscribedProducts ?? []).includes(productCode);
  }, [subscriptions.subscribedProducts]);

  const setPreferences = useCallback(async (categories: string[], stores: string[]) => {
    if (!user) {
      const current = readLS();
      const updated = { ...current, preferredCategories: categories, preferredStores: stores };
      writeLS(updated);
      setSubscriptions(updated);
      return;
    }
    await saveToFirestore({ preferredCategories: categories, preferredStores: stores });
  }, [user, saveToFirestore]);

  const completeOnboarding = useCallback(async () => {
    if (!user) {
      const current = readLS();
      const updated = { ...current, onboardingComplete: true };
      writeLS(updated);
      setSubscriptions(updated);
      return;
    }
    await saveToFirestore({ onboardingComplete: true });
  }, [user, saveToFirestore]);

  const bulkSubscribe = useCallback(async (productCodes: string[]) => {
    if (!user) {
      const current = readLS();
      const merged = [...new Set([...current.subscribedProducts, ...productCodes])].slice(0, MAX_LS_PRODUCTS);
      const updated = { ...current, subscribedProducts: merged };
      writeLS(updated);
      setSubscriptions(updated);
      return;
    }
    const existing = subscriptions.subscribedProducts ?? [];
    const merged = [...new Set([...existing, ...productCodes])];
    await saveToFirestore({ subscribedProducts: merged });
  }, [user, subscriptions.subscribedProducts, saveToFirestore]);

  return {
    subscriptions,
    loading,
    subscribe,
    unsubscribe,
    isSubscribed,
    setPreferences,
    completeOnboarding,
    bulkSubscribe,
  };
}
