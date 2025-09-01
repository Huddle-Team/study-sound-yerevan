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
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

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
app.use(helmet());
app.use(cors({
  origin: [
    'https://spytech.am',      // Production domain
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
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('phone').trim().isLength({ min: 1 }).withMessage('Phone is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('selectedItems').isArray({ min: 1 }).withMessage('At least one item must be selected'),
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

    const { name, phone, message, selectedItems } = req.body;
    
    console.log('📋 Processing booking request:');
    console.log('- Name:', name);
    console.log('- Phone:', phone);
    console.log('- Selected Items:', selectedItems.length);

    // Create enhanced message with item names
    const itemList = selectedItems.map(itemId => {
      const itemName = getItemName(itemId);
      return `• ${itemName}`;
    }).join('\n');

    const telegramMessage = `🎧 New SpyTech Booking Request

👤 **Customer Information:**
Name: ${name}
Phone: ${phone}

📦 **Selected Items:**
${itemList}

💬 **Message:**
${message}

🕒 **Time:** ${new Date().toLocaleString('en-US', { 
  timeZone: 'Asia/Yerevan',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})} (Yerevan time)`;

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
    // Try to load SSL certificates
    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
      cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'))
    };

    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
      console.log(`📡 Health check: https://104.154.91.216:${HTTPS_PORT}/api/health`);
    });
    return httpsServer;
  } catch (error) {
    console.warn('⚠️  Could not start HTTPS server:', error.message);
    console.warn('📝 SSL certificates not found. Run with HTTP only or generate certificates.');
    return null;
  }
}

// Start servers
console.log('🚀 Starting SpyTech API Server...');
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

// Always start HTTP server
const httpServer = startHttpServer();

// Try to start HTTPS server if certificates exist
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
