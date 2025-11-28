"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const router = useRouter();
    const { items, removeItem } = useCart();

    // Clear cart context on mount if we just came from checkout
    useEffect(() => {
        // We can't easily clear all from context without adding a clearCart method
        // But we manually cleared localStorage in the checkout page.
        // To sync the context, we could reload or expose clearCart.
        // For this demo, let's just assume the user will navigate away.
        // Ideally, CartContext should listen to storage events or have a clear method.

        // Quick hack to clear context state for this session
        items.forEach(item => removeItem(item.id));
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
            <div className="mb-6 text-green-500">
                <CheckCircle className="h-20 w-20" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted max-w-md mb-8">
                Thank you for your purchase. Your order {orderId ? `#${orderId.slice(0, 8)}` : ''} has been received and is being processed.
            </p>
            <Button onClick={() => router.push('/')} size="lg">
                Continue Shopping
            </Button>
        </div>
    );
}
