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
    image: "https://m.media-amazon.com/images/I/61EL2AKKcBL._AC_UY218_.jpg",
    brand: "TechSound",
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: 2499,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    brand: "EcoWear",
    category: "Clothing",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    price: 3999,
    image: "https://images.unsplash.com/photo-1602143407151-01114192003fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    brand: "HydroSmart",
    category: "Health",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Portable Phone Charger",
    price: 2999,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    brand: "PowerPack",
    category: "Electronics",
    rating: 4.1,
  },
  {
    id: "5",
    name: "Coffee Maker",
    price: 8999,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    brand: "BrewMaster",
    category: "Kitchen",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Running Shoes",
    price: 12999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    brand: "RunFast",
    category: "Sports",
    rating: 4.8,
  },
];
