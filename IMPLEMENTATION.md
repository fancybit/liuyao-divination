# Database migration instructions for Supabase

## Migration SQL
```sql
-- Add interpretation_en column for storing English interpretations
ALTER TABLE divination_records 
ADD COLUMN IF NOT EXISTS interpretation_en TEXT;
```

## Implementation Summary

The following changes have been made to support bilingual interpretations:

### 1. Database Schema
- Added `interpretation_en` column to `divination_records` table
- Existing `interpretation` column stores Chinese interpretations

### 2. API Changes (`/api/interpret`)
- Accepts `locale` parameter ('zh' or 'en')
- Generates locale-specific prompts for AI interpretation
- Returns appropriate language interpretation

### 3. Frontend Changes

#### Divination Page (`/divination`)
- Passes current locale to API when interpreting
- Saves interpretation to correct column based on locale
- Chinese locale → `interpretation` column
- English locale → `interpretation_en` column

#### Records Page (`/records`)
- Displays interpretation based on current locale
- Shows alternative language interpretation if available
- Saves AI re-interpretations to correct locale column
- Added "Interpretation (English)" and "Interpretation (Chinese)" sections

### 4. TypeScript Types
- Updated `DivinationRecord` interface with `interpretation_en: string | null`

### 5. Translations
- Added `interpretationEn` and `interpretationZh` keys to both language files

## Deployment Steps

1. **Apply database migration** in Supabase SQL Editor
2. **Deploy code changes** to Vercel
3. **Test functionality**:
   - Switch to English, cast a hexagram, save → should save to `interpretation_en`
   - Switch to Chinese, cast a hexagram, save → should save to `interpretation`
   - View records in each language → should show correct interpretation

## Notes
- Existing records will have `interpretation_en` as NULL
- AI re-interpretation in records page will update the correct column based on current locale
- Users see their own language's interpretation by default, with option to view alternative language