import { useState, useEffect, useCallback } from 'react';
import { type Store } from '../../domain/entities/Store';
import { StoreService } from '../services/StoreService';
import { MockStoreRepository } from '../../infrastructure/repos/MockStoreRepository';

const repo = new MockStoreRepository();
const service = new StoreService(repo);

export function useStores(city?: string) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = city ? service.getStoresByCity(city) : service.getAllStores();
    p.then(data => {
      setStores(data);
      setLoading(false);
    });
  }, [city]);

  return { stores, loading };
}

export function useStoreSearch(query: string) {
  const [results, setResults] = useState<Store[]>([]);

  const search = useCallback(async (q: string) => {
    const data = await service.searchStores(q);
    setResults(data);
  }, []);

  useEffect(() => {
    if (query) search(query);
    else setResults([]);
  }, [query, search]);

  return results;
}

export function useStoreNames() {
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    service.getStoreNames().then(setNames);
  }, []);
  return names;
}
