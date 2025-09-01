# Mixed Content Solution - Final Fix

## Issue: HTTPS site cannot make HTTP requests

Modern browsers block HTTP requests from HTTPS pages for security. We need a proper solution.

## Solution 1: Use Cloudflare or CDN Proxy (Recommended)

### Step 1: Set up Cloudflare for your domain
1. Add your domain to Cloudflare
2. Create a proxy rule for API calls
3. Configure SSL/TLS settings

### Step 2: Use subdomain for API
Instead of IP address, use a subdomain:
- Point `api.spytech.am` to `104.154.91.216`
- Enable Cloudflare proxy
- Force HTTPS

Then update frontend:
```
VITE_API_URL=https://api.spytech.am/api
```

## Solution 2: Nginx Reverse Proxy with SSL

Install nginx on your server and configure SSL:

```nginx
# /etc/nginx/sites-available/spytech-api
server {
    listen 443 ssl http2;
    server_name api.spytech.am;
    
    ssl_certificate /etc/letsencrypt/live/api.spytech.am/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.spytech.am/privkey.pem;
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Solution 3: Website Meta Tag (Quick Fix)

Add this to your website's HTML head:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

This tells the browser to automatically upgrade HTTP requests to HTTPS.

## Solution 4: Update Vite Configuration

Add to your vite.config.ts:

```typescript
export default defineConfig({
  // ... existing config
  server: {
    https: false,
    cors: true,
    headers: {
      'Content-Security-Policy': 'upgrade-insecure-requests'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

## Solution 5: Use HTTPS with Let's Encrypt (Production)

### Step 1: Install Certbot
```bash
sudo apt update
sudo apt install certbot nginx
```

### Step 2: Get SSL Certificate
```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get certificate for api subdomain
sudo certbot certonly --standalone -d api.spytech.am
```

### Step 3: Configure Nginx
```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/spytech-api

# Enable site
sudo ln -s /etc/nginx/sites-available/spytech-api /etc/nginx/sites-enabled/

# Start nginx
sudo systemctl start nginx
```

## Quick Implementation: Meta Tag Solution

### Step 1: Add meta tag to your HTML
Edit your index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <title>SpyTech</title>
</head>
```

### Step 2: Update Vite config
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': 'upgrade-insecure-requests'
    }
  }
})
```

### Step 3: Rebuild and deploy
```bash
npm run build
# Deploy to S3
```

## Recommended Approach: Subdomain + Cloudflare

1. **DNS Setup**:
   - Point `api.spytech.am` to `104.154.91.216`
   - Enable Cloudflare proxy

2. **Cloudflare Rules**:
   - Force HTTPS redirect
   - Cache API responses

3. **Update Frontend**:
   ```
   VITE_API_URL=https://api.spytech.am/api
   ```

4. **Backend stays HTTP**:
   - Cloudflare handles HTTPS termination
   - Your backend runs on HTTP (port 3001)

This gives you proper HTTPS without certificate management! 🚀
