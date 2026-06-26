-- V27__rewrite_all_inax_products.sql
-- Cập nhật đồng loạt mô tả và chi tiết cho tất cả sản phẩm INAX còn lại để chuẩn hóa giao diện Accordion

-- 1. Bồn cầu 1 khối INAX
UPDATE products SET 
description = 'Bồn cầu 1 khối INAX với thiết kế nguyên khối tinh tế, hạn chế tối đa các rãnh bám bẩn. Lớp men Aqua Ceramic độc quyền giúp bề mặt luôn sáng bóng, đánh bay mọi vết bẩn dễ dàng.',
detail = '<ul><li><strong>Hệ thống xả:</strong> Xả xoáy Eco-X mạnh mẽ, cuốn trôi vết bẩn hoàn toàn.</li><li><strong>Công nghệ men:</strong> Aqua Ceramic siêu chống bám bẩn, trắng sáng lên đến 100 năm.</li><li><strong>Thiết kế:</strong> Thân kín, nắp rơi êm không gây tiếng ồn.</li><li><strong>Bảo hành:</strong> 10 năm cho phần sứ, 2 năm cho phụ kiện.</li></ul>'
WHERE slug LIKE 'bon-cau-1-khoi-inax-%' AND description NOT LIKE '%Trải nghiệm đỉnh cao%';

-- 2. Bồn cầu 2 khối INAX
UPDATE products SET 
description = 'Bồn cầu 2 khối INAX là giải pháp tối ưu cho mọi không gian phòng tắm. Thiết kế nhỏ gọn, dễ dàng vận chuyển và lắp đặt. Hiệu suất xả mạnh mẽ nhưng vô cùng tiết kiệm nước.',
detail = '<ul><li><strong>Hệ thống xả:</strong> Xả thẳng/Xả xoáy (tùy mẫu), tiết kiệm nước với 2 chế độ xả.</li><li><strong>Chất liệu:</strong> Sứ vệ sinh cao cấp INAX.</li><li><strong>Tiện ích:</strong> Nắp bệ ngồi đóng êm, bề mặt chống xước.</li><li><strong>Bảo hành:</strong> 10 năm cho phần sứ.</li></ul>'
WHERE slug LIKE 'bon-cau-2-khoi-inax-%';

-- 3. Lavabo Âm bàn / Treo tường / Đặt bàn INAX (trừ AL-652V đã làm)
UPDATE products SET 
description = 'Chậu rửa mặt Lavabo INAX mang đường nét thiết kế thanh lịch, góc cạnh bo tròn an toàn. Lòng chậu sâu rộng, hạn chế tối đa tình trạng văng nước ra ngoài, giữ cho khu vực bàn đá luôn khô ráo.',
detail = '<ul><li><strong>Thiết kế:</strong> Đa dạng kiểu dáng (Âm bàn, Đặt bàn, Treo tường).</li><li><strong>Công nghệ men:</strong> Men sứ cao cấp chống ố vàng, dễ dàng vệ sinh.</li><li><strong>Đặc điểm:</strong> Có lỗ thoát tràn an toàn.</li><li><strong>Bảo hành:</strong> 10 năm phần sứ chính hãng.</li></ul>'
WHERE slug LIKE 'lavabo-%-inax-%' AND slug != 'lavabo-dat-ban-inax-al-652v';

-- 4. Vòi Lavabo INAX
UPDATE products SET 
description = 'Vòi chậu rửa mặt INAX với lớp mạ Chrome/Niken sáng bóng như gương. Tay gạt điều chỉnh nhẹ nhàng, van gốm Ceramic bền bỉ không rò rỉ nước, mang lại trải nghiệm sử dụng êm ái mỗi ngày.',
detail = '<ul><li><strong>Chất liệu:</strong> Đồng thau nguyên chất mạ Chrome/Niken chống gỉ sét.</li><li><strong>Lõi van:</strong> Van đĩa sứ Ceramic độ bền cao, hoạt động mượt mà.</li><li><strong>Công nghệ:</strong> Dòng chảy tạo bọt mềm mại, tiết kiệm nước hiệu quả.</li><li><strong>Bảo hành:</strong> 2-3 năm chính hãng.</li></ul>'
WHERE slug LIKE 'voi-lavabo-inax-%';

-- 5. Vòi Sen & Bồn Tắm INAX
UPDATE products SET 
description = 'Bộ sen tắm INAX mang đến trải nghiệm tắm thư giãn tuyệt đỉnh. Bát sen tỏa nước đều và rộng, bao trùm toàn bộ cơ thể. Công nghệ điều nhiệt an toàn, chống bỏng, đặc biệt phù hợp cho gia đình có trẻ nhỏ.',
detail = '<ul><li><strong>Chất liệu:</strong> Thân đồng mạ Chrome/Niken bền bỉ với thời gian.</li><li><strong>Tính năng:</strong> Bát sen massage nhiều chế độ, tay sen dễ cầm nắm.</li><li><strong>An toàn:</strong> (Với các dòng nhiệt kế) Tự động ổn định nhiệt độ ở mức an toàn.</li><li><strong>Bảo hành:</strong> 2-3 năm chính hãng.</li></ul>'
WHERE slug LIKE 'voi-sen-%-inax-%' OR slug LIKE 'bo-sen-tam-inax-%';

-- 6. Bồn tiểu nam INAX
UPDATE products SET 
description = 'Bồn tiểu nam INAX thiết kế tiện dụng, đảm bảo vệ sinh tối đa cho không gian vệ sinh nam. Phù hợp cho cả công trình dân dụng và thương mại nhờ tính thẩm mỹ và độ bền bỉ cao.',
detail = '<ul><li><strong>Thiết kế:</strong> Dáng treo tường hoặc đặt sàn gọn gàng.</li><li><strong>Xả rửa:</strong> Tích hợp vách chắn, hệ thống xả trải đều chống văng.</li><li><strong>Công nghệ men:</strong> Chống bám mùi, dễ dàng lau chùi.</li><li><strong>Bảo hành:</strong> 10 năm phần sứ.</li></ul>'
WHERE slug LIKE 'bon-tieu-nam-inax-%';

-- 7. Vòi Cảm Ứng INAX
UPDATE products SET 
description = 'Vòi chậu cảm ứng INAX ứng dụng công nghệ mắt hồng ngoại siêu nhạy. Tự động cấp và ngắt nước giúp tiết kiệm tối đa và ngăn ngừa nguy cơ lây nhiễm chéo vi khuẩn.',
detail = '<ul><li><strong>Cảm biến:</strong> Hồng ngoại thông minh, nhận diện tay tức thì.</li><li><strong>Nguồn điện:</strong> Sử dụng điện AC hoặc Pin DC an toàn.</li><li><strong>Chất liệu:</strong> Đồng thau mạ Chrome/Niken.</li><li><strong>Bảo hành:</strong> 2 năm cho phần điện tử.</li></ul>'
WHERE slug LIKE 'voi-cam-ung-inax-%';

-- 8. Nắp Thông Minh (Washlet) INAX
UPDATE products SET 
description = 'Nắp rửa điện tử INAX biến chiếc bồn cầu thông thường thành thiết bị thông minh. Hỗ trợ đa dạng chức năng rửa: rửa đại tiện, rửa phụ nữ, sưởi ấm bệ ngồi, mang lại sự sạch sẽ tối ưu.',
detail = '<ul><li><strong>Tiện ích sưởi ấm:</strong> Bệ ngồi có sưởi ấm, nước ấm nhiều cấp độ.</li><li><strong>Vòi rửa:</strong> Vòi phun kép tự vệ sinh, có chế độ massage.</li><li><strong>Công nghệ:</strong> Khử mùi tự động, sấy khô bằng khí ấm.</li><li><strong>Lắp đặt:</strong> Dễ dàng thay thế cho nắp bồn cầu cũ.</li><li><strong>Bảo hành:</strong> 2 năm chính hãng.</li></ul>'
WHERE slug LIKE 'nap-thong-minh-inax-%';
