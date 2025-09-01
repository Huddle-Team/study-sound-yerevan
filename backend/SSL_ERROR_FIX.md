# SSL Protocol Error Fix

## Issue: ERR_SSL_PROTOCOL_ERROR

The meta tag `upgrade-insecure-requests` is working (browser is trying HTTPS), but your backend container is only running HTTP, not HTTPS.

## Root Cause

Your current container was built before we added the auto-SSL server. It's running the old `server.js` instead of `server-auto-ssl.js`.

## Solution: Rebuild Container

### Option 1: PowerShell (Windows)
```powershell
cd backend
.\rebuild-with-https.ps1
```

### Option 2: Bash (Linux/WSL)
```bash
cd backend
chmod +x rebuild-with-https.sh
./rebuild-with-https.sh
```

### Option 3: Manual Steps
```bash
# Stop old container
docker stop spytech-api
docker rm spytech-api
docker rmi spytech-backend

# Rebuild with HTTPS support
docker build -t spytech-backend .

# Run new container
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend
```

## Expected Result After Rebuild

Container logs should show:
```
🚀 Starting SpyTech API Server...
📊 Environment: production
✅ Product data loaded successfully
🌐 HTTP Server running on port 3001
🔐 Generating self-signed certificate...
✅ Self-signed certificate generated successfully
🔒 HTTPS Server running on port 3443
```

## Test Commands

```bash
# Test HTTP
curl http://104.154.91.216:3001/api/health

# Test HTTPS (ignore certificate warnings)
curl -k https://104.154.91.216:3443/api/health
```

## Why This Happens

1. Browser sees `upgrade-insecure-requests` meta tag
2. Converts `http://104.154.91.216:3001/api/booking/submit` to `https://104.154.91.216:3001/api/booking/submit`
3. But port 3001 only serves HTTP, not HTTPS
4. SSL protocol error occurs

## After Fix

1. Browser upgrades to `https://104.154.91.216:3001/api/booking/submit`
2. But server auto-redirects to HTTPS port 3443
3. Request succeeds on `https://104.154.91.216:3443/api/booking/submit`

Run the rebuild script to fix this! 🚀
