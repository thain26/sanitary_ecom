-- =============================================================
-- V21__merge_bancau_to_boncau.sql
-- Gộp các danh mục "Bàn cầu" bị trùng lặp do import từ CSV vào "Bồn cầu"
-- =============================================================

DO $$ 
DECLARE 
    target_1khoi INT;
    target_2khoi INT;
    target_thongminh INT;
    target_treotuong INT;
    target_chung INT;
BEGIN
    -- Lấy ID của các danh mục đích (Bồn cầu)
    SELECT id INTO target_1khoi FROM categories WHERE name ILIKE 'Bồn Cầu 1 Khối%' LIMIT 1;
    SELECT id INTO target_2khoi FROM categories WHERE name ILIKE 'Bồn Cầu 2 Khối%' LIMIT 1;
    SELECT id INTO target_thongminh FROM categories WHERE name ILIKE 'Bồn Cầu Thông Minh%' LIMIT 1;
    SELECT id INTO target_treotuong FROM categories WHERE name ILIKE 'Bồn Cầu Gắn Tường%' LIMIT 1;
    SELECT id INTO target_chung FROM categories WHERE name = 'Bồn Cầu' LIMIT 1;

    -- 1. Bàn cầu 1 khối
    IF target_1khoi IS NOT NULL THEN
        UPDATE products 
        SET category_id = target_1khoi 
        WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE 'Bàn cầu 1 khối%' OR name ILIKE 'Bàn cầu một khối%');
    END IF;

    -- 2. Bàn cầu 2 khối
    IF target_2khoi IS NOT NULL THEN
        UPDATE products 
        SET category_id = target_2khoi 
        WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE 'Bàn cầu 2 khối%');
    END IF;

    -- 3. Bàn cầu thông minh / điện tử
    IF target_thongminh IS NOT NULL THEN
        UPDATE products 
        SET category_id = target_thongminh 
        WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE 'Bàn cầu thông minh%' OR name ILIKE 'Bàn cầu điện tử%' OR name ILIKE 'Bàn cầu kết hợp nắp rửa%');
    END IF;

    -- 4. Bàn cầu treo tường
    IF target_treotuong IS NOT NULL THEN
        UPDATE products 
        SET category_id = target_treotuong 
        WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE 'Bàn cầu treo tường%');
    END IF;

    -- 5. Bàn Cầu (Toilets) chung
    IF target_chung IS NOT NULL THEN
        UPDATE products 
        SET category_id = target_chung 
        WHERE category_id IN (SELECT id FROM categories WHERE name ILIKE 'Bàn Cầu (Toilets)%');
    END IF;

    -- Cuối cùng, xóa các danh mục "Bàn cầu" không còn sản phẩm (phòng hờ còn sản phẩm bị sót thì không xóa)
    -- Do PostgreSQL sẽ báo lỗi khóa ngoại nếu danh mục còn sản phẩm, 
    -- ta chỉ xóa các danh mục không có sản phẩm tham chiếu.
    DELETE FROM categories 
    WHERE name ILIKE 'Bàn cầu%' 
    AND id NOT IN (SELECT DISTINCT category_id FROM products WHERE category_id IS NOT NULL);

END $$;
