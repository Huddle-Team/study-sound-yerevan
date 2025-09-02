// Add this endpoint to your server-auto-ssl.js after the booking/submit endpoint

// Telegram webhook endpoint to receive messages and get chat IDs
app.post('/api/telegram/webhook', (req, res) => {
  try {
    const update = req.body;
    
    // Log all incoming Telegram updates
    console.log('📱 Telegram Update Received:', JSON.stringify(update, null, 2));
    
    if (update.message) {
      const chatId = update.message.chat.id;
      const username = update.message.from.username || 'no_username';
      const firstName = update.message.from.first_name || 'Unknown';
      const text = update.message.text || 'No text';
      
      console.log('💬 New Message:');
      console.log(`  Chat ID: ${chatId}`);
      console.log(`  Username: @${username}`);
      console.log(`  Name: ${firstName}`);
      console.log(`  Message: ${text}`);
      
      // Respond to /start command
      if (text === '/start') {
        // Send welcome message back
        const welcomeMessage = `Hello ${firstName}! 👋\n\nYour Chat ID is: ${chatId}\n\nYou can now receive booking notifications from SpyTech!`;
        
        // You can send this back to the user (optional)
        // sendTelegramMessage(chatId, welcomeMessage);
      }
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get current chat ID from your .env
app.get('/api/telegram/chat-id', (req, res) => {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  res.json({ 
    chatId: chatId || 'Not configured',
    status: chatId ? 'configured' : 'missing'
  });
});
