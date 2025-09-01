#!/bin/bash

# SpyTech Backend Docker Deployment Script
echo "🚀 Deploying SpyTech Backend with Docker..."

# Check if we're in the right directory
if [ ! -f "server-https.js" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Step 1: Generate SSL certificates if they don't exist
if [ ! -f "ssl/private.key" ] || [ ! -f "ssl/certificate.crt" ]; then
    echo "🔐 Generating SSL certificates..."
    chmod +x generate-ssl.sh
    ./generate-ssl.sh
fi

# Step 2: Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env template - PLEASE UPDATE WITH YOUR VALUES!"
    cat > .env << EOF
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
NODE_ENV=production
PORT=3001
HTTPS_PORT=3443
EOF
    echo "📝 Please edit .env file with your actual Telegram credentials"
    echo "   Then run this script again"
    exit 1
fi

# Step 3: Stop existing container if running
if docker ps -q -f name=spytech-api | grep -q .; then
    echo "🛑 Stopping existing container..."
    docker stop spytech-api
    docker rm spytech-api
fi

# Step 4: Build Docker image
echo "🏗️  Building Docker image..."
docker build -t spytech-backend .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Step 5: Run container
echo "🚀 Starting container..."
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    
    # Wait a moment for container to start
    sleep 3
    
    # Check container status
    echo "📊 Container status:"
    docker ps | grep spytech-api
    
    echo ""
    echo "📡 Testing endpoints..."
    
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
    fi
    
    echo ""
    echo "🎉 Deployment complete!"
    echo "📱 Your frontend will now work without mixed content errors"
    echo "📋 View logs: docker logs -f spytech-api"
    
else
    echo "❌ Failed to start container!"
    echo "📋 Check logs: docker logs spytech-api"
    exit 1
fi
