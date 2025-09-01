#!/bin/bash

echo "🔄 Updating backend container with api.spytech.am support..."

# Navigate to backend directory
cd backend

# Stop current container
echo "🛑 Stopping current container..."
docker stop spytech-api 2>/dev/null || true
docker rm spytech-api 2>/dev/null || true

# Remove old image to force rebuild with new CORS settings
echo "🗑️  Removing old image..."
docker rmi spytech-backend 2>/dev/null || true

# Rebuild with updated CORS settings
echo "🏗️  Building container with api.spytech.am CORS support..."
docker build -t spytech-backend .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Run new container
echo "🚀 Starting updated container..."
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    
    # Wait for container to start
    sleep 5
    
    echo "📋 Container logs:"
    docker logs spytech-api --tail 10
    
    echo ""
    echo "📡 Testing endpoints..."
    
    # Test HTTP
    if curl -s http://localhost:3001/api/health | grep -q "healthy"; then
        echo "✅ HTTP endpoint working"
    else
        echo "❌ HTTP endpoint failed"
    fi
    
    # Test HTTPS
    if curl -s -k https://localhost:3443/api/health | grep -q "healthy"; then
        echo "✅ HTTPS endpoint working"
    else
        echo "❌ HTTPS endpoint failed"
    fi
    
    echo ""
    echo "🎉 Backend updated successfully!"
    echo "📝 CORS now allows requests from:"
    echo "   - https://spytech.am"
    echo "   - https://api.spytech.am"
    echo "   - Development servers"
    
else
    echo "❌ Failed to start container!"
    exit 1
fi
