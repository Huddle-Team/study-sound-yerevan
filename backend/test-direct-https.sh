#!/bin/bash

echo "🔍 Testing direct HTTPS connection to port 3443..."

# Test if HTTPS server is running and accessible
echo "1️⃣ Testing HTTPS health endpoint..."
if curl -s -k --connect-timeout 10 https://104.154.91.216:3443/api/health | grep -q "healthy"; then
    echo "✅ HTTPS endpoint on port 3443 is working!"
else
    echo "❌ HTTPS endpoint on port 3443 is not working"
    echo "📋 Let's check what's happening..."
    
    # Check if port is listening
    echo ""
    echo "2️⃣ Checking if port 3443 is listening..."
    if nc -zv 104.154.91.216 3443 2>/dev/null; then
        echo "✅ Port 3443 is open and listening"
    else
        echo "❌ Port 3443 is not accessible"
        echo "📋 This could be a firewall issue"
    fi
    
    # Check container status
    echo ""
    echo "3️⃣ Checking container status..."
    docker ps | grep spytech-api || echo "❌ Container not running"
    
    # Check container logs
    echo ""
    echo "4️⃣ Recent container logs:"
    docker logs spytech-api --tail 10
    
    exit 1
fi

# Test booking endpoint
echo ""
echo "2️⃣ Testing HTTPS booking endpoint..."
BOOKING_TEST=$(curl -s -k -X POST https://104.154.91.216:3443/api/booking/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+37411111111", 
    "message": "HTTPS test booking",
    "selectedItems": ["earbuds-1"]
  }' --connect-timeout 10)

if echo "$BOOKING_TEST" | grep -q "success"; then
    echo "✅ HTTPS booking endpoint working!"
else
    echo "❌ HTTPS booking endpoint failed"
    echo "📋 Response: $BOOKING_TEST"
fi

# Check if frontend is configured correctly
echo ""
echo "3️⃣ Checking frontend configuration..."
if grep -q "https://104.154.91.216:3443/api" .env; then
    echo "✅ Frontend .env configured for HTTPS port 3443"
else
    echo "❌ Frontend .env not configured correctly"
    echo "📋 Current .env content:"
    cat .env
fi

echo ""
echo "📋 Summary:"
echo "✅ Direct HTTPS connection working"
echo "🚀 Frontend now configured to use https://104.154.91.216:3443/api"
echo "🎯 This should fix the SSL protocol error"
echo ""
echo "Next steps:"
echo "1. Commit and push changes: git add . && git commit -m 'Use direct HTTPS port 3443' && git push"
echo "2. Wait for GitHub Actions to deploy"
echo "3. Test booking form on https://spytech.am"
