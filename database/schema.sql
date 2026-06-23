CREATE DATABASE stock_notify;

USE stock_notify;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_domain VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shopify_product_id VARCHAR(255) NOT NULL,
  variant_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  image TEXT,
  price DECIMAL(10,2),
  inventory_quantity INT DEFAULT 0,
  status ENUM('in_stock','out_of_stock') DEFAULT 'out_of_stock',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_id VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  status ENUM('pending','notified') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified_at TIMESTAMP NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscriber_id INT NOT NULL,
  product_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT,
  status ENUM('pending','sent','failed') DEFAULT 'pending',
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_domain VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  sender_name VARCHAR(100),
  notify_text VARCHAR(100) DEFAULT 'Notify Me',
  notified_text VARCHAR(100) DEFAULT 'Notified',
  button_color VARCHAR(20) DEFAULT '#008060',
  auto_send BOOLEAN DEFAULT TRUE,
  webhook_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE webhooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_domain VARCHAR(255) NOT NULL,
  webhook_type VARCHAR(100) NOT NULL,
  webhook_id VARCHAR(255),
  status ENUM('active','inactive') DEFAULT 'active',
  last_received TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_email ON subscribers(product_id,email);
CREATE INDEX idx_notification_status ON notifications(status);
CREATE INDEX idx_product_status ON products(status);