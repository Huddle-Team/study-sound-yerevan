# SpyTech Backend - Docker Deployment Guide

Complete guide for deploying the SpyTech Telegram API backend using Docker.

## 🎯 Production Architecture

```
Internet → Nginx (Port 80/443) → Docker Container (Port 3001) → Telegram API
```

- **Frontend**: `https://spytech.am` (S3 Static Website)
- **Backend API**: `https://api.spytech.am` (Your Docker Server)
- **Telegram Bot**: Secure server-side integration

## 📋 Prerequisites

1. **Server Requirements**:
   - Ubuntu 20.04+ or CentOS 7+
   - 1GB RAM minimum (2GB recommended)
   - 10GB disk space
   - Docker & Docker Compose installed

2. **Domain Setup**:
   - `spytech.am` → S3 static website
   - `api.spytech.am` → Your server IP

3. **SSL Certificate**:
   - Get SSL certificate for `api.spytech.am`
   - Place certificates in `ssl/` directory

## 🚀 Quick Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Logout and login again for group changes to take effect
```

### 2. Deploy Application

```bash
# Clone or upload your backend files to server
# Navigate to backend directory
cd /path/to/backend

# Configure environment
cp .env.example .env
nano .env  # Edit with your values

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Environment Configuration

Edit `.env` file with your production values:

```bash
# Backend Environment Variables
PORT=3001

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_actual_bot_token
TELEGRAM_CHAT_ID=your_actual_chat_id

# Frontend URL (for CORS)
FRONTEND_URL=https://spytech.am

# Security
NODE_ENV=production
```

## 🔧 Manual Docker Commands

### Build and Run
```bash
# Build the image
docker build -t spytech-api .

# Run container
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  --env-file .env \
  -v $(pwd)/data:/app/data:ro \
  --restart unless-stopped \
  spytech-api
```

### Using Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f spytech-api

# Stop services
docker-compose down

# Restart API only
docker-compose restart spytech-api

# Update and redeploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 SSL Setup with Nginx

### 1. Get SSL Certificate

```bash
# Using Let's Encrypt (recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d api.spytech.am

# Copy certificates
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/api.spytech.am/fullchain.pem ssl/spytech.am.crt
sudo cp /etc/letsencrypt/live/api.spytech.am/privkey.pem ssl/spytech.am.key
sudo chown $USER:$USER ssl/*
```

### 2. Enable Nginx Service

Uncomment the nginx section in `docker-compose.yml` and run:

```bash
docker-compose up -d
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check API health
curl https://api.spytech.am/api/health

# Test Telegram integration
curl -X POST https://api.spytech.am/api/telegram/test
```

### View Logs
```bash
# Real-time logs
docker-compose logs -f spytech-api

# Last 100 lines
docker-compose logs --tail=100 spytech-api

# Error logs only
docker-compose logs spytech-api 2>&1 | grep -i error
```

### Update Deployment
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🛡️ Security Features

- ✅ **Container Security**: Non-root user, minimal image
- ✅ **Rate Limiting**: 10 requests/second with burst
- ✅ **CORS Protection**: Only allows spytech.am origin
- ✅ **SSL/TLS**: HTTPS only with modern protocols
- ✅ **Security Headers**: XSS, CSRF, and content type protection
- ✅ **Health Monitoring**: Built-in health checks

## 🔧 Troubleshooting

### Common Issues

1. **API not responding**:
   ```bash
   docker-compose logs spytech-api
   # Check for port conflicts or environment issues
   ```

2. **Telegram 401 Unauthorized**:
   ```bash
   # Verify bot token in .env file
   # Check if bot is active and chat ID is correct
   ```

3. **CORS errors**:
   ```bash
   # Ensure FRONTEND_URL matches your domain exactly
   # Check nginx CORS headers
   ```

4. **SSL certificate issues**:
   ```bash
   # Verify certificate files exist and are readable
   # Check nginx configuration
   ```

### Performance Optimization

```bash
# View container stats
docker stats spytech-api

# Monitor resource usage
docker-compose exec spytech-api top

# Restart if needed
docker-compose restart spytech-api
```

## 📱 Frontend Configuration

Update your frontend `.env` for production:

```bash
# Frontend .env
VITE_API_URL=https://api.spytech.am/api
```

Build and deploy to S3:

```bash
npm run build
# Upload dist/ contents to S3 bucket for spytech.am
```

## 🎉 Production Checklist

- [ ] Server has Docker and Docker Compose installed
- [ ] Domain `api.spytech.am` points to your server
- [ ] SSL certificate is installed and valid
- [ ] `.env` file is configured with production values
- [ ] Docker containers are running and healthy
- [ ] API health check returns 200 OK
- [ ] Telegram test endpoint works
- [ ] Frontend is deployed to S3 with correct API URL
- [ ] Booking form submissions work end-to-end

Your SpyTech backend is now production-ready with enterprise-grade security and monitoring! 🚀
