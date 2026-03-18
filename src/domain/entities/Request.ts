export type RequestStatus = 'waiting' | 'answered' | 'closed';
export type Urgency = 'normal' | 'urgent';
export type MainCategory = 'food' | 'drinks' | 'essentials' | 'beauty' | 'snacks' | 'medicine' | 'other';
export type SubCategory = string;

/** @deprecated Use MainCategory — kept for backward compatibility */
export type Category = MainCategory;

export interface PriceRequest {
  id: string;
  userId: string;
  username: string;
  avatarEmoji: string;
  productName: string;
  brand?: string;
  description?: string;
  category: MainCategory;
  subCategory?: SubCategory;
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
