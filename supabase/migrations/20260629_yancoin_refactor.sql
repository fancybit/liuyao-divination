-- 言币系统重构
-- Migration: 20260629_yancoin_refactor

-- ==========================================
-- 1. 改造 user_tiers 表：min_divinations → min_exp，删除 price_per_divination
-- ==========================================
ALTER TABLE user_tiers
ADD COLUMN IF NOT EXISTS min_exp INT NOT NULL DEFAULT 0;

-- 迁移现有数据：min_exp = min_divinations * 5（每次占卜5言币，1:1经验）
UPDATE user_tiers SET min_exp = min_divinations * 5 WHERE min_exp = 0;

ALTER TABLE user_tiers DROP COLUMN IF EXISTS min_divinations;
ALTER TABLE user_tiers DROP COLUMN IF EXISTS price_per_divination;

-- 更新默认等级经验值（重新 upsert）
DELETE FROM user_tiers;
INSERT INTO user_tiers (name, min_exp, color) VALUES
  ('初学', 0, '#6b7280'),
  ('进阶', 100, '#3b82f6'),
  ('资深', 500, '#8b5cf6'),
  ('大师', 2500, '#f59e0b');

-- ==========================================
-- 2. 新建 system_config 表
-- ==========================================
CREATE TABLE IF NOT EXISTS system_config (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- 所有人可读
CREATE POLICY "Anyone can read system_config" ON system_config
  FOR SELECT USING (true);

-- 仅 admin 可写
CREATE POLICY "Admins can insert system_config" ON system_config
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update system_config" ON system_config
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- 默认配置
INSERT INTO system_config (key, value, description) VALUES
  ('new_user_free_coins', '50', '新用户注册赠送言币数'),
  ('exp_per_coin', '1', '每消费1言币获得的经验值')
ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- 3. 改造 user_credits 表
-- ==========================================
ALTER TABLE user_credits
ADD COLUMN IF NOT EXISTS total_exp INT NOT NULL DEFAULT 0;

-- 迁移现有总占卜次数为经验值（每次5言币，1:1经验）
UPDATE user_credits SET total_exp = total_divinations * 5 WHERE total_exp = 0;

-- total_divinations 保留但不再作为等级驱动，仅做统计
-- remaining_credits 改为 remaining_coins
ALTER TABLE user_credits RENAME COLUMN remaining_credits TO remaining_coins;

-- ==========================================
-- 4. 改造 divination_records 表
-- ==========================================
ALTER TABLE divination_records
ADD COLUMN IF NOT EXISTS coins_used INT NOT NULL DEFAULT 5;

-- ==========================================
-- 5. 更新存储函数：读取系统配置
-- ==========================================
CREATE OR REPLACE FUNCTION get_system_config(p_key TEXT)
RETURNS TEXT AS $$
DECLARE
  v_value TEXT;
BEGIN
  SELECT value INTO v_value FROM system_config WHERE key = p_key;
  RETURN v_value;
END;
$$ LANGUAGE plpgsql STABLE;

-- ==========================================
-- 6. 重写占卜扣币触发器
-- ==========================================
CREATE OR REPLACE FUNCTION handle_divination_coins()
RETURNS TRIGGER AS $$
DECLARE
  v_exp_ratio INT;
  v_exp_gained INT;
  v_total_exp INT;
  v_new_tier_id INT;
BEGIN
  -- 读取经验比率配置
  SELECT COALESCE(value::int, 1) INTO v_exp_ratio
  FROM system_config WHERE key = 'exp_per_coin';

  -- 消耗 5 言币
  NEW.coins_used := 5;

  -- 计算获得经验
  v_exp_gained := 5 * v_exp_ratio;

  -- 扣币 + 增加经验
  UPDATE user_credits
  SET remaining_coins = remaining_coins - 5,
      total_exp = total_exp + v_exp_gained,
      total_divinations = total_divinations + 1,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- 检查是否升级
  SELECT total_exp INTO v_total_exp
  FROM user_credits WHERE user_id = NEW.user_id;

  SELECT id INTO v_new_tier_id
  FROM user_tiers
  WHERE min_exp <= v_total_exp
  ORDER BY min_exp DESC
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

DROP TRIGGER IF EXISTS on_divination_created_billing ON divination_records;
CREATE TRIGGER on_divination_coins
  BEFORE INSERT ON divination_records
  FOR EACH ROW EXECUTE FUNCTION handle_divination_coins();

-- ==========================================
-- 7. 重写注册初始化触发器（读取系统配置）
-- ==========================================
CREATE OR REPLACE FUNCTION handle_new_user_coins()
RETURNS TRIGGER AS $$
DECLARE
  v_free_coins INT;
BEGIN
  SELECT COALESCE(value::int, 50) INTO v_free_coins
  FROM system_config WHERE key = 'new_user_free_coins';

  INSERT INTO public.user_credits (user_id, remaining_coins, total_divinations, total_exp, current_tier_id)
  VALUES (NEW.id, v_free_coins, 0, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_coins
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_coins();

-- ==========================================
-- 8. 更新 admin RLS 策略引用
-- ==========================================
-- user_credits 的 RLS 中 remaining_credits 已改名为 remaining_coins，策略无需变
-- 但需确保 admins 可读写 user_credits

DROP POLICY IF EXISTS "Admins can view all credits" ON user_credits;
DROP POLICY IF EXISTS "Admins can update all credits" ON user_credits;

CREATE POLICY "Admins can view all credits" ON user_credits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Admins can update all credits" ON user_credits
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
