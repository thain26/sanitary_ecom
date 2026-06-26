-- =============================================================
-- V22__drop_unused_tables.sql
-- Xóa các bảng không còn sử dụng để làm sạch database
-- =============================================================

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS shipping_logs CASCADE;
