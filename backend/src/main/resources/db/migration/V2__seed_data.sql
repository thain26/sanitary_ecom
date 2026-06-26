-- =============================================================
-- V2__seed_data.sql — Dữ liệu mẫu từ Catalog Inax 2025
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ADMIN USER  (password: Admin@123)
-- ─────────────────────────────────────────────────────────────
INSERT INTO users (email, password, full_name, phone, role, status) VALUES
('admin@sanitary.vn', '$2a$12$K8Kg1zNq5VlE9Ux2x3h4wOqW7Mf6pL4nT2yB1vX0cD3eG5iJ7kM9', 'Admin Hệ Thống', '0901234567', 'ADMIN', 'ACTIVE');

-- ─────────────────────────────────────────────────────────────
-- 2. BRANDS
-- ─────────────────────────────────────────────────────────────
INSERT INTO brands (name, slug, description, is_active) VALUES
('INAX',  'inax',  'Thương hiệu thiết bị vệ sinh hàng đầu Nhật Bản', TRUE),
('TOTO',  'toto',  'Thương hiệu thiết bị vệ sinh cao cấp Nhật Bản',   TRUE),
('Grohe', 'grohe', 'Thương hiệu vòi nước cao cấp Đức',                 TRUE),
('Caesar','caesar','Thương hiệu thiết bị vệ sinh Đài Loan',            TRUE);

-- ─────────────────────────────────────────────────────────────
-- 3. CATEGORIES (L1 + L2 từ catalog Inax 2025)
-- ─────────────────────────────────────────────────────────────
-- L1
INSERT INTO categories (id, parent_id, name, slug, image_url, sort_order) VALUES
(1,  NULL, 'Bồn Cầu',                  'bon-cau',         'https://images.unsplash.com/photo-1649083049103-62b1154b7305?w=500&auto=format&fit=crop&q=60',  1),
(2,  NULL, 'Chậu Rửa Mặt (Lavabo)',    'lavabo',          'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=500&auto=format&fit=crop&q=60',  2),
(3,  NULL, 'Vòi Nước',                 'voi-nuoc',        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60',  3),
(4,  NULL, 'Bồn Tiểu Nam',             'bon-tieu-nam',    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&auto=format&fit=crop&q=60',  4),
(5,  NULL, 'Vòi Cảm Ứng',              'voi-cam-ung',     'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60',  5),
(6,  NULL, 'Nắp Thông Minh (Washlet)', 'nap-thong-minh',  'https://images.unsplash.com/photo-1649083049103-62b1154b7305?w=500&auto=format&fit=crop&q=60',  6),
(7,  NULL, 'Phụ Kiện & Thiết Bị Khác', 'phu-kien',        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=60',  7);

-- L2 — Bồn Cầu
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
(10, 1, 'Bồn Cầu 1 Khối (One-piece)',    'bon-cau-1-khoi',    1),
(11, 1, 'Bồn Cầu 2 Khối (Two-piece)',    'bon-cau-2-khoi',    2),
(12, 1, 'Bồn Cầu Thông Minh (Smart)',    'bon-cau-thong-minh',3);

-- L2 — Lavabo
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
(20, 2, 'Lavabo Âm Bàn (Under Counter)', 'lavabo-am-ban',      1),
(21, 2, 'Lavabo Đặt Bàn (Counter Top)',  'lavabo-dat-ban',     2),
(22, 2, 'Lavabo Treo Tường (Wall-hung)', 'lavabo-treo-tuong',  3);

-- L2 — Vòi Nước
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
(30, 3, 'Vòi Lavabo',              'voi-lavabo',        1),
(31, 3, 'Vòi Sen & Bồn Tắm',      'voi-sen-bon-tam',   2);

SELECT SETVAL('categories_id_seq', 100);

-- ─────────────────────────────────────────────────────────────
-- 4. PRODUCTS — Bồn Cầu 1 Khối (INAX)
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, stock, segment, is_featured)
VALUES
(10, 1,
 'Bồn cầu 1 khối INAX AC-900VRN',
 'bon-cau-1-khoi-inax-ac-900vrn',
 'AC-900VRN',
 'Bồn cầu 1 khối cao cấp với công nghệ Aqua Ceramic chống bám bẩn, tiết kiệm nước.',
 '{"flush_volume":"3.5L/5.0L","flush_type":"Eco-X Vortex","aqua_ceramic":true,"dimensions":"680x370x750mm","weight":"26kg","color":"Trắng","material":"Sứ cao cấp","warranty_years":3}',
 6200000, 20, 'PREMIUM', FALSE),

(10, 1,
 'Bồn cầu 1 khối INAX AC-969VN',
 'bon-cau-1-khoi-inax-ac-969vn',
 'AC-969VN',
 'Bồn cầu 1 khối Aqua Ceramic dáng oval hiện đại, hệ thống xả xoáy mạnh.',
 '{"flush_volume":"3.5L/5.0L","flush_type":"Eco-X Vortex","aqua_ceramic":true,"dimensions":"700x390x780mm","weight":"28kg","color":"Trắng","material":"Sứ cao cấp","warranty_years":3}',
 7500000, 15, 'PREMIUM', TRUE),

(10, 1,
 'Bồn cầu 1 khối INAX AC-991VRN',
 'bon-cau-1-khoi-inax-ac-991vrn',
 'AC-991VRN',
 'Bồn cầu 1 khối thiết kế tối giản, nắp êm tự động hạ.',
 '{"flush_volume":"3.5L/5.0L","flush_type":"Eco-X Vortex","aqua_ceramic":true,"soft_close_lid":true,"dimensions":"720x390x800mm","weight":"30kg","color":"Trắng","warranty_years":3}',
 8300000, 12, 'PREMIUM', FALSE),

(10, 1,
 'Bồn cầu 1 khối INAX AC-1032VN',
 'bon-cau-1-khoi-inax-ac-1032vn',
 'AC-1032VN',
 'Bồn cầu 1 khối hạng sang, thiết kế rimless không vành dễ vệ sinh.',
 '{"flush_volume":"3.5L/5.0L","flush_type":"Eco-X Vortex","aqua_ceramic":true,"rimless":true,"soft_close_lid":true,"dimensions":"720x400x800mm","weight":"31kg","color":"Trắng","warranty_years":3}',
 9800000, 10, 'PREMIUM', FALSE),

(10, 1,
 'Bồn cầu 1 khối INAX AC-1035VN',
 'bon-cau-1-khoi-inax-ac-1035vn',
 'AC-1035VN',
 'Bồn cầu 1 khối cao cấp rimless, tiết kiệm nước tối ưu.',
 '{"flush_volume":"3.5L/5.0L","aqua_ceramic":true,"rimless":true,"dimensions":"740x400x810mm","warranty_years":3}',
 10200000, 8, 'PREMIUM', FALSE),

(10, 1,
 'Bồn cầu 1 khối INAX AC-2700VN',
 'bon-cau-1-khoi-inax-ac-2700vn',
 'AC-2700VN',
 'Bồn cầu 1 khối luxury dáng thấp, thiết kế Nhật Bản đương đại.',
 '{"flush_volume":"3.5L/5.0L","aqua_ceramic":true,"rimless":true,"soft_close_lid":true,"dimensions":"760x410x830mm","weight":"35kg","warranty_years":5}',
 16810000, 5, 'LUXURY', TRUE);

-- ─────────────────────────────────────────────────────────────
-- 5. PRODUCTS — Bồn Cầu 2 Khối
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (category_id, brand_id, name, slug, model_code, technical_specs, base_price, stock, segment)
VALUES
(11, 1, 'Bồn cầu 2 khối INAX AC-504VN', 'bon-cau-2-khoi-inax-ac-504vn', 'AC-504VN',
 '{"flush_volume":"6L","aqua_ceramic":true,"dimensions":"660x360x730mm","warranty_years":3}',
 2500000, 30, 'STANDARD'),

(11, 1, 'Bồn cầu 2 khối INAX AC-700VN', 'bon-cau-2-khoi-inax-ac-700vn', 'AC-700VN',
 '{"flush_volume":"4.5L/6L","aqua_ceramic":true,"dimensions":"680x370x750mm","warranty_years":3}',
 3200000, 25, 'STANDARD'),

(11, 1, 'Bồn cầu 2 khối INAX C-108VA', 'bon-cau-2-khoi-inax-c-108va', 'C-108VA',
 '{"flush_volume":"6L","dimensions":"660x350x720mm","warranty_years":2}',
 2200000, 35, 'STANDARD');

-- ─────────────────────────────────────────────────────────────
-- 6. PRODUCTS — Bồn Cầu Thông Minh
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, stock, segment, is_featured)
VALUES
(12, 1,
 'Bồn cầu thông minh INAX Satis G AC-618VN',
 'bon-cau-thong-minh-inax-satis-g-ac-618vn',
 'AC-618VN',
 'Bồn cầu thông minh Satis G tích hợp vòi rửa, sấy khô, khử mùi, nắp tự động.',
 '{"flush_volume":"3.5L/5.0L","aqua_ceramic":true,"smart_features":["Auto open/close lid","Heated seat","Bidet","Hot air dry","Deodorizer","Auto flush"],"dimensions":"730x390x400mm","warranty_years":3}',
 45000000, 3, 'LUXURY', TRUE),

(12, 1,
 'Bồn cầu thông minh INAX Satis S AC-818VN',
 'bon-cau-thong-minh-inax-satis-s-ac-818vn',
 'AC-818VN',
 'Bồn cầu thông minh Satis S cao cấp nhất, Plasmacluster khử khuẩn không khí.',
 '{"aqua_ceramic":true,"smart_features":["Plasmacluster","Auto open/close lid","Heated seat","Bidet","Dryer","Deodorizer","Auto flush","Remote control"],"warranty_years":5}',
 90000000, 2, 'LUXURY', FALSE);

-- ─────────────────────────────────────────────────────────────
-- 7. PRODUCTS — Lavabo
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (category_id, brand_id, name, slug, model_code, technical_specs, base_price, stock, segment)
VALUES
(20, 1, 'Lavabo âm bàn INAX AL-S620V', 'lavabo-am-ban-inax-al-s620v', 'AL-S620V',
 '{"aqua_ceramic":true,"dimensions":"620x460mm","mount_type":"Under Counter","material":"Sứ","warranty_years":3}',
 3800000, 20, 'PREMIUM'),

(20, 1, 'Lavabo âm bàn INAX AL-S640V', 'lavabo-am-ban-inax-al-s640v', 'AL-S640V',
 '{"aqua_ceramic":true,"dimensions":"640x470mm","mount_type":"Under Counter","warranty_years":3}',
 4100000, 18, 'PREMIUM'),

(21, 1, 'Lavabo đặt bàn INAX AL-652V', 'lavabo-dat-ban-inax-al-652v', 'AL-652V',
 '{"aqua_ceramic":true,"dimensions":"520x430mm","mount_type":"Counter Top","warranty_years":3}',
 3200000, 15, 'PREMIUM'),

(21, 1, 'Lavabo đặt bàn INAX AL-2094V', 'lavabo-dat-ban-inax-al-2094v', 'AL-2094V',
 '{"aqua_ceramic":true,"dimensions":"580x460mm","mount_type":"Counter Top","warranty_years":3}',
 5500000, 10, 'PREMIUM'),

(22, 1, 'Lavabo treo tường INAX L-333V', 'lavabo-treo-tuong-inax-l-333v', 'L-333V',
 '{"dimensions":"560x415mm","mount_type":"Wall-hung","material":"Sứ","warranty_years":2}',
 890000, 40, 'STANDARD'),

(22, 1, 'Lavabo treo tường INAX L-345V', 'lavabo-treo-tuong-inax-l-345v', 'L-345V',
 '{"dimensions":"600x430mm","mount_type":"Wall-hung","warranty_years":2}',
 1200000, 35, 'STANDARD'),

(22, 1, 'Lavabo treo tường INAX L-2293V', 'lavabo-treo-tuong-inax-l-2293v', 'L-2293V',
 '{"dimensions":"630x450mm","mount_type":"Wall-hung","warranty_years":2}',
 1500000, 25, 'STANDARD'),

(22, 1, 'Lavabo treo tường INAX AL-2293V', 'lavabo-treo-tuong-inax-al-2293v', 'AL-2293V',
 '{"aqua_ceramic":true,"dimensions":"630x450mm","mount_type":"Wall-hung","warranty_years":3}',
 2100000, 20, 'PREMIUM');

-- ─────────────────────────────────────────────────────────────
-- 8. PRODUCTS — Vòi Nước
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (category_id, brand_id, name, slug, model_code, technical_specs, base_price, stock, segment)
VALUES
(30, 1, 'Vòi lavabo INAX LFV-5012S', 'voi-lavabo-inax-lfv-5012s', 'LFV-5012S',
 '{"flow_rate":"8L/min","material":"Đồng thau mạ Chrome","connection":"1/2 inch","finish":"Chrome","warranty_years":2}',
 2440000, 30, 'STANDARD'),

(30, 1, 'Vòi lavabo INAX LFV-502S', 'voi-lavabo-inax-lfv-502s', 'LFV-502S',
 '{"flow_rate":"8L/min","material":"Đồng thau mạ Chrome","finish":"Chrome","warranty_years":2}',
 2600000, 25, 'STANDARD'),

(30, 1, 'Vòi lavabo INAX LFV-6012S', 'voi-lavabo-inax-lfv-6012s', 'LFV-6012S',
 '{"flow_rate":"9L/min","material":"Đồng thau mạ Chrome","finish":"Chrome","warranty_years":3}',
 3200000, 20, 'PREMIUM'),

(30, 1, 'Vòi lavabo INAX LFV-632S', 'voi-lavabo-inax-lfv-632s', 'LFV-632S',
 '{"flow_rate":"9L/min","material":"Đồng thau mạ Chrome","finish":"Chrome","warranty_years":3}',
 3500000, 18, 'PREMIUM'),

(30, 1, 'Vòi lavabo INAX LFV-7000B', 'voi-lavabo-inax-lfv-7000b', 'LFV-7000B',
 '{"material":"DZR Brass","finish":"Chrome","single_lever":true,"warranty_years":3}',
 4880000, 15, 'PREMIUM'),

(31, 1, 'Vòi sen bồn tắm INAX BFV-635S', 'voi-sen-bon-tam-inax-bfv-635s', 'BFV-635S',
 '{"type":"Shower set","finish":"Chrome","warranty_years":2}',
 3000000, 20, 'STANDARD'),

(31, 1, 'Vòi sen nhiệt kế INAX BFV-3415T', 'voi-sen-nhiet-ke-inax-bfv-3415t', 'BFV-3415T',
 '{"type":"Thermostatic shower","temperature_control":true,"finish":"Chrome","warranty_years":3}',
 15000000, 8, 'LUXURY'),

(31, 1, 'Bộ sen tắm INAX BFV-1113S-4C', 'bo-sen-tam-inax-bfv-1113s-4c', 'BFV-1113S-4C',
 '{"type":"Shower set 4in1","finish":"Chrome","warranty_years":3}',
 4500000, 15, 'PREMIUM');

-- ─────────────────────────────────────────────────────────────
-- 9. PRODUCTS — Bồn Tiểu Nam, Vòi Cảm Ứng, Nắp Thông Minh
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (category_id, brand_id, name, slug, model_code, technical_specs, base_price, stock, segment)
VALUES
(4, 1, 'Bồn tiểu nam INAX AU-411V', 'bon-tieu-nam-inax-au-411v', 'AU-411V',
 '{"flush_type":"Manual","mount_type":"Wall-hung","warranty_years":2}',
 1800000, 15, 'STANDARD'),

(4, 1, 'Bồn tiểu nam INAX AU-431V', 'bon-tieu-nam-inax-au-431v', 'AU-431V',
 '{"flush_type":"Manual","mount_type":"Wall-hung","warranty_years":2}',
 2200000, 12, 'STANDARD'),

(5, 1, 'Vòi cảm ứng INAX AMV-50', 'voi-cam-ung-inax-amv-50', 'AMV-50',
 '{"sensor_type":"Infrared","power":"AC/DC","warranty_years":2}',
 3500000, 10, 'PREMIUM'),

(5, 1, 'Vòi cảm ứng INAX AMV-90', 'voi-cam-ung-inax-amv-90', 'AMV-90',
 '{"sensor_type":"Infrared","power":"AC/DC","mixing_valve":true,"warranty_years":3}',
 5500000, 8, 'PREMIUM'),

(6, 1, 'Nắp thông minh INAX CW-H18VN', 'nap-thong-minh-inax-cw-h18vn', 'CW-H18VN',
 '{"smart_features":["Heated seat","Bidet","Dryer","Deodorizer"],"power":"220V","warranty_years":2}',
 12000000, 10, 'LUXURY');

-- ─────────────────────────────────────────────────────────────
-- 10. PRODUCT ATTRIBUTES (mẫu cho một số sản phẩm)
-- ─────────────────────────────────────────────────────────────
INSERT INTO product_attributes (product_id, attr_name, attr_value)
SELECT id, 'Màu sắc', 'Trắng'         FROM products WHERE model_code IN ('AC-969VN','AC-900VRN','AC-504VN','L-333V');
INSERT INTO product_attributes (product_id, attr_name, attr_value)
SELECT id, 'Chất liệu', 'Sứ cao cấp'  FROM products WHERE model_code IN ('AC-969VN','AC-900VRN','AC-618VN');
INSERT INTO product_attributes (product_id, attr_name, attr_value)
SELECT id, 'Công nghệ bề mặt', 'Aqua Ceramic' FROM products WHERE model_code IN ('AC-969VN','AC-900VRN','AC-991VRN','AC-1032VN','AL-S620V');
INSERT INTO product_attributes (product_id, attr_name, attr_value)
SELECT id, 'Xuất xứ', 'Nhật Bản'      FROM products WHERE brand_id = (SELECT id FROM brands WHERE slug='inax');

-- ─────────────────────────────────────────────────────────────
-- 11. COLLECTIONS (Series sản phẩm)
-- ─────────────────────────────────────────────────────────────
INSERT INTO collections (name, slug, description) VALUES
('Bộ Sưu Tập Satis',        'bo-suu-tap-satis',        'Dòng bồn cầu thông minh cao cấp nhất của INAX'),
('Series Aqua Ceramic',      'series-aqua-ceramic',     'Sản phẩm ứng dụng công nghệ Aqua Ceramic chống bám bẩn'),
('Giải Pháp Tiết Kiệm Nước', 'giai-phap-tiet-kiem-nuoc','Sản phẩm tiết kiệm nước với hệ thống xả Eco-X');

INSERT INTO collection_products (collection_id, product_id)
SELECT c.id, p.id FROM collections c, products p
WHERE c.slug = 'bo-suu-tap-satis' AND p.model_code IN ('AC-618VN','AC-818VN');

INSERT INTO collection_products (collection_id, product_id)
SELECT c.id, p.id FROM collections c, products p
WHERE c.slug = 'series-aqua-ceramic'
  AND p.model_code IN ('AC-900VRN','AC-969VN','AC-991VRN','AC-1032VN','AL-S620V','AL-S640V','AL-2293V');

-- ─────────────────────────────────────────────────────────────
-- 12. SETTINGS
-- ─────────────────────────────────────────────────────────────
INSERT INTO settings (key, value, description) VALUES
('store_name',              'Thiết Bị Vệ Sinh TDM',      'Tên cửa hàng'),
('store_phone',             '1800 1234',                  'Số điện thoại hotline'),
('store_email',             'contact@sanitary.vn',        'Email liên hệ'),
('store_address',           '123 Nguyễn Huệ, Q.1, TP.HCM','Địa chỉ cửa hàng'),
('default_shipping_fee',    '30000',                      'Phí vận chuyển mặc định (VND)'),
('free_shipping_threshold', '2000000',                    'Miễn phí ship khi đơn >= giá trị này (VND)'),
('low_stock_threshold',     '5',                          'Cảnh báo tồn kho thấp khi số lượng <= giá trị này'),
('order_code_prefix',       'ORD',                        'Tiền tố mã đơn hàng'),
('review_require_purchase', 'true',                       'Yêu cầu đã mua hàng mới được review');

-- ─────────────────────────────────────────────────────────────
-- 13. BANNERS
-- ─────────────────────────────────────────────────────────────
INSERT INTO banners (title, image_url, link_url, position, sort_order, is_active) VALUES
('INAX 2025 — Bộ Sưu Tập Mới Nhất', 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop', '/danh-muc/bon-cau', 'HERO', 1, TRUE),
('Satis — Trải Nghiệm Đẳng Cấp',    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',     '/san-pham/bon-cau-thong-minh-inax-satis-g-ac-618vn', 'HERO', 2, TRUE),
('Aqua Ceramic — Trắng Sạch 100 Năm','https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',     '/bo-suu-tap/series-aqua-ceramic', 'HERO', 3, TRUE),
('Lavabo Cao Cấp',                   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=60', '/danh-muc/lavabo',  'SIDEBAR', 1, TRUE);

-- ─────────────────────────────────────────────────────────────
-- 14. VOUCHERS mẫu
-- ─────────────────────────────────────────────────────────────
INSERT INTO vouchers (code, name, type, value, min_order_value, max_discount, usage_limit, start_date, end_date) VALUES
('INAX2025',  'Giảm 5% nhân dịp ra mắt 2025',    'PERCENT',      5.00, 1000000, 500000, 200, NOW(), NOW() + INTERVAL '1 year'),
('WELCOME50', 'Giảm 50,000đ cho đơn đầu tiên',    'FIXED_AMOUNT', 50000.00, 500000, NULL, 1000, NOW(), NOW() + INTERVAL '1 year'),
('SALE100K',  'Giảm 100,000đ đơn từ 2 triệu',    'FIXED_AMOUNT', 100000.00, 2000000, NULL, 500, NOW(), NOW() + INTERVAL '6 months');

-- ─────────────────────────────────────────────────────────────
-- 15. BLOG POSTS mẫu
-- ─────────────────────────────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, is_published, published_at, author_id) VALUES
('Cách chọn bồn cầu phù hợp cho phòng tắm của bạn',
 'cach-chon-bon-cau-phu-hop',
 'Hướng dẫn chi tiết cách lựa chọn bồn cầu phù hợp với diện tích, phong cách và ngân sách.',
 TRUE, NOW(), (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1)),

('Công nghệ Aqua Ceramic là gì? Tại sao nên chọn?',
 'cong-nghe-aqua-ceramic-la-gi',
 'Tìm hiểu công nghệ Aqua Ceramic độc quyền của INAX giúp sứ trắng sáng đến 100 năm.',
 TRUE, NOW(), (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1)),

('So sánh INAX và TOTO — Chọn thương hiệu nào?',
 'so-sanh-inax-va-toto',
 'Phân tích chi tiết ưu nhược điểm của hai thương hiệu thiết bị vệ sinh Nhật Bản hàng đầu.',
 TRUE, NOW(), (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1));
