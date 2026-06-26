-- =============================================================
-- V10__add_category_descriptions.sql — Cập nhật mô tả chi tiết danh mục
-- =============================================================

UPDATE categories 
SET description = 'Bàn cầu, Lavabo, Vòi sen...' 
WHERE slug = 'thiet-bi-ve-sinh';

UPDATE categories 
SET description = 'Nắp thông minh, Phụ kiện...' 
WHERE slug = 'nap-va-phu-kien';
