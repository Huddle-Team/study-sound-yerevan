# HTTPS Backend Setup Guide

## Problem
Your website (`https://spytech.am`) is served over HTTPS, but the backend API (`http://104.154.91.216:3001`) uses HTTP. Modern browsers block these "mixed content" requests for security.

## Solution: Enable HTTPS on Backend

### Option 1: Quick Setup with Self-Signed Certificates

#### Step 1: Generate SSL Certificates

**On Linux/WSL:**
```bash
cd backend
chmod +x generate-ssl.sh
./generate-ssl.sh
```

**On Windows (PowerShell):**
```powershell
cd backend
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\generate-ssl.ps1
```

#### Step 2: Start HTTPS Server

```bash
cd backend
node server-https.js
```

The server will now run on:
- HTTP: `http://104.154.91.216:3001` 
- HTTPS: `https://104.154.91.216:3443`

#### Step 3: Update Frontend Configuration

✅ Already updated:
- `.env`: `VITE_API_URL=https://104.154.91.216:3443/api`
- GitHub Actions: Uses HTTPS URL for builds

#### Step 4: Handle Browser Warning

Since we're using self-signed certificates, browsers will show a security warning. Users need to:

1. Visit `https://104.154.91.216:3443/api/health` 
2. Click "Advanced" → "Proceed to 104.154.91.216 (unsafe)"
3. This allows the browser to accept the self-signed certificate

### Option 2: Production Setup with Let's Encrypt (Recommended)

For production, use a proper SSL certificate:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Get certificate for your domain
sudo certbot certonly --standalone -d api.spytech.am

# Certificates will be in:
# /etc/letsencrypt/live/api.spytech.am/fullchain.pem
# /etc/letsencrypt/live/api.spytech.am/privkey.pem
```

Then update `server-https.js` to use these certificates:

```javascript
const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.spytech.am/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.spytech.am/fullchain.pem')
};
```

### Option 3: Alternative - Use HTTP Website

If HTTPS setup is complex, you can serve your website over HTTP instead:

1. Configure S3 bucket for HTTP-only
2. Update `.env`: `VITE_API_URL=http://104.154.91.216:3001/api`
3. Access website via `http://spytech.am` instead of `https://spytech.am`

## Docker Deployment

The updated Docker setup supports both HTTP and HTTPS:

```bash
# Build with SSL support
docker build -t spytech-backend .

# Run with port mapping for both protocols
docker run -d \
  -p 3001:3001 \
  -p 3443:3443 \
  --name spytech-api \
  spytech-backend
```

## Testing

Test both endpoints:

```bash
# HTTP health check
curl http://104.154.91.216:3001/api/health

# HTTPS health check (with self-signed cert)
curl -k https://104.154.91.216:3443/api/health
```

## Current Status

✅ **HTTPS server code**: `server-https.js` created  
✅ **SSL generation scripts**: Ready for both Windows/Linux  
✅ **Environment updated**: Uses `https://104.154.91.216:3443/api`  
✅ **GitHub Actions updated**: Builds with HTTPS URL  
✅ **Docker support**: Both HTTP/HTTPS ports exposed  

## Next Steps

1. **Generate SSL certificates** using the provided scripts
2. **Start the HTTPS server** with `node server-https.js`
3. **Handle browser warning** for self-signed certificates
4. **Test the booking form** on your live website

The mixed content error will be resolved once the backend serves over HTTPS! 🔒
