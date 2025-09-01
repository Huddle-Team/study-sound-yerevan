# SSL Certificate Authority Invalid Fix

## Issue: ERR_CERT_AUTHORITY_INVALID

✅ **Good news**: Your HTTPS server is now accessible!  
❌ **Issue**: Browser rejects self-signed certificate

## Solution 1: Accept Certificate (Quick Fix)

### For Users:
1. Visit `https://104.154.91.216:3443/api/health` directly
2. Click "Advanced" → "Proceed to 104.154.91.216 (unsafe)"
3. Certificate will be accepted for the session
4. Now your booking form will work

### For Testing:
```bash
# Test with curl (ignores certificate)
curl -k https://104.154.91.216:3443/api/health
```

## Solution 2: Use HTTP Instead (Simplest)

Since HTTPS setup is complex, let's temporarily use HTTP with CORS headers:

### Update Frontend to use HTTP:
```bash
# Update environment variable
echo "VITE_API_URL=http://104.154.91.216:3001/api" > .env

# Rebuild frontend
npm run build
```

### Update GitHub Actions:
The workflow needs to use HTTP URL instead of HTTPS.

## Solution 3: Add Certificate Exception Script

Create a helper page for users to accept the certificate:

```html
<!DOCTYPE html>
<html>
<head>
    <title>SpyTech - Enable HTTPS</title>
</head>
<body>
    <h1>SpyTech Setup</h1>
    <p>To enable booking functionality, please:</p>
    <ol>
        <li>Click this link: <a href="https://104.154.91.216:3443/api/health" target="_blank">Accept Certificate</a></li>
        <li>Click "Advanced" then "Proceed to 104.154.91.216 (unsafe)"</li>
        <li>Return to the main website</li>
    </ol>
    <p>This is needed because we use a self-signed certificate.</p>
</body>
</html>
```

## Solution 4: Production SSL Certificate

For production, use Let's Encrypt:

```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Get certificate (requires domain pointing to your server)
sudo certbot certonly --standalone -d yourdomain.com

# Update server to use real certificates
```

## Recommended Approach: Switch to HTTP

Since the HTTPS setup is causing certificate issues, let's use HTTP for now:

### Step 1: Update Environment
```bash
# Update .env file
sed -i 's/https:\/\/104.154.91.216:3443/http:\/\/104.154.91.216:3001/' .env
```

### Step 2: Update GitHub Actions
Change the workflow to use HTTP URL instead of HTTPS.

### Step 3: Update CORS Settings
Ensure your backend allows requests from your HTTPS website to HTTP API.

This is common in development and works fine since your website traffic is already encrypted.

## Quick Commands

### Option A: Use HTTP (Recommended)
```bash
# Update frontend environment
echo "VITE_API_URL=http://104.154.91.216:3001/api" > .env

# Test HTTP endpoint
curl http://104.154.91.216:3001/api/health
```

### Option B: Accept Certificate
1. Open: https://104.154.91.216:3443/api/health
2. Accept certificate warning
3. Test booking form

The HTTP approach is simpler and will work immediately! 🚀
