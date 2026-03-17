import { useState, useEffect, useCallback } from 'react';
import { type PriceRequest } from '../../domain/entities/Request';
import { type PriceResponse } from '../../domain/entities/Response';
import { RequestService, type FilterOptions } from '../services/RequestService';
import { MockRequestRepository } from '../../infrastructure/repos/MockRequestRepository';

const repo = new MockRequestRepository();
const service = new RequestService(repo);

export function useRequests(filters?: FilterOptions) {
  const [requests, setRequests] = useState<PriceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const data = await service.getFilteredRequests(filters ?? {});
    setRequests(data);
    setLoading(false);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, refetch: fetchRequests };
}

export function useRequestDetail(id: string) {
  const [request, setRequest] = useState<PriceRequest | null>(null);
  const [responses, setResponses] = useState<PriceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [req, res] = await Promise.all([
      service.getRequestById(id),
      service.getResponsesForRequest(id),
    ]);
    setRequest(req);
    setResponses(res);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addResponse = async (data: Parameters<typeof service.addResponse>[0]) => {
    await service.addResponse(data);
    await fetch();
  };

  const markHelpful = async (responseId: string) => {
    await service.markHelpful(responseId);
    await fetch();
  };

  return { request, responses, loading, addResponse, markHelpful };
}

export function useCreateRequest() {
  const create = useCallback(
    (data: Parameters<typeof service.createRequest>[0]) => service.createRequest(data),
    []
  );
  return { create };
}

export function useUserRequests(userId: string) {
  const [requests, setRequests] = useState<PriceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service.getUserRequests(userId).then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, [userId]);

  return { requests, loading };
}
