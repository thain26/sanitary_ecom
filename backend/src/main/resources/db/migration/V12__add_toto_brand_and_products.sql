-- =============================================================
-- V12__add_toto_brand_and_products.sql
-- Thêm thương hiệu TOTO và sản phẩm từ Catalogue TOTO 2025
-- Nguồn: Catalogue TOTO 2025 (Mini Catalogue 12th Edition)
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. THÊM THƯƠNG HIỆU TOTO (đã xóa ở V11, nay thêm lại với data đầy đủ)
-- ─────────────────────────────────────────────────────────────
INSERT INTO brands (name, slug, logo_url, description, is_active)
VALUES (
    'TOTO',
    'toto',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TOTO_logo.svg/320px-TOTO_logo.svg.png',
    'TOTO là thương hiệu thiết bị vệ sinh hàng đầu Nhật Bản, được thành lập năm 1917. Nổi tiếng với công nghệ WASHLET®, Tornado Flush và lớp men CeFiONtect chống bám bẩn. Cam kết mang đến trải nghiệm phòng tắm cao cấp, bền bỉ và thân thiện với môi trường.',
    TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 2. THÊM SẢN PHẨM TOTO
-- Category IDs: 1=Bồn Cầu, 2=Lavabo, 3=Vòi Nước, 4=Bồn Tiểu, 6=Nắp Thông Minh, 7=Phụ Kiện
-- Sub-category IDs: 10=BC1Khối, 11=BC2Khối, 12=BCThôngMinh, 20=LavaboÂmBàn, 21=LabovĐặtBàn, 22=LavaboTreo, 30=VòiLavabo, 31=VòiSen
-- ─────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════
-- 2.1 BỒN CẦU 1 KHỐI TOTO (category_id = 10)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(10, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu 1 Khối TOTO MS887RT3',
 'bon-cau-1-khoi-toto-ms887rt3',
 'MS887RT3',
 'Bồn cầu 1 khối TOTO MS887RT3 với công nghệ Tornado Flush mạnh mẽ, lớp men CeFiONtect chống bám bẩn vượt trội. Thiết kế liền khối sang trọng, phù hợp không gian phòng tắm hiện đại. Kèm nắp đóng êm TC385VS. Xuất xứ: Nhật Bản.',
 '{"flush_volume":"3.0L/4.8L","flush_type":"Tornado Flush","cefiontect":true,"soft_close_lid":"TC385VS","dimensions":"760x375x785mm","weight":"28kg","color":"Trắng","material":"Vitreous China","warranty_years":5}',
 9800000, 8500000, 25, 12, TRUE, TRUE),

(10, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu 1 Khối TOTO MS857DT3',
 'bon-cau-1-khoi-toto-ms857dt3',
 'MS857DT3',
 'Bồn cầu 1 khối TOTO MS857DT3 thế hệ mới với công nghệ xả Tornado Flush và men sứ CeFiONtect siêu trơn tru giúp chống bám bẩn hiệu quả. Dùng phổ biến trong các dự án nhà ở cao cấp và khách sạn. Kèm nắp đóng êm TC507VS.',
 '{"flush_volume":"3.0L/4.8L","flush_type":"Tornado Flush","cefiontect":true,"soft_close_lid":"TC507VS","dimensions":"720x365x770mm","weight":"26kg","color":"Trắng","material":"Vitreous China","warranty_years":5}',
 8500000, 7200000, 30, 18, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.2 BỒN CẦU 2 KHỐI TOTO (category_id = 11)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(11, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu 2 Khối TOTO CS300DRT3',
 'bon-cau-2-khoi-toto-cs300drt3',
 'CS300DRT3',
 'Bồn cầu 2 khối TOTO CS300DRT3 phổ thông nhưng bền bỉ, thiết kế gọn gàng phù hợp cho mọi không gian. Hệ thống xả mạnh, tiết kiệm nước 6L/lần. Kèm két nước và nắp đóng êm TC385VS. Bảo hành 5 năm.',
 '{"flush_volume":"6L","flush_type":"Gravity Flush","cefiontect":false,"soft_close_lid":"TC385VS","dimensions":"620x310x810mm","weight":"18kg","color":"Trắng","material":"Vitreous China","warranty_years":5}',
 2800000, 2600000, 50, 35, FALSE, TRUE),

(11, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu 2 Khối TOTO CS769DRE2',
 'bon-cau-2-khoi-toto-cs769dre2',
 'CS769DRE2',
 'Bồn cầu 2 khối TOTO CS769DRE2 cao cấp với men sứ CeFiONtect độc quyền, hệ thống Tornado Flush xả sạch tối ưu. Phù hợp không gian phòng tắm sang trọng. Kèm nắp rửa cơ TC507VS.',
 '{"flush_volume":"3.8L/6L","flush_type":"Tornado Flush","cefiontect":true,"soft_close_lid":"TC507VS","dimensions":"670x360x820mm","weight":"22kg","color":"Trắng","material":"Vitreous China","warranty_years":5}',
 9200000, 8800000, 20, 8, TRUE, TRUE),

(11, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu 2 Khối TOTO CS619NRT1',
 'bon-cau-2-khoi-toto-cs619nrt1',
 'CS619NRT1',
 'Bồn cầu 2 khối TOTO CS619NRT1 thiết kế vuông vức hiện đại, hệ thống xả mạnh 6L/lần. Thân bồn đặc chắc, chống bẩn tốt nhờ men trắng tinh khiết. Phù hợp nhà phố và chung cư. Kèm két nước và nắp TC384VS.',
 '{"flush_volume":"6L","flush_type":"Siphon Jet","cefiontect":false,"soft_close_lid":"TC384VS","dimensions":"640x340x800mm","weight":"20kg","color":"Trắng","material":"Vitreous China","warranty_years":5}',
 5200000, 4800000, 35, 15, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.3 BỒN CẦU THÔNG MINH NEOREST TOTO (category_id = 12)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(12, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu Thông Minh TOTO NEOREST NH2 CES9756PJA',
 'bon-cau-thong-minh-toto-neorest-nh2-ces9756pja',
 'CES9756PJA',
 'Bồn cầu thông minh TOTO NEOREST NH2 - đỉnh cao công nghệ vệ sinh Nhật Bản. Tích hợp nắp Washlet tự động, sấy khô, khử mùi, cảm biến tự động mở/đóng nắp. Vòi rửa ấm điều chỉnh nhiệt độ, áp lực nước. Chế độ kháng khuẩn eWater+. Điều khiển từ xa. Phù hợp các dự án cao cấp 5 sao.',
 '{"flush_volume":"3.5L/4.8L","flush_type":"Tornado Flush","cefiontect":true,"washlet":true,"ewater_plus":true,"remote_control":true,"auto_open_close":true,"heated_seat":true,"warm_water_wand":true,"deodorizer":true,"air_dryer":true,"dimensions":"780x400x615mm","weight":"40kg","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 85000000, 79000000, 5, 2, TRUE, TRUE),

(12, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu Thông Minh TOTO NEOREST AS CES9768PJA',
 'bon-cau-thong-minh-toto-neorest-as-ces9768pja',
 'CES9768PJA',
 'TOTO NEOREST AS - bồn cầu thông minh tích hợp hoàn toàn với nắp Washlet cao cấp. Công nghệ CEFIONTECT men sứ siêu mịn, Tornado Flush mạnh mẽ. Vòi rửa nhiều chế độ, sấy ấm, khử mùi tự động. Điều khiển qua remote và ứng dụng smartphone. Tiêu chuẩn khách sạn 5 sao.',
 '{"flush_volume":"3.5L/4.8L","flush_type":"Tornado Flush","cefiontect":true,"washlet":true,"ewater_plus":true,"remote_control":true,"auto_open_close":true,"heated_seat":true,"warm_water_wand":true,"deodorizer":true,"air_dryer":true,"dimensions":"760x415x590mm","weight":"38kg","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 65000000, 59000000, 8, 3, TRUE, TRUE),

(12, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu Treo Tường TOTO CW522RB',
 'bon-cau-treo-tuong-toto-cw522rb',
 'CW522RB',
 'Bồn cầu treo tường TOTO CW522RB thiết kế tối giản, sang trọng. Phần thân treo giúp dễ vệ sinh sàn nhà. Két nước âm tường riêng. Men sứ CeFiONtect siêu bền, chống bám bẩn. Phù hợp nội thất hiện đại tối giản.',
 '{"installation":"Wall-hung","flush_volume":"3.0L/6L","flush_type":"Tornado Flush","cefiontect":true,"dimensions":"365x540x375mm","weight":"20kg","color":"Trắng","material":"Vitreous China","warranty_years":5,"note":"Cần mua thêm bộ khung âm tường"}',
 12500000, 11800000, 15, 6, FALSE, TRUE),

(12, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Cầu Treo Tường TOTO CW523RB',
 'bon-cau-treo-tuong-toto-cw523rb',
 'CW523RB',
 'Bồn cầu treo tường TOTO CW523RB - phiên bản nâng cấp với thiết kế khối vuông hiện đại hơn. Hệ thống Tornado Flush mạnh mẽ, tiết kiệm nước. Thích hợp kết hợp với nắp Washlet SB series. Lắp đặt âm tường chuyên nghiệp.',
 '{"installation":"Wall-hung","flush_volume":"3.0L/6L","flush_type":"Tornado Flush","cefiontect":true,"dimensions":"375x565x385mm","weight":"21kg","color":"Trắng","material":"Vitreous China","warranty_years":5,"note":"Cần mua thêm bộ khung âm tường"}',
 14800000, 13500000, 12, 4, TRUE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.4 CHẬU RỬA MẶT TOTO - ĐẶT BÀN (category_id = 21)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(21, (SELECT id FROM brands WHERE slug='toto'),
 'Chậu Rửa Mặt Đặt Bàn TOTO LT710CTRM',
 'chau-rua-mat-dat-ban-toto-lt710ctrm',
 'LT710CTRM',
 'Chậu rửa mặt đặt bàn TOTO LT710CTRM thiết kế tròn tinh tế, men sứ trắng sáng bóng. Kích thước phù hợp mọi không gian phòng tắm. Bề mặt men siêu mịn dễ vệ sinh. Có lỗ vòi sẵn. Sản xuất tại Nhật Bản.',
 '{"type":"Counter Top","shape":"Round","dimensions":"420x360x175mm","hole":"1 lỗ","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 2800000, 2500000, 40, 22, FALSE, TRUE),

(21, (SELECT id FROM brands WHERE slug='toto'),
 'Chậu Rửa Mặt Đặt Bàn TOTO L5242B',
 'chau-rua-mat-dat-ban-toto-l5242b',
 'L5242B',
 'Chậu rửa mặt đặt bàn TOTO L5242B thiết kế hình elip thanh lịch. Bề mặt men sứ chất lượng cao dễ vệ sinh, không thấm nước. Kích thước phù hợp không gian phòng tắm gia đình. Màu trắng tinh.',
 '{"type":"Counter Top","shape":"Oval","dimensions":"450x360x180mm","hole":"1 lỗ","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 2200000, NULL, 38, 20, FALSE, TRUE),

(21, (SELECT id FROM brands WHERE slug='toto'),
 'Chậu Rửa Mặt Chân Dài TOTO LPT240',
 'chau-rua-mat-chan-dai-toto-lpt240',
 'LPT240',
 'Bộ chậu rửa mặt chân dài TOTO LPT240 bao gồm chậu và chân đỡ thẳng. Thiết kế cổ điển - hiện đại, phù hợp không gian trang nhã. Men sứ trắng tinh khiết, bền bỉ theo thời gian. Chân chậu chắc chắn, an toàn.',
 '{"type":"Pedestal","shape":"Oval","dimensions":"430x350x820mm","hole":"1 lỗ","color":"Trắng","includes_pedestal":true,"material":"Vitreous China","warranty_years":3}',
 4500000, 4100000, 20, 9, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.5 CHẬU RỬA ÂM BÀN TOTO (category_id = 20)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(20, (SELECT id FROM brands WHERE slug='toto'),
 'Chậu Rửa Âm Bàn TOTO LW184J',
 'chau-rua-am-ban-toto-lw184j',
 'LW184J',
 'Chậu rửa mặt âm bàn TOTO LW184J thiết kế chữ nhật hiện đại, kích thước 395x395mm. Lắp đặt âm bàn đá hoặc gỗ. Men sứ siêu trắng, bền màu lâu dài. Thích hợp không gian phòng tắm tối giản, sang trọng.',
 '{"type":"Under Counter","shape":"Square","dimensions":"395x395x195mm","hole":"Không lỗ","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 3200000, 2900000, 35, 16, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.6 CHẬU RỬA TREO TƯỜNG TOTO (category_id = 22)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(22, (SELECT id FROM brands WHERE slug='toto'),
 'Chậu Rửa Treo Tường TOTO LHT964',
 'chau-rua-treo-tuong-toto-lht964',
 'LHT964',
 'Chậu rửa mặt treo tường TOTO LHT964 thiết kế hình bán nguyệt gọn gàng, không chiếm diện tích. Phù hợp toilet nhỏ và WC khách. Men sứ vitreous china cao cấp. Đi kèm bu-lông treo tường. Không kèm vòi.',
 '{"type":"Wall-hung","shape":"Semi-circle","dimensions":"370x280x145mm","hole":"1 lỗ","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 1650000, NULL, 45, 28, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.7 VÒI LAVABO TOTO (category_id = 30)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(30, (SELECT id FROM brands WHERE slug='toto'),
 'Vòi Chậu 1 Tay Gạt TOTO TLG10301V',
 'voi-chau-1-tay-gat-toto-tlg10301v',
 'TLG10301V',
 'Vòi chậu rửa mặt TOTO TLG10301V lắp đặt 1 lỗ, tay gạt đơn. Thân vòi mạ chrome bóng sáng cao cấp, chống ăn mòn. Lõi vòi ceramic bền bỉ, không rỉ nước. Tiết kiệm nước với bộ hạn chế lưu lượng 6L/phút.',
 '{"type":"Single Lever","holes":"1","flow_rate":"6L/min","finish":"Chrome","material":"Brass","certifications":"WELS","warranty_years":3}',
 1850000, 1680000, 60, 32, FALSE, TRUE),

(30, (SELECT id FROM brands WHERE slug='toto'),
 'Vòi Chậu 2 Tay Gạt TOTO TL261DD',
 'voi-chau-2-tay-gat-toto-tl261dd',
 'TL261DD',
 'Vòi chậu 2 tay gạt TOTO TL261DD lắp đặt 3 lỗ, thiết kế cổ điển sang trọng. Tay gạt nóng/lạnh riêng biệt dễ điều chỉnh nhiệt độ. Thân vòi đúc đồng nguyên chất mạ chrome. Lõi gốm bền lâu.',
 '{"type":"Double Lever","holes":"3","flow_rate":"8L/min","finish":"Chrome","material":"Brass","certifications":"WELS","warranty_years":3}',
 2600000, 2350000, 40, 18, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.8 VÒI SEN & BỒN TẮM TOTO (category_id = 31)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(31, (SELECT id FROM brands WHERE slug='toto'),
 'Bộ Sen Tắm Cây TOTO TBW01305V',
 'bo-sen-tam-cay-toto-tbw01305v',
 'TBW01305V',
 'Bộ sen tắm cây TOTO TBW01305V hoàn chỉnh gồm cần sen, tay sen và vòi tắm bồn. Tay sen cho chùm tia mềm mại, tiết kiệm nước. Cần sen điều chỉnh góc độ linh hoạt. Vật liệu đồng mạ chrome cao cấp, bền lâu.',
 '{"type":"Shower Column","includes":"Shower head + Arm + Hand shower + Hose","flow_rate":"9L/min","finish":"Chrome","material":"Brass + ABS","height_adjustable":true,"warranty_years":3}',
 5200000, 4800000, 25, 14, FALSE, TRUE),

(31, (SELECT id FROM brands WHERE slug='toto'),
 'Vòi Bếp TOTO TKS05309V',
 'voi-bep-toto-tks05309v',
 'TKS05309V',
 'Vòi bếp TOTO TKS05309V với cổ ngỗng cao, xoay 360°. Tay gạt đơn điều chỉnh nhiệt độ và lưu lượng tiện lợi. Đầu vòi kéo dài với 2 chế độ: dòng chảy tập trung và tia phun rộng. Thân đồng mạ chrome không gỉ.',
 '{"type":"Kitchen Faucet","spout_rotation":"360°","modes":"2 (stream + spray)","finish":"Chrome","material":"Brass","flow_rate":"8L/min","warranty_years":3}',
 3200000, 2900000, 30, 11, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.9 BỒN TIỂU NAM TOTO (category_id = 4)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(4, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Tiểu Nam Treo Tường TOTO UWN905VRE',
 'bon-tieu-nam-treo-tuong-toto-uwn905vre',
 'UWN905VRE',
 'Bồn tiểu nam treo tường TOTO UWN905VRE với men sứ CeFiONtect chống bám bẩn tối ưu. Hệ thống xả tự động cảm biến hồng ngoại tiết kiệm nước. Thiết kế treo tường dễ vệ sinh. Dùng phổ biến trong nhà vệ sinh công cộng và khách sạn.',
 '{"installation":"Wall-hung","flush_type":"Auto Sensor","sensor":"Infrared","cefiontect":true,"water_saving":"1L/flush","dimensions":"350x345x610mm","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 6500000, 5800000, 18, 7, FALSE, TRUE),

(4, (SELECT id FROM brands WHERE slug='toto'),
 'Bồn Tiểu Nam Sàn TOTO ULN903',
 'bon-tieu-nam-san-toto-uln903',
 'ULN903',
 'Bồn tiểu nam kiểu sàn TOTO ULN903 phù hợp cải tạo hoặc lắp đặt mới. Men sứ trắng bóng tiêu chuẩn. Hệ thống xả nước thủ công. Dễ vệ sinh, bền bỉ theo thời gian.',
 '{"installation":"Floor-standing","flush_type":"Manual","cefiontect":false,"dimensions":"280x325x650mm","color":"Trắng","material":"Vitreous China","warranty_years":3}',
 2800000, NULL, 22, 10, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.10 NẮP RỬA THÔNG MINH / WASHLET TOTO (category_id = 6)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(6, (SELECT id FROM brands WHERE slug='toto'),
 'Nắp Rửa Điện Tử TOTO Washlet C2 TCF6631',
 'nap-rua-dien-tu-toto-washlet-c2-tcf6631',
 'TCF6631',
 'Nắp rửa điện tử TOTO Washlet C2 series, dòng phổ thông nhưng đầy đủ tính năng: vòi rửa phía sau và trước (dành cho nữ), sấy khô, điều nhiệt chỗ ngồi, điều khiển từ xa. Công nghệ vòi rửa EWATER+ kháng khuẩn. Tương thích hầu hết bồn cầu thị trường.',
 '{"series":"Washlet C2","rear_wash":true,"front_wash":true,"heated_seat":true,"air_dryer":true,"ewater_plus":true,"remote":"Side Control","power":"550W","voltage":"220V","warranty_years":2}',
 8900000, 7800000, 20, 12, TRUE, TRUE),

(6, (SELECT id FROM brands WHERE slug='toto'),
 'Nắp Rửa Điện Tử TOTO Washlet C5 TCF7669',
 'nap-rua-dien-tu-toto-washlet-c5-tcf7669',
 'TCF7669',
 'Nắp rửa điện tử TOTO Washlet C5 cao cấp hơn C2 với tính năng: vòi rửa nhiều chế độ (massage, oscillating, pulsating), khử mùi bằng than hoạt tính, tự vệ sinh vòi trước/sau sử dụng. Tiết kiệm điện. Điều khiển từ xa. Thích hợp bồn cầu 1 và 2 khối.',
 '{"series":"Washlet C5","rear_wash":true,"front_wash":true,"massage_mode":true,"deodorizer":"Carbon Filter","wand_self_clean":true,"heated_seat":true,"air_dryer":true,"remote":"Remote Control","power":"550W","voltage":"220V","warranty_years":2}',
 15500000, 13800000, 15, 8, TRUE, TRUE),

(6, (SELECT id FROM brands WHERE slug='toto'),
 'Nắp Rửa Điện Tử TOTO Washlet S7 TCF8SM46',
 'nap-rua-dien-tu-toto-washlet-s7-tcf8sm46',
 'TCF8SM46',
 'Đỉnh cao dòng Washlet - TOTO S7 với nắp tự đóng mở cảm biến, vòi rửa điều chỉnh 5 vị trí, làm nóng nước tức thì không cần bình, chế độ khử mùi liên tục, sấy ấm, nhật ký sử dụng. Kết nối ứng dụng smartphone. Tiêu chuẩn khách sạn 5 sao.',
 '{"series":"Washlet S7","rear_wash":true,"front_wash":true,"auto_open_close":true,"wand_positions":5,"tankless_heating":true,"ewater_plus":true,"deodorizer":"Continuous","heated_seat":true,"air_dryer":true,"remote":"Remote + App","power":"680W","voltage":"220V","warranty_years":2}',
 32000000, 28500000, 8, 3, TRUE, TRUE),

(6, (SELECT id FROM brands WHERE slug='toto'),
 'Nắp Đóng Êm TOTO TC385VS',
 'nap-dong-em-toto-tc385vs',
 'TC385VS',
 'Nắp đóng êm TOTO TC385VS dành cho bồn cầu 2 khối dòng CS300 và CS619. Chất liệu nhựa cao cấp, bản lề đặc biệt giúp nắp đóng chậm không gây tiếng động. Dễ tháo lắp vệ sinh. Màu trắng tiêu chuẩn.',
 '{"type":"Soft-close Seat","compatible":"CS300/CS619 series","material":"Resin","color":"Trắng","warranty_years":1}',
 450000, NULL, 80, 55, FALSE, TRUE),

(6, (SELECT id FROM brands WHERE slug='toto'),
 'Nắp Rửa Cơ TOTO TC507VS',
 'nap-rua-co-toto-tc507vs',
 'TC507VS',
 'Nắp rửa cơ TOTO TC507VS với vòi rửa tự phun nước không dùng điện, phù hợp dòng bồn cầu CS769. Vòi rửa điều chỉnh góc độ, áp lực nước dùng tay vặn. Vật liệu nhựa cao cấp ABS, đóng êm nhẹ nhàng.',
 '{"type":"Non-electric Bidet Seat","compatible":"CS769 series","material":"ABS","has_wand":true,"wand_adjustable":true,"color":"Trắng","warranty_years":1}',
 850000, 780000, 50, 30, FALSE, TRUE);

-- ═══════════════════════════════════════════════════════════════
-- 2.11 PHỤ KIỆN TOTO (category_id = 7)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO products (category_id, brand_id, name, slug, model_code, description, technical_specs, base_price, sale_price, stock, sold_count, is_featured, is_active)
VALUES
(7, (SELECT id FROM brands WHERE slug='toto'),
 'Thanh Vịn Nhà Tắm TOTO YHB60R',
 'thanh-vin-nha-tam-toto-yhb60r',
 'YHB60R',
 'Thanh vịn phòng tắm TOTO YHB60R màu trắng, chiều dài 60cm. Thép không gỉ SUS304 mạ trắng bền màu. Chịu lực 200kg. Dễ lắp đặt vào tường gạch. Thiết kế hỗ trợ người cao tuổi và người khuyết tật. Đạt chuẩn JIS.',
 '{"type":"Grab Bar","length":"600mm","material":"SUS304","load_capacity":"200kg","finish":"White","standard":"JIS","warranty_years":3}',
 1850000, 1650000, 35, 15, FALSE, TRUE),

(7, (SELECT id FROM brands WHERE slug='toto'),
 'Giá Đỡ Giấy Vệ Sinh TOTO YH500',
 'gia-do-giay-ve-sinh-toto-yh500',
 'YH500',
 'Giá đỡ giấy vệ sinh TOTO YH500 bằng hợp kim mạ chrome bóng, thiết kế đơn giản hiện đại. Trục tháo lắp nhanh tiện vệ sinh. Lắp tường bằng vít. Kích thước tiêu chuẩn 97x120x137mm. Phù hợp mọi không gian WC.',
 '{"type":"Paper Holder","dimensions":"97x120x137mm","material":"Zinc Alloy","finish":"Chrome","mounting":"Wall","warranty_years":2}',
 650000, NULL, 70, 42, FALSE, TRUE),

(7, (SELECT id FROM brands WHERE slug='toto'),
 'Móc Áo Đơn TOTO YH200',
 'moc-ao-don-toto-yh200',
 'YH200',
 'Móc áo đơn TOTO YH200 bằng hợp kim kẽm mạ chrome, chắc chắn chịu lực 5kg. Lắp đặt tường nhanh gọn bằng vít. Thiết kế tối giản, dễ phối hợp với nội thất. Phù hợp phòng tắm, nhà vệ sinh, hành lang.',
 '{"type":"Single Hook","load_capacity":"5kg","material":"Zinc Alloy","finish":"Chrome","mounting":"Wall","warranty_years":2}',
 320000, NULL, 90, 58, FALSE, TRUE),

(7, (SELECT id FROM brands WHERE slug='toto'),
 'Kệ Phòng Tắm TOTO YTS301',
 'ke-phong-tam-toto-yts301',
 'YTS301',
 'Kệ phòng tắm TOTO YTS301 bằng hợp kim mạ chrome, đặt được nhiều vật dụng nhỏ. Thiết kế có lỗ thoát nước tránh đọng xà phòng. Lắp đặt tường dễ dàng. Chịu lực 3kg. Kích thước 200x135x70mm.',
 '{"type":"Corner Shelf","dimensions":"200x135x70mm","load_capacity":"3kg","material":"Zinc Alloy","finish":"Chrome","drain_holes":true,"mounting":"Wall","warranty_years":2}',
 480000, NULL, 55, 33, FALSE, TRUE);

-- ─────────────────────────────────────────────────────────────
-- 3. THÊM ẢNH SẢN PHẨM TOTO (product_images)
-- ─────────────────────────────────────────────────────────────
-- Bồn cầu TOTO
INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id,
       CASE
         WHEN p.model_code IN ('MS887RT3','MS857DT3','CS300DRT3','CS769DRE2','CS619NRT1')
           THEN 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80'
         WHEN p.model_code IN ('CES9756PJA','CES9768PJA')
           THEN 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&auto=format&fit=crop&q=80'
         WHEN p.model_code IN ('CW522RB','CW523RB')
           THEN 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=80'
         WHEN p.model_code IN ('LT710CTRM','L5242B','LPT240','LW184J','LHT964')
           THEN 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=80'
         WHEN p.model_code IN ('TLG10301V','TL261DD','TBW01305V','TKS05309V')
           THEN 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&auto=format&fit=crop&q=80'
         WHEN p.model_code IN ('TCF6631','TCF7669','TCF8SM46','TC385VS','TC507VS')
           THEN 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&auto=format&fit=crop&q=80'
         ELSE 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&auto=format&fit=crop&q=80'
       END,
       p.name,
       TRUE,
       0
FROM products p
WHERE p.brand_id = (SELECT id FROM brands WHERE slug = 'toto');
