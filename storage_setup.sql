-- 1. Create the storage bucket 'product-images'
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- 2. Policy: Allow Public Read Access (Everyone can see images)
create policy "Give public access to product-images"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- 3. Policy: Allow Anyone to Upload (Simpler for this internal app)
-- In a stricter app, you would check for authentication
create policy "Allow uploads to product-images"
on storage.objects for insert
with check ( bucket_id = 'product-images' );
