import requests

# The Vercel project is "yntx" under team "fancybits-projects"
# Use the Vercel API to get decrypted env vars
project_id = "prj_QVrKV5RNJPpQ3kAR4MxeHLK96lFm"
team_id = "team_42P1V8BvNSMK0zoDDxtrMELf"

# Try to get env vars via the Vercel API
# First, we need to use the OIDC token for auth
url = f"https://api.vercel.com/v9/projects/{project_id}/env"
params = {"teamId": team_id, "decrypt": "true"}
headers = {"Authorization": f"Bearer {open('.env.vercel2').read().split('VERCEL_OIDC_TOKEN=')[1].split('\\n')[0].strip().strip('\"')}"}

try:
    resp = requests.get(url, params=params, headers=headers)
    print("Status:", resp.status_code)
    print("Body:", resp.text[:2000])
except Exception as e:
    print("Error:", e)