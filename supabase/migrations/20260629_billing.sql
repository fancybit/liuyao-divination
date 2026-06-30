-- 计费系统：用户等级、点数、充值记录、占卜扣点
-- Migration: 20260629_billing

-- ==========================================
-- 1. 用户等级表
-- ==========================================
CREATE TABLE IF NOT EXISTS user_tiers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  min_divinations INT NOT NULL DEFAULT 0,
  price_per_divination INT NOT NULL DEFAULT 5,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 默认插入4个等级
INSERT INTO user_tiers (name, min_divinations, price_per_divination, color) VALUES
  ('初学', 0, 5, '#6b7280'),
  ('进阶', 20, 4, '#3b82f6'),
  ('资深', 100, 3, '#8b5cf6'),
  ('大师', 500, 2, '#f59e0b')
ON CONFLICT DO NOTHING;

-- ==========================================
-- 2. 用户点数表
-- ==========================================
CREATE TABLE IF NOT EXISTS user_credits (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remaining_credits INT NOT NULL DEFAULT 50,
  total_divinations INT NOT NULL DEFAULT 0,
  current_tier_id INT REFERENCES user_tiers(id) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);

-- RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits" ON user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 3. 充值记录表
-- ==========================================
CREATE TABLE IF NOT EXISTS billing_records (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_added INT NOT NULL,
  amount NUMERIC(10, 2) DEFAULT 0,
  payment_method TEXT DEFAULT 'simulated',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_billing_records_user_id ON billing_records(user_id);

ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own billing records" ON billing_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own billing records" ON billing_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 4. 占卜记录表新增 credits_used 列
-- ==========================================
ALTER TABLE divination_records
ADD COLUMN IF NOT EXISTS credits_used INT DEFAULT 0;

-- ==========================================
-- 5. 注册时自动创建 user_credits 记录
-- ==========================================
CREATE OR REPLACE FUNCTION handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, remaining_credits, total_divinations, current_tier_id)
  VALUES (NEW.id, 50, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_credits();

-- ==========================================
-- 6. 占卜扣点触发器（替代旧的 update_divination_count）
-- ==========================================
CREATE OR REPLACE FUNCTION handle_divination_billing()
RETURNS TRIGGER AS $$
DECLARE
  v_price INT;
  v_total INT;
  v_new_tier_id INT;
BEGIN
  -- 获取当前等级的价格
  SELECT price_per_divination INTO v_price
  FROM user_credits uc
  JOIN user_tiers ut ON uc.current_tier_id = ut.id
  WHERE uc.user_id = NEW.user_id;

  IF v_price IS NULL THEN
    v_price := 5; -- fallback 初学价格
  END IF;

  -- 更新 credits_used
  NEW.credits_used := v_price;

  -- 扣点 + 增加占卜次数
  UPDATE user_credits
  SET remaining_credits = remaining_credits - v_price,
      total_divinations = total_divinations + 1,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- 检查是否升级
  SELECT total_divinations INTO v_total
  FROM user_credits WHERE user_id = NEW.user_id;

  SELECT id INTO v_new_tier_id
  FROM user_tiers
  WHERE min_divinations <= v_total
  ORDER BY min_divinations DESC
  LIMIT 1;

  IF v_new_tier_id IS NOT NULL THEN
    UPDATE user_credits
    SET current_tier_id = v_new_tier_id,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 移除旧触发器，用新的替代
DROP TRIGGER IF EXISTS on_divination_created ON divination_records;
CREATE TRIGGER on_divination_created_billing
  BEFORE INSERT ON divination_records
  FOR EACH ROW EXECUTE FUNCTION handle_divination_billing();

-- ==========================================
-- 7. Admins 可管理 user_credits（全局读写）
-- ==========================================
-- profiles 表补充 RLS 放开给 admin（已有 Schema 中 profiles RLS 是所有人可读，无需改）
-- user_credits admin 读取策略（依赖 admins 表）
CREATE POLICY "Admins can view all credits" ON user_credits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update all credits" ON user_credits
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- billing_records admin 读取策略
CREATE POLICY "Admins can view all billing records" ON billing_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- user_tiers admins 可读写
ALTER TABLE user_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tiers" ON user_tiers
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert tiers" ON user_tiers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update tiers" ON user_tiers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can delete tiers" ON user_tiers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
