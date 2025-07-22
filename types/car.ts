export interface CarListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Benzin' | 'Diesel' | 'Elektro' | 'Hybrid' | 'LPG' | 'Andere';
  transmission: 'Manuell' | 'Automatik';
  power: number; // PS
  description: string;
  location: string;
  sellerType: 'Privat' | 'Händler';
  sellerName: string;
  sellerPhone?: string;
  sellerId?: string;
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
  source?: string; // Source of the listing (internal, mobile.de, kleinanzeigen.de)
}

export type FilterOptions = {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: string[];
  transmission?: string[];
  sellerType?: string[];
  source?: string[];
  minPower?: number;
  maxPower?: number;
  features?: string[];
  keyword?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterOptions;
  createdAt: string;
}

export interface CostCalculation {
  purchasePrice: number;
  insurance: number;
  tax: number;
  fuel: number;
  maintenance: number;
  depreciation: number;
  totalMonthly: number;
  totalYearly: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  carId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface SellerProfile {
  id: string;
  name: string;
  type: 'Privat' | 'Händler';
  avatar?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  description?: string;
  rating: {
    average: number;
    count: number;
  };
  reviews: SellerReview[];
  memberSince: string;
  responseTime?: string;
  activeListings: number;
  totalSold: number;
  verified: boolean;
}

export interface SellerReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  carId?: string;
  carTitle?: string;
}