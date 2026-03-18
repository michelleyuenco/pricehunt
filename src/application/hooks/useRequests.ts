import { useState, useEffect, useCallback } from 'react';
import { type PriceRequest } from '../../domain/entities/Request';
import { type PriceResponse } from '../../domain/entities/Response';
import { firestoreRepo } from '../../infrastructure/firebase/FirestoreRequestRepository';
import { type Category } from '../../domain/entities/Request';

export interface FilterOptions {
  city?: string;
  category?: Category;
  status?: 'waiting' | 'answered' | 'all';
  sort?: 'newest' | 'urgent' | 'most_responses';
  search?: string;
}

export function useRequests(filters?: FilterOptions) {
  const [allRequests, setAllRequests] = useState<PriceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = firestoreRepo.subscribeAll((data) => {
      setAllRequests(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const requests = applyFilters(allRequests, filters);
  return { requests, loading };
}

function applyFilters(requests: PriceRequest[], filters?: FilterOptions): PriceRequest[] {
  let result = [...requests];
  if (filters?.city) result = result.filter(r => r.city === filters.city);
  if (filters?.category) result = result.filter(r => r.category === filters.category);
  if (filters?.status && filters.status !== 'all') result = result.filter(r => r.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(r =>
      r.productName.toLowerCase().includes(q) ||
      r.storeName.toLowerCase().includes(q) ||
      (r.brand ?? '').toLowerCase().includes(q)
    );
  }
  if (filters?.sort === 'urgent') {
    result.sort((a, b) => {
      if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
      if (b.urgency === 'urgent' && a.urgency !== 'urgent') return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } else if (filters?.sort === 'most_responses') {
    result.sort((a, b) => b.responseCount - a.responseCount);
  }
  return result;
}

export function useRequestDetail(id: string) {
  const [request, setRequest] = useState<PriceRequest | null>(null);
  const [responses, setResponses] = useState<PriceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsubReq = firestoreRepo.subscribeById(id, (req) => {
      setRequest(req);
      setLoading(false);
    });
    const unsubRes = firestoreRepo.subscribeResponses(id, setResponses);
    return () => { unsubReq(); unsubRes(); };
  }, [id]);

  const addResponse = useCallback(async (data: {
    requestId: string;
    userId: string;
    userName: string;
    userPhoto: string;
    username: string;
    avatarEmoji: string;
    price: number;
    currency: PriceResponse['currency'];
    availability: PriceResponse['availability'];
    storeConfirmed: string;
    note?: string;
  }) => {
    await firestoreRepo.addResponse({
      requestId: data.requestId,
      userId: data.userId,
      userName: data.userName,
      userPhoto: data.userPhoto,
      username: data.username,
      avatarEmoji: data.avatarEmoji,
      price: data.price,
      currency: data.currency,
      availability: data.availability,
      storeConfirmed: data.storeConfirmed,
      note: data.note,
    });
  }, []);

  const markHelpful = useCallback(async (responseId: string) => {
    await firestoreRepo.voteHelpful(responseId);
  }, []);

  return { request, responses, loading, addResponse, markHelpful };
}

export function useCreateRequest() {
  const create = useCallback(async (data: {
    userId: string;
    userName: string;
    userPhoto: string;
    username: string;
    avatarEmoji: string;
    productName: string;
    brand?: string;
    description?: string;
    category: PriceRequest['category'];
    storeName: string;
    city: string;
    district?: string;
    anyStoreInCity: boolean;
    urgency: PriceRequest['urgency'];
    note?: string;
    tipEnabled: boolean;
  }): Promise<PriceRequest> => {
    return firestoreRepo.create({
      userId: data.userId,
      userName: data.userName,
      userPhoto: data.userPhoto,
      username: data.userName,
      avatarEmoji: data.userPhoto,
      productName: data.productName,
      brand: data.brand,
      description: data.description,
      category: data.category,
      storeName: data.storeName,
      city: data.city,
      district: data.district,
      anyStoreInCity: data.anyStoreInCity,
      urgency: data.urgency,
      note: data.note,
      tipEnabled: false,
    });
  }, []);
  return { create };
}

export function useUserRequests(userId: string) {
  const [requests, setRequests] = useState<PriceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setRequests([]); setLoading(false); return; }
    setLoading(true);
    const unsub = firestoreRepo.subscribeByUserId(userId, (data) => {
      setRequests(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  return { requests, loading };
}
