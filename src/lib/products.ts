// Define a type for your product to ensure consistency
export interface Product {
  id: number;
  imgUrl?: string; // Added imgUrl property
  name: string;
  image: string;
  rating: number;
  description?: string;
  reviewCount: number;
  price: number;
  oldPrice?: number;
  colors?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 5,
    reviewCount: 65,
    price: 292,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 2,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 3,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 4,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 5,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 6,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 7,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
  {
    id: 8,
    name: 'Havic HV G-92 Gamepad',
    image: '/placeholder.svg',
    rating: 4,
    reviewCount: 65,
    price: 192,
    oldPrice: 220,
    colors: ['black', 'white', 'red'],
  },
];
