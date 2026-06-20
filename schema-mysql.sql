-- 六爻占卜系统数据库 Schema (MySQL 版本)
-- 在 MySQL 中执行此文件

-- 用户表 (需要自行实现认证，这里使用简化的用户表)

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  total_divinations INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 占卜记录表
CREATE TABLE IF NOT EXISTS divination_records (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  question TEXT DEFAULT '',
  hexagram_original JSON NOT NULL,
  hexagram_changed JSON,
  changing_lines JSON DEFAULT '[]',
  cast_result JSON NOT NULL,
  interpretation TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_records_user_id ON divination_records(user_id);
CREATE INDEX idx_records_created_at ON divination_records(created_at DESC);
CREATE INDEX idx_records_public ON divination_records(is_public);

-- 用户关系表 (六度关系网)
CREATE TABLE IF NOT EXISTS user_connections (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  connected_user_id CHAR(36) NOT NULL,
  connection_type VARCHAR(50) DEFAULT 'divination',
  weight INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_connection (user_id, connected_user_id, connection_type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (connected_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX idx_connections_user ON user_connections(user_id);
CREATE INDEX idx_connections_connected ON user_connections(connected_user_id);
