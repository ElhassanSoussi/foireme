"use client";

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type NavItem = Database['public']['Tables']['header_nav_items']['Row'];

export function Navbar() {
    const { openCart, cartCount } = useCart();
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchNavItems = async () => {
            const { data } = await supabase
                .from('header_nav_items')
                .select('*')
                .order('order_index');

            if (data && data.length > 0) {
                setNavItems(data);
            } else {
                // Fallback if no items in DB yet
                setNavItems([
                    { id: '1', label: 'Skincare', href: '/categories/skincare', order_index: 1, created_at: '' },
                    { id: '2', label: 'Makeup', href: '/categories/makeup', order_index: 2, created_at: '' },
                    { id: '3', label: 'Gifts', href: '/categories/gifts', order_index: 3, created_at: '' },
                    { id: '4', label: 'New Arrivals', href: '/products?sort=newest', order_index: 4, created_at: '' },
                ]);
            }
        };

        fetchNavItems();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
                    ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'
                    : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container-custom flex h-20 items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-serif text-2xl font-bold tracking-tighter">FOIREME.</span>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="text-sm font-medium text-muted hover:text-primary transition-colors uppercase tracking-wide"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-0 group-hover:w-48 focus:w-48 transition-all duration-300 border-b border-transparent focus:border-primary bg-transparent outline-none text-sm px-2"
                        />
                        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </button>
                    </div>

                    <Link href="/wishlist" className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:block">
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                    </Link>

                    <button
                        onClick={openCart}
                        className="p-2 hover:bg-secondary rounded-full transition-colors relative"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        <span className="sr-only">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <Link href="/login" className="p-2 hover:bg-secondary rounded-full transition-colors hidden sm:block">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                    </Link>

                    <button className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
