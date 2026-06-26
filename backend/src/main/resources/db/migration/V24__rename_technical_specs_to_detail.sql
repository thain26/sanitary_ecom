-- =============================================================
-- V24__rename_technical_specs_to_detail.sql
-- Đổi tên cột technical_specs thành detail và chuyển sang kiểu TEXT
-- =============================================================

ALTER TABLE products RENAME COLUMN technical_specs TO detail;
ALTER TABLE products ALTER COLUMN detail TYPE TEXT USING detail::text;
