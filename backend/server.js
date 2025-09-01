const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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
  contentSecurityPolicy: false, // Disable CSP to allow mixed content
  crossOriginEmbedderPolicy: false
}));

// Special middleware to handle mixed content requests
app.use((req, res, next) => {
  // Allow requests from HTTPS sites to HTTP API
  res.header('Access-Control-Allow-Origin', 'https://spytech.am');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors({
  origin: [
    'https://spytech.am',      // Production domain
    'http://localhost:5173',  // Vite dev server
    'http://localhost:8080',  // Alternative dev port
    'http://localhost:3000',  // Create React App
    'http://127.0.0.1:5173',  // localhost alternative
    'http://127.0.0.1:8080',  // localhost alternative
    process.env.FRONTEND_URL  // Environment variable
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validation middleware
const validateBooking = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-ZáàâäãåąčćđéèêëęëĞğỊịİıĺłľńňőóôöõøŕřşšťūúůüưvýỳỹŶŷŽžЁёЀѐЅѕЄєЁёЋћЂђЅѕІіЇїЈјЉљЊњЋћЌќЎўЏџАаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯяՀհԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ\s]+$/)
    .withMessage('Name should only contain letters and spaces'),
  
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\d\s\+\-\(\)]+$/)
    .withMessage('Invalid phone number format'),
  
  body('selectedActionType')
    .notEmpty()
    .withMessage('Action type is required')
    .isIn(['rent', 'buy'])
    .withMessage('Invalid action type'),
];

// Send message to Telegram
const sendToTelegram = async (bookingData) => {
  try {
    const message = formatBookingMessage(bookingData);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status} - ${result.description}`);
    }

    return { success: true, messageId: result.result.message_id };
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
    }
    
    return `Item #${itemId}`;
  } catch (error) {
    console.warn('Error looking up item name:', error);
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

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'SpyTech Telegram API'
  });
});

// Test Telegram connection
app.post('/api/telegram/test', async (req, res) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({
        success: false,
        error: 'Telegram configuration missing'
      });
    }

    const testMessage = `🧪 <b>Test Message</b>\n\nTelegram integration is working!\n\n📅 ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Yerevan' })} (Armenia Time)`;
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (response.ok) {
      res.json({ success: true, message: 'Test message sent successfully!' });
    } else {
      res.status(400).json({ success: false, error: result.description });
    }
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SpyTech Telegram API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/telegram/test`);
  
  // Verify environment variables
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️  Warning: Telegram configuration missing!');
    console.warn('   Make sure to set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env');
  } else {
    console.log('✅ Telegram configuration loaded');
  }
});

module.exports = app;
