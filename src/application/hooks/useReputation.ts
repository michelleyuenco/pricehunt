import { useState, useEffect, useCallback } from 'react';
import {
  doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, query, where, getDocs,
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase/config';
import { useAuth } from '../context/AuthContext';
import { computeEarnedBadges } from '../../domain/constants/badges';
import type { Timestamp } from 'firebase/firestore';

export interface UserReputation {
  userId: string;
  displayName: string;
  photoUrl: string;
  totalRecords: number;
  helpfulVotes: number;
  accuracyScore: number;
  verifiedRecords: number;
  badges: string[];
  joinedAt: Timestamp | null;
  lastActiveAt: Timestamp | null;
}

const DEFAULT_REPUTATION: Omit<UserReputation, 'userId'> = {
  displayName: '',
  photoUrl: '',
  totalRecords: 0,
  helpfulVotes: 0,
  accuracyScore: 100,
  verifiedRecords: 0,
  badges: [],
  joinedAt: null,
  lastActiveAt: null,
};

export function useUserReputation(userId: string | undefined): { reputation: UserReputation | null; loading: boolean } {
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setReputation(null); return; }
    setLoading(true);
    getDoc(doc(db, 'userReputation', userId))
      .then(snap => {
        if (snap.exists()) {
          setReputation({ userId, ...snap.data() } as UserReputation);
        } else {
          setReputation(null);
        }
      })
      .catch(() => setReputation(null))
      .finally(() => setLoading(false));
  }, [userId]);

  return { reputation, loading };
}

export function useMyReputation() {
  const { user } = useAuth();
  const { reputation, loading } = useUserReputation(user?.uid);

  const ensureReputationDoc = useCallback(async () => {
    if (!user) return;
    const ref = doc(db, 'userReputation', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ...DEFAULT_REPUTATION,
        userId: user.uid,
        displayName: user.displayName ?? '',
        photoUrl: user.photoURL ?? '',
        joinedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });
    }
  }, [user]);

  /**
   * Called after a successful price record. Returns list of newly earned badges.
   */
  const onRecordSaved = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    try {
      await ensureReputationDoc();
      const ref = doc(db, 'userReputation', user.uid);

      // Increment totalRecords and update lastActiveAt
      await updateDoc(ref, {
        totalRecords: increment(1),
        lastActiveAt: serverTimestamp(),
      });

      // Compute new badges
      const snap = await getDoc(ref);
      const data = snap.data() as UserReputation;
      const newTotal = data.totalRecords;

      // Count unique stores for this user
      const recordsQuery = query(collection(db, 'priceRecords'), where('userId', '==', user.uid));
      const recordsSnap = await getDocs(recordsQuery);
      const uniqueStores = new Set(recordsSnap.docs.map(d => d.data().storeId)).size;

      const earned = computeEarnedBadges(newTotal, data.helpfulVotes, data.accuracyScore, uniqueStores);
      const prevBadges: string[] = data.badges ?? [];
      const newBadges = earned.filter(b => !prevBadges.includes(b));

      if (newBadges.length > 0) {
        await updateDoc(ref, { badges: earned });
      }

      return newBadges;
    } catch (err) {
      console.error('Failed to update reputation:', err);
      return [];
    }
  }, [user, ensureReputationDoc]);

  return { reputation, loading, onRecordSaved };
}
