"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch categories
            const { data: catData } = await supabase.from('categories').select('*').order('title');
            if (catData) setCategories(catData);

            // Fetch products
            let query = supabase.from('products').select('*').eq('is_active', true);

            if (selectedCategory) {
                query = query.eq('category_id', selectedCategory);
            }

            const { data: prodData } = await query;
            if (prodData) setProducts(prodData);

            setLoading(false);
        };

        fetchData();
    }, [selectedCategory]);

    return (
        <div className="container-custom py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Shop All</h1>
                    <p className="text-muted">Explore our complete collection of premium cosmetics.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" /> Filter
                    </Button>
                    <select
                        className="h-10 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        value={selectedCategory || ''}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[3/4] bg-secondary animate-pulse" />
                            <div className="h-4 bg-secondary animate-pulse w-2/3" />
                            <div className="h-4 bg-secondary animate-pulse w-1/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-muted">
                            No products found in this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
