-- V26__fix_product_info.sql
-- Cập nhật thông số kỹ thuật thực tế từ Internet cho các sản phẩm tiêu biểu

-- 1. INAX Satis G AC-618VN
UPDATE products 
SET description = 'Bồn cầu thông minh INAX Satis G AC-618VN mang đến trải nghiệm vệ sinh hoàn hảo với thiết kế không két nước sang trọng. Tích hợp công nghệ men Aqua Ceramic và tính năng Plasmacluster diệt khuẩn không khí.',
    detail = '<ul>
<li><strong>Mã sản phẩm:</strong> AC-618VN</li>
<li><strong>Hệ thống xả:</strong> Xả xoáy Triple Vortex mạnh mẽ, siêu êm (4.5L/6L).</li>
<li><strong>Công nghệ:</strong> Men Aqua Ceramic chống bám bẩn 100 năm, Plasmacluster khử mùi & diệt khuẩn.</li>
<li><strong>Tính năng thông minh:</strong> Tự động đóng/mở nắp, sưởi ấm bệ ngồi, phun rửa tự động kép, sấy khô, tự động xả.</li>
<li><strong>Kích thước:</strong> 375 x 635 x 540 mm (R x S x C).</li>
<li><strong>Nguồn điện:</strong> 220V, 50-60Hz, 1200W.</li>
</ul>'
WHERE slug = 'bon-cau-thong-minh-inax-satis-g-ac-618vn';

-- 2. Lavabo INAX AL-652V
UPDATE products 
SET description = 'Chậu rửa mặt đặt bàn INAX AL-652V thuộc bộ sưu tập Signature Design. Với kiểu dáng chữ nhật vuông bầu và viền siêu mỏng, sản phẩm tôn lên vẻ đẹp hiện đại và tinh tế cho phòng tắm.',
    detail = '<ul>
<li><strong>Mã sản phẩm:</strong> AL-652V</li>
<li><strong>Kiểu dáng:</strong> Đặt nổi trên bàn đá, lòng chậu sâu chống văng nước.</li>
<li><strong>Công nghệ men:</strong> Aqua Ceramic siêu chống bám bẩn, trắng sáng dài lâu.</li>
<li><strong>Kích thước:</strong> 650 x 460 x 191 mm (Dài x Rộng x Cao).</li>
<li><strong>Chất liệu:</strong> Sứ vệ sinh cao cấp.</li>
<li><strong>Lưu ý:</strong> Sản phẩm không bao gồm vòi chậu và bộ xả.</li>
</ul>'
WHERE slug = 'lavabo-dat-ban-inax-al-652v';

-- 3. TOTO Neorest NH2 CES9756PJA
UPDATE products 
SET description = 'TOTO Neorest NH2 là biểu tượng của sự tiện nghi xa hoa với thiết kế nguyên khối. Được trang bị hệ sinh thái Clean Synergy, mang đến không gian phòng tắm đẳng cấp 5 sao.',
    detail = '<ul>
<li><strong>Mã sản phẩm:</strong> CES9756PJA</li>
<li><strong>Hệ thống xả:</strong> Tornado Flush xả xoáy siêu sạch, tiết kiệm nước (3.8L/3.0L).</li>
<li><strong>Công nghệ bề mặt:</strong> Men sứ siêu mịn CeFiONtect ngăn vi khuẩn bám dính.</li>
<li><strong>Làm sạch thông minh:</strong> Ewater+ tự động khử trùng lòng cầu và vòi rửa, kết hợp phun sương Premist.</li>
<li><strong>Tính năng Washlet:</strong> Vòi rửa đa chế độ Air-in Wonder Wave, sấy khô, sưởi ấm, tự động đóng/mở nắp.</li>
<li><strong>Nguồn điện:</strong> 220V - 240V.</li>
</ul>'
WHERE slug = 'bon-cau-thong-minh-toto-neorest-nh2-ces9756pja';

-- 4. TOTO Washlet S7 TCF8SM46
UPDATE products 
SET description = 'Nắp rửa điện tử cao cấp TOTO Washlet S7 với thiết kế siêu mỏng (giảm 25% độ dày) cùng bệ ngồi công thái học. Nâng tầm bồn cầu thường thành thiết bị vệ sinh thông minh hoàn mỹ.',
    detail = '<ul>
<li><strong>Mã sản phẩm:</strong> TCF8SM46 (hoặc tương đương dòng S7).</li>
<li><strong>Công nghệ làm sạch:</strong> Khử khuẩn Ewater+ và phun sương Premist trước khi dùng.</li>
<li><strong>Tiện ích sưởi ấm:</strong> Làm nóng nước tức thì không cần bình chứa, sưởi ấm bệ ngồi đa cấp độ.</li>
<li><strong>Tính năng rửa:</strong> Vòi rửa massage nhiều chế độ, sấy khô bằng khí ấm, tự động khử mùi.</li>
<li><strong>Kích thước:</strong> 530 x 383 x 103 mm (Siêu mỏng).</li>
<li><strong>Điều khiển:</strong> Remote rời đi kèm màu trắng ngọc trai trực quan.</li>
</ul>'
WHERE slug = 'nap-rua-dien-tu-toto-washlet-s7-tcf8sm46';
