import type { Timestamp } from 'firebase/firestore';

export interface PriceRecord {
  id?: string;
  userId: string;
  userName: string;
  userPhoto: string;

  // Product reference
  productCode: string;
  productName: string;
  productBrand: string;

  // Store reference
  storeId: string;
  storeName: string;
  storeBranch: string;
  storeAddress: string;

  // Price data
  price: number;
  currency: string;
  unit: string;
  isOnSale: boolean;
  originalPrice: number | null;

  // Meta
  note: string;
  photoUrl: string | null;
  recordedAt: Timestamp;
  location: {
    lat: number | null;
    lng: number | null;
  };
}

export interface UnifiedProduct {
  code: string;
  name: string;
  brand: string;
  aliases: string[];
  category: string;
  isOfficial: boolean;
  createdBy: string | null;
  recordCount: number;
  lastRecordedPrice: number | null;
  lastRecordedAt: Timestamp | null;
}

export interface UnifiedStore {
  id: string;
  brand: string;
  brandName: string;
  branchName: string;
  fullName: string;
  address: string;
  district: string;
  region: string;
  lat: number | null;
  lng: number | null;
  isVerified: boolean;
  createdBy: string | null;
  recordCount: number;
}
