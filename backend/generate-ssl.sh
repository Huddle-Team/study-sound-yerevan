#!/bin/bash

# Create SSL directory
mkdir -p backend/ssl

# Generate private key
openssl genrsa -out backend/ssl/private.key 2048

# Generate certificate signing request
openssl req -new -key backend/ssl/private.key -out backend/ssl/cert.csr \
  -subj "/C=AM/ST=Yerevan/L=Yerevan/O=SpyTech/OU=IT/CN=104.154.91.216"

# Generate self-signed certificate
openssl x509 -req -days 365 -in backend/ssl/cert.csr -signkey backend/ssl/private.key -out backend/ssl/certificate.crt

# Clean up CSR file
rm backend/ssl/cert.csr

echo "✅ SSL certificates generated successfully!"
echo "📁 Files created:"
echo "   - backend/ssl/private.key"
echo "   - backend/ssl/certificate.crt"
echo ""
echo "⚠️  Note: These are self-signed certificates for development/testing."
echo "🔒 For production, use certificates from a trusted CA like Let's Encrypt."
