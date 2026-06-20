-- Add interpretation_en column for English interpretations
ALTER TABLE divination_records 
ADD COLUMN IF NOT EXISTS interpretation_en TEXT;