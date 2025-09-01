#!/bin/bash

# SpyTech Backend Deployment Script

echo "🚀 Starting SpyTech Backend Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Build and start the application
echo "📦 Building Docker images..."
docker-compose build

echo "🏃 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if API is responding
echo "🔍 Checking API health..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is running successfully!"
    echo "🌐 API URL: http://localhost:3001/api"
    echo "📊 Health Check: http://localhost:3001/api/health"
    echo "🧪 Test Endpoint: http://localhost:3001/api/telegram/test"
else
    echo "❌ Backend API is not responding. Checking logs..."
    docker-compose logs spytech-api
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Useful commands:"
echo "  docker-compose logs -f spytech-api  # View logs"
echo "  docker-compose stop                 # Stop services"
echo "  docker-compose restart spytech-api  # Restart API"
echo "  docker-compose down                 # Stop and remove containers"
echo ""
