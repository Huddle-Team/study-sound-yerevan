# SpyTech Telegram Bot API

A secure Express.js backend server for handling Telegram bot integration for the SpyTech exam tools website.

## Features

- 🔒 **Security**: Rate limiting, CORS, Helmet security headers
- 📝 **Validation**: Server-side form validation with detailed error messages
- 🤖 **Telegram Integration**: Secure bot token handling and message formatting
- 🌍 **CORS Support**: Configurable for S3 static website hosting
- 📊 **Health Monitoring**: Health check and test endpoints
- 🛡️ **Error Handling**: Comprehensive error handling and logging

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_CHAT_ID`: Your Telegram chat/group ID
   - `FRONTEND_URL`: Your S3 website URL (for CORS)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Test Telegram Connection
```
POST /api/telegram/test
```
Sends a test message to verify Telegram integration.

### Submit Booking
```
POST /api/booking/submit
Content-Type: application/json

{
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "selectedActionType": "rent", // or "buy"
  "selectedRentItem": "Micro Camera", // optional
  "selectedSaleItem": "Bluetooth Earpiece", // optional
  "productName": "Product Name" // optional
}
```

## Validation Rules

- **Full Name**: 2-100 characters, letters and spaces only
- **Phone Number**: Numbers, spaces, +, -, (, ) only
- **Action Type**: Must be "rent" or "buy"

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origin restrictions
- **Helmet**: Security headers protection
- **Input Validation**: Server-side validation with sanitization
- **Error Handling**: Secure error responses without sensitive data exposure

## Deployment

### Development
- Use `npm run dev` for development with nodemon
- Frontend URL: `http://localhost:5173`

### Production
- Set `NODE_ENV=production` in `.env`
- Update `FRONTEND_URL` to your S3 website URL
- Use `npm start` for production
- Consider using PM2 or similar process manager

## Message Format

Telegram messages include:
- Timestamp (Armenia timezone)
- Customer details (name, phone)
- Booking type (rent/buy)
- Selected items
- Request metadata (IP, User Agent)
- Professional formatting with emojis

## Error Handling

The API returns consistent JSON responses:

**Success:**
```json
{
  "success": true,
  "message": "Booking request sent successfully!",
  "messageId": 12345
}
```

**Error:**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [...]
}
```
