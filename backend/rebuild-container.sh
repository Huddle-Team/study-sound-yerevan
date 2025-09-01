#!/bin/bash

echo "🔄 Rebuilding and restarting SpyTech backend container..."

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop spytech-api 2>/dev/null || true
docker rm spytech-api 2>/dev/null || true

# Remove old image
echo "🗑️  Removing old image..."
docker rmi spytech-backend 2>/dev/null || true

# Rebuild image
echo "🏗️  Building new image..."
docker build -t spytech-backend .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Run new container
echo "🚀 Starting new container..."
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

if [ $? -eq 0 ]; then
    echo "✅ Container restarted successfully!"
    
    # Wait for container to start
    sleep 5
    
    echo "📊 Container status:"
    docker ps | grep spytech-api
    
    echo ""
    echo "📋 Recent logs:"
    docker logs spytech-api --tail 20
    
    echo ""
    echo "📡 Testing endpoints in 3 seconds..."
    sleep 3
    
    # Test HTTP endpoint
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ HTTP endpoint working: http://104.154.91.216:3001/api"
    else
        echo "❌ HTTP endpoint not responding"
    fi
    
    # Test HTTPS endpoint
    if curl -s -k https://localhost:3443/api/health > /dev/null; then
        echo "✅ HTTPS endpoint working: https://104.154.91.216:3443/api"
    else
        echo "❌ HTTPS endpoint not responding"
        echo "📋 Check logs: docker logs spytech-api"
    fi
    
else
    echo "❌ Failed to start container!"
    echo "📋 Check logs: docker logs spytech-api"
    exit 1
fi
