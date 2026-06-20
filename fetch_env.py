import json, urllib.request, ssl, os

BASE = r"C:\Users\Administrator\AppData\Roaming\Tencent\Marvis\User\A096C9894ECC789AC4E4BCC159557F98\workspace\conv_19e8bd33661_141ab5d3fc23\temp\liuyao-divination"

# Read OIDC token
with open(os.path.join(BASE, '.env.migration'), 'r') as f:
    for line in f:
        if 'VERCEL_OIDC_TOKEN=' in line:
            token = line.split('VERCEL_OIDC_TOKEN=')[1].strip().strip('"')
            break

project_id = "prj_QVrKV5RNJPpQ3kAR4MxeHLK96lFm"
team_id = "team_42P1V8BvNSMK0zoDDxtrMELf"

# Get decrypted env vars from Vercel API for production
url = f"https://api.vercel.com/v9/projects/{project_id}/env?teamId={team_id}&decrypt=true"
req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
ctx = ssl.create_default_context()

try:
    resp = urllib.request.urlopen(req, context=ctx)
    data = json.loads(resp.read())
    
    env_map = {}
    for env in data.get('envs', []):
        key = env.get('key', '')
        val = env.get('value', '')
        target = env.get('target', [])
        # Only get production vars
        if 'production' in target:
            env_map[key] = val
    
    print("SUPABASE_URL:", env_map.get('NEXT_PUBLIC_SUPABASE_URL', 'NOT FOUND'))
    print("SUPABASE_ANON_KEY:", env_map.get('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NOT FOUND')[:20] + '...')
    
    # Save to file for migration script
    with open(os.path.join(BASE, '.env.supabase'), 'w') as f:
        for k, v in env_map.items():
            if 'SUPABASE' in k:
                f.write(f"{k}={v}\n")
    print("\nSaved to .env.supabase")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
    print("Trying without teamId...")
    url2 = f"https://api.vercel.com/v9/projects/{project_id}/env?decrypt=true"
    req2 = urllib.request.Request(url2, headers={"Authorization": f"Bearer {token}"})
    try:
        resp2 = urllib.request.urlopen(req2, context=ctx)
        data2 = json.loads(resp2.read())
        print(json.dumps(data2, indent=2)[:2000])
    except Exception as e2:
        print(f"Error2: {e2}")
