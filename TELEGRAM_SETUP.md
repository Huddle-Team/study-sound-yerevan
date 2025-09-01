# Telegram Integration Setup Guide

This guide will help you set up Telegram integration to receive booking requests from your website.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the instructions:
   - Choose a name for your bot (e.g., "SpyTech Booking Bot")
   - Choose a username for your bot (must end with 'bot', e.g., "spytech_booking_bot")
5. BotFather will give you a token that looks like: `123456789:ABCdefGhIjKlmNoPQRsTuVwXyZ`
6. **Save this token** - you'll need it in Step 3

## Step 2: Get Your Chat ID

### Option A: Personal Chat (messages sent to you directly)
1. Start a chat with your bot by clicking the link BotFather provided
2. Send any message to your bot (e.g., "Hello")
3. Open this URL in your browser (replace YOUR_BOT_TOKEN with the token from Step 1):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for `"chat":{"id":123456789}` in the response
5. Copy the number (your chat ID)

### Option B: Group Chat (messages sent to a group)
1. Create a Telegram group
2. Add your bot to the group
3. Make the bot an admin (optional but recommended)
4. Send a message in the group mentioning the bot (e.g., "@your_bot_name test")
5. Open the same URL as above to get updates
6. Look for the group chat ID (will be negative, like `-1001234567890`)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your values:
   ```
   VITE_TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIjKlmNoPQRsTuVwXyZ
   VITE_TELEGRAM_CHAT_ID=123456789
   ```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Look for a blue "🧪 Test Telegram" button in the bottom-right corner
3. Click it to test the connection
4. Check your Telegram chat for a test message

## Step 5: Deploy to S3

### For S3 Static Hosting:
The Telegram integration works client-side, so it will work with static hosting on S3.

1. Build your project:
   ```bash
   npm run build
   ```

2. The build files will be in the `dist` folder

3. Upload the contents of `dist` folder to your S3 bucket

4. Make sure your S3 bucket is configured for static website hosting

### Environment Variables for Production:
Since this is a client-side app, the environment variables will be bundled into the build. Make sure to:

1. Set your production environment variables before building
2. Keep your bot token secure (consider using a backend service for production)

## Security Notes

⚠️ **Important**: Since this is a client-side implementation, your bot token will be visible in the built JavaScript files. For production use, consider:

1. Creating a separate backend API that handles Telegram messaging
2. Using serverless functions (Vercel, Netlify, AWS Lambda)
3. Restricting bot permissions to only send messages

## Message Format

When someone submits a booking form, you'll receive a message like:

```
🎧 New Booking Request

📅 Date: 09/01/2025, 02:30:45 PM (Armenia Time)
👤 Name: John Doe
📞 Phone: +374 99 123 456
🎯 Action Type: rent
📦 Product: Micro Earpieces Basic

🌐 Source: SpyTech Exam Tools Website

Please contact the customer within 24 hours.
```

## Troubleshooting

- **Test button not working**: Check browser console for errors
- **Messages not received**: Verify bot token and chat ID
- **"Bot not found" error**: Make sure the bot token is correct
- **"Chat not found" error**: Verify the chat ID and ensure the bot is added to the chat

## Support

If you need help with the setup, check the browser console for error messages and verify all configuration steps above.
