-- 六爻占卜系统数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件

-- 用户表 (由 Supabase Auth 自动管理 auth.users)

-- 占卜记录表
CREATE TABLE IF NOT EXISTS divination_records (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT DEFAULT '',
  hexagram_original JSONB NOT NULL,       -- 本卦信息
  hexagram_changed JSONB,                  -- 变卦信息 (无动爻则为null)
  changing_lines INTEGER[] DEFAULT '{}',   -- 动爻位置 [1-6]
  cast_result TEXT NOT NULL,               -- 六次掷币结果 JSON
  interpretation TEXT DEFAULT '',          -- AI/规则 解卦文本
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false          -- 是否公开
);

-- 索引
CREATE INDEX idx_records_user_id ON divination_records(user_id);
CREATE INDEX idx_records_created_at ON divination_records(created_at DESC);
CREATE INDEX idx_records_public ON divination_records(is_public) WHERE is_public = true;

-- 用户关系表 (六度关系网)
CREATE TABLE IF NOT EXISTS user_connections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL DEFAULT 'divination', -- divination/view/comment
  weight INTEGER DEFAULT 1,                            -- 关系权重
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, connected_user_id, connection_type)
);

-- 索引
CREATE INDEX idx_connections_user ON user_connections(user_id);
CREATE INDEX idx_connections_connected ON user_connections(connected_user_id);

-- 用户 Profile 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  total_divinations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自动创建 profile 触发器
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 更新 divination count
CREATE OR REPLACE FUNCTION update_divination_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET total_divinations = total_divinations + 1, updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_divination_created ON divination_records;
CREATE TRIGGER on_divination_created
  AFTER INSERT ON divination_records
  FOR EACH ROW EXECUTE FUNCTION update_divination_count();

-- RLS 策略
ALTER TABLE divination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- profiles: 所有人可读，本人可写
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- divination_records: 公开的记录所有人可读，自己的记录全部可读
CREATE POLICY "Public records are viewable by everyone" ON divination_records
  FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own records" ON divination_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON divination_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON divination_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON divination_records
  FOR DELETE USING (auth.uid() = user_id);

-- user_connections: 插入和查看策略
CREATE POLICY "Anyone can view connections" ON user_connections
  FOR SELECT USING (true);
CREATE POLICY "Users can create connections" ON user_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON user_connections
  FOR DELETE USING (auth.uid() = user_id);