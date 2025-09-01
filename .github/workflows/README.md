# SpyTech GitHub Actions Workflows

This directory contains the CI/CD pipelines for the SpyTech project.

## 📋 Workflows Overview

### 1. `deploy-frontend.yml` - Frontend Deployment
**Trigger**: Push to main branch (frontend changes)
**Target**: S3 static website hosting → `https://spytech.am`

**What it does**:
- ✅ Builds React/Vite frontend with production config
- ✅ Deploys to S3 bucket with optimized caching
- ✅ Preserves existing images during deployment
- ✅ Invalidates CloudFront cache for instant updates
- ✅ Sets proper HTTP headers for performance

### 2. `deploy-backend.yml` - Backend Deployment  
**Trigger**: Push to main branch (backend changes)
**Target**: Docker server → `https://api.spytech.am`

**What it does**:
- ✅ Builds Docker image with Node.js backend
- ✅ Tests container startup and health
- ✅ Deploys via SSH to production server
- ✅ Uses Docker Compose for service orchestration
- ✅ Performs health checks and rollback on failure

### 3. `quality-checks.yml` - Code Quality & Testing
**Trigger**: Pull requests and pushes to develop branch

**What it does**:
- ✅ Runs ESLint and TypeScript checks
- ✅ Executes tests (if available)
- ✅ Security vulnerability scanning
- ✅ Dependency audit and outdated package checks
- ✅ Docker build validation

## 🔧 Setup Instructions

### Prerequisites
1. GitHub repository with this codebase
2. AWS account with S3 bucket for `spytech.am`
3. Server for backend deployment with Docker installed
4. Domain configuration: `spytech.am` → S3, `api.spytech.am` → your server

### Required GitHub Secrets

Navigate to: `Repository Settings > Secrets and variables > Actions`

**Frontend (S3) Secrets:**
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=spytech-website
CLOUDFRONT_DISTRIBUTION_ID=E1234567890123 (optional)
```

**Backend (Server) Secrets:**
```
SERVER_HOST=123.456.789.0
SERVER_USER=ubuntu
SERVER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----...
```

**Optional (Docker Hub):**
```
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-token
```

## 🚀 Usage

### Automatic Deployment
1. **Make changes** to your code
2. **Push to main branch**
3. **GitHub Actions automatically deploys** based on what changed:
   - Frontend changes → Deploys to S3
   - Backend changes → Deploys to Docker server
   - Both → Deploys both

### Manual Deployment
1. Go to **Actions** tab in GitHub
2. Select the workflow you want to run
3. Click **Run workflow**
4. Choose the branch and run

### Pull Request Workflow
1. **Create PR** to main branch
2. **Quality checks run automatically**:
   - Code linting and type checking
   - Security scanning
   - Build validation
3. **Review results** before merging

## 📊 Workflow Status

Check deployment status:
- **GitHub Actions tab**: View logs and status
- **Frontend**: `https://spytech.am` 
- **Backend Health**: `https://api.spytech.am/api/health`

### Status Badges (Add to main README)
```markdown
![Frontend Deploy](https://github.com/Huddle-Team/study-sound-yerevan/workflows/Build%20and%20Deploy%20SpyTech%20Frontend%20to%20S3/badge.svg)
![Backend Deploy](https://github.com/Huddle-Team/study-sound-yerevan/workflows/Build%20and%20Deploy%20SpyTech%20Backend/badge.svg)
![Quality Checks](https://github.com/Huddle-Team/study-sound-yerevan/workflows/Quality%20Checks/badge.svg)
```

## 🔍 Troubleshooting

### Common Issues

**❌ Frontend deployment fails**
- Check AWS credentials and S3 bucket permissions
- Verify build process completes successfully
- Check CloudFront distribution ID (if using)

**❌ Backend deployment fails**  
- Verify SSH key and server access
- Check Docker and Docker Compose on server
- Review server logs: `ssh user@server && sudo docker-compose logs`

**❌ Quality checks fail**
- Fix linting errors: `npm run lint`
- Resolve TypeScript errors: `npx tsc --noEmit`
- Update dependencies: `npm audit fix`

### Debugging Steps

1. **Check workflow logs** in GitHub Actions tab
2. **Verify secrets** are correctly set
3. **Test locally** before pushing:
   ```bash
   # Frontend
   npm run build
   
   # Backend  
   cd backend
   docker build -t test .
   ```
4. **Check server status**:
   ```bash
   ssh user@server
   sudo docker-compose ps
   sudo docker-compose logs
   ```

## 📈 Performance Optimizations

### Frontend
- **Caching**: Static assets cached for 1 year
- **CDN**: CloudFront for global delivery
- **Compression**: Gzip enabled on S3
- **Images**: Preserved across deployments

### Backend
- **Health Checks**: Automatic container restart
- **Zero Downtime**: Rolling deployment with Docker
- **Resource Limits**: Container memory/CPU limits
- **Security**: Non-root user, minimal attack surface

## 🔒 Security Features

- ✅ **Secrets Management**: No credentials in code
- ✅ **SSH Keys**: Dedicated deployment keys
- ✅ **Container Security**: Non-privileged execution  
- ✅ **Dependency Scanning**: Automated vulnerability checks
- ✅ **Code Quality**: Linting and type checking
- ✅ **HTTPS Only**: SSL/TLS for all communications

## 📝 Customization

### Adding Tests
Add test scripts to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  }
}
```

### Environment-Specific Deployments
Create additional workflow files for staging:
- `deploy-staging.yml`
- Update triggers and environment variables

### Notifications
Add Slack/Discord notifications:
```yaml
- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
```

Your SpyTech project now has enterprise-grade CI/CD! 🚀
