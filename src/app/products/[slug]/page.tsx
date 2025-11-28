"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Star, Heart, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'application'>('description');
    const [selectedImage, setSelectedImage] = useState<string>('');
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;

            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single();

            if (data) {
                setProduct(data);
                setSelectedImage(data.primary_image_url || '');

                // Fetch related products
                if (data.category_id) {
                    const { data: related } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category_id', data.category_id)
                        .neq('id', data.id)
                        .limit(4);

                    if (related) setRelatedProducts(related);
                }
            } else {
                // Handle 404 in a real app
            }
            setLoading(false);
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.primary_image_url || '/images/placeholder.png'
        });
    };

    const allImages = [product.primary_image_url, ...(product.additional_image_urls || [])].filter(Boolean) as string[];

    return (
        <div className="bg-background">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
                            <Image
                                src={selectedImage || '/images/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square bg-secondary overflow-hidden border-2 transition-colors ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="mb-8 border-b border-border pb-8">
                            {product.badge && (
                                <span className="inline-block px-2 py-1 bg-secondary text-xs font-bold tracking-widest uppercase mb-4">
                                    {product.badge}
                                </span>
                            )}
                            <h1 className="text-4xl font-serif font-bold mb-2">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.round(product.average_rating) ? 'fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted">{product.reviews_count} Reviews</span>
                            </div>

                            <p className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</p>

                            <p className="text-muted leading-relaxed mb-8">
                                {product.short_description}
                            </p>

                            <div className="flex gap-4">
                                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                                <button className="p-3 border border-input hover:bg-secondary transition-colors">
                                    <Heart className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8 text-center text-sm text-muted">
                            <div className="flex flex-col items-center gap-2">
                                <Truck className="h-5 w-5" />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                <span>Free Returns</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-auto">
                            <div className="flex border-b border-border mb-6">
                                {(['description', 'ingredients', 'application'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 px-4 text-sm font-medium uppercase tracking-wide transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-muted hover:text-primary'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[150px] text-sm leading-relaxed text-muted">
                                {activeTab === 'description' && (
                                    <div className="prose prose-sm max-w-none">
                                        {product.long_description || product.short_description}
                                    </div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <div className="space-y-2">
                                        <p className="font-medium text-foreground">Key Ingredients:</p>
                                        {product.ingredients && product.ingredients.length > 0 ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {product.ingredients.map((ing, i) => (
                                                    <li key={i}>{ing}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Ingredients list not available.</p>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'application' && (
                                    <div className="prose prose-sm max-w-none">
                                        {product.application_tips || "Apply to clean, dry skin."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t border-border pt-16">
                        <h2 className="text-3xl font-serif font-bold mb-12 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
