-- =============================================================
-- V11__remove_non_inax_brands.sql — Loại bỏ các thương hiệu chưa có dữ liệu
-- =============================================================

DELETE FROM brands WHERE slug IN ('toto', 'grohe', 'caesar');
