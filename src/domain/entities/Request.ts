export type RequestStatus = 'waiting' | 'answered' | 'closed';
export type Urgency = 'normal' | 'urgent';
export type Category = 'food' | 'drinks' | 'essentials' | 'beauty' | 'snacks' | 'medicine' | 'other';

export interface PriceRequest {
  id: string;
  userId: string;
  username: string;
  avatarEmoji: string;
  productName: string;
  brand?: string;
  description?: string;
  category: Category;
  storeName: string;
  city: string;
  district?: string;
  anyStoreInCity: boolean;
  urgency: Urgency;
  note?: string;
  tipEnabled: boolean;
  status: RequestStatus;
  responseCount: number;
  createdAt: Date;
}
