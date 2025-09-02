# PowerShell script to rebuild Docker container
Write-Host "🔧 Rebuilding SpyTech Backend Docker Container..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "C:\Users\gor_gevorgyan1\study-sound-yerevan\backend"

# Stop and remove existing container (ignore errors if not found)
Write-Host "🛑 Stopping existing container..." -ForegroundColor Yellow
try {
    docker stop backedn 2>$null
    docker rm backedn 2>$null
} catch {
    Write-Host "Container not found or already stopped" -ForegroundColor Gray
}

# Remove old image to force rebuild
Write-Host "🗑️ Removing old image..." -ForegroundColor Yellow
try {
    docker rmi spytech-backend 2>$null
} catch {
    Write-Host "Image not found" -ForegroundColor Gray
}

# Build new image
Write-Host "🔨 Building new Docker image..." -ForegroundColor Cyan
docker build -t spytech-backend .

if ($LASTEXITCODE -eq 0) {
    # Run new container
    Write-Host "🚀 Starting new container..." -ForegroundColor Green
    docker run -d --name backedn -p 3001:3001 -p 443:443 --env-file .env --restart unless-stopped spytech-backend
    
    # Check container status
    Write-Host "📊 Container status:" -ForegroundColor Blue
    docker ps | Select-String "backedn"
    
    Write-Host "✅ Docker container rebuild complete!" -ForegroundColor Green
    Write-Host "🔍 Check logs with: docker logs backedn" -ForegroundColor Gray
    Write-Host "🌐 Test with: curl http://localhost:3001/api/health" -ForegroundColor Gray
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
}
