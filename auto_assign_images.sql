-- RUN THIS IN SUPABASE SQL EDITOR
-- This will automatically assign professional images to your existing food items

-- Beverages
UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1544253101-55508f58b404?auto=format&fit=crop&q=80&w=600' 
WHERE product_name ILIKE '%Masala Chai%';

UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1596932470550-2c35581177ce?auto=format&fit=crop&q=80&w=600' 
WHERE product_name ILIKE '%Filter Coffee%';

-- Starters
UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600' 
WHERE product_name ILIKE '%Gobi 65%';

-- Main Course
UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600' 
WHERE product_name ILIKE '%Veg Biryani%';

-- Desserts
UPDATE public.products 
SET image_url = 'https://images.unsplash.com/photo-1595696122606-25f1908889cd?auto=format&fit=crop&q=80&w=600' 
WHERE product_name ILIKE '%Gulab Jamun%';
