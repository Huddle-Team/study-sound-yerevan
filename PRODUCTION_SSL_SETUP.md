# Production SSL Setup with Subdomain

## 🎯 Best Solution: Use api.spytech.am

I've updated your configuration to use `https://api.spytech.am/api` instead of the IP address. This provides:

✅ **Automatic SSL** (via Cloudflare)  
✅ **No certificate warnings**  
✅ **Professional setup**  
✅ **Easy maintenance**

## Step 1: DNS Configuration

Add this DNS record in your domain provider (or Cloudflare):

```
Type: A
Name: api
Value: 104.154.91.216
Proxy: Yes (Orange cloud in Cloudflare)
TTL: Auto
```

## Step 2: Cloudflare SSL Settings

1. Go to SSL/TLS → Overview
2. Set encryption mode to **"Flexible"** or **"Full"**
3. Enable **"Always Use HTTPS"**
4. Enable **"Automatic HTTPS Rewrites"**

## Step 3: Test DNS Resolution

```bash
# Test if DNS is working
nslookup api.spytech.am
# Should return: 104.154.91.216

# Test HTTPS (may take a few minutes for DNS to propagate)
curl https://api.spytech.am/api/health
```

## Step 4: Deploy Updated Frontend

```bash
# Commit the changes
git add .
git commit -m "Use api.spytech.am subdomain for automatic SSL"
git push
```

## Alternative: Quick Test with IP (Immediate)

If you want to test immediately while setting up DNS:

### Accept Certificate Method:
1. Open: https://104.154.91.216:3443/api/health
2. Click "Advanced" → "Proceed to 104.154.91.216 (unsafe)"  
3. Test booking form on https://spytech.am
4. Should work immediately!

### Temporary HTTP Method:
```bash
# Temporarily use HTTP for testing
echo "VITE_API_URL=http://104.154.91.216:3001/api" > .env
```

## What I Updated

✅ **Frontend**: Now uses `https://api.spytech.am/api`  
✅ **GitHub Actions**: Builds with subdomain URL  
✅ **Backend CORS**: Allows requests from subdomain  
✅ **Documentation**: Complete setup guide

## Expected Timeline

- **DNS Setup**: 5-10 minutes
- **SSL Certificate**: Automatic (Cloudflare)
- **Frontend Deploy**: ~2 minutes (GitHub Actions)
- **Total**: Working in ~15 minutes

## Benefits of Subdomain Approach

🔒 **Real SSL Certificate** - No browser warnings  
🚀 **Better Performance** - Cloudflare CDN  
🛡️ **DDoS Protection** - Cloudflare security  
📊 **Analytics** - Cloudflare insights  
🔧 **Easy Management** - No certificate renewal

Set up the DNS record and your booking form will work perfectly! 🚀
