# AWS S3 + CloudFront Static Deployment Guide

## Why Static Deployment?

- **Lowest Cost**: Often under $1/month
- **Fastest Performance**: Global CDN delivery
- **High Availability**: 99.99% uptime SLA
- **Secure**: Built-in DDoS protection

## Prerequisites

Since your app uses localStorage, we need to export as static files.

### 1. Configure Next.js for Static Export

Update `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### 2. Update Package.json

Add export script:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "export": "next build && next export",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 3. Build and Test Static Export

```bash
# Build static files
npm run build

# Test static files locally
npx serve out
```

## AWS Deployment Steps

### 1. Create S3 Bucket

```bash
# Using AWS CLI (install first: https://aws.amazon.com/cli/)
aws s3 mb s3://math-practice-bianca-app --region us-east-1

# Enable static website hosting
aws s3 website s3://math-practice-bianca-app \
  --index-document index.html \
  --error-document error.html
```

### 2. Upload Static Files

```bash
# Upload built files
aws s3 sync out/ s3://math-practice-bianca-app --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket math-practice-bianca-app --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::math-practice-bianca-app/*"
  }]
}'
```

### 3. Create CloudFront Distribution

```bash
# Create distribution (via AWS Console is easier)
# Or use AWS CLI:
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "math-practice-'$(date +%s)'",
  "Comment": "Math Practice App CDN",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-math-practice-bianca-app",
      "DomainName": "math-practice-bianca-app.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-math-practice-bianca-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "Enabled": true
}'
```

## Automated Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "Building and deploying Math Practice app..."

# Build
npm run build

# Upload to S3
aws s3 sync out/ s3://math-practice-bianca-app --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
echo "App available at: https://YOUR_CLOUDFRONT_DOMAIN"
```

## Cost Estimate

- **S3 Storage**: $0.023 per GB per month
- **CloudFront**: $0.085 per GB transfer
- **Typical monthly cost**: $0.50-5 for small to medium traffic

---

## 🎯 Manual Console Setup (Easier)

### S3 Setup:

1. AWS Console → S3 → Create bucket
2. Name: `math-practice-bianca-app`
3. Uncheck "Block all public access"
4. Properties → Static website hosting → Enable
5. Upload your `out/` folder contents

### CloudFront Setup:

1. AWS Console → CloudFront → Create distribution
2. Origin domain: Select your S3 bucket
3. Viewer protocol policy: Redirect HTTP to HTTPS
4. Default root object: `index.html`
5. Create distribution (takes 15-20 minutes)

### Custom Domain:

1. CloudFront → Add alternate domain name
2. Request SSL certificate via ACM
3. Update DNS to point to CloudFront domain
