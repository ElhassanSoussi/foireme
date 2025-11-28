"use client";

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
    const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCart();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!isOpen) return null;

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-background shadow-xl flex flex-col h-full animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-serif font-bold">Shopping Cart</h2>
                    <button onClick={closeCart} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <ShoppingBag className="h-16 w-16 text-muted/20" />
                            <p className="text-muted">Your cart is empty</p>
                            <Button variant="outline" onClick={closeCart}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-24 w-24 bg-secondary flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-muted">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-border">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-secondary transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-secondary transition-colors"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs text-muted hover:text-red-500 underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-border bg-secondary/10 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted">Shipping</span>
                                <span className="text-muted">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between items-center font-medium text-lg pt-2 border-t border-border/50">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
