#!/bin/bash

echo "🔍 Testing api.spytech.am DNS and SSL setup..."

# Test DNS resolution
echo "1️⃣ Testing DNS resolution..."
DNS_RESULT=$(nslookup api.spytech.am 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
if [ "$DNS_RESULT" = "104.154.91.216" ]; then
    echo "✅ DNS resolves correctly: api.spytech.am → 104.154.91.216"
elif [ -n "$DNS_RESULT" ]; then
    echo "⚠️  DNS resolves to: $DNS_RESULT (should be 104.154.91.216)"
    echo "💡 May need a few minutes for DNS propagation"
else
    echo "❌ DNS not resolving yet"
    echo "💡 DNS propagation can take 5-15 minutes"
fi

# Test HTTPS connection to subdomain
echo ""
echo "2️⃣ Testing HTTPS connection to api.spytech.am..."
if curl -s --connect-timeout 10 https://api.spytech.am/api/health | grep -q "healthy"; then
    echo "✅ HTTPS connection to api.spytech.am working!"
    echo "🔒 SSL certificate is valid (Cloudflare or Let's Encrypt)"
else
    echo "❌ HTTPS connection to api.spytech.am failed"
    echo "💡 This could be due to:"
    echo "   - DNS still propagating"
    echo "   - Cloudflare proxy not enabled"
    echo "   - SSL not configured"
    
    # Fallback test to IP
    echo ""
    echo "🔄 Testing fallback to IP address..."
    if curl -s -k --connect-timeout 10 https://104.154.91.216:3443/api/health | grep -q "healthy"; then
        echo "✅ Direct IP HTTPS still working"
        echo "💡 Just need to wait for DNS/SSL propagation"
    else
        echo "❌ Direct IP HTTPS also failing"
    fi
fi

# Test booking endpoint on subdomain
echo ""
echo "3️⃣ Testing booking endpoint on api.spytech.am..."
BOOKING_TEST=$(curl -s -X POST https://api.spytech.am/api/booking/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DNS Test User",
    "phone": "+37411111111", 
    "message": "Testing api.spytech.am subdomain",
    "selectedItems": ["earbuds-1"]
  }' --connect-timeout 10)

if echo "$BOOKING_TEST" | grep -q "success"; then
    echo "✅ Booking endpoint working on api.spytech.am!"
else
    echo "❌ Booking endpoint not working yet"
    echo "📋 Response: $BOOKING_TEST"
fi

# Check frontend configuration
echo ""
echo "4️⃣ Checking frontend configuration..."
if grep -q "https://api.spytech.am/api" .env; then
    echo "✅ Frontend configured for api.spytech.am"
else
    echo "❌ Frontend not configured correctly"
    echo "📋 Updating .env file..."
    echo "VITE_API_URL=https://api.spytech.am/api" > .env
    echo "✅ Frontend .env updated"
fi

# Check backend container
echo ""
echo "5️⃣ Checking backend container status..."
if docker ps | grep -q spytech-api; then
    echo "✅ Backend container running"
    
    # Check if it has both HTTP and HTTPS
    echo "📋 Recent container logs:"
    docker logs spytech-api --tail 5
else
    echo "❌ Backend container not running"
    echo "🔧 Starting backend container..."
    
    cd backend
    docker run -d \
      --name spytech-api \
      -p 3001:3001 \
      -p 3443:3443 \
      --env-file .env \
      --restart unless-stopped \
      spytech-backend
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend container started"
        sleep 3
        docker logs spytech-api --tail 5
    else
        echo "❌ Failed to start backend container"
    fi
fi

echo ""
echo "📋 Summary:"
echo "   DNS Resolution: $(nslookup api.spytech.am 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1 || echo "Not resolved")"
echo "   HTTPS Health: $(curl -s --connect-timeout 5 https://api.spytech.am/api/health >/dev/null 2>&1 && echo "✅ Working" || echo "❌ Failed")"
echo "   Frontend Config: $(grep -q "api.spytech.am" .env && echo "✅ Correct" || echo "❌ Needs update")"
echo "   Backend Container: $(docker ps | grep -q spytech-api && echo "✅ Running" || echo "❌ Not running")"

echo ""
echo "🚀 Next steps:"
if curl -s --connect-timeout 5 https://api.spytech.am/api/health >/dev/null 2>&1; then
    echo "1. ✅ DNS and SSL working - ready to deploy!"
    echo "2. Run: git add . && git commit -m 'Use api.spytech.am subdomain' && git push"
    echo "3. Wait for GitHub Actions to deploy (~2 minutes)"
    echo "4. Test booking form on https://spytech.am"
else
    echo "1. ⏳ Wait a few more minutes for DNS propagation"
    echo "2. Check Cloudflare proxy is enabled (orange cloud)"
    echo "3. Verify SSL/TLS mode is set to 'Flexible' or 'Full'"
    echo "4. Re-run this test: ./test-subdomain-setup.sh"
fi
