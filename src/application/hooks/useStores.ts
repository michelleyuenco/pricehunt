import { STATIC_STORES, STORE_NAMES } from '../../domain/constants/stores';
import { type Store } from '../../domain/entities/Store';

export function useStores(city?: string): { stores: Store[]; loading: boolean } {
  const stores = city
    ? STATIC_STORES.filter(s => s.city === city)
    : STATIC_STORES;
  return { stores, loading: false };
}

export function useStoreNames(): string[] {
  return STORE_NAMES;
}
