# HTTPS Troubleshooting Guide

## Issue: HTTPS endpoint not responding

Your container is running the old `server.js` instead of `server-https.js`. I've fixed the Dockerfile, but you need to rebuild.

## Quick Fix

Run this command to rebuild and restart with the correct HTTPS server:

```bash
# Make script executable and run
chmod +x rebuild-container.sh
./rebuild-container.sh
```

## Manual Fix Steps

If the script doesn't work, do this manually:

### Step 1: Stop and remove old container
```bash
docker stop spytech-api
docker rm spytech-api
docker rmi spytech-backend
```

### Step 2: Rebuild with fixed Dockerfile
```bash
docker build -t spytech-backend .
```

### Step 3: Run new container
```bash
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend
```

### Step 4: Check logs
```bash
docker logs spytech-api
```

## Expected Output (After Fix)

You should now see:
```
🚀 Starting SpyTech API Server...
📊 Environment: production
✅ Product data loaded successfully
🌐 HTTP Server running on port 3001
📡 Health check: http://104.154.91.216:3001/api/health
🔒 HTTPS Server running on port 3443
📡 Health check: https://104.154.91.216:3443/api/health
```

## Common Issues & Solutions

### 1. SSL Certificate Missing
**Error**: `Could not start HTTPS server: ENOENT: no such file or directory, open 'ssl/private.key'`

**Solution**:
```bash
# Generate SSL certificates
./generate-ssl.sh
# Then rebuild container
./rebuild-container.sh
```

### 2. Port Already in Use
**Error**: `Port 3443 is already in use`

**Solution**:
```bash
# Find what's using the port
sudo netstat -tlnp | grep :3443
# Kill the process
sudo kill $(sudo lsof -t -i:3443)
# Restart container
docker restart spytech-api
```

### 3. Environment Variables Missing
**Error**: Missing Telegram credentials

**Solution**:
```bash
# Check .env file exists and has correct values
cat .env
# Should contain:
# TELEGRAM_BOT_TOKEN=your_actual_token
# TELEGRAM_CHAT_ID=your_actual_chat_id
```

### 4. Container Won't Start
**Solution**:
```bash
# Check detailed logs
docker logs spytech-api --tail 50

# Check container status
docker ps -a | grep spytech-api

# Try running interactively for debugging
docker run -it --rm -p 3001:3001 -p 3443:3443 --env-file .env spytech-backend
```

## Test Commands

After rebuilding, test both endpoints:

```bash
# Test HTTP
curl -v http://104.154.91.216:3001/api/health

# Test HTTPS (ignore certificate warnings)
curl -v -k https://104.154.91.216:3443/api/health

# Test from container
docker exec spytech-api curl -s http://localhost:3001/api/health
docker exec spytech-api curl -s -k https://localhost:3443/api/health
```

## Success Indicators

✅ Both HTTP and HTTPS endpoints respond  
✅ Container logs show both servers starting  
✅ No SSL certificate errors  
✅ Frontend can connect without mixed content errors  

Run `./rebuild-container.sh` now to fix the issue! 🚀
