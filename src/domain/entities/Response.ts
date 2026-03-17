export type Availability = 'in_stock' | 'out_of_stock' | 'limited';
export type Currency = 'NT$' | 'HK$' | 'S$' | '¥';

export interface PriceResponse {
  id: string;
  requestId: string;
  userId: string;
  username: string;
  avatarEmoji: string;
  price: number;
  currency: Currency;
  availability: Availability;
  storeConfirmed: string;
  note?: string;
  helpfulVotes: number;
  isBestAnswer: boolean;
  createdAt: Date;
}
