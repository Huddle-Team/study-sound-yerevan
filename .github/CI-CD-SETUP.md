# SpyTech CI/CD Setup Guide

Complete GitHub Actions CI/CD pipeline for automatic deployment to S3 (frontend) and Docker server (backend).

## 🏗️ Pipeline Overview

```
GitHub Push → CI/CD Pipeline → Production Deployment

Frontend: main branch → Build → S3 → CloudFront → spytech.am
Backend:  main branch → Build → Docker → Server → api.spytech.am
```

## 📋 Required GitHub Secrets

You need to add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Frontend Deployment (S3) Secrets
```
AWS_ACCESS_KEY_ID         = Your AWS access key ID
AWS_SECRET_ACCESS_KEY     = Your AWS secret access key  
AWS_REGION               = Your AWS region (e.g., us-east-1)
S3_BUCKET_NAME           = Your S3 bucket name for spytech.am
CLOUDFRONT_DISTRIBUTION_ID = (Optional) CloudFront distribution ID
```

### Backend Deployment (Docker Server) Secrets
```
SERVER_HOST              = Your server IP address or domain
SERVER_USER              = SSH username for your server (e.g., ubuntu, root)
SERVER_SSH_KEY           = Private SSH key for server access
DOCKER_USERNAME          = (Optional) Docker Hub username
DOCKER_PASSWORD          = (Optional) Docker Hub password/token
```

## 🔐 Setting Up GitHub Secrets

### 1. AWS Credentials (Frontend)

1. **Create AWS IAM User**:
   ```bash
   # Required permissions for S3 and CloudFront
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket",
           "s3:PutObjectAcl"
         ],
         "Resource": [
           "arn:aws:s3:::your-bucket-name",
           "arn:aws:s3:::your-bucket-name/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Add to GitHub Secrets**:
   - `AWS_ACCESS_KEY_ID`: From IAM user
   - `AWS_SECRET_ACCESS_KEY`: From IAM user
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `S3_BUCKET_NAME`: Your bucket name (e.g., `spytech-website`)

### 2. Server SSH Access (Backend)

1. **Generate SSH Key Pair**:
   ```bash
   # On your local machine
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/spytech_deploy
   
   # Copy public key to your server
   ssh-copy-id -i ~/.ssh/spytech_deploy.pub user@your-server-ip
   ```

2. **Add to GitHub Secrets**:
   - `SERVER_HOST`: Your server IP or domain (e.g., `123.456.789.0`)
   - `SERVER_USER`: SSH username (e.g., `ubuntu`, `root`)
   - `SERVER_SSH_KEY`: Contents of your private key file (`~/.ssh/spytech_deploy`)

### 3. Docker Hub (Optional)

If you want to push images to Docker Hub:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token

## 🚀 Pipeline Features

### Frontend Pipeline (`deploy-frontend.yml`)
- **Trigger**: Push to main branch (frontend changes only)
- **Build**: Node.js 18, npm ci, production build
- **Deploy**: Upload to S3, set cache headers, preserve images
- **CDN**: CloudFront cache invalidation
- **Testing**: Optional frontend tests on PRs

### Backend Pipeline (`deploy-backend.yml`)
- **Trigger**: Push to main branch (backend changes only)
- **Build**: Docker image build and test
- **Deploy**: SSH to server, Docker Compose deployment
- **Health Check**: Verify API is responding
- **Testing**: Optional backend tests and security scans on PRs

## 📁 Deployment Structure

### Frontend (S3)
```
spytech.am/
├── index.html          (no-cache)
├── assets/
│   ├── app.js         (1-year cache)
│   └── app.css        (1-year cache)
└── images/            (preserved across deployments)
    └── ...
```

### Backend (Docker Server)
```
/opt/spytech-backend/
├── current/           (active deployment)
├── backup-*/          (previous deployments)
└── docker-compose.yml
```

## 🔄 Deployment Process

### Automatic Deployment
1. **Push to main branch**
2. **GitHub Actions triggers**
3. **Frontend**: Builds and deploys to S3
4. **Backend**: Builds Docker image and deploys to server
5. **Health checks verify deployment**
6. **Notifications on success/failure**

### Manual Deployment
You can also trigger deployments manually from GitHub Actions tab.

## 🧪 Testing

### Pull Request Checks
- **Frontend**: Build validation, optional tests
- **Backend**: Docker build test, security scan, optional tests

### Production Validation
- **Frontend**: Build succeeds, S3 upload completes
- **Backend**: Docker health check, API responds to `/api/health`

## 🔍 Monitoring & Troubleshooting

### Check Deployment Status
1. **GitHub Actions tab**: View pipeline logs
2. **Frontend**: Visit `https://spytech.am`
3. **Backend**: Check `https://api.spytech.am/api/health`

### Common Issues

**Frontend Deployment Fails**:
```bash
# Check AWS credentials and permissions
# Verify S3 bucket exists and is accessible
# Check build process logs
```

**Backend Deployment Fails**:
```bash
# SSH to server and check Docker logs
ssh user@server
sudo docker-compose logs

# Check server resources
df -h  # Disk space
free -m  # Memory usage
```

**CORS Issues After Deployment**:
```bash
# Verify backend CORS configuration includes spytech.am
# Check environment variables on server
# Restart backend containers if needed
```

## 📊 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=https://api.spytech.am/api
```

### Backend (.env on server)
```bash
PORT=3001
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
FRONTEND_URL=https://spytech.am
NODE_ENV=production
```

## 🔒 Security Best Practices

- ✅ **Secrets Management**: All sensitive data in GitHub Secrets
- ✅ **SSH Key Access**: Dedicated deployment keys
- ✅ **AWS IAM**: Minimal required permissions
- ✅ **Docker Security**: Non-root user, security scanning
- ✅ **HTTPS Only**: SSL for both frontend and backend
- ✅ **Container Isolation**: Docker network security

## 🎯 Next Steps

1. **Set up GitHub Secrets** with your credentials
2. **Test with a small change** to verify pipeline works
3. **Monitor first deployment** for any issues
4. **Set up monitoring** alerts for production
5. **Create staging environment** for testing

Your SpyTech project now has enterprise-grade CI/CD with automatic deployment! 🚀
