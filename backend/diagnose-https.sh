#!/bin/bash

echo "🔍 Diagnosing HTTPS connectivity issue..."

# Check if we're running on the server
if [ "$(hostname -I | grep -o '104.154.91.216')" ]; then
    echo "✅ Running on the target server"
else
    echo "⚠️  This script should be run on the server (104.154.91.216)"
fi

echo ""
echo "1️⃣ Checking if HTTPS port is listening..."
if netstat -tlnp 2>/dev/null | grep -q ":3443"; then
    echo "✅ Port 3443 is listening"
    netstat -tlnp | grep ":3443"
else
    echo "❌ Port 3443 is not listening"
    echo "📋 Container might not be running properly"
fi

echo ""
echo "2️⃣ Checking Docker container status..."
if docker ps | grep -q spytech-api; then
    echo "✅ Container is running"
    docker ps | grep spytech-api
else
    echo "❌ Container is not running"
    echo "📋 Start with: docker start spytech-api"
fi

echo ""
echo "3️⃣ Testing local HTTPS connectivity..."
if curl -s -k --connect-timeout 5 https://localhost:3443/api/health > /dev/null; then
    echo "✅ Local HTTPS connection works"
else
    echo "❌ Local HTTPS connection failed"
    echo "📋 Check container logs: docker logs spytech-api"
fi

echo ""
echo "4️⃣ Checking firewall status..."
if command -v ufw &> /dev/null; then
    echo "🔥 UFW Firewall status:"
    sudo ufw status | grep -E "(Status|3443)" || echo "Port 3443 not allowed"
    
    if ! sudo ufw status | grep -q "3443"; then
        echo ""
        echo "🔧 FIXING: Opening port 3443 in firewall..."
        sudo ufw allow 3443
        sudo ufw reload
        echo "✅ Port 3443 opened in firewall"
    fi
    
elif command -v firewall-cmd &> /dev/null; then
    echo "🔥 FirewallD status:"
    sudo firewall-cmd --list-ports | grep 3443 || echo "Port 3443 not open"
    
    if ! sudo firewall-cmd --list-ports | grep -q "3443"; then
        echo ""
        echo "🔧 FIXING: Opening port 3443 in firewall..."
        sudo firewall-cmd --permanent --add-port=3443/tcp
        sudo firewall-cmd --reload
        echo "✅ Port 3443 opened in firewall"
    fi
    
else
    echo "⚠️  No common firewall detected (ufw/firewalld)"
    echo "💡 You may need to manually configure your firewall"
fi

echo ""
echo "5️⃣ Testing external HTTPS connectivity..."
if curl -s -k --connect-timeout 10 https://104.154.91.216:3443/api/health > /dev/null; then
    echo "✅ External HTTPS connection works!"
    echo "🎉 Your frontend should now work"
else
    echo "❌ External HTTPS connection still failing"
    echo ""
    echo "🔧 Additional troubleshooting needed:"
    echo "   - Check cloud provider firewall (GCP/AWS/Azure)"
    echo "   - Verify Docker port binding: docker port spytech-api"
    echo "   - Check container logs: docker logs spytech-api"
fi

echo ""
echo "6️⃣ Container logs (last 10 lines):"
docker logs spytech-api --tail 10

echo ""
echo "7️⃣ Port binding verification:"
docker port spytech-api 2>/dev/null || echo "❌ Could not get port information"

echo ""
echo "📋 Summary:"
echo "   - HTTP (3001): $(curl -s --connect-timeout 3 http://localhost:3001/api/health &>/dev/null && echo "✅ Working" || echo "❌ Failed")"
echo "   - HTTPS Local (3443): $(curl -s -k --connect-timeout 3 https://localhost:3443/api/health &>/dev/null && echo "✅ Working" || echo "❌ Failed")"
echo "   - HTTPS External (3443): $(curl -s -k --connect-timeout 5 https://104.154.91.216:3443/api/health &>/dev/null && echo "✅ Working" || echo "❌ Failed")"

echo ""
echo "🔄 If external HTTPS still fails, try:"
echo "   1. Check cloud provider security groups"
echo "   2. Restart Docker container: docker restart spytech-api"
echo "   3. Use alternative port 443: sudo docker run -p 443:3443 ..."
