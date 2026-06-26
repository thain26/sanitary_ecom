-- Drop segment check constraint and drop column from products table
ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_products_segment;
ALTER TABLE products DROP COLUMN IF EXISTS segment;
