# Docker Setup Guide for SpyTech Backend

## Prerequisites

1. **Docker installed** on your server
2. **SSL certificates generated** (see HTTPS_SETUP.md)
3. **Environment variables** configured

## Step 1: Generate SSL Certificates

First, generate SSL certificates on your server:

```bash
# On your server (104.154.91.216)
cd /path/to/your/project/backend

# Generate SSL certificates
chmod +x generate-ssl.sh
./generate-ssl.sh
```

This creates:
- `backend/ssl/private.key`
- `backend/ssl/certificate.crt`

## Step 2: Set Environment Variables

Create a `.env` file in the backend directory:

```bash
# backend/.env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
NODE_ENV=production
PORT=3001
HTTPS_PORT=3443
```

## Step 3: Build Docker Image

```bash
# Navigate to backend directory
cd backend

# Build the Docker image
docker build -t spytech-backend .

# Verify the image was created
docker images | grep spytech-backend
```

## Step 4: Run Docker Container

### Option A: Simple Run (Recommended)

```bash
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend
```

### Option B: Run with Volume Mounts (For easier SSL management)

```bash
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  -v $(pwd)/ssl:/app/ssl:ro \
  -v $(pwd)/.env:/app/.env:ro \
  --restart unless-stopped \
  spytech-backend
```

### Option C: Using Docker Compose (Advanced)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  spytech-api:
    build: .
    container_name: spytech-api
    ports:
      - "3001:3001"
      - "3443:3443"
    env_file:
      - .env
    volumes:
      - ./ssl:/app/ssl:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run:
```bash
docker-compose up -d
```

## Step 5: Verify Container is Running

```bash
# Check container status
docker ps

# Check logs
docker logs spytech-api

# Follow logs in real-time
docker logs -f spytech-api

# Test health endpoints
curl http://104.154.91.216:3001/api/health
curl -k https://104.154.91.216:3443/api/health
```

## Step 6: Container Management

### Stop Container
```bash
docker stop spytech-api
```

### Start Container
```bash
docker start spytech-api
```

### Restart Container
```bash
docker restart spytech-api
```

### Remove Container
```bash
docker stop spytech-api
docker rm spytech-api
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild image
docker build -t spytech-backend .

# Stop and remove old container
docker stop spytech-api
docker rm spytech-api

# Run new container
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend
```

## Troubleshooting

### Check if ports are available
```bash
# Check if ports are in use
netstat -tlnp | grep :3001
netstat -tlnp | grep :3443

# Kill processes using the ports if needed
sudo kill $(sudo lsof -t -i:3001)
sudo kill $(sudo lsof -t -i:3443)
```

### Check container logs for errors
```bash
# View recent logs
docker logs spytech-api --tail 50

# Follow logs for debugging
docker logs -f spytech-api
```

### Access container shell for debugging
```bash
docker exec -it spytech-api sh
```

### Check SSL certificates inside container
```bash
docker exec spytech-api ls -la /app/ssl/
```

## Production Deployment Commands

Here's the complete sequence for production deployment:

```bash
# 1. Clone/update code
git clone https://github.com/Huddle-Team/study-sound-yerevan.git
cd study-sound-yerevan/backend

# 2. Generate SSL certificates
./generate-ssl.sh

# 3. Create environment file
cat > .env << EOF
TELEGRAM_BOT_TOKEN=your_actual_bot_token
TELEGRAM_CHAT_ID=your_actual_chat_id
NODE_ENV=production
PORT=3001
HTTPS_PORT=3443
EOF

# 4. Build and run
docker build -t spytech-backend .
docker run -d \
  --name spytech-api \
  -p 3001:3001 \
  -p 3443:3443 \
  --env-file .env \
  --restart unless-stopped \
  spytech-backend

# 5. Verify
docker logs spytech-api
curl http://104.154.91.216:3001/api/health
curl -k https://104.154.91.216:3443/api/health
```

## Expected Output

When running successfully, you should see:
```
🚀 Starting SpyTech API Server...
📊 Environment: production
✅ Product data loaded successfully
🌐 HTTP Server running on port 3001
📡 Health check: http://104.154.91.216:3001/api/health
🔒 HTTPS Server running on port 3443
📡 Health check: https://104.154.91.216:3443/api/health
```

Your backend will now be accessible at:
- **HTTP**: `http://104.154.91.216:3001/api`
- **HTTPS**: `https://104.154.91.216:3443/api`

The frontend will use the HTTPS endpoint to avoid mixed content errors! 🚀
