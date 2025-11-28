export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            site_settings: {
                Row: {
                    id: string
                    site_name: string
                    tagline: string | null
                    contact_email: string | null
                    phone: string | null
                    address: string | null
                    currency: string
                    tax_rate: number
                    shipping_fee: number
                    free_shipping_threshold: number | null
                    created_at: string
                    updated_at: string
                }
            }
            appearance_settings: {
                Row: {
                    id: string
                    primary_color: string | null
                    secondary_color: string | null
                    accent_color: string | null
                    background_color: string | null
                    text_color: string | null
                    heading_font: string | null
                    body_font: string | null
                    button_radius: number
                    card_radius: number
                    spacing_scale: Json | null
                    updated_at: string
                }
            }
            header_nav_items: {
                Row: {
                    id: string
                    label: string
                    href: string
                    order_index: number
                    created_at: string
                }
            }
            footer_settings: {
                Row: {
                    id: string
                    brand_description: string | null
                    copyright_text: string | null
                    updated_at: string
                }
            }
            footer_links: {
                Row: {
                    id: string
                    section_key: string
                    label: string
                    href: string
                    order_index: number
                }
            }
            social_links: {
                Row: {
                    id: string
                    platform: string
                    url: string
                    is_active: boolean
                }
            }
            hero_sections: {
                Row: {
                    id: string
                    title: string
                    subtitle: string | null
                    badge_text: string | null
                    description: string | null
                    cta_label: string | null
                    cta_href: string | null
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
            }
            categories: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    description: string | null
                    image_url: string | null
                    order_index: number
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                }
            }
            products: {
                Row: {
                    id: string
                    slug: string
                    name: string
                    short_description: string | null
                    long_description: string | null
                    price: number
                    badge: string | null
                    average_rating: number
                    reviews_count: number
                    is_featured: boolean
                    is_active: boolean
                    category_id: string | null
                    primary_image_url: string | null
                    additional_image_urls: string[] | null
                    ingredients: string[] | null
                    application_tips: string | null
                    created_at: string
                    updated_at: string
                }
            }
        }
    }
}
