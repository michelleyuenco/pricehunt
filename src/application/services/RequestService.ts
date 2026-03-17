import { type IRequestRepository } from '../../domain/interfaces/IRequestRepository';
import { type PriceRequest, type Category } from '../../domain/entities/Request';
import { type PriceResponse, type Currency, type Availability } from '../../domain/entities/Response';

export type SortOption = 'newest' | 'urgent' | 'most_responses';

export interface FilterOptions {
  city?: string;
  category?: Category;
  store?: string;
  status?: 'waiting' | 'answered' | 'all';
  search?: string;
  sort?: SortOption;
}

export class RequestService {
  private repo: IRequestRepository;
  constructor(repo: IRequestRepository) { this.repo = repo; }

  async getFilteredRequests(filters: FilterOptions): Promise<PriceRequest[]> {
    let requests = await this.repo.getAll();

    if (filters.city) {
      requests = requests.filter(r => r.city === filters.city);
    }
    if (filters.category) {
      requests = requests.filter(r => r.category === filters.category);
    }
    if (filters.store) {
      requests = requests.filter(r =>
        r.storeName.toLowerCase().includes(filters.store!.toLowerCase())
      );
    }
    if (filters.status && filters.status !== 'all') {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      requests = requests.filter(
        r =>
          r.productName.toLowerCase().includes(q) ||
          r.storeName.toLowerCase().includes(q) ||
          (r.brand ?? '').toLowerCase().includes(q)
      );
    }

    if (filters.sort === 'urgent') {
      requests = [...requests].sort((a, b) => {
        if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
        if (b.urgency === 'urgent' && a.urgency !== 'urgent') return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } else if (filters.sort === 'most_responses') {
      requests = [...requests].sort((a, b) => b.responseCount - a.responseCount);
    }

    return requests;
  }

  async createRequest(
    data: Omit<PriceRequest, 'id' | 'createdAt' | 'responseCount' | 'status'>
  ): Promise<PriceRequest> {
    return this.repo.create(data);
  }

  async getRequestById(id: string): Promise<PriceRequest | null> {
    return this.repo.getById(id);
  }

  async getResponsesForRequest(requestId: string): Promise<PriceResponse[]> {
    return this.repo.getResponsesForRequest(requestId);
  }

  async addResponse(data: {
    requestId: string;
    userId: string;
    username: string;
    avatarEmoji: string;
    price: number;
    currency: Currency;
    availability: Availability;
    storeConfirmed: string;
    note?: string;
  }): Promise<PriceResponse> {
    return this.repo.addResponse(data);
  }

  async markHelpful(responseId: string): Promise<void> {
    return this.repo.markHelpful(responseId);
  }

  async getUserRequests(userId: string): Promise<PriceRequest[]> {
    return this.repo.getByUserId(userId);
  }
}
