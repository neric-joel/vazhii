# -*- coding: utf-8 -*-
"""Upload built dist/ folder directly to Vercel."""
import os, hashlib, json, urllib.request, urllib.error

TOKEN = os.environ.get("VERCEL_TOKEN", "")  # set via: export VERCEL_TOKEN=your_token

# Collect all files in dist/
files_meta = []
file_contents = {}

for root, dirs, files in os.walk('dist'):
    for fname in files:
        fpath = os.path.join(root, fname)
        with open(fpath, 'rb') as f:
            content = f.read()
        sha = hashlib.sha1(content).hexdigest()
        # Normalize path: make it relative to dist/
        rel = fpath.replace(os.sep, '/')
        prefix = 'dist/'
        if rel.startswith(prefix):
            rel = rel[len(prefix):]
        files_meta.append({'file': rel, 'sha': sha, 'size': len(content)})
        file_contents[sha] = (content, rel)

print(f"Total files: {len(files_meta)}")
for m in files_meta:
    print(f"  {m['file']}")

# Step 1: Upload each file
print("\nUploading files...")
for sha, (content, rel) in file_contents.items():
    req = urllib.request.Request(
        'https://api.vercel.com/v2/files',
        data=content,
        method='POST',
        headers={
            'Authorization': f'Bearer {TOKEN}',
            'Content-Type': 'application/octet-stream',
            'x-vercel-digest': sha,
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"  Uploaded: {rel}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if e.code == 409:
            print(f"  (already exists): {rel}")
        else:
            print(f"  ERROR {e.code}: {rel} — {body[:100]}")

# Step 2: Create deployment with uploaded files
print("\nCreating Vercel deployment...")
payload = {
    "name": "vazhii",
    "files": files_meta,
    "target": "production",
    "projectSettings": {
        "framework": "vite"
    }
}

req = urllib.request.Request(
    'https://api.vercel.com/v13/deployments',
    data=json.dumps(payload).encode(),
    method='POST',
    headers={
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json',
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        print(f"Deploy ID: {data.get('id', '?')}")
        print(f"State: {data.get('readyState', '?')}")
        print(f"URL: {data.get('url', '?')}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"ERROR {e.code}: {body[:500]}")
