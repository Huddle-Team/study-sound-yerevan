# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY server-https.js server.js
COPY . .

# Create data directory and copy data files
RUN mkdir -p data
COPY data/ ./data/

# Create SSL directory for certificates
RUN mkdir -p ssl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S spytech -u 1001

# Change ownership of app directory to nodejs user
RUN chown -R spytech:nodejs /app
USER spytech

# Expose both HTTP and HTTPS ports
EXPOSE 3001 3443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: 3001, path: '/api/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
      process.exit(res.statusCode === 200 ? 0 : 1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Start application
CMD ["npm", "start"]
