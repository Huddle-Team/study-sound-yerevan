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

// Security middleware with mixed content handling
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.spytech.am", "http://localhost:3001"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Validation middleware
const validateBooking = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).escape(),
  body('phoneNumber').trim().isLength({ min: 6, max: 20 }).escape(),
  body('selectedActionType').isIn(['rent', 'sale']),
  body('selectedRentItem').optional().isNumeric(),
  body('selectedSaleItem').optional().isNumeric(),
  body('productName').optional().trim().isLength({ max: 200 }).escape(),
  body('rentalStartDate').optional().isISO8601(),
  body('rentalEndDate').optional().isISO8601(),
];

// Helper function to send message to Telegram
const sendToTelegram = async (bookingData) => {
  try {
    const message = formatBookingMessage(bookingData);
    
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Message sent to Telegram successfully');
    return result;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    throw error;
  }
};

// Helper function to get item name by ID
const getItemName = (itemId, type = 'rent') => {
  try {
    if (type === 'rent') {
      // Look in audio rentals
      const audioItem = rentalsData.audioRentals?.find(item => item.id == itemId);
      if (audioItem) return audioItem.names?.en || `Rental Item #${itemId}`;
      
      // Look in camera rentals  
      const cameraItem = rentalsData.cameraRentals?.find(item => item.id == itemId);
      if (cameraItem) return cameraItem.names?.en || `Camera Rental #${itemId}`;
    } else if (type === 'sale') {
      // Look in audio sale items
      const audioItem = productsData.audioSaleItems?.find(item => item.id == itemId);
      if (audioItem) return audioItem.names?.en || `Sale Item #${itemId}`;
      
      // Look in camera sale items
      const cameraItem = productsData.cameraSaleItems?.find(item => item.id == itemId);
      if (cameraItem) return cameraItem.names?.en || `Camera Sale #${itemId}`;
    }
    
    return `Item #${itemId}`;
  } catch (error) {
    console.error('Error getting item name:', error);
    return `Item #${itemId}`;
  }
};

// Format booking message
const formatBookingMessage = (data) => {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yerevan',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  let message = `🎧 <b>New Booking Request</b>\n\n`;
  message += `📅 <b>Date:</b> ${timestamp} (Armenia Time)\n`;
  message += `👤 <b>Name:</b> ${data.fullName}\n`;
  message += `📞 <b>Phone:</b> ${data.phoneNumber}\n`;
  message += `🎯 <b>Action Type:</b> ${data.selectedActionType || data.actionType}\n`;

  if (data.productName) {
    message += `📦 <b>Product:</b> ${data.productName}\n`;
  }

  if (data.selectedRentItem) {
    const itemName = getItemName(data.selectedRentItem, 'rent');
    message += `🔄 <b>Rent Item:</b> ${itemName} (ID: ${data.selectedRentItem})\n`;
  }

  if (data.selectedSaleItem) {
    const itemName = getItemName(data.selectedSaleItem, 'sale');
    message += `💰 <b>Sale Item:</b> ${itemName} (ID: ${data.selectedSaleItem})\n`;
  }

  // Add rental date information if it's a rental
  if (data.selectedActionType === 'rent' && (data.rentalStartDate || data.rentalEndDate)) {
    message += `\n📅 <b>Rental Details:</b>\n`;
    if (data.rentalStartDate) message += `Start Date: ${data.rentalStartDate}\n`;
    if (data.rentalEndDate) message += `End Date: ${data.rentalEndDate}\n`;
  }

  // Add IP and User Agent for tracking
  if (data.ip) {
    message += `🌍 <b>IP:</b> ${data.ip}\n`;
  }
  
  if (data.userAgent) {
    message += `💻 <b>Device:</b> ${data.userAgent.substring(0, 50)}...\n`;
  }

  message += `\n🌐 <b>Source:</b> SpyTech Exam Tools Website`;
  message += `\n\n<i>Please contact the customer within 24 hours.</i>`;

  return message;
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    ssl: true
  });
});

// Get all rentals
app.get('/api/rentals', (req, res) => {
  try {
    res.json({
      success: true,
      data: rentalsData
    });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rental data'
    });
  }
});

// Get all products for sale
app.get('/api/products', (req, res) => {
  try {
    res.json({
      success: true,
      data: productsData
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product data'
    });
  }
});

// Submit booking
app.post('/api/booking/submit', validateBooking, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Add request metadata
    const bookingData = {
      ...req.body,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // Send to Telegram
    const result = await sendToTelegram(bookingData);

    res.json({
      success: true,
      message: 'Booking request sent successfully!',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process booking request'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// SSL Certificate generation using node-forge
const forge = require('node-forge');

function generateSSLCertificate() {
  console.log('🔐 Generating self-signed SSL certificate...');
  
  // Generate a key pair
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
    value: 'api.spytech.am'
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
    value: 'IT Department'
  }];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 2, // DNS
      value: 'api.spytech.am'
    }, {
      type: 2, // DNS
      value: 'localhost'
    }]
  }, {
    name: 'subjectKeyIdentifier'
  }]);
  
  // Self-sign certificate
  cert.sign(keys.privateKey);
  
  // Convert to PEM format
  const certPem = forge.pki.certificateToPem(cert);
  const keyPem = forge.pki.privateKeyToPem(keys.privateKey);
  
  console.log('✅ SSL certificate generated successfully');
  
  return {
    cert: certPem,
    key: keyPem
  };
}

// Start servers
async function startServers() {
  try {
    // Generate SSL certificate
    const sslCert = generateSSLCertificate();
    
    // Start HTTP server
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      console.log(`🟢 HTTP Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    });

    // Start HTTPS server
    const httpsOptions = {
      key: sslCert.key,
      cert: sslCert.cert
    };
    
    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
      console.log(`📡 Health check: https://localhost:${HTTPS_PORT}/api/health`);
      console.log(`🚀 SpyTech Telegram Backend is ready!`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully...');
      httpServer.close(() => {
        httpsServer.close(() => {
          console.log('✅ Servers closed successfully');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('❌ Failed to start servers:', error);
    process.exit(1);
  }
}

// Add node-forge dependency check
try {
  require('node-forge');
  startServers();
} catch (error) {
  console.error('❌ node-forge is required for SSL certificate generation');
  console.error('Please install it with: npm install node-forge');
  process.exit(1);
}
