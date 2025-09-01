#!/bin/bash

echo "🔄 Rebuilding container with HTTPS auto-SSL server..."

# Stop current container
echo "🛑 Stopping current container..."
docker stop spytech-api
docker rm spytech-api

# Remove old image to force rebuild
echo "🗑️  Removing old image..."
docker rmi spytech-backend

# Rebuild with auto-SSL server
echo "🏗️  Building image with auto-SSL server..."
docker build -t spytech-backend .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Run new container
echo "🚀 Starting container with HTTPS support..."
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
    docker logs spytech-api --tail 15
    
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
        echo "🔒 SSL certificate auto-generated successfully!"
    else
        echo "❌ HTTPS endpoint failed"
        echo "📋 Check logs above for SSL certificate generation"
    fi
else
    echo "❌ Failed to start container!"
    exit 1
fi
