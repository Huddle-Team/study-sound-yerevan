#!/bin/bash

echo "🔧 Rebuilding SpyTech Backend Docker Container..."

# Navigate to backend directory
cd /mnt/c/Users/gor_gevorgyan1/study-sound-yerevan/backend

# Stop and remove existing container
echo "🛑 Stopping existing container..."
sudo docker stop backedn 2>/dev/null || echo "Container not running"
sudo docker rm backedn 2>/dev/null || echo "Container not found"

# Remove old image to force rebuild
echo "🗑️ Removing old image..."
sudo docker rmi spytech-backend 2>/dev/null || echo "Image not found"

# Build new image
echo "🔨 Building new Docker image..."
sudo docker build -t spytech-backend .

# Run new container
echo "🚀 Starting new container..."
sudo docker run -d \
  --name backedn \
  -p 3001:3001 \
  -p 443:443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

# Check container status
echo "📊 Container status:"
sudo docker ps | grep backedn

echo "✅ Docker container rebuild complete!"
echo "🔍 Check logs with: sudo docker logs backedn"
echo "🌐 Test with: curl http://localhost:3001/api/health"
