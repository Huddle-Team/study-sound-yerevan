# Certificate Authority Invalid - Final Solution

## ✅ Progress Made!
- SSL protocol error is FIXED
- HTTPS connection is working
- Browser is rejecting self-signed certificate (expected)

## Solution 1: Accept Certificate (Quick Test)

### For immediate testing:
1. Open in new tab: https://104.154.91.216:3443/api/health
2. Click "Advanced" → "Proceed to 104.154.91.216 (unsafe)"
3. Return to https://spytech.am and test booking form
4. Should work immediately!

## Solution 2: Disable Certificate Validation (Development)

Add this to your frontend fetch calls (temporary):

```javascript
// Add to booking form request
const response = await fetch('https://104.154.91.216:3443/api/booking/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  // This won't work in browser, but shows the concept
});
```

## Solution 3: Production SSL Certificate (Recommended)

### Option A: Let's Encrypt (Free)
```bash
# On your server
sudo apt update
sudo apt install certbot

# Get certificate (requires domain)
sudo certbot certonly --standalone -d api.spytech.am

# Update your DNS: api.spytech.am → 104.154.91.216
# Then use: https://api.spytech.am/api
```

### Option B: Cloudflare Proxy (Easiest)
1. Add `api.spytech.am` to DNS pointing to `104.154.91.216`
2. Enable Cloudflare proxy (orange cloud)
3. Set SSL/TLS to "Flexible" or "Full"
4. Update frontend: `VITE_API_URL=https://api.spytech.am/api`

## Solution 4: Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name api.spytech.am;
    
    ssl_certificate /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
    }
}
```

## Quick Test Solution (Immediate)

### Step 1: Accept the certificate
Visit: https://104.154.91.216:3443/api/health
Accept the security warning

### Step 2: Test booking form
Go to https://spytech.am and try booking - should work!

## Recommended Production Setup

1. **Add subdomain**: Point `api.spytech.am` to your server
2. **Use Cloudflare**: Enable proxy for automatic SSL
3. **Update frontend**: Use domain instead of IP
4. **No certificate management**: Cloudflare handles everything

## Commands for Cloudflare Setup

```bash
# Update frontend to use subdomain
echo "VITE_API_URL=https://api.spytech.am/api" > .env

# Update GitHub Actions
# (I can update this for you)

# DNS Settings:
# api.spytech.am A 104.154.91.216 (Proxied: Yes)
```

The certificate error is normal for self-signed certs. For immediate testing, just accept the certificate manually! 🚀
