"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    cartCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addItem = (newItem: Omit<CartItem, 'id'>) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.productId === newItem.productId);
            if (existingItem) {
                return currentItems.map((item) =>
                    item.productId === newItem.productId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...currentItems, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
        });
        setIsOpen(true);
    };

    const removeItem = (id: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((currentItems) =>
            currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                isOpen,
                openCart,
                closeCart,
                items,
                addItem,
                removeItem,
                updateQuantity,
                cartCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
