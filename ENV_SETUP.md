# Hướng dẫn Triển khai (Deployment Guide) - Miễn phí 100%

Dựa trên lựa chọn của bạn, tôi đã thiết kế kiến trúc triển khai sử dụng các dịch vụ Cloud miễn phí tốt nhất hiện nay:
- **Database (PostgreSQL)**: Neon.tech
- **Cache (Redis)**: Upstash.com
- **Backend (Spring Boot)**: Render.com
- **Frontend (Customer & Admin)**: Bạn có thể chọn 1 trong 3 nền tảng cực tốt bên dưới (Đều miễn phí 100% thay thế cho Vercel).

---

## BƯỚC 1: Khởi tạo Database (Neon.tech)
1. Truy cập [Neon.tech](https://neon.tech/) và tạo tài khoản miễn phí.
2. Tạo Project mới (Chọn PostgreSQL version 15+).
3. Copy chuỗi kết nối (Connection String) có dạng: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
4. Cấu hình vào Backend: Đổi `postgresql://` thành `jdbc:postgresql://` cho `SPRING_DATASOURCE_URL`.

## BƯỚC 2: Khởi tạo Redis Cache (Upstash.com)
1. Truy cập [Upstash.com](https://upstash.com/) và tạo database Redis (Free tier).
2. Lấy các thông số: `SPRING_DATA_REDIS_HOST`, `SPRING_DATA_REDIS_PORT`, và `SPRING_DATA_REDIS_PASSWORD` để điền vào Backend.

## BƯỚC 3: Triển khai Backend (Render.com)
Tôi đã tạo sẵn file `backend/render.yaml` (Blueprint) giúp bạn deploy tự động.
1. Đẩy (Push) toàn bộ code của bạn lên 1 repository trên GitHub.
2. Truy cập [Render.com](https://render.com/), liên kết GitHub.
3. Chọn **Blueprints** -> **New Blueprint Instance** -> Chọn Repo của bạn.
4. Render sẽ đọc cấu hình và tự hỏi bạn các biến môi trường. Hãy nhập thông số từ Bước 1, Bước 2 và `GEMINI_API_KEY`.
5. Đợi Build xong, bạn sẽ có link: `https://sanitary-backend-xxxx.onrender.com`.

---

## BƯỚC 4: Triển khai Frontend (Thay thế Vercel)
Tôi đã tạo sẵn file `public/_redirects` cho cả 2 frontend để tương thích với mọi nền tảng! Bạn có thể chọn 1 trong 3 lựa chọn sau:

### Lựa chọn 1: Render.com (Khuyến nghị - Tiện lợi vì chung chỗ với Backend)
Bạn có thể host luôn 2 cái Web trên Render dạng **Static Site** (Miễn phí hoàn toàn & rất nhanh).
1. Trên Render, chọn **New** -> **Static Site**.
2. Chọn Repo GitHub của bạn.
3. Cấu hình Customer Web:
   - Build Command: `npm run build`
   - Publish directory: `customer-web/dist`
   - Root directory: `customer-web`
   - Nhập Environment Variables: `VITE_API_BASE_URL` = (Link backend ở Bước 3)
   - Lưu ý: Vào mục *Redirects/Rewrites* của Render cài đặt: Source `/*` -> Destination `/index.html`, Action `Rewrite`.
4. Làm tương tự cho Admin Web (Đổi Root directory thành `admin-web` và thư mục publish thành `admin-web/dist`).

### Lựa chọn 2: Netlify (Dễ sử dụng số 1, đối thủ lớn nhất của Vercel)
1. Truy cập [Netlify.com](https://www.netlify.com/), đăng nhập bằng GitHub.
2. Chọn **Add new site** -> **Import an existing project** -> Chọn Repo của bạn.
3. Cấu hình:
   - Base directory: `customer-web`
   - Build command: `npm run build`
   - Publish directory: `customer-web/dist`
   - Add environment variables: `VITE_API_BASE_URL` = (Link backend ở Bước 3).
4. Deploy! Làm lại y hệt bước trên cho `admin-web`.

### Lựa chọn 3: Cloudflare Pages (Nhanh nhất thế giới)
1. Truy cập [Cloudflare Pages](https://pages.cloudflare.com/), đăng nhập bằng GitHub.
2. Create a project -> Connect to Git.
3. Cài đặt các thông số thư mục (Build command là `npm run build`, output là `dist`) y như Netlify. Mạng lưới CDN của Cloudflare sẽ giúp web của bạn load cực kỳ nhanh ở Việt Nam.

---
🎉 **Hoàn tất!** Giờ đây bạn đã có 1 hệ thống E-commerce thực tế với cơ sở hạ tầng tách biệt Frontend - Backend chuẩn mực, và đặc biệt là chi phí duy trì hàng tháng là 0 đồng!
