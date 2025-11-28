"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { ArrowRight } from "lucide-react";

type HeroSection = Database['public']['Tables']['hero_sections']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type NewsletterSettings = Database['public']['Tables']['newsletter_settings']['Row'];

export default function Home() {
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newsletter, setNewsletter] = useState<NewsletterSettings | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [heroRes, catRes, prodRes, newsRes] = await Promise.all([
        supabase.from('hero_sections').select('*').eq('is_active', true).single(),
        supabase.from('categories').select('*').order('order_index').limit(4),
        supabase.from('products').select('*').eq('is_featured', true).eq('is_active', true).limit(8),
        supabase.from('newsletter_settings').select('*').single()
      ]);

      if (heroRes.data) setHero(heroRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setFeaturedProducts(prodRes.data);
      if (newsRes.data) setNewsletter(newsRes.data);
    };

    fetchData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { error } = await supabase.from('newsletter_subscribers').insert({
      email,
      source: 'homepage',
    });

    if (!error) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-secondary/20">
        {hero ? (
          <>
            <div className="absolute inset-0 z-0">
              {hero.image_url && (
                <Image
                  src={hero.image_url}
                  alt={hero.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="container-custom relative z-10 h-full flex items-center">
              <div className="max-w-xl space-y-6 text-white p-8 md:p-0">
                {hero.badge_text && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur text-xs font-bold tracking-widest uppercase mb-2">
                    {hero.badge_text}
                  </span>
                )}
                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-xl md:text-2xl font-light opacity-90">
                    {hero.subtitle}
                  </p>
                )}
                {hero.description && (
                  <p className="text-base opacity-80 max-w-md">
                    {hero.description}
                  </p>
                )}
                <div className="pt-4">
                  <Link href={hero.cta_href || '/products'}>
                    <Button size="lg" className="bg-white text-black hover:bg-white/90 border-none min-w-[160px]">
                      {hero.cta_label || 'Shop Now'}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating Cards Effect (Visual only) */}
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3">
                <div className="relative w-full h-full">
                  {/* We could add floating product cards here if we had specific data */}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Fallback Hero
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-serif">Welcome to Foireme</h1>
              <p className="text-muted">Loading experience...</p>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Flawless Essentials</h2>
            <p className="text-muted text-lg">
              Curated favorites for your daily ritual. Discover the products our community loves most.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              // Skeletons or empty state
              <p className="col-span-full text-center text-muted">No featured products found.</p>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-square overflow-hidden bg-white"
              >
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                  <h3 className="text-2xl font-serif font-bold mb-2">{category.title}</h3>
                  <span className="text-sm font-medium uppercase tracking-widest opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-2">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold">
              {newsletter?.headline || "Join the Inner Circle"}
            </h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              {newsletter?.description || "Subscribe to receive exclusive offers, early access to new launches, and beauty tips from our experts."}
            </p>

            {subscribed ? (
              <div className="p-4 bg-white/10 rounded-lg text-green-400 font-medium">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={newsletter?.placeholder || "Enter your email address"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                />
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-white/90 border-none px-8"
                >
                  {newsletter?.cta_label || "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
