-- Seed admin account with password 'admin123'
INSERT INTO users (email, password, full_name, phone, role, status)
VALUES ('admin@sanitary.com', '$2a$10$tM2a6/p31JzT/0K1QdDyeu5l2q4pG6rU29n2m1tHjB7Ebe9vY7yZ2', 'Admin Quản Trị', '0987654321', 'ADMIN', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Seed some default vouchers
INSERT INTO vouchers (code, name, type, value, min_order_value, max_discount, usage_limit, used_count, applies_to, start_date, end_date, is_active)
VALUES 
('INAX2026', 'Mã Giảm Giá 10%', 'PERCENT', 10.00, 0.00, 200000.00, 100, 0, 'ALL', '2026-01-01 00:00:00+07', '2027-01-01 00:00:00+07', TRUE),
('LUXURY500', 'Giảm 500k đơn từ 5 triệu', 'FIXED_AMOUNT', 500000.00, 5000000.00, 500000.00, 50, 0, 'ALL', '2026-01-01 00:00:00+07', '2027-01-01 00:00:00+07', TRUE)
ON CONFLICT (code) DO NOTHING;
