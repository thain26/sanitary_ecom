-- =============================================================
-- V9__update_categories_hierarchy.sql — Thiết lập cấu trúc danh mục 3 cấp
-- =============================================================

-- Reset parent_id của các danh mục con về NULL để tránh vi phạm khóa ngoại
UPDATE categories SET parent_id = NULL WHERE parent_id IN (8, 9);

-- Xóa các danh mục trùng lặp nếu đã lỡ được chèn trong lần chạy lỗi trước
DELETE FROM categories WHERE id IN (8, 9);

-- 1. Thêm 2 nhóm danh mục cấp cao nhất (L1)
INSERT INTO categories (id, parent_id, name, slug, image_url, sort_order, is_active) VALUES
(8, NULL, 'Thiết bị vệ sinh', 'thiet-bi-ve-sinh', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&auto=format&fit=crop&q=60', 1, TRUE),
(9, NULL, 'Nắp & Phụ kiện',   'nap-va-phu-kien', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=60', 2, TRUE);

-- 2. Cập nhật parent_id cho các danh mục trước đây là L1 để đưa chúng vào L2
-- Nhóm 1: Thiết bị vệ sinh
UPDATE categories SET parent_id = 8, sort_order = 1 WHERE id = 1; -- Bồn Cầu
UPDATE categories SET parent_id = 8, sort_order = 2 WHERE id = 2; -- Chậu Rửa Mặt (Lavabo)
UPDATE categories SET parent_id = 8, sort_order = 3 WHERE id = 3; -- Vòi Nước

-- Nhóm 2: Nắp & Phụ kiện
UPDATE categories SET parent_id = 9, sort_order = 1 WHERE id = 4; -- Bồn Tiểu Nam
UPDATE categories SET parent_id = 9, sort_order = 2 WHERE id = 5; -- Vòi Cảm Ứng
UPDATE categories SET parent_id = 9, sort_order = 3 WHERE id = 6; -- Nắp Thông Minh (Washlet)
UPDATE categories SET parent_id = 9, sort_order = 4 WHERE id = 7; -- Phụ Kiện & Thiết Bị Khác
