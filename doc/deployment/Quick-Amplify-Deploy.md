# 🚀 Quick AWS Amplify Deployment

## Prerequisites

- Your code is in a Git repository (GitHub, GitLab, etc.)
- AWS account with appropriate permissions

## Step 1: Prepare for Deployment

```bash
# Ensure everything builds correctly
npm run build

# Test production build
npm start
# Visit http://localhost:3000 and test the math practice features

# Commit your latest changes
git add .
git commit -m "Ready for AWS Amplify deployment - Math Practice app complete"
git push origin main
```

## Step 2: Deploy to AWS Amplify

### Via AWS Console (Recommended)

1. **Login**: https://console.aws.amazon.com
2. **Navigate**: Search "Amplify" → Click "AWS Amplify"
3. **New App**: Click "New app" → "Host web app"
4. **Connect Git**:
   - Choose your Git provider (GitHub/GitLab/etc.)
   - Authorize AWS Amplify
   - Select your repository
   - Choose `main` branch
5. **App Settings**:
   - App name: `math-practice-bianca`
   - Build settings: (Auto-detected, but here's what it uses)
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
6. **Review**: Check settings and click "Save and deploy"

### Deployment Process

- **Duration**: 5-10 minutes
- **Stages**: Provision → Build → Deploy → Verify
- **Result**: You'll get a URL like `https://main.d1a2b3c4d5e6f7.amplifyapp.com`

## Step 3: Test Your Deployed App

Visit your Amplify URL and test:

- ✅ Navigation between To-Do and Math Practice
- ✅ Math practice settings (pattern, direction, start number)
- ✅ Question generation and answering
- ✅ Achievement system and progress tracking
- ✅ Mobile responsiveness
- ✅ LocalStorage persistence (achievements should save)

## Step 4: Optional Customizations

### Custom Domain

1. In Amplify console → Domain management
2. Add domain: `mathpractice.yourdomain.com`
3. Follow DNS verification steps
4. SSL automatically provisioned

### Environment Variables (if needed)

1. In Amplify console → Environment variables
2. Add:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_APP_NAME`: `Math Practice for Bianca`

### Branch-based Deployments

- `main` branch → Production environment
- `develop` branch → Staging environment (optional)
- Pull requests → Preview deployments

## Step 5: Automatic Updates

From now on, every time you push to `main`:

```bash
git add .
git commit -m "Update math practice features"
git push origin main
# Amplify automatically deploys in ~5 minutes
```

## Monitoring & Analytics

In AWS Amplify console you can view:

- **Build logs**: Debug any deployment issues
- **Access logs**: See app usage patterns
- **Performance**: Monitor loading times
- **Costs**: Track your monthly bill

## Expected Costs

For a personal/educational app like this:

- **Build minutes**: Free tier (1,000 minutes/month)
- **Hosting**: ~$1-5/month depending on traffic
- **Custom domain**: Free (SSL included)

---

## 🎉 You're Live!

Once deployed, your Math Practice app will be:

- ✅ **Globally accessible** via CDN
- ✅ **HTTPS secure** with automatic SSL
- ✅ **Auto-updating** on every git push
- ✅ **Mobile optimized** for Bianca's devices
- ✅ **Production ready** with monitoring

**Share the URL** with Bianca and her family to start practicing math! 🌟
