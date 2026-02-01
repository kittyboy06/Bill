-- RUN THIS IN SUPABASE SQL EDITOR
-- This adds the image column to your existing table

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_url text;

-- Optional: Add some dummy images to existing data for testing
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1544253101-55508f58b404?auto=format&fit=crop&q=80&w=600' WHERE category = 'Beverages';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600' WHERE category = 'Main Course';
