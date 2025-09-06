'use client';

// Cart UI + summary + pay (client)
import { useCart } from '@/store/cart';
import { formatCurrency } from '@/lib/currency';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, remove, setQty, clear, totalCents } = useCart();
  const router = useRouter();
  
  const subtotal = totalCents();
  const taxRate = 0.0825; // 8.25% tax
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  const handlePayment = () => {
    // Generate order ID
    const orderId = `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    // Create receipt object
    const receipt = {
      id: orderId,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        qty: item.qty,
        price: item.product.price,
      })),
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    localStorage.setItem(`receipt:${orderId}`, JSON.stringify(receipt));
    
    // Clear cart and navigate to receipt
    clear();
    router.push(`/receipt/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {items.map((item) => (
              <div key={item.product.id} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    {item.product.brand && (
                      <p className="text-sm text-gray-600">{item.product.brand}</p>
                    )}
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => setQty(item.product.id, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <button
                      onClick={() => remove(item.product.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.25%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium"
            >
              Pay with Prop Money
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
