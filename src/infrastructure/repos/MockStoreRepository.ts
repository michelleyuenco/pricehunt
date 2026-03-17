import { type IStoreRepository } from '../../domain/interfaces/IStoreRepository';
import { type Store } from '../../domain/entities/Store';
import { MOCK_STORES } from '../data/mockStores';

export class MockStoreRepository implements IStoreRepository {
  async getAll(): Promise<Store[]> {
    return [...MOCK_STORES];
  }

  async getByCity(city: string): Promise<Store[]> {
    return MOCK_STORES.filter(s => s.city === city);
  }

  async getById(id: string): Promise<Store | null> {
    return MOCK_STORES.find(s => s.id === id) ?? null;
  }

  async search(query: string): Promise<Store[]> {
    const q = query.toLowerCase();
    return MOCK_STORES.filter(
      s =>
        s.nameZh.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q)
    );
  }
}
