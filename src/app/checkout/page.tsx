"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export default function CheckoutPage() {
    const { items, subtotal, cartCount } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (items.length === 0) {
            router.push('/products');
        }

        const fetchSettings = async () => {
            const { data } = await supabase.from('site_settings').select('*').single();
            if (data) setSettings(data);
        };
        fetchSettings();
    }, [items, router]);

    // Calculations
    const shipping = settings?.shipping_fee || 0;
    const taxRate = settings?.tax_rate || 0;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create or get customer
            // Ideally we check if customer exists by email, if not create.
            // For simplicity, we'll just insert a new customer record or ignore conflict if we had unique constraint handling ready.
            // Since email is unique, we should try to select first.

            let customerId: string;

            const { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('email', email)
                .single();

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                const { data: newCustomer, error: customerError } = await supabase
                    .from('customers')
                    .insert({ email, name })
                    .select('id')
                    .single();

                if (customerError) throw customerError;
                customerId = newCustomer.id;
            }

            // 2. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_id: customerId,
                    subtotal,
                    tax,
                    shipping,
                    total,
                    status: 'pending'
                })
                .select('id')
                .single();

            if (orderError) throw orderError;

            // 3. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 4. Success
            // Clear cart (we need to expose a clearCart method in context, or just reload)
            // For now, let's redirect to success page which will handle clearing or just show success
            localStorage.removeItem('cart'); // Manual clear for now
            router.push(`/checkout/success?orderId=${order.id}`);

        } catch (error) {
            console.error('Checkout error:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Form */}
                <div>
                    <form onSubmit={handlePlaceOrder} className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Contact Information</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Shipping Address</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <select
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                                >
                                    <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Payment</h2>
                            <div className="p-4 border border-border rounded-md bg-secondary/20 text-sm text-muted">
                                This is a demo store. No payment is required.
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </Button>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="bg-secondary/20 p-8 rounded-lg h-fit">
                    <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-16 w-16 bg-white rounded overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-bl">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">{item.name}</h3>
                                        <p className="text-sm text-muted">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="font-medium text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
