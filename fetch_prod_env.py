import json, urllib.request, ssl, os

BASE = r"C:\Users\Administrator\AppData\Roaming\Tencent\Marvis\User\A096C9894ECC789AC4E4BCC159557F98\workspace\conv_19e8bd33661_141ab5d3fc23\temp\liuyao-divination"

# Read OIDC token from .env.prod
token = None
with open(os.path.join(BASE, '.env.prod'), 'r') as f:
    for line in f:
        if 'VERCEL_OIDC_TOKEN=' in line:
            token = line.split('VERCEL_OIDC_TOKEN=')[1].strip().strip('"')
            break

if not token:
    print("No token found")
    exit(1)

# Vercel API to get env vars with decryption
url = "https://api.vercel.com/v9/projects/prj_QVrKV5RNJPpQ3kAR4MxeHLK96lFm/env?decrypt=true&target=production"
ctx = ssl.create_default_context()

req = urllib.request.Request(url)
req.add_header("Authorization", f"Bearer {token}")

try:
    resp = urllib.request.urlopen(req, context=ctx)
    data = json.loads(resp.read())
    envs = data.get("envs", [])
    
    env_map = {}
    for e in envs:
        key = e.get("key", "")
        value = e.get("value", "")
        env_map[key] = value
        
    for k, v in sorted(env_map.items()):
        if 'SUPABASE' in k.upper() or 'DASH' in k.upper():
            print(f"{k}={v}")
    
    # Save to file
    with open(os.path.join(BASE, '.env.supabase'), 'w', encoding='utf-8') as f:
        for k, v in env_map.items():
            if 'SUPABASE' in k.upper():
                f.write(f"{k}={v}\n")
    
    print("\n--- Saved to .env.supabase ---")
except Exception as e:
    print(f"Error: {e}")
