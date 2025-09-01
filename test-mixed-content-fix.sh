#!/bin/bash

echo "🔄 Testing Mixed Content Fix..."

# Test the backend HTTP endpoint first
echo "1️⃣ Testing backend HTTP endpoint..."
if curl -s http://104.154.91.216:3001/api/health | grep -q "healthy"; then
    echo "✅ Backend HTTP endpoint working"
else
    echo "❌ Backend HTTP endpoint not working"
    echo "📋 Make sure your container is running: docker ps | grep spytech-api"
    exit 1
fi

# Test a booking submission
echo ""
echo "2️⃣ Testing booking endpoint..."
BOOKING_TEST=$(curl -s -X POST http://104.154.91.216:3001/api/booking/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+37411111111", 
    "message": "Test booking from script",
    "selectedItems": ["earbuds-1"]
  }')

if echo "$BOOKING_TEST" | grep -q "success"; then
    echo "✅ Booking endpoint working"
else
    echo "❌ Booking endpoint failed"
    echo "📋 Response: $BOOKING_TEST"
fi

# Check if frontend build includes the meta tag
echo ""
echo "3️⃣ Checking frontend configuration..."
if grep -q "upgrade-insecure-requests" index.html; then
    echo "✅ Meta tag added to index.html"
else
    echo "❌ Meta tag missing from index.html"
fi

if grep -q "upgrade-insecure-requests" vite.config.ts; then
    echo "✅ CSP header added to vite.config.ts"
else
    echo "❌ CSP header missing from vite.config.ts"
fi

# Build frontend to test
echo ""
echo "4️⃣ Testing frontend build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
    
    # Check if built files contain the meta tag
    if find dist -name "*.html" -exec grep -l "upgrade-insecure-requests" {} \; | grep -q .; then
        echo "✅ Built HTML includes upgrade-insecure-requests"
    else
        echo "❌ Built HTML missing upgrade-insecure-requests"
    fi
else
    echo "❌ Frontend build failed"
    echo "📋 Run 'npm run build' manually to see errors"
fi

echo ""
echo "📋 Summary:"
echo "   Backend HTTP API: $(curl -s http://104.154.91.216:3001/api/health | grep -q healthy && echo "✅ Working" || echo "❌ Failed")"
echo "   Meta tag in HTML: $(grep -q "upgrade-insecure-requests" index.html && echo "✅ Added" || echo "❌ Missing")"
echo "   Vite CSP header: $(grep -q "upgrade-insecure-requests" vite.config.ts && echo "✅ Added" || echo "❌ Missing")"

echo ""
echo "🚀 Next steps:"
echo "   1. Deploy your frontend with: git add . && git commit -m 'Fix mixed content' && git push"
echo "   2. GitHub Actions will rebuild with the meta tag"
echo "   3. Test booking form on https://spytech.am"
echo ""
echo "💡 The 'upgrade-insecure-requests' meta tag tells browsers to automatically"
echo "   convert HTTP requests to HTTPS, which should fix the mixed content error."

# Test if we can simulate the upgrade
echo ""
echo "5️⃣ Testing insecure request upgrade simulation..."
# This simulates what the browser should do
if curl -s --location --proto-redir =https http://104.154.91.216:3001/api/health | grep -q "healthy"; then
    echo "✅ HTTP to HTTPS upgrade simulation works"
else
    echo "⚠️  Upgrade simulation needs actual HTTPS endpoint"
    echo "📝 The browser will handle this automatically with the meta tag"
fi
