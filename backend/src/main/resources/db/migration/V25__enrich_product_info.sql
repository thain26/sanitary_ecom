-- V25__enrich_product_info.sql
UPDATE products 
SET description = 'Trải nghiệm đỉnh cao của sự vệ sinh và tiện nghi với Bồn cầu thông minh INAX Satis. Tích hợp công nghệ men Aqua Ceramic siêu chống bám bẩn cùng hệ thống xả Triple Vortex cuốn trôi mọi vết bẩn một cách êm ái.',
    detail = '<ul>
<li><strong>Công nghệ men:</strong> Aqua Ceramic siêu chống bám bẩn, trắng sáng suốt 100 năm.</li>
<li><strong>Hệ thống xả:</strong> Xả Triple Vortex mạnh mẽ nhưng cực kỳ êm ái.</li>
<li><strong>Tính năng thông minh:</strong> Nắp tự động đóng mở, sấy ấm bệ ngồi, khử mùi tự động, phát nhạc.</li>
<li><strong>Kích thước:</strong> 705 x 400 x 540 mm.</li>
<li><strong>Nguồn điện:</strong> 220V / 50Hz.</li>
<li><strong>Bảo hành:</strong> Chính hãng 2 năm điện tử, 10 năm phần sứ.</li>
</ul>'
WHERE slug IN ('bon-cau-thong-minh-inax-satis-g-ac-618vn', 'bon-cau-thong-minh-inax-satis-s-ac-818vn');

UPDATE products 
SET description = 'Lavabo đặt bàn INAX AL-652V là mảnh ghép hoàn hảo cho không gian phòng tắm đương đại. Lớp men Aqua Ceramic giúp chống ố vàng, duy trì vẻ đẹp tinh khôi qua thời gian.',
    detail = '<ul>
<li><strong>Loại:</strong> Chậu rửa mặt đặt bàn (Counter Top).</li>
<li><strong>Công nghệ men:</strong> Aqua Ceramic siêu chống bám bẩn.</li>
<li><strong>Thiết kế:</strong> Cạnh viền siêu mỏng, tối giản, sang trọng.</li>
<li><strong>Kích thước:</strong> 520 x 430 x 150 mm.</li>
<li><strong>Chất liệu:</strong> Sứ vệ sinh cao cấp.</li>
</ul>'
WHERE slug = 'lavabo-dat-ban-inax-al-652v';

UPDATE products 
SET description = 'TOTO NEOREST - Biểu tượng của sự xa xỉ trong không gian phòng tắm. Tích hợp hoàn toàn nắp Washlet cao cấp, xả Tornado Flush mạnh mẽ, tự động khử khuẩn bằng eWater+.',
    detail = '<ul>
<li><strong>Hệ thống xả:</strong> Tornado Flush siêu sạch, siêu êm.</li>
<li><strong>Công nghệ men:</strong> CEFIONTECT bề mặt siêu mịn.</li>
<li><strong>Kháng khuẩn:</strong> Nước điện phân eWater+ tự động làm sạch vòi và lòng bồn.</li>
<li><strong>Tính năng Washlet:</strong> Vòi rửa đa chế độ, massage, sấy khô, sưởi ấm bệ ngồi.</li>
<li><strong>Điều khiển:</strong> Remote Control hiện đại, nắp tự động đóng/mở qua cảm biến.</li>
</ul>'
WHERE slug IN ('bon-cau-thong-minh-toto-neorest-nh2-ces9756pja', 'bon-cau-thong-minh-toto-neorest-as-ces9768pja');

UPDATE products 
SET description = 'Đỉnh cao của nắp rửa điện tử - TOTO Washlet S7. Nắp tự đóng mở cảm biến, vòi rửa điều chỉnh 5 vị trí, làm nóng nước tức thì không cần bình, chế độ khử mùi liên tục.',
    detail = '<ul>
<li><strong>Dòng sản phẩm:</strong> Washlet S7 cao cấp.</li>
<li><strong>Tính năng:</strong> Vòi rửa đa năng, massage, sấy ấm bệ ngồi.</li>
<li><strong>Công nghệ:</strong> Nước điện phân eWater+ kháng khuẩn 99.9%.</li>
<li><strong>Điều khiển:</strong> Remote rời đi kèm.</li>
<li><strong>Nguồn điện:</strong> 220V - 680W.</li>
</ul>'
WHERE slug = 'nap-rua-dien-tu-toto-washlet-s7-tcf8sm46';
