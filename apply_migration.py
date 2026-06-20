import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('.env.vercel')

# Get Supabase URL and extract connection info
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
if not supabase_url:
    print("NEXT_PUBLIC_SUPABASE_URL not found")
    exit(1)

# Supabase URL format: https://[project-id].supabase.co
# Connection info:
# host: [project-id].supabase.co
# port: 5432
# database: postgres
# user: postgres
# password: from Supabase dashboard

print("Supabase URL:", supabase_url)
print("\nTo apply the migration manually:")
print("1. Go to Supabase dashboard for your project")
print("2. Navigate to SQL Editor")
print("3. Run the following SQL:")
print("\nALTER TABLE divination_records ADD COLUMN IF NOT EXISTS interpretation_en TEXT;")
print("\n4. Click Run to execute")