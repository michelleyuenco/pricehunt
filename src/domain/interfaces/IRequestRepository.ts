import { type PriceRequest } from '../entities/Request';
import { type PriceResponse } from '../entities/Response';

export interface IRequestRepository {
  getAll(): Promise<PriceRequest[]>;
  getById(id: string): Promise<PriceRequest | null>;
  getByUserId(userId: string): Promise<PriceRequest[]>;
  create(request: Omit<PriceRequest, 'id' | 'createdAt' | 'responseCount' | 'status'>): Promise<PriceRequest>;
  getResponsesForRequest(requestId: string): Promise<PriceResponse[]>;
  addResponse(response: Omit<PriceResponse, 'id' | 'createdAt' | 'helpfulVotes' | 'isBestAnswer'>): Promise<PriceResponse>;
  markHelpful(responseId: string): Promise<void>;
}
