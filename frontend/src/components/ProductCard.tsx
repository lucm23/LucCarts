'use client';

// Reusable product card (client)
import { Product } from '@/lib/products';
import { formatCurrency } from '@/lib/currency';
import { useCart } from '@/store/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 sm:h-56 object-cover"
      />
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
        {product.brand && (
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
        )}
        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        )}
        {product.rating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={() => add(product)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors w-full sm:w-auto min-h-[44px] touch-manipulation"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
