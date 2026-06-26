-- =============================================================
-- V1__schema.sql
-- Sanitary E-Commerce Platform — Database Schema
-- Java 25 + Spring Boot 3.x + PostgreSQL + Flyway
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. USERS & AUTH
-- ─────────────────────────────────────────────────────────────

CREATE TABLE users (
    id          BIGSERIAL       PRIMARY KEY,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,                        -- BCrypt hash
    full_name   VARCHAR(255)    NOT NULL,
    phone       VARCHAR(20),
    avatar_url  VARCHAR(500),
    role        VARCHAR(20)     NOT NULL DEFAULT 'CUSTOMER',     -- CUSTOMER | ADMIN
    status      VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',       -- ACTIVE | LOCKED | UNVERIFIED
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_role   CHECK (role   IN ('CUSTOMER', 'ADMIN')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'LOCKED', 'UNVERIFIED'))
);

CREATE TABLE user_addresses (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name  VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20)     NOT NULL,
    province        VARCHAR(100)    NOT NULL,
    district        VARCHAR(100)    NOT NULL,
    ward            VARCHAR(100)    NOT NULL,
    street_detail   VARCHAR(500)    NOT NULL,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE TABLE refresh_tokens (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(512)    NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ     NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 2. BRANDS & CATEGORIES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE brands (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    slug        VARCHAR(120)    NOT NULL UNIQUE,
    logo_url    VARCHAR(500),
    description TEXT,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id          BIGSERIAL       PRIMARY KEY,
    parent_id   BIGINT          REFERENCES categories(id),
    name        VARCHAR(200)    NOT NULL,
    slug        VARCHAR(220)    NOT NULL UNIQUE,
    image_url   VARCHAR(500),
    description TEXT,
    sort_order  INT             NOT NULL DEFAULT 0,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. PRODUCTS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE products (
    id              BIGSERIAL       PRIMARY KEY,
    category_id     BIGINT          NOT NULL REFERENCES categories(id),
    brand_id        BIGINT          NOT NULL REFERENCES brands(id),
    name            VARCHAR(500)    NOT NULL,
    slug            VARCHAR(520)    NOT NULL UNIQUE,
    model_code      VARCHAR(50)     NOT NULL UNIQUE,
    sku             VARCHAR(100),
    description     TEXT,
    technical_specs JSONB,                                      -- thông số kỹ thuật linh hoạt
    base_price      DECIMAL(15,0)   NOT NULL,
    sale_price      DECIMAL(15,0),                              -- NULL = không khuyến mãi
    stock           INT             NOT NULL DEFAULT 0,
    sold_count      INT             NOT NULL DEFAULT 0,
    rating_avg      DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
    rating_count    INT             NOT NULL DEFAULT 0,
    segment         VARCHAR(20)     NOT NULL DEFAULT 'STANDARD', -- STANDARD | PREMIUM | LUXURY
    is_featured     BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_products_segment    CHECK (segment IN ('STANDARD', 'PREMIUM', 'LUXURY')),
    CONSTRAINT chk_products_price      CHECK (base_price > 0),
    CONSTRAINT chk_products_stock      CHECK (stock >= 0),
    CONSTRAINT chk_products_rating     CHECK (rating_avg BETWEEN 0.00 AND 5.00)
);

CREATE TABLE product_images (
    id          BIGSERIAL       PRIMARY KEY,
    product_id  BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url         VARCHAR(500)    NOT NULL,
    alt         VARCHAR(255),
    is_primary  BOOLEAN         NOT NULL DEFAULT FALSE,
    sort_order  INT             NOT NULL DEFAULT 0
);

CREATE TABLE product_attributes (
    id          BIGSERIAL       PRIMARY KEY,
    product_id  BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attr_name   VARCHAR(100)    NOT NULL,
    attr_value  VARCHAR(255)    NOT NULL
);

CREATE TABLE collections (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(200)    NOT NULL,
    slug        VARCHAR(220)    NOT NULL UNIQUE,
    description TEXT,
    banner_url  VARCHAR(500),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE TABLE collection_products (
    collection_id   BIGINT  NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id      BIGINT  NOT NULL REFERENCES products(id)    ON DELETE CASCADE,
    PRIMARY KEY (collection_id, product_id)
);

-- ─────────────────────────────────────────────────────────────
-- 4. PROMOTIONS & VOUCHERS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE vouchers (
    id              BIGSERIAL       PRIMARY KEY,
    code            VARCHAR(50)     NOT NULL UNIQUE,
    name            VARCHAR(200)    NOT NULL,
    type            VARCHAR(20)     NOT NULL,                    -- PERCENT | FIXED_AMOUNT
    value           DECIMAL(15,2)   NOT NULL CHECK (value > 0),
    min_order_value DECIMAL(15,0)   NOT NULL DEFAULT 0,
    max_discount    DECIMAL(15,0),                              -- trần giảm tối đa (cho PERCENT)
    usage_limit     INT,                                        -- NULL = không giới hạn
    used_count      INT             NOT NULL DEFAULT 0,
    applies_to      VARCHAR(20)     NOT NULL DEFAULT 'ALL',     -- ALL | CATEGORY | PRODUCT
    start_date      TIMESTAMPTZ     NOT NULL,
    end_date        TIMESTAMPTZ     NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_vouchers_type       CHECK (type       IN ('PERCENT', 'FIXED_AMOUNT')),
    CONSTRAINT chk_vouchers_applies_to CHECK (applies_to IN ('ALL', 'CATEGORY', 'PRODUCT')),
    CONSTRAINT chk_vouchers_dates      CHECK (end_date > start_date)
);

CREATE TABLE flash_sales (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(200)    NOT NULL,
    start_time  TIMESTAMPTZ     NOT NULL,
    end_time    TIMESTAMPTZ     NOT NULL,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_flash_sales_times CHECK (end_time > start_time)
);

CREATE TABLE flash_sale_products (
    id              BIGSERIAL       PRIMARY KEY,
    flash_sale_id   BIGINT          NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    sale_price      DECIMAL(15,0)   NOT NULL CHECK (sale_price > 0),
    quantity_limit  INT,
    sold_count      INT             NOT NULL DEFAULT 0,
    UNIQUE (flash_sale_id, product_id)
);

-- ─────────────────────────────────────────────────────────────
-- 5. CART
-- ─────────────────────────────────────────────────────────────

CREATE TABLE carts (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     BIGINT          REFERENCES users(id) ON DELETE CASCADE,
    session_id  VARCHAR(255),                                   -- guest cart
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT cart_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE cart_items (
    id          BIGSERIAL       PRIMARY KEY,
    cart_id     BIGINT          NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id  BIGINT          NOT NULL REFERENCES products(id),
    quantity    INT             NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price       DECIMAL(15,0)   NOT NULL,                       -- giá tại thời điểm thêm vào giỏ
    UNIQUE (cart_id, product_id)
);

-- ─────────────────────────────────────────────────────────────
-- 6. ORDERS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE orders (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          REFERENCES users(id),       -- NULL nếu guest checkout
    order_code      VARCHAR(30)     NOT NULL UNIQUE,            -- ORD-20250519-00001
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    subtotal        DECIMAL(15,0)   NOT NULL,
    voucher_id      BIGINT          REFERENCES vouchers(id),
    discount_amount DECIMAL(15,0)   NOT NULL DEFAULT 0,
    shipping_fee    DECIMAL(15,0)   NOT NULL DEFAULT 0,
    total           DECIMAL(15,0)   NOT NULL,
    payment_method  VARCHAR(10)     NOT NULL DEFAULT 'COD',     -- chỉ COD
    payment_status  VARCHAR(10)     NOT NULL DEFAULT 'UNPAID',  -- UNPAID | PAID | REFUNDED
    note            TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_orders_status         CHECK (status         IN ('PENDING','CONFIRMED','PROCESSING','SHIPPING','DELIVERED','CANCELLED','REFUNDED')),
    CONSTRAINT chk_orders_payment_method CHECK (payment_method IN ('COD')),
    CONSTRAINT chk_orders_payment_status CHECK (payment_status IN ('UNPAID','PAID','REFUNDED')),
    CONSTRAINT chk_orders_total          CHECK (total >= 0)
);

CREATE TABLE order_items (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        BIGINT          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    model_code      VARCHAR(50)     NOT NULL,                   -- snapshot mã sản phẩm
    product_name    VARCHAR(500)    NOT NULL,                   -- snapshot tên
    price           DECIMAL(15,0)   NOT NULL,                   -- snapshot giá
    quantity        INT             NOT NULL CHECK (quantity > 0),
    subtotal        DECIMAL(15,0)   NOT NULL,
    reviewed        BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE TABLE order_addresses (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        BIGINT          NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    recipient_name  VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20)     NOT NULL,
    province        VARCHAR(100)    NOT NULL,
    district        VARCHAR(100)    NOT NULL,
    ward            VARCHAR(100)    NOT NULL,
    street_detail   VARCHAR(500)    NOT NULL
);

CREATE TABLE order_status_history (
    id          BIGSERIAL       PRIMARY KEY,
    order_id    BIGINT          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status      VARCHAR(20)     NOT NULL,
    note        TEXT,
    created_by  BIGINT          REFERENCES users(id),           -- admin thực hiện
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE user_vouchers (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     BIGINT          NOT NULL REFERENCES users(id),
    voucher_id  BIGINT          NOT NULL REFERENCES vouchers(id),
    used_at     TIMESTAMPTZ,
    order_id    BIGINT          REFERENCES orders(id),
    UNIQUE (user_id, voucher_id)
);

-- ─────────────────────────────────────────────────────────────
-- 7. REVIEWS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE reviews (
    id              BIGSERIAL       PRIMARY KEY,
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    order_item_id   BIGINT          REFERENCES order_items(id),
    rating          SMALLINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content         TEXT,
    images_json     JSONB           NOT NULL DEFAULT '[]',
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,      -- đã mua hàng xác nhận
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, order_item_id)
);

-- ─────────────────────────────────────────────────────────────
-- 8. WISHLIST
-- ─────────────────────────────────────────────────────────────

CREATE TABLE wishlists (
    user_id     BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- ─────────────────────────────────────────────────────────────
-- 9. PAYMENT & SHIPPING
-- ─────────────────────────────────────────────────────────────

CREATE TABLE payments (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        BIGINT          NOT NULL UNIQUE REFERENCES orders(id),
    method          VARCHAR(10)     NOT NULL DEFAULT 'COD',
    amount          DECIMAL(15,0)   NOT NULL,
    status          VARCHAR(10)     NOT NULL DEFAULT 'PENDING',  -- PENDING | PAID | REFUNDED
    paid_at         TIMESTAMPTZ,
    collected_by    BIGINT          REFERENCES users(id),        -- admin xác nhận thu tiền
    note            TEXT,
    CONSTRAINT chk_payments_status CHECK (status IN ('PENDING', 'PAID', 'REFUNDED'))
);

CREATE TABLE shipping_logs (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        BIGINT          NOT NULL REFERENCES orders(id),
    carrier         VARCHAR(50),                                -- GHN | GHTK | VTP | MANUAL
    tracking_code   VARCHAR(100),
    status          VARCHAR(100),
    note            TEXT,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 10. ADMIN / CMS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE banners (
    id          BIGSERIAL       PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,
    image_url   VARCHAR(500)    NOT NULL,
    link_url    VARCHAR(500),
    position    VARCHAR(30)     NOT NULL DEFAULT 'HERO',         -- HERO | SIDEBAR | CATEGORY_TOP | POPUP
    sort_order  INT             NOT NULL DEFAULT 0,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    start_date  TIMESTAMPTZ,
    end_date    TIMESTAMPTZ,
    CONSTRAINT chk_banners_position CHECK (position IN ('HERO','SIDEBAR','CATEGORY_TOP','POPUP'))
);

CREATE TABLE blog_posts (
    id              BIGSERIAL       PRIMARY KEY,
    title           VARCHAR(500)    NOT NULL,
    slug            VARCHAR(520)    NOT NULL UNIQUE,
    excerpt         TEXT,
    content         TEXT,
    thumbnail       VARCHAR(500),
    author_id       BIGINT          REFERENCES users(id),
    is_published    BOOLEAN         NOT NULL DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE settings (
    id          BIGSERIAL       PRIMARY KEY,
    key         VARCHAR(100)    NOT NULL UNIQUE,
    value       TEXT,
    description VARCHAR(500)
);

CREATE TABLE audit_logs (
    id              BIGSERIAL       PRIMARY KEY,
    admin_id        BIGINT          REFERENCES users(id),
    action          VARCHAR(20)     NOT NULL,                    -- CREATE | UPDATE | DELETE | LOGIN
    entity          VARCHAR(100)    NOT NULL,
    entity_id       BIGINT,
    changes_json    JSONB,
    ip_address      VARCHAR(50),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 11. INDEXES
-- ─────────────────────────────────────────────────────────────

-- Users
CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_role   ON users(role);

-- Categories
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug   ON categories(slug);

-- Products
CREATE INDEX idx_products_category   ON products(category_id);
CREATE INDEX idx_products_brand      ON products(brand_id);
CREATE INDEX idx_products_model_code ON products(model_code);
CREATE INDEX idx_products_segment    ON products(segment);
CREATE INDEX idx_products_featured   ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active     ON products(is_active)   WHERE is_active   = TRUE;
CREATE INDEX idx_products_price      ON products(base_price);
CREATE INDEX idx_products_sold       ON products(sold_count DESC);
CREATE INDEX idx_products_created    ON products(created_at DESC);
-- Full-text search (PostgreSQL native)
CREATE INDEX idx_products_fts ON products
    USING GIN (to_tsvector('simple', name || ' ' || COALESCE(model_code, '')));

-- Carts
CREATE INDEX idx_carts_user    ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- Orders
CREATE INDEX idx_orders_user    ON orders(user_id);
CREATE INDEX idx_orders_code    ON orders(order_code);
CREATE INDEX idx_orders_status  ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order items
CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user    ON reviews(user_id);

-- Vouchers
CREATE INDEX idx_vouchers_code   ON vouchers(code);
CREATE INDEX idx_vouchers_active ON vouchers(is_active, start_date, end_date);

-- Audit logs
CREATE INDEX idx_audit_logs_admin   ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
