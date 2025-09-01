#!/bin/bash

# Telegram Setup Script
echo "🤖 Telegram Integration Setup"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "📄 .env file already exists"
fi

echo ""
echo "📋 Setup Instructions:"
echo ""
echo "1. Create a Telegram bot:"
echo "   • Message @BotFather on Telegram"
echo "   • Send /newbot and follow instructions"
echo "   • Copy the bot token"
echo ""
echo "2. Get your chat ID:"
echo "   • Start a chat with your bot"
echo "   • Send a message to your bot"
echo "   • Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates"
echo "   • Copy the chat ID from the response"
echo ""
echo "3. Edit the .env file and add your values:"
echo "   VITE_TELEGRAM_BOT_TOKEN=your_token_here"
echo "   VITE_TELEGRAM_CHAT_ID=your_chat_id_here"
echo ""
echo "4. Test the integration:"
echo "   • Run: npm run dev"
echo "   • Click the 'Test Telegram' button"
echo "   • Check your Telegram for a test message"
echo ""
echo "📖 For detailed instructions, see TELEGRAM_SETUP.md"
echo ""
echo "🚀 Ready to start development server? Run: npm run dev"
