# Manual Commands to Update Backend

Since the script had a directory issue, here are the manual commands to run from the backend directory:

```bash
# Make sure you're in the backend directory and Dockerfile exists
pwd
ls -la Dockerfile

# Stop current container
docker stop spytech-api
docker rm spytech-api

# Remove old image
docker rmi spytech-backend

# Build new image with updated CORS
docker build -t spytech-backend .

# Run new container (need --privileged for port 443)
docker run -d \
  --name spytech-api \
  --privileged \
  -p 3001:3001 \
  -p 443:443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

# Check if it's running
docker ps | grep spytech-api

# Check logs
docker logs spytech-api --tail 10

# Test endpoints
curl http://localhost:3001/api/health
curl -k https://localhost:443/api/health
```

## Expected Output

You should see logs like:
```
🚀 Starting SpyTech API Server...
🌐 HTTP Server running on port 3001
🔒 HTTPS Server running on port 443
```

## Test api.spytech.am

After the container is running, test the subdomain:

```bash
# Test DNS resolution
nslookup api.spytech.am

# Test HTTPS connection
curl https://api.spytech.am/api/health
```

Run these commands manually and let me know the output! 🚀
