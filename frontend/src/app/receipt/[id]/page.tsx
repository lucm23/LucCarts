'use client';

// Printable receipt (client)
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import { Receipt } from '@/store/cart';
import Link from 'next/link';

interface ReceiptPageProps {
  params: {
    id: string;
  };
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const receiptData = localStorage.getItem(`receipt:${params.id}`);
    if (receiptData) {
      setReceipt(JSON.parse(receiptData));
    }
    setLoading(false);
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Receipt Not Found</h1>
          <p className="text-gray-600 mb-8">The receipt you're looking for doesn't exist.</p>
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Luccarts Mini Shop</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase!</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Details</h2>
          <p className="text-gray-600">Order ID: {receipt.id}</p>
          <p className="text-gray-600">Date: {new Date(receipt.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items Purchased</h3>
          <div className="space-y-3">
            {receipt.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(receipt.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(receipt.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(receipt.total)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Print Receipt
          </button>
          <Link
            href="/products"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
