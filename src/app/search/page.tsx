"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { ProductCard } from '@/components/ui/ProductCard';
import { Search } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setProducts([]);
                return;
            }

            setLoading(true);
            // Simple ILIKE search on name and description
            const { data } = await supabase
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
                .eq('is_active', true);

            if (data) setProducts(data);
            setLoading(false);
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Search className="h-12 w-12 text-muted/20" />
                <h2 className="text-xl font-medium">Search for products</h2>
                <p className="text-muted">Enter a keyword to start searching.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold">Search Results</h1>
                <p className="text-muted">
                    Found {products.length} results for "{query}"
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[3/4] bg-secondary animate-pulse" />
                            <div className="h-4 bg-secondary animate-pulse w-2/3" />
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
                        <div className="col-span-full py-12 text-center text-muted">
                            No products found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="container-custom py-12">
            <Suspense fallback={<div>Loading search...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
