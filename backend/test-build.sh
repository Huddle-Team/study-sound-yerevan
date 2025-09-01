#!/bin/bash

echo "🔍 Testing Docker build locally..."

# Check if package.json has node-forge
if grep -q "node-forge" package.json; then
    echo "✅ node-forge dependency found in package.json"
else
    echo "❌ node-forge dependency missing!"
    echo "📝 Adding node-forge to package.json..."
    
    # Use npm to add the dependency
    npm install --save node-forge
    
    if [ $? -eq 0 ]; then
        echo "✅ node-forge added successfully"
    else
        echo "❌ Failed to add node-forge"
        exit 1
    fi
fi

# Test npm install locally first
echo "🧪 Testing npm install..."
npm ci --only=production

if [ $? -eq 0 ]; then
    echo "✅ npm install successful"
    
    # Now test Docker build
    echo "🐳 Testing Docker build..."
    docker build -t spytech-backend-test .
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker build successful!"
        echo "🚀 Ready to deploy with: ./deploy-auto-ssl.sh"
        
        # Clean up test image
        docker rmi spytech-backend-test 2>/dev/null || true
    else
        echo "❌ Docker build failed!"
        echo "📋 Check the error messages above"
        exit 1
    fi
else
    echo "❌ npm install failed!"
    echo "📋 Check your package.json and node_modules"
    exit 1
fi
