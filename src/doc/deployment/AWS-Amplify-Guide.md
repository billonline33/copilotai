# AWS Amplify Deployment Guide

## Why AWS Amplify?

- **Zero Configuration**: Automatically detects Next.js
- **Global CDN**: Fast loading worldwide
- **Automatic HTTPS**: SSL certificates included
- **Git Integration**: Auto-deploy on code changes
- **Custom Domain**: Easy domain setup
- **Cost Effective**: Pay only for usage

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Make sure your code is in a Git repository
git add .
git commit -m "Ready for AWS Amplify deployment"
git push origin main
```

### 2. Deploy via AWS Console

1. **Login to AWS Console**: https://console.aws.amazon.com
2. **Navigate to AWS Amplify**: Search for "Amplify" in services
3. **Create New App**:
   - Click "New app" → "Host web app"
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your repository
   - Choose the `main` branch

### 3. Build Settings (Auto-detected)

Amplify will automatically detect these settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 4. Environment Variables (if needed)

- `NODE_ENV`: `production`
- `NEXT_PUBLIC_APP_NAME`: `Math Practice for Bianca`

### 5. Deploy!

- Click "Save and deploy"
- Wait 5-10 minutes for deployment
- Your app will be available at: `https://[random-string].amplifyapp.com`

## Custom Domain Setup

1. In Amplify console, go to "Domain management"
2. Add your domain (e.g., `mathpractice.yourdomain.com`)
3. Follow DNS verification steps
4. SSL certificate auto-provisioned

## Cost Estimate

- **Build minutes**: Free tier includes 1,000 minutes/month
- **Storage**: $0.023 per GB per month
- **Data transfer**: $0.15 per GB
- **Typical monthly cost**: $5-15 for small to medium traffic

## Automatic Updates

- Every git push to main branch triggers auto-deployment
- Preview deployments for feature branches
- Rollback capability to previous versions

---

## 🎯 Quick Deploy Commands

```bash
# 1. Ensure clean build
npm run build

# 2. Test production locally
npm start

# 3. Commit and push
git add .
git commit -m "Production ready"
git push origin main

# 4. Then follow AWS Amplify console steps above
```

**Amplify URL**: After deployment, you'll get a URL like:
`https://main.d1a2b3c4d5e6f7.amplifyapp.com`
