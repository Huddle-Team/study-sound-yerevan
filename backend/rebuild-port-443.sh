#!/bin/bash

echo "🔄 Rebuilding SpyTech API for port 443..."

# Make sure we're in the right directory
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: Dockerfile not found. Make sure you're in the backend directory."
    exit 1
fi

echo "🛑 Stopping and removing old container..."
docker stop spytech-api 2>/dev/null || true
docker rm spytech-api 2>/dev/null || true

echo "🗑️ Removing old image..."
docker rmi spytech-backend 2>/dev/null || true

echo "🔨 Building new image with port 443..."
docker build -t spytech-backend .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🚀 Starting new container on port 443..."
docker run -d \
  --name spytech-api \
  --privileged \
  -p 3001:3001 \
  -p 443:443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

if [ $? -ne 0 ]; then
    echo "❌ Container start failed!"
    exit 1
fi

echo "✅ Container started successfully!"

echo "📋 Container status:"
docker ps | grep spytech-api

echo ""
echo "📝 Container logs:"
docker logs spytech-api --tail 10

echo ""
echo "🧪 Testing endpoints..."
sleep 2

echo "Testing HTTP endpoint:"
curl -s http://localhost:3001/api/health || echo "❌ HTTP test failed"

echo ""
echo "Testing HTTPS endpoint:"
curl -k -s https://localhost:443/api/health || echo "❌ HTTPS test failed"

echo ""
echo "🌐 Testing subdomain (should work now):"
curl -k -s https://api.spytech.am/api/health || echo "❌ Subdomain test failed"

echo ""
echo "🎉 All done! Your API should now be accessible at:"
echo "   - HTTP:  http://api.spytech.am:3001/api"
echo "   - HTTPS: https://api.spytech.am/api"
