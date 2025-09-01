# PowerShell script to generate SSL certificates for Windows

# Create SSL directory
New-Item -ItemType Directory -Force -Path "backend/ssl"

Write-Host "🔐 Generating SSL certificates for SpyTech backend..."

# Note: This requires OpenSSL to be installed on Windows
# You can install it via: winget install ShiningLight.OpenSSL

try {
    # Check if OpenSSL is available
    $opensslPath = Get-Command openssl -ErrorAction SilentlyContinue
    
    if ($opensslPath) {
        Write-Host "✅ OpenSSL found, generating certificates..."
        
        # Generate private key
        & openssl genrsa -out backend/ssl/private.key 2048
        
        # Generate certificate signing request
        & openssl req -new -key backend/ssl/private.key -out backend/ssl/cert.csr -subj "/C=AM/ST=Yerevan/L=Yerevan/O=SpyTech/OU=IT/CN=104.154.91.216"
        
        # Generate self-signed certificate
        & openssl x509 -req -days 365 -in backend/ssl/cert.csr -signkey backend/ssl/private.key -out backend/ssl/certificate.crt
        
        # Clean up CSR file
        Remove-Item backend/ssl/cert.csr -Force
        
        Write-Host "✅ SSL certificates generated successfully!" -ForegroundColor Green
        Write-Host "📁 Files created:" -ForegroundColor Yellow
        Write-Host "   - backend/ssl/private.key"
        Write-Host "   - backend/ssl/certificate.crt"
        Write-Host ""
        Write-Host "⚠️  Note: These are self-signed certificates for development/testing." -ForegroundColor Yellow
        Write-Host "🔒 For production, use certificates from a trusted CA like Let's Encrypt." -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ OpenSSL not found!" -ForegroundColor Red
        Write-Host "📥 Please install OpenSSL first:" -ForegroundColor Yellow
        Write-Host "   winget install ShiningLight.OpenSSL"
        Write-Host "   Or download from: https://slproweb.com/products/Win32OpenSSL.html"
        Write-Host ""
        Write-Host "🔄 Alternative: Use Let's Encrypt for production certificates"
    }
    
} catch {
    Write-Host "❌ Error generating certificates: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure OpenSSL is installed and in your PATH"
}
