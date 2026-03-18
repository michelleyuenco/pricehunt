import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  where,
  onSnapshot,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { type PriceRequest } from '../../domain/entities/Request';
import { type PriceResponse } from '../../domain/entities/Response';

function toRequest(id: string, data: Record<string, unknown>): PriceRequest {
  return {
    id,
    userId: data.userId as string,
    username: (data.userName as string) ?? '',
    avatarEmoji: (data.userPhoto as string) ?? '👤',
    productName: data.productName as string,
    brand: data.brand as string | undefined,
    description: data.description as string | undefined,
    category: (data.category as PriceRequest['category']) ?? 'other',
    subCategory: (data.subCategory as string) ?? '',
    storeName: data.storeName as string,
    city: data.city as string,
    district: data.district as string | undefined,
    anyStoreInCity: (data.anyStoreInCity as boolean) ?? false,
    urgency: (data.urgency as PriceRequest['urgency']) ?? 'normal',
    note: data.note as string | undefined,
    tipEnabled: false,
    status: (data.status as PriceRequest['status']) ?? 'waiting',
    responseCount: (data.responseCount as number) ?? 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(),
  };
}

function toResponse(id: string, data: Record<string, unknown>): PriceResponse {
  return {
    id,
    requestId: data.requestId as string,
    userId: data.userId as string,
    username: (data.userName as string) ?? '',
    avatarEmoji: (data.userPhoto as string) ?? '👤',
    price: data.price as number,
    currency: (data.currency as PriceResponse['currency']) ?? 'HK$',
    availability: (data.availability as PriceResponse['availability']) ?? 'in_stock',
    storeConfirmed: data.storeConfirmed as string,
    note: data.note as string | undefined,
    helpfulVotes: (data.helpfulVotes as number) ?? 0,
    isBestAnswer: false,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(),
  };
}

export class FirestoreRequestRepository {
  async getAll(): Promise<PriceRequest[]> {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => toRequest(d.id, d.data() as Record<string, unknown>));
  }

  subscribeAll(callback: (requests: PriceRequest[]) => void) {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      callback(snap.docs.map(d => toRequest(d.id, d.data() as Record<string, unknown>)));
    });
  }

  subscribeByUserId(userId: string, callback: (requests: PriceRequest[]) => void) {
    const q = query(
      collection(db, 'requests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, snap => {
      callback(snap.docs.map(d => toRequest(d.id, d.data() as Record<string, unknown>)));
    });
  }

  async getById(id: string): Promise<PriceRequest | null> {
    const snap = await getDoc(doc(db, 'requests', id));
    if (!snap.exists()) return null;
    return toRequest(snap.id, snap.data() as Record<string, unknown>);
  }

  subscribeById(id: string, callback: (request: PriceRequest | null) => void) {
    return onSnapshot(doc(db, 'requests', id), snap => {
      if (!snap.exists()) callback(null);
      else callback(toRequest(snap.id, snap.data() as Record<string, unknown>));
    });
  }

  async create(
    data: Omit<PriceRequest, 'id' | 'createdAt' | 'responseCount' | 'status'> & {
      userName: string;
      userPhoto: string;
    }
  ): Promise<PriceRequest> {
    const docRef = await addDoc(collection(db, 'requests'), {
      userId: data.userId,
      userName: data.userName,
      userPhoto: data.userPhoto,
      productName: data.productName,
      brand: data.brand ?? '',
      description: data.description ?? '',
      category: data.category,
      subCategory: data.subCategory ?? '',
      storeName: data.storeName,
      city: data.city,
      district: data.district ?? '',
      anyStoreInCity: data.anyStoreInCity,
      urgency: data.urgency,
      note: data.note ?? '',
      status: 'waiting',
      responseCount: 0,
      createdAt: serverTimestamp(),
    });
    return {
      id: docRef.id,
      ...data,
      username: data.userName,
      avatarEmoji: data.userPhoto,
      status: 'waiting',
      responseCount: 0,
      tipEnabled: false,
      createdAt: new Date(),
    };
  }

  subscribeResponses(requestId: string, callback: (responses: PriceResponse[]) => void) {
    const q = query(
      collection(db, 'responses'),
      where('requestId', '==', requestId),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => {
      callback(snap.docs.map(d => toResponse(d.id, d.data() as Record<string, unknown>)));
    });
  }

  async getResponsesForRequest(requestId: string): Promise<PriceResponse[]> {
    const q = query(
      collection(db, 'responses'),
      where('requestId', '==', requestId),
      orderBy('createdAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => toResponse(d.id, d.data() as Record<string, unknown>));
  }

  async addResponse(
    data: Omit<PriceResponse, 'id' | 'createdAt' | 'helpfulVotes' | 'isBestAnswer'> & {
      userName: string;
      userPhoto: string;
    }
  ): Promise<PriceResponse> {
    const docRef = await addDoc(collection(db, 'responses'), {
      requestId: data.requestId,
      userId: data.userId,
      userName: data.userName,
      userPhoto: data.userPhoto,
      price: data.price,
      currency: data.currency,
      availability: data.availability,
      storeConfirmed: data.storeConfirmed,
      note: data.note ?? '',
      helpfulVotes: 0,
      createdAt: serverTimestamp(),
    });

    // Update request: increment responseCount & mark answered
    const reqRef = doc(db, 'requests', data.requestId);
    await updateDoc(reqRef, {
      responseCount: increment(1),
      status: 'answered',
    });

    return {
      id: docRef.id,
      ...data,
      username: data.userName,
      avatarEmoji: data.userPhoto,
      helpfulVotes: 0,
      isBestAnswer: false,
      createdAt: new Date(),
    };
  }

  async voteHelpful(responseId: string): Promise<void> {
    await updateDoc(doc(db, 'responses', responseId), {
      helpfulVotes: increment(1),
    });
  }

  async getTotalCounts(): Promise<{ requests: number; responses: number }> {
    const [reqSnap, resSnap] = await Promise.all([
      getDocs(collection(db, 'requests')),
      getDocs(collection(db, 'responses')),
    ]);
    return { requests: reqSnap.size, responses: resSnap.size };
  }

  subscribeResponderLeaderboard(callback: (leaders: Array<{ userId: string; userName: string; userPhoto: string; count: number; helpfulVotes: number }>) => void) {
    return onSnapshot(collection(db, 'responses'), snap => {
      const map = new Map<string, { userName: string; userPhoto: string; count: number; helpfulVotes: number }>();
      snap.docs.forEach(d => {
        const data = d.data() as Record<string, unknown>;
        const uid = data.userId as string;
        const existing = map.get(uid);
        if (existing) {
          existing.count++;
          existing.helpfulVotes += (data.helpfulVotes as number) ?? 0;
        } else {
          map.set(uid, {
            userName: (data.userName as string) ?? '',
            userPhoto: (data.userPhoto as string) ?? '👤',
            count: 1,
            helpfulVotes: (data.helpfulVotes as number) ?? 0,
          });
        }
      });
      const leaders = Array.from(map.entries())
        .map(([userId, v]) => ({ userId, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      callback(leaders);
    });
  }
}

export const firestoreRepo = new FirestoreRequestRepository();
