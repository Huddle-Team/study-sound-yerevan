# Docker Build Fix Guide

## Issue: Docker build failing on npm ci

The build is failing because of dependency issues. Here are the solutions:

## Solution 1: Manual Fix (Quick)

```bash
cd backend

# 1. Clean up any existing containers/images
docker stop spytech-api 2>/dev/null || true
docker rm spytech-api 2>/dev/null || true
docker rmi spytech-backend 2>/dev/null || true

# 2. Install dependencies locally first
npm install

# 3. Build Docker image
docker build -t spytech-backend .

# 4. Run container
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend
```

## Solution 2: Test Build Script

```bash
chmod +x test-build.sh
./test-build.sh
```

## Solution 3: Alternative Dockerfile

If the build still fails, use this simpler approach:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN cp server-auto-ssl.js server.js
EXPOSE 3001 3443
CMD ["npm", "start"]
```

## Solution 4: Use npm install instead of npm ci

Edit the Dockerfile and change:
```dockerfile
RUN npm ci --only=production
```

To:
```dockerfile
RUN npm install --production
```

## Quick Commands to Try

```bash
# Option A: Simple rebuild
cd backend
docker build --no-cache -t spytech-backend .

# Option B: Use npm install
sed -i 's/npm ci --only=production/npm install --production/' Dockerfile
docker build -t spytech-backend .

# Option C: Install dependencies first
npm install
docker build -t spytech-backend .
```

## Expected Success Output

When working, you should see:
```
Successfully built [image-id]
Successfully tagged spytech-backend:latest
```

Try **Solution 1** first - it's the quickest fix! 🚀
