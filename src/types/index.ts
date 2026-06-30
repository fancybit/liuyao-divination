export interface UserTier {
  id: number;
  name: string;
  min_exp: number;
  color: string;
  created_at: string;
}

export interface UserCredits {
  id: number;
  user_id: string;
  remaining_coins: number;
  total_divinations: number;
  total_exp: number;
  current_tier_id: number;
  created_at: string;
  updated_at: string;
  tier_name?: string;
  tier_color?: string;
}

export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface BillingRecord {
  id: number;
  user_id: string;
  credits_added: number;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface HexagramData {
  id: number;
  name: string;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
  description: string;
  judgment: string;
  image: string;
  lines: LineData[];
}

export interface LineData {
  position: number;
  text: string;
  meaning: string;
}

export interface CastResult {
  lines: number[];        // 6次结果: 6,7,8,9 (6=老阴 7=少阳 8=少阴 9=老阳)
  originalHexagram: number;
  changedHexagram: number | null;
  changingLines: number[];
}

export interface DivinationRecord {
  id: number;
  user_id: string;
  question: string;
  hexagram_original: HexagramData;
  hexagram_changed: HexagramData | null;
  changing_lines: number[];
  cast_result: string;
  interpretation: string;
  interpretation_en: string | null;
  created_at: string;
  is_public: boolean;
  coins_used?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string;
  total_divinations: number;
  created_at: string;
}

export interface UserConnection {
  id: number;
  user_id: string;
  connected_user_id: string;
  connection_type: string;
  weight: number;
  created_at: string;
  username?: string;
  avatar_url?: string;
}
