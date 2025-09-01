#!/bin/bash

echo "🔄 Switching back to HTTP with mixed content support..."

# Stop the current container
echo "🛑 Stopping HTTPS container..."
docker stop spytech-api 2>/dev/null || true
docker rm spytech-api 2>/dev/null || true

# Run with the original HTTP server (with mixed content headers)
echo "🚀 Starting HTTP server with mixed content support..."
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

if [ $? -eq 0 ]; then
    echo "✅ HTTP container started successfully!"
    
    # Wait for container to start
    sleep 3
    
    echo "📊 Container status:"
    docker ps | grep spytech-api
    
    echo ""
    echo "📋 Container logs:"
    docker logs spytech-api --tail 10
    
    echo ""
    echo "📡 Testing HTTP endpoint..."
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ HTTP endpoint working: http://104.154.91.216:3001/api"
        echo ""
        echo "🎉 Setup complete!"
        echo "📱 Your frontend should now work with HTTP API"
        echo "🔒 Note: This uses HTTP API with HTTPS frontend (common setup)"
        echo ""
        echo "📋 To test:"
        echo "   1. Deploy your frontend with updated .env"
        echo "   2. Test the booking form on https://spytech.am"
        echo "   3. Check network tab - should show HTTP requests succeeding"
    else
        echo "❌ HTTP endpoint not responding"
        echo "📋 Check logs: docker logs spytech-api"
    fi
else
    echo "❌ Failed to start container!"
    exit 1
fi
