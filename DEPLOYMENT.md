# SpyTech Exam Tools - Secure Architecture Setup

This setup separates your website (frontend) from the Telegram bot server (backend) for better security and deployment flexibility.

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTPS    ┌─────────────────┐    Telegram API    ┌─────────────────┐
│   S3 Website    │ ──────────► │  Backend Server │ ─────────────────► │   Telegram Bot  │
│   (Frontend)    │             │   (Express.js)  │                    │                 │
└─────────────────┘             └─────────────────┘                    └─────────────────┘
```

### Frontend (S3 Static Website)
- **Location**: Amazon S3 bucket with static website hosting
- **Contains**: React app, HTML, CSS, JS - NO sensitive data
- **Security**: Bot tokens are NOT exposed to users
- **CDN**: Can be served via CloudFront for global performance

### Backend (Express.js Server)
- **Location**: Your own server (VPS, AWS EC2, etc.)
- **Contains**: Telegram bot logic, API endpoints, sensitive credentials
- **Security**: Bot tokens are securely stored in environment variables
- **Scalability**: Can be scaled independently from frontend

## 🚀 Deployment Steps

### 1. Backend Server Setup

#### a) Prepare Backend Files
```bash
cd backend
npm install
```

#### b) Configure Environment
```bash
cp .env.example .env
# Edit .env with your values:
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
FRONTEND_URL=https://your-s3-bucket-website.s3.amazonaws.com
```

#### c) Deploy Backend to Server

**Option 1: Docker Deployment (Recommended)**
```bash
# On your server
cd backend

# Configure environment
cp .env.example .env
# Edit .env with production values:
# TELEGRAM_BOT_TOKEN=your_bot_token
# TELEGRAM_CHAT_ID=your_chat_id  
# FRONTEND_URL=https://spytech.am

# Deploy with Docker
chmod +x deploy.sh
./deploy.sh
```

**Option 2: Traditional Deployment**
Options:
- **VPS/Dedicated Server**: Upload files, install Node.js, run with PM2
- **AWS EC2**: Use Elastic Beanstalk or manual setup
- **DigitalOcean Droplet**: Direct deployment
- **Railway/Render**: Git-based deployment

Example PM2 deployment:
```bash
# On your server
npm install -g pm2
pm2 start server.js --name "spytech-api"
pm2 startup
pm2 save
```

### 2. Frontend (Website) Deployment to S3

#### a) Update Frontend Configuration
```bash
# In main project directory
# Update .env file:
VITE_API_URL=https://api.spytech.am/api
```

#### b) Build and Deploy to S3
```bash
npm run build
```

Upload `dist/` folder contents to S3 bucket for `spytech.am` domain.

#### c) S3 Bucket Configuration
1. Enable **Static Website Hosting**
2. Set **Index Document**: `index.html`
3. Set **Error Document**: `index.html` (for SPA routing)
4. Configure **Public Access** for website files
5. Point `spytech.am` domain to S3 bucket
6. Optional: Set up **CloudFront CDN**

## 🔧 Testing the Setup

### Local Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Test booking form - should work through backend API

### Production Testing
1. Use the BackendTest component (included in App.tsx temporarily)
2. Test backend health: Should connect to your server
3. Test Telegram integration: Should send test message
4. Test booking form: Should submit through backend

## 🛡️ Security Benefits

### ✅ What's Secure Now:
- Bot tokens are server-side only
- No sensitive credentials in browser
- CORS protection
- Rate limiting
- Input validation
- Professional error handling

### ⚠️ Before (Direct Telegram):
- Bot tokens exposed in frontend bundle
- Anyone could inspect and steal tokens
- No rate limiting or validation
- Direct API calls from browser

## 🔗 API Endpoints

Your backend will provide these endpoints:

- `GET /api/health` - Server health check
- `POST /api/telegram/test` - Test Telegram connection
- `POST /api/booking/submit` - Submit booking request

## 📱 Frontend Changes

The frontend now:
1. Calls your backend API instead of Telegram directly
2. Uses environment variable `VITE_API_URL` for backend URL
3. Handles API responses with proper error messages
4. Maintains same user experience with improved security

## 🎯 Next Steps

1. **Deploy Backend**: Choose your server platform and deploy
2. **Update Frontend URL**: Set `VITE_API_URL` to your backend server
3. **Build & Deploy Frontend**: Upload to S3
4. **Test Everything**: Use the test component to verify
5. **Remove Test Component**: Remove BackendTest from App.tsx when done
6. **Monitor**: Set up logging and monitoring for your backend

## 💡 Production Tips

- Use HTTPS for both frontend and backend
- Set up domain names for professional URLs
- Configure CloudFront for S3 for better performance
- Use PM2 or similar for backend process management
- Set up basic server monitoring
- Consider adding a simple admin dashboard for booking management

This architecture provides a secure, scalable solution where your website can be hosted on fast, cheap S3 static hosting while your sensitive bot logic runs securely on your own server.
