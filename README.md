# Foireme - Premium Cosmetics E-commerce

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Supabase Setup**
   - Go to your Supabase project dashboard.
   - Run the SQL script found in `supabase/schema.sql` in the SQL Editor to set up tables and policies.
   - Create a storage bucket named `products` and make it public.
   - Create an admin user via the Authentication tab or SQL.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Features

- **Storefront**: Elegant, responsive design with "Minimalist Luxury" aesthetic.
- **Admin Dashboard**: Manage products, orders, and view stats.
- **Tech Stack**: Next.js 16, Tailwind CSS v4, Supabase (Auth, Database, Storage).
