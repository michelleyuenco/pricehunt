import { type Store } from '../entities/Store';

export interface IStoreRepository {
  getAll(): Promise<Store[]>;
  getByCity(city: string): Promise<Store[]>;
  getById(id: string): Promise<Store | null>;
  search(query: string): Promise<Store[]>;
}
