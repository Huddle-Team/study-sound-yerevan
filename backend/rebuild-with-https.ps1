# PowerShell script to rebuild container with HTTPS auto-SSL

Write-Host "🔄 Rebuilding container with HTTPS auto-SSL server..." -ForegroundColor Yellow

# Stop current container
Write-Host "🛑 Stopping current container..." -ForegroundColor Cyan
docker stop spytech-api
docker rm spytech-api

# Remove old image to force rebuild
Write-Host "🗑️  Removing old image..." -ForegroundColor Cyan
docker rmi spytech-backend

# Rebuild with auto-SSL server
Write-Host "🏗️  Building image with auto-SSL server..." -ForegroundColor Cyan
docker build -t spytech-backend .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Run new container
Write-Host "🚀 Starting container with HTTPS support..." -ForegroundColor Cyan
docker run -d --name spytech-api -p 3001:3001 -p 3443:3443 --env-file .env --restart unless-stopped spytech-backend

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container started successfully!" -ForegroundColor Green
    
    # Wait for container to start
    Start-Sleep -Seconds 5
    
    Write-Host "📋 Container logs:" -ForegroundColor Yellow
    docker logs spytech-api --tail 15
    
    Write-Host ""
    Write-Host "📡 Testing endpoints..." -ForegroundColor Cyan
    
    # Test HTTP
    try {
        $httpResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -TimeoutSec 5
        if ($httpResponse.status -eq "healthy") {
            Write-Host "✅ HTTP endpoint working" -ForegroundColor Green
        } else {
            Write-Host "❌ HTTP endpoint failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ HTTP endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test HTTPS
    try {
        # PowerShell equivalent of curl -k (ignore SSL certificate errors)
        [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
        $httpsResponse = Invoke-RestMethod -Uri "https://localhost:3443/api/health" -TimeoutSec 10
        if ($httpsResponse.status -eq "healthy") {
            Write-Host "✅ HTTPS endpoint working" -ForegroundColor Green
            Write-Host "🔒 SSL certificate auto-generated successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ HTTPS endpoint failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ HTTPS endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "📋 Check logs above for SSL certificate generation" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📋 Expected logs should show:" -ForegroundColor Yellow
    Write-Host "   - 🚀 Starting SpyTech API Server..."
    Write-Host "   - 🌐 HTTP Server running on port 3001"
    Write-Host "   - 🔐 Generating self-signed certificate..."
    Write-Host "   - 🔒 HTTPS Server running on port 3443"
    
} else {
    Write-Host "❌ Failed to start container!" -ForegroundColor Red
    exit 1
}
