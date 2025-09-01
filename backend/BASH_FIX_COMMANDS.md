# Quick Fix Commands for SSL Protocol Error

## Run these commands in your bash terminal (WSL/Git Bash):

```bash
# Navigate to backend directory
cd ~/study-sound-yerevan/backend

# Make script executable
chmod +x rebuild-with-https.sh

# Run the rebuild script
./rebuild-with-https.sh
```

## Alternative: Manual Commands

If the script doesn't work, run these commands one by one:

```bash
# Stop current container
docker stop spytech-api
docker rm spytech-api

# Remove old image to force rebuild
docker rmi spytech-backend

# Rebuild with HTTPS auto-SSL
docker build -t spytech-backend .

# Run new container with both HTTP and HTTPS
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

# Check logs to verify HTTPS server starts
docker logs spytech-api --tail 15

# Test both endpoints
curl http://localhost:3001/api/health
curl -k https://localhost:3443/api/health
```

## What to Look For

After rebuild, container logs should show:
```
🚀 Starting SpyTech API Server...
🌐 HTTP Server running on port 3001
🔐 Generating self-signed certificate...
✅ Self-signed certificate generated successfully
🔒 HTTPS Server running on port 3443
```

## Test Your Website

After rebuild:
1. Visit https://spytech.am
2. Try the booking form
3. Should work without SSL protocol errors!

The browser will upgrade HTTP requests to HTTPS, and your server will handle them properly on port 3443! 🚀
