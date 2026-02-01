-- RUN THIS IN SUPABASE SQL EDITOR to fix the Upload Error

-- 1. Drop the old policy if it exists (to avoid conflicts)
drop policy if exists "Allow uploads to product-images" on storage.objects;

-- 2. Create a stronger, explicit policy for PUBLIC/ANON uploads
create policy "Allow public uploads to product-images"
on storage.objects for insert
to public
with check ( bucket_id = 'product-images' );

-- 3. Also allow updating (in case you overwrite a file)
create policy "Allow public updates to product-images"
on storage.objects for update
to public
using ( bucket_id = 'product-images' );

-- 4. Just in case: Ensure RLS is enabled generally (so policies work), 
-- checking this confirms we aren't blocked by a global "disable".
alter table storage.objects enable row level security;
