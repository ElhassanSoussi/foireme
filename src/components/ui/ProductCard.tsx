"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './Button';
import { Heart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.primary_image_url || '/images/placeholder.png'
        });
    };

    return (
        <div
            className="group relative flex flex-col space-y-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                {product.badge && (
                    <div className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-wider font-medium">
                        {product.badge}
                    </div>
                )}

                <button className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/0 hover:bg-white/90 text-transparent hover:text-red-500 transition-all duration-300 group-hover:bg-white/50 group-hover:text-muted">
                    <Heart className="h-4 w-4 fill-current" />
                </button>

                <Image
                    src={product.primary_image_url || '/images/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div
                    className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                >
                    <Button className="w-full shadow-lg" size="sm" onClick={handleAddToCart}>
                        Quick Add - ${product.price.toFixed(2)}
                    </Button>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.round(product.average_rating) ? 'fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-muted">({product.reviews_count})</span>
                </div>

                <h3 className="font-medium leading-none text-base">
                    <Link href={`/products/${product.slug}`} className="hover:underline underline-offset-4">
                        {product.name}
                    </Link>
                </h3>
                <p className="text-sm text-muted line-clamp-1">{product.short_description}</p>
                <p className="font-medium">${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
}
