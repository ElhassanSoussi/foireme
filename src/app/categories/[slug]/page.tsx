import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ProductCard } from '@/components/ui/ProductCard';

// This is a server component
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch category
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!category) {
        notFound();
    }

    // Fetch products in category
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true);

    return (
        <div>
            {/* Category Hero */}
            <div className="relative h-[40vh] w-full bg-secondary overflow-hidden">
                {category.image_url ? (
                    <Image
                        src={category.image_url}
                        alt={category.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-secondary" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="container-custom text-white space-y-4">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold">{category.title}</h1>
                        {category.description && (
                            <p className="text-lg max-w-2xl mx-auto opacity-90">{category.description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-muted">
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
