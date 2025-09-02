const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

// Load product data
let rentalsData = {};
let productsData = {};

try {
  rentalsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'rentals.json'), 'utf8'));
  productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
  console.log('✅ Product data loaded successfully');
} catch (error) {
  console.warn('⚠️  Warning: Could not load product data files:', error.message);
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:", "https:", "http:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }
}));
app.use(cors({
  origin: [
    'https://spytech.am',      // Production domain
    'https://api.spytech.am',  // API subdomain
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4173',  // Vite preview
    'https://localhost:5173', // HTTPS dev
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const protocol = req.secure ? 'HTTPS' : 'HTTP';
  console.log(`[${timestamp}] ${protocol} ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Helper function to get item name from rental or product data
function getItemName(itemId) {
  // Search in rentals first
  for (const category of Object.values(rentalsData)) {
    if (Array.isArray(category)) {
      const item = category.find(item => item.id === itemId);
      if (item) return item.name || item.title || 'Unknown Item';
    }
  }
  
  // Search in products
  for (const category of Object.values(productsData)) {
    if (Array.isArray(category)) {
      const item = category.find(item => item.id === itemId);
      if (item) return item.name || item.title || 'Unknown Item';
    }
  }
  
  return `Item ID: ${itemId}`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    protocol: req.secure ? 'HTTPS' : 'HTTP',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Telegram webhook endpoint
app.post('/api/booking/submit', [
  body('fullName').trim().isLength({ min: 1 }).withMessage('Full name is required'),
  body('phoneNumber').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
  body('selectedActionType').isIn(['rent', 'buy']).withMessage('Action type must be rent or buy'),
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      fullName, 
      phoneNumber, 
      selectedActionType, 
      selectedRentItem, 
      selectedSaleItem, 
      productName,
      rentalStartDate,
      rentalEndDate,
      rentalTime
    } = req.body;
    
    console.log('📋 Processing booking request:');
    console.log('- Name:', fullName);
    console.log('- Phone:', phoneNumber);
    console.log('- Action Type:', selectedActionType);
    console.log('- Product:', productName);
    console.log('- Selected Item ID:', selectedRentItem || selectedSaleItem);
    if (rentalStartDate) console.log('- Rental Start:', rentalStartDate);
    if (rentalEndDate) console.log('- Rental End:', rentalEndDate);
    if (rentalTime) console.log('- Preferred Time:', rentalTime);

    // Build the Telegram message
    let telegramMessage = `🎧 New SpyTech Booking Request

👤 **Customer Information:**
Name: ${fullName}
Phone: ${phoneNumber}

 **Action:** ${selectedActionType === 'rent' ? 'Rent' : 'Buy'}`;

    // Add product name if provided
    if (productName && productName.trim()) {
      telegramMessage += `\n📦 **Product:** ${productName}`;
    } else {
      telegramMessage += `\n📦 **Product:** General inquiry - customer will specify`;
    }

    // Add rental date/time information if it's a rental
    if (selectedActionType === 'rent' && (rentalStartDate || rentalEndDate || rentalTime)) {
      telegramMessage += `\n\n� **Rental Details:**`;
      if (rentalStartDate) telegramMessage += `\nStart Date: ${rentalStartDate}`;
      if (rentalEndDate) telegramMessage += `\nEnd Date: ${rentalEndDate}`;
      if (rentalTime) telegramMessage += `\nPreferred Time: ${rentalTime}`;
    }

    telegramMessage += `\n\n🕒 **Time:** ${new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Yerevan',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })} (Yerevan time)`;

    console.log('📧 Telegram message prepared:', telegramMessage);

    // Send to Telegram
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Missing Telegram configuration');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramPayload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'Markdown'
    };

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Telegram API error:', response.status, errorText);
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Message sent to Telegram successfully');
    console.log('📊 Telegram response:', result);

    res.json({
      success: true,
      message: 'Booking submitted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Function to generate self-signed certificate in memory
function generateSelfSignedCert() {
  const forge = require('node-forge');
  
  // Generate a keypair
  console.log('🔐 Generating self-signed certificate...');
  const keys = forge.pki.rsa.generateKeyPair(2048);
  
  // Create a certificate
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  
  const attrs = [{
    name: 'commonName',
    value: '104.154.91.216'
  }, {
    name: 'countryName',
    value: 'AM'
  }, {
    shortName: 'ST',
    value: 'Yerevan'
  }, {
    name: 'localityName',
    value: 'Yerevan'
  }, {
    name: 'organizationName',
    value: 'SpyTech'
  }, {
    shortName: 'OU',
    value: 'IT'
  }];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey);
  
  return {
    key: forge.pki.privateKeyToPem(keys.privateKey),
    cert: forge.pki.certificateToPem(cert)
  };
}

// Function to start HTTP server
function startHttpServer() {
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 HTTP Server running on port ${PORT}`);
    console.log(`📡 Health check: http://104.154.91.216:${PORT}/api/health`);
  });
  return httpServer;
}

// Function to start HTTPS server
function startHttpsServer() {
  try {
    let httpsOptions;
    
    // Try to load SSL certificates from files first
    const sslDir = path.join(__dirname, 'ssl');
    const keyPath = path.join(sslDir, 'private.key');
    const certPath = path.join(sslDir, 'certificate.crt');
    
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      console.log('📁 Loading SSL certificates from files...');
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    } else {
      console.log('⚠️  SSL certificate files not found, generating self-signed certificate...');
      
      // Check if node-forge is available
      try {
        require.resolve('node-forge');
        const { key, cert } = generateSelfSignedCert();
        httpsOptions = { key, cert };
        console.log('✅ Self-signed certificate generated successfully');
      } catch (forgeError) {
        console.warn('❌ node-forge not available, cannot generate certificates');
        console.warn('💡 Install with: npm install node-forge');
        return null;
      }
    }

    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
      console.log(`📡 Health check: https://104.154.91.216:${HTTPS_PORT}/api/health`);
    });
    return httpsServer;
  } catch (error) {
    console.warn('⚠️  Could not start HTTPS server:', error.message);
    console.warn('📝 Running HTTP only');
    return null;
  }
}

// Start servers
console.log('🚀 Starting SpyTech API Server...');
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

// Always start HTTP server
const httpServer = startHttpServer();

// Try to start HTTPS server
const httpsServer = startHttpsServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️  Received SIGTERM, shutting down gracefully...');
  httpServer?.close(() => {
    console.log('📴 HTTP server closed');
  });
  httpsServer?.close(() => {
    console.log('📴 HTTPS server closed');
  });
});

process.on('SIGINT', () => {
  console.log('⏹️  Received SIGINT, shutting down gracefully...');
  httpServer?.close(() => {
    console.log('📴 HTTP server closed');
  });
  httpsServer?.close(() => {
    console.log('📴 HTTPS server closed');
  });
});

module.exports = app;
