CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  is_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  name VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  device VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  compatibility TEXT,
  price INTEGER NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_device ON products(device);
CREATE INDEX idx_products_manufacturer ON products(manufacturer);
CREATE INDEX idx_products_seller ON products(seller_id);