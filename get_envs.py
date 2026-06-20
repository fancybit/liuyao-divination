import json
import subprocess

# Get Vercel env vars using the Vercel API
result = subprocess.run(
    ['npx', 'vercel', 'env', 'ls', '--json'],
    capture_output=True, text=True, 
    cwd=r'C:\Users\Administrator\AppData\Roaming\Tencent\Marvis\User\A096C9894ECC789AC4E4BCC159557F98\workspace\conv_19e8bd33661_141ab5d3fc23\temp\liuyao-divination'
)
print("STDOUT:", result.stdout[:500])
print("STDERR:", result.stderr[:500])
