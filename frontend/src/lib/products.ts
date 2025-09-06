// Local catalog data + types
export interface Product {
  id: string;
  name: string;
  price: number; // cents
  image: string;
  brand?: string;
  category?: string;
  rating?: number;
}

// Mock product catalog
export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 7999, // $79.99 in cents
    image: "https://picsum.photos/300/300?random=1",
    brand: "TechSound",
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: 2499,
    image: "https://picsum.photos/300/300?random=2",
    brand: "EcoWear",
    category: "Clothing",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    price: 3999,
    image: "https://picsum.photos/300/300?random=3",
    brand: "HydroSmart",
    category: "Health",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Portable Phone Charger",
    price: 2999,
    image: "https://picsum.photos/300/300?random=4",
    brand: "PowerPack",
    category: "Electronics",
    rating: 4.1,
  },
  {
    id: "5",
    name: "Coffee Maker",
    price: 8999,
    image: "https://picsum.photos/300/300?random=5",
    brand: "BrewMaster",
    category: "Kitchen",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Running Shoes",
    price: 12999,
    image: "https://picsum.photos/300/300?random=6",
    brand: "RunFast",
    category: "Sports",
    rating: 4.8,
  },
];
