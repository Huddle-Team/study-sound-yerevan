# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy everything first
COPY . .

# Install dependencies
RUN npm install --production

# Override server.js with the auto-SSL version
RUN cp server-auto-ssl.js server.js

# Create non-root user for security (but we'll run as root for port 443)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S spytech -u 1001 && \
    chown -R spytech:nodejs /app

# Note: Running as root to bind to port 443
# USER spytech

# Expose both HTTP and HTTPS ports
EXPOSE 3001 443

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
