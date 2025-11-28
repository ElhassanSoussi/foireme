-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Site Settings
create table site_settings (
  id uuid default uuid_generate_v4() primary key,
  site_name text not null default 'Foireme',
  tagline text,
  contact_email text,
  phone text,
  address text,
  currency text default 'USD',
  tax_rate numeric default 0,
  shipping_fee numeric default 0,
  free_shipping_threshold numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Appearance Settings
create table appearance_settings (
  id uuid default uuid_generate_v4() primary key,
  primary_color text,
  secondary_color text,
  accent_color text,
  background_color text,
  text_color text,
  heading_font text,
  body_font text,
  button_radius numeric default 0,
  card_radius numeric default 0,
  spacing_scale jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Header Settings
create table header_settings (
  id uuid default uuid_generate_v4() primary key,
  logo_text text not null default 'FOIREME',
  logo_subtitle text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Header Nav Items
create table header_nav_items (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  href text not null,
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Footer Settings
create table footer_settings (
  id uuid default uuid_generate_v4() primary key,
  brand_description text,
  copyright_text text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Footer Links
create table footer_links (
  id uuid default uuid_generate_v4() primary key,
  section_key text not null, -- e.g. 'shop', 'help', 'about', 'legal'
  label text not null,
  href text not null,
  order_index int default 0
);

-- 7. Social Links
create table social_links (
  id uuid default uuid_generate_v4() primary key,
  platform text not null, -- 'facebook', 'instagram', 'twitter', 'youtube'
  url text not null,
  is_active boolean default true
);

-- 8. Hero Sections
create table hero_sections (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subtitle text,
  badge_text text,
  description text,
  cta_label text,
  cta_href text,
  image_url text,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Categories
create table categories (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  description text,
  image_url text,
  order_index int default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Products
create table products (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  name text not null,
  short_description text,
  long_description text,
  price numeric(10, 2) not null,
  badge text,
  average_rating numeric(3, 2) default 0,
  reviews_count int default 0,
  is_featured boolean default false,
  is_active boolean default true,
  category_id uuid references categories(id) on delete set null,
  primary_image_url text,
  additional_image_urls text[], -- or jsonb if you prefer structured data
  ingredients text[],
  application_tips text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Newsletter Settings
create table newsletter_settings (
  id uuid default uuid_generate_v4() primary key,
  headline text,
  description text,
  placeholder text,
  cta_label text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Newsletter Subscribers
create table newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source text -- e.g. 'footer', 'hero'
);

-- 13. Customers
create table customers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Orders
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id) on delete set null,
  subtotal numeric(10, 2) not null,
  tax numeric(10, 2) default 0,
  shipping numeric(10, 2) default 0,
  total numeric(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. Order Items
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity int not null,
  unit_price numeric(10, 2) not null
);

-- 16. Admin Users
create table admin_users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Helper function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from admin_users
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table site_settings enable row level security;
alter table appearance_settings enable row level security;
alter table header_settings enable row level security;
alter table header_nav_items enable row level security;
alter table footer_settings enable row level security;
alter table footer_links enable row level security;
alter table social_links enable row level security;
alter table hero_sections enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table newsletter_settings enable row level security;
alter table newsletter_subscribers enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table admin_users enable row level security;

-- Public Read Policies (Content)
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read appearance_settings" on appearance_settings for select using (true);
create policy "Public read header_settings" on header_settings for select using (true);
create policy "Public read header_nav_items" on header_nav_items for select using (true);
create policy "Public read footer_settings" on footer_settings for select using (true);
create policy "Public read footer_links" on footer_links for select using (true);
create policy "Public read social_links" on social_links for select using (true);
create policy "Public read hero_sections" on hero_sections for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read newsletter_settings" on newsletter_settings for select using (true);

-- Admin Write Policies (Content)
-- We'll use a macro-like approach or just repeat the policy for clarity.
-- Using the is_admin() function for cleaner policies.

-- Site Settings
create policy "Admin all site_settings" on site_settings for all using (is_admin());
-- Appearance Settings
create policy "Admin all appearance_settings" on appearance_settings for all using (is_admin());
-- Header Settings
create policy "Admin all header_settings" on header_settings for all using (is_admin());
-- Header Nav Items
create policy "Admin all header_nav_items" on header_nav_items for all using (is_admin());
-- Footer Settings
create policy "Admin all footer_settings" on footer_settings for all using (is_admin());
-- Footer Links
create policy "Admin all footer_links" on footer_links for all using (is_admin());
-- Social Links
create policy "Admin all social_links" on social_links for all using (is_admin());
-- Hero Sections
create policy "Admin all hero_sections" on hero_sections for all using (is_admin());
-- Categories
create policy "Admin all categories" on categories for all using (is_admin());
-- Products
create policy "Admin all products" on products for all using (is_admin());
-- Newsletter Settings
create policy "Admin all newsletter_settings" on newsletter_settings for all using (is_admin());

-- Newsletter Subscribers
-- Public can insert (subscribe)
create policy "Public insert newsletter_subscribers" on newsletter_subscribers for insert with check (true);
-- Admin can view/manage
create policy "Admin all newsletter_subscribers" on newsletter_subscribers for all using (is_admin());

-- Customers
-- Admin can view all
create policy "Admin all customers" on customers for all using (is_admin());
-- Users can view their own customer record (if we link auth later, for now just admin)

-- Orders
-- Admin can view all
create policy "Admin all orders" on orders for all using (is_admin());
-- Users can view own orders (needs auth linkage, assuming customer_id might link to auth or just guest checkout for now)
-- For this schema, let's assume authenticated users might have a customer record linked, 
-- but the prompt didn't strictly specify auth-to-customer link other than admin.
-- We'll stick to Admin access for now as requested.

-- Order Items
create policy "Admin all order_items" on order_items for all using (is_admin());

-- Admin Users
-- Only admins can view admin users (or maybe super admin, but let's say admins can see each other)
create policy "Admin view admin_users" on admin_users for select using (is_admin());
-- Only admins can manage admin users
create policy "Admin manage admin_users" on admin_users for all using (is_admin());
