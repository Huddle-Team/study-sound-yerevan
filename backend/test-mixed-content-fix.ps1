# PowerShell script to test mixed content fix

Write-Host "🔄 Testing Mixed Content Fix..." -ForegroundColor Yellow

# Test the backend HTTP endpoint first
Write-Host "1️⃣ Testing backend HTTP endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://104.154.91.216:3001/api/health" -TimeoutSec 10
    if ($response.status -eq "healthy") {
        Write-Host "✅ Backend HTTP endpoint working" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend HTTP endpoint not responding correctly" -ForegroundColor Red
        Write-Host "📋 Response: $response" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend HTTP endpoint not working" -ForegroundColor Red
    Write-Host "📋 Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "📋 Make sure your container is running: docker ps | grep spytech-api" -ForegroundColor Yellow
    exit 1
}

# Test a booking submission
Write-Host ""
Write-Host "2️⃣ Testing booking endpoint..." -ForegroundColor Cyan
$bookingData = @{
    name = "Test User"
    phone = "+37411111111"
    message = "Test booking from script"
    selectedItems = @("earbuds-1")
} | ConvertTo-Json

try {
    $bookingResponse = Invoke-RestMethod -Uri "http://104.154.91.216:3001/api/booking/submit" -Method POST -Body $bookingData -ContentType "application/json" -TimeoutSec 10
    if ($bookingResponse.success) {
        Write-Host "✅ Booking endpoint working" -ForegroundColor Green
    } else {
        Write-Host "❌ Booking endpoint failed" -ForegroundColor Red
        Write-Host "📋 Response: $bookingResponse" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Booking endpoint failed" -ForegroundColor Red
    Write-Host "📋 Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Check if frontend build includes the meta tag
Write-Host ""
Write-Host "3️⃣ Checking frontend configuration..." -ForegroundColor Cyan

if (Select-String -Path "../index.html" -Pattern "upgrade-insecure-requests" -Quiet) {
    Write-Host "✅ Meta tag added to index.html" -ForegroundColor Green
} else {
    Write-Host "❌ Meta tag missing from index.html" -ForegroundColor Red
}

if (Select-String -Path "../vite.config.ts" -Pattern "upgrade-insecure-requests" -Quiet) {
    Write-Host "✅ CSP header added to vite.config.ts" -ForegroundColor Green
} else {
    Write-Host "❌ CSP header missing from vite.config.ts" -ForegroundColor Red
}

# Test frontend build
Write-Host ""
Write-Host "4️⃣ Testing frontend build..." -ForegroundColor Cyan
Push-Location ..
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend builds successfully" -ForegroundColor Green
        
        # Check if built files contain the meta tag
        if (Get-ChildItem -Path "dist" -Filter "*.html" -Recurse | Select-String -Pattern "upgrade-insecure-requests" -Quiet) {
            Write-Host "✅ Built HTML includes upgrade-insecure-requests" -ForegroundColor Green
        } else {
            Write-Host "❌ Built HTML missing upgrade-insecure-requests" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        Write-Host "📋 Build output: $buildOutput" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Write-Host "📋 Error: $($_.Exception.Message)" -ForegroundColor Yellow
}
Pop-Location

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Yellow

$backendStatus = try { 
    $healthCheck = Invoke-RestMethod -Uri "http://104.154.91.216:3001/api/health" -TimeoutSec 5
    if ($healthCheck.status -eq "healthy") { "✅ Working" } else { "❌ Failed" }
} catch { "❌ Failed" }

$metaTagStatus = if (Select-String -Path "../index.html" -Pattern "upgrade-insecure-requests" -Quiet) { "✅ Added" } else { "❌ Missing" }
$viteHeaderStatus = if (Select-String -Path "../vite.config.ts" -Pattern "upgrade-insecure-requests" -Quiet) { "✅ Added" } else { "❌ Missing" }

Write-Host "   Backend HTTP API: $backendStatus"
Write-Host "   Meta tag in HTML: $metaTagStatus"
Write-Host "   Vite CSP header: $viteHeaderStatus"

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Green
Write-Host "   1. Deploy your frontend with: git add . && git commit -m 'Fix mixed content' && git push"
Write-Host "   2. GitHub Actions will rebuild with the meta tag"
Write-Host "   3. Test booking form on https://spytech.am"
Write-Host ""
Write-Host "💡 The 'upgrade-insecure-requests' meta tag tells browsers to automatically" -ForegroundColor Cyan
Write-Host "   convert HTTP requests to HTTPS, which should fix the mixed content error."
