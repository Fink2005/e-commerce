/* eslint-disable no-unused-vars */
export interface Device {
  type: 'mobile' | 'tablet' | 'router';
  name: string;
  price: number;
  image: string;
}

export interface PackagePlan {
  name: string;
  price: number;
  minutes?: number | 'unlimited';
  sms?: number | 'unlimited';
  data?: number | 'unlimited';
  speed?: number;
  device?: string;
}

export interface CustomizableOptions {
  minutes?: { min: number; max: number; price: number; unlimited?: number };
  sms?: { min: number; max: number; price: number; unlimited?: number };
  data?: { min: number; max: number; price: number; unlimited?: number };
  speed?: { min: number; max: number; price: number };
  devices?: boolean;
}

export interface UsageRecommendation {
  lightUser: { minutes?: number; sms?: number; data?: number; speed?: number };
  mediumUser: { minutes?: number; sms?: number; data?: number; speed?: number };
  heavyUser: { minutes?: number; sms?: number; data?: number; speed?: number };
}

export interface CombinationDeal {
  name: string;
  packages: string[];
  discount: number;
}

export interface Color {
  name: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description?: string; // Added description property
  deviceType: string;
  inStock: boolean;
  colors?: Color[];
  sizes?: string[];
  discount: number;
  type: 'product' | 'package';
  packageType?: string;
  includedDevices?: Device[];
  defaultPlans?: PackagePlan[];
  customizable?: CustomizableOptions;
  usageRecommendation?: UsageRecommendation;
  availableCombinations?: CombinationDeal[];
}

// new

export enum ProductType {
  PHONE = 'PHONE',
  PACKAGE = 'PACKAGE',
  BUNDLE = 'BUNDLE',
  ALL = 'ALL',
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number | null;
  isActive: boolean;
  createdAt: string;
  colors?: string[];
  imgUrl?: string; // Add image property
  reviewCount?: number;
  updatedAt: string;
  type: ProductType;
}

export interface AnimatingItem {
  id: string;
  x: number;
  y: number;
  product: ProductResponse;
}
