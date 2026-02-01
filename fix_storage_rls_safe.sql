-- RUN THIS IN SUPABASE SQL EDITOR
-- Corrected version: Does NOT try to alter system tables.

-- 1. Drop the old policy if it exists
-- (If this line fails, just ignore it and run the CREATE lines below)
drop policy if exists "Allow uploads to product-images" on storage.objects;

-- 2. Create policy for PUBLIC uploads
create policy "Allow public uploads to product-images"
on storage.objects for insert
to public
with check ( bucket_id = 'product-images' );

-- 3. Allow updating
create policy "Allow public updates to product-images"
on storage.objects for update
to public
using ( bucket_id = 'product-images' );
