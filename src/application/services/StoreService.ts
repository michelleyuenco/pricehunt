import { type IStoreRepository } from '../../domain/interfaces/IStoreRepository';
import { type Store } from '../../domain/entities/Store';

export class StoreService {
  private repo: IStoreRepository;
  constructor(repo: IStoreRepository) { this.repo = repo; }

  async getAllStores(): Promise<Store[]> {
    return this.repo.getAll();
  }

  async getStoresByCity(city: string): Promise<Store[]> {
    return this.repo.getByCity(city);
  }

  async searchStores(query: string): Promise<Store[]> {
    if (!query.trim()) return [];
    return this.repo.search(query);
  }

  async getStoreNames(): Promise<string[]> {
    const stores = await this.repo.getAll();
    return [...new Set(stores.map(s => s.nameZh))];
  }
}
