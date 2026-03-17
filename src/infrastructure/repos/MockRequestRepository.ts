import { type IRequestRepository } from '../../domain/interfaces/IRequestRepository';
import { type PriceRequest } from '../../domain/entities/Request';
import { type PriceResponse } from '../../domain/entities/Response';
import { MOCK_REQUESTS } from '../data/mockRequests';
import { MOCK_RESPONSES } from '../data/mockResponses';

let requests: PriceRequest[] = [...MOCK_REQUESTS];
let responses: PriceResponse[] = [...MOCK_RESPONSES];

export class MockRequestRepository implements IRequestRepository {
  async getAll(): Promise<PriceRequest[]> {
    return [...requests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getById(id: string): Promise<PriceRequest | null> {
    return requests.find(r => r.id === id) ?? null;
  }

  async getByUserId(userId: string): Promise<PriceRequest[]> {
    return requests
      .filter(r => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(
    data: Omit<PriceRequest, 'id' | 'createdAt' | 'responseCount' | 'status'>
  ): Promise<PriceRequest> {
    const newRequest: PriceRequest = {
      ...data,
      id: `req_${Date.now()}`,
      status: 'waiting',
      responseCount: 0,
      createdAt: new Date(),
    };
    requests = [newRequest, ...requests];
    return newRequest;
  }

  async getResponsesForRequest(requestId: string): Promise<PriceResponse[]> {
    return responses
      .filter(r => r.requestId === requestId)
      .sort((a, b) => b.helpfulVotes - a.helpfulVotes);
  }

  async addResponse(
    data: Omit<PriceResponse, 'id' | 'createdAt' | 'helpfulVotes' | 'isBestAnswer'>
  ): Promise<PriceResponse> {
    const newResponse: PriceResponse = {
      ...data,
      id: `res_${Date.now()}`,
      helpfulVotes: 0,
      isBestAnswer: false,
      createdAt: new Date(),
    };
    responses = [newResponse, ...responses];
    // Update request responseCount and status
    requests = requests.map(r => {
      if (r.id === data.requestId) {
        return { ...r, responseCount: r.responseCount + 1, status: 'answered' as const };
      }
      return r;
    });
    return newResponse;
  }

  async markHelpful(responseId: string): Promise<void> {
    responses = responses.map(r => {
      if (r.id === responseId) {
        return { ...r, helpfulVotes: r.helpfulVotes + 1 };
      }
      return r;
    });
  }
}
