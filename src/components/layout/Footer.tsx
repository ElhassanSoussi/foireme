"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

type FooterLink = Database['public']['Tables']['footer_links']['Row'];
type SocialLink = Database['public']['Tables']['social_links']['Row'];
type FooterSettings = Database['public']['Tables']['footer_settings']['Row'];

export function Footer() {
    const [links, setLinks] = useState<FooterLink[]>([]);
    const [socials, setSocials] = useState<SocialLink[]>([]);
    const [settings, setSettings] = useState<FooterSettings | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [linksRes, socialsRes, settingsRes] = await Promise.all([
                supabase.from('footer_links').select('*').order('order_index'),
                supabase.from('social_links').select('*').eq('is_active', true),
                supabase.from('footer_settings').select('*').single()
            ]);

            if (linksRes.data) setLinks(linksRes.data);
            if (socialsRes.data) setSocials(socialsRes.data);
            if (settingsRes.data) setSettings(settingsRes.data);
        };

        fetchData();
    }, []);

    const getLinksBySection = (section: string) => links.filter(l => l.section_key === section);

    const socialIcons: Record<string, React.ReactNode> = {
        facebook: <Facebook className="h-5 w-5" />,
        instagram: <Instagram className="h-5 w-5" />,
        twitter: <Twitter className="h-5 w-5" />,
        youtube: <Youtube className="h-5 w-5" />,
    };

    return (
        <footer className="border-t border-border bg-background">
            <div className="container-custom py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-serif text-lg font-bold">FOIREME.</h3>
                        <p className="text-sm text-muted max-w-xs">
                            {settings?.brand_description || "Redefining beauty with clean, sustainable, and effective cosmetics for the modern individual."}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted">
                            {getLinksBySection('shop').length > 0 ? getLinksBySection('shop').map(link => (
                                <li key={link.id}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
                            )) : (
                                <>
                                    <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                                    <li><Link href="/categories/skincare" className="hover:text-primary transition-colors">Skincare</Link></li>
                                    <li><Link href="/categories/makeup" className="hover:text-primary transition-colors">Makeup</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted">
                            {getLinksBySection('about').length > 0 ? getLinksBySection('about').map(link => (
                                <li key={link.id}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
                            )) : (
                                <>
                                    <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                    <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted">
                            {getLinksBySection('legal').length > 0 ? getLinksBySection('legal').map(link => (
                                <li key={link.id}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>
                            )) : (
                                <>
                                    <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted">
                        {settings?.copyright_text || `© ${new Date().getFullYear()} Foireme Cosmetics. All rights reserved.`}
                    </p>
                    <div className="flex gap-4">
                        {socials.map(social => (
                            <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                                {socialIcons[social.platform.toLowerCase()] || social.platform}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
