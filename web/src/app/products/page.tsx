// Product grid (server component)
import { createClient } from '@/utils/supabase/server';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage() {
  const supabase = await createClient();

  // Fetch products from database
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="mt-2 text-gray-600">Discover our amazing collection of products</p>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading products. Please try again later.</p>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id.toString(),
                name: product.name,
                price: product.price,
                image: product.image_url || '',
                brand: product.brand,
                category: product.category,
                rating: product.rating
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
