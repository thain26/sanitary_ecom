-- V28__rewrite_all_toto_products.sql
-- Cập nhật đồng loạt mô tả và chi tiết cho tất cả sản phẩm TOTO còn lại để chuẩn hóa giao diện Accordion

-- 1. Bồn cầu 1 khối TOTO
UPDATE products SET 
description = 'Bồn cầu 1 khối TOTO sở hữu thiết kế nguyên khối không có rãnh hở, mang đến vẻ đẹp hiện đại và giúp việc vệ sinh trở nên dễ dàng hơn bao giờ hết. Tích hợp công nghệ xả Tornado mạnh mẽ.',
detail = '<ul><li><strong>Công nghệ xả:</strong> Tornado Flush - Xả xoáy 360 độ siêu mạnh, siêu êm.</li><li><strong>Men sứ:</strong> CeFiONtect chống bám bẩn ưu việt, duy trì độ trắng sáng.</li><li><strong>Thiết kế:</strong> Vành kín hoàn toàn (Rimless), không có chỗ cho vi khuẩn trú ngụ.</li><li><strong>Nắp đóng:</strong> Nắp đóng êm nhẹ nhàng, chất liệu cao cấp.</li></ul>'
WHERE slug LIKE 'bon-cau-1-khoi-toto-%';

-- 2. Bồn cầu 2 khối TOTO
UPDATE products SET 
description = 'Bồn cầu 2 khối TOTO là sự lựa chọn phổ biến cho các gia đình hiện đại nhờ thiết kế linh hoạt, dễ lắp đặt. Công nghệ xả tiên tiến giúp tiết kiệm nước tối đa mà vẫn xả sạch mọi vết bẩn.',
detail = '<ul><li><strong>Tính năng:</strong> Tiết kiệm nước với nút nhấn 2 chế độ xả.</li><li><strong>Bề mặt sứ:</strong> Chống ố vàng, dễ dàng lau chùi hàng ngày.</li><li><strong>Nắp bệ ngồi:</strong> Thiết kế vừa vặn, tạo cảm giác thoải mái khi ngồi.</li><li><strong>Bảo hành:</strong> Bảo hành chính hãng TOTO Việt Nam.</li></ul>'
WHERE slug LIKE 'bon-cau-2-khoi-toto-%';

-- 3. Bồn cầu treo tường TOTO
UPDATE products SET 
description = 'Bồn cầu treo tường TOTO mang phong cách thiết kế tối giản Châu Âu. Giải pháp tuyệt vời để tiết kiệm không gian và giữ cho mặt sàn luôn sạch sẽ, khô ráo.',
detail = '<ul><li><strong>Kiểu lắp đặt:</strong> Treo tường kết hợp két nước âm tường (cần mua khung âm tường riêng).</li><li><strong>Công nghệ:</strong> Men CeFiONtect siêu mịn, xả Tornado êm ái.</li><li><strong>Chịu lực:</strong> Khung kim loại ẩn chịu tải trọng cao, vô cùng chắc chắn.</li><li><strong>Bảo hành:</strong> 2 năm chính hãng.</li></ul>'
WHERE slug LIKE 'bon-cau-treo-tuong-toto-%';

-- 4. Chậu Rửa Mặt Lavabo TOTO
UPDATE products SET 
description = 'Chậu rửa mặt Lavabo TOTO với chất men sáng bóng, đường nét tinh tế, tô điểm cho không gian phòng tắm sang trọng. Bề mặt nhẵn mịn giúp ngăn chặn sự sinh sôi của vi khuẩn.',
detail = '<ul><li><strong>Kiểu dáng:</strong> Âm bàn, đặt bàn, hoặc treo tường đa dạng.</li><li><strong>Công nghệ:</strong> Bề mặt nhẵn mịn chống bám bẩn CeFiONtect (tùy mã sản phẩm).</li><li><strong>Thiết kế:</strong> Lỗ thoát tràn an toàn, lòng chậu sâu rộng.</li><li><strong>Bảo hành:</strong> 2 năm chính hãng TOTO.</li></ul>'
WHERE slug LIKE 'chau-rua-%-toto-%';

-- 5. Vòi Chậu / Vòi Bếp TOTO
UPDATE products SET 
description = 'Vòi nước TOTO được chế tác từ đồng thau nguyên khối mạ Chrome Niken, mang lại vẻ đẹp sáng bóng bất chấp thời gian. Lõi van gốm ceramic điều khiển nhiệt độ chính xác tuyệt đối.',
detail = '<ul><li><strong>Chất liệu:</strong> Đồng mạ Ni-Cr cao cấp, chống ăn mòn hiệu quả.</li><li><strong>Lõi van:</strong> Van đĩa sứ điều tiết nước mượt mà, không rỉ nước.</li><li><strong>Công nghệ nước:</strong> Trộn bọt khí Aerial Pulse tạo cảm giác êm ái, tiết kiệm nước.</li><li><strong>Bảo hành:</strong> 2 năm chính hãng.</li></ul>'
WHERE slug LIKE 'voi-chau-%-toto-%' OR slug LIKE 'voi-bep-toto-%';

-- 6. Vòi Sen Tắm TOTO
UPDATE products SET 
description = 'Bộ sen tắm TOTO biến phòng tắm thành spa tại gia với công nghệ dòng chảy đa chế độ. Tận hưởng cảm giác thư thái với bát sen mạ Chrome cao cấp và khả năng giữ nhiệt ổn định.',
detail = '<ul><li><strong>Trải nghiệm:</strong> Bát sen massage với các chế độ phun nước êm ái.</li><li><strong>Công nghệ:</strong> SMA (lò xo nhiệt tự động) duy trì nhiệt độ ổn định chống bỏng.</li><li><strong>Chất liệu:</strong> Đồng mạ Ni-Cr sáng bóng, chống gỉ sét.</li><li><strong>Bảo hành:</strong> 2 năm chính hãng TOTO.</li></ul>'
WHERE slug LIKE 'bo-sen-tam-%-toto-%';

-- 7. Bồn Tiểu Nam TOTO
UPDATE products SET 
description = 'Bồn tiểu nam TOTO mang ngôn ngữ thiết kế góc cạnh nam tính hoặc bo tròn thanh lịch. Tối ưu hóa chức năng xả rửa, giảm thiểu mùi hôi và thân thiện với môi trường.',
detail = '<ul><li><strong>Lắp đặt:</strong> Treo tường hoặc đặt sàn.</li><li><strong>Tính năng:</strong> Tương thích với van xả cảm ứng tự động.</li><li><strong>Vệ sinh:</strong> Lòng tiểu dốc, xả tràn đều giúp cuốn trôi hoàn toàn chất bẩn.</li><li><strong>Bảo hành:</strong> 2 năm phần sứ chính hãng.</li></ul>'
WHERE slug LIKE 'bon-tieu-nam-%-toto-%';

-- 8. Nắp Đóng Êm / Nắp Rửa Cơ TOTO (trừ Washlet S7)
UPDATE products SET 
description = 'Nắp bồn cầu TOTO (Nắp rửa cơ Eco-washer hoặc nắp đóng êm) là giải pháp nâng cấp nhanh chóng cho bồn cầu thường. Thiết kế mỏng nhẹ, mang lại sự tiện nghi và vệ sinh sạch sẽ hơn.',
detail = '<ul><li><strong>Loại nắp:</strong> Đóng êm giảm ồn hoặc Nắp rửa cơ không dùng điện.</li><li><strong>Chất liệu:</strong> Nhựa cao cấp kháng khuẩn, chống trầy xước.</li><li><strong>Vòi rửa (nếu có):</strong> Vòi rửa nước lạnh, tự thu gọn sau khi sử dụng.</li><li><strong>Dễ vệ sinh:</strong> Tháo lắp nhanh chóng chỉ với 1 nút nhấn.</li></ul>'
WHERE slug LIKE 'nap-%-toto-%' AND slug != 'nap-rua-dien-tu-toto-washlet-s7-tcf8sm46';

-- 9. Phụ Kiện TOTO (Thanh vịn, Giá đỡ, Móc áo, Kệ)
UPDATE products SET 
description = 'Phụ kiện phòng tắm TOTO sở hữu độ hoàn thiện tinh xảo, chất liệu kim loại cao cấp không lo gỉ sét trong môi trường ẩm ướt. Giải pháp hoàn hảo để đồng bộ hóa không gian nhà tắm.',
detail = '<ul><li><strong>Chất liệu chính:</strong> Thép không gỉ (Inox 304) hoặc Hợp kim kẽm mạ Chrome.</li><li><strong>Độ bền:</strong> Chịu lực tốt, chống ăn mòn bề mặt.</li><li><strong>Thiết kế:</strong> Gắn tường chắc chắn bằng vít lở đi kèm.</li><li><strong>Bảo hành:</strong> 2 năm chính hãng TOTO.</li></ul>'
WHERE (slug LIKE 'thanh-vin-%-toto-%' OR slug LIKE 'gia-do-%-toto-%' OR slug LIKE 'moc-ao-%-toto-%' OR slug LIKE 'ke-%-toto-%');
