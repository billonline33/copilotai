# AWS App Runner Deployment Guide

## Why AWS App Runner?

- **Container-based**: Full control over environment
- **Auto-scaling**: Handles traffic spikes automatically
- **Simple**: Easier than ECS/EKS
- **Production-ready**: Load balancing and health checks included

## Step-by-Step Deployment

### 1. Create Dockerfile

Create this file in your project root:

```dockerfile
# Use the official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]
```

### 2. Create .dockerignore

```dockerignore
node_modules
.next
.git
.env.local
cypress
doc
README.md
```

### 3. Test Docker Build Locally

```bash
# Build the image
docker build -t math-practice-app .

# Test locally
docker run -p 3000:3000 math-practice-app

# Test at http://localhost:3000
```

### 4. Deploy via AWS Console

1. **Navigate to App Runner**: AWS Console → App Runner
2. **Create Service**:

   - Source: "Source code repository"
   - Connect your GitHub repository
   - Branch: `main`
   - Build command: Automatic (uses Dockerfile)

3. **Configure Service**:

   - Service name: `math-practice-app`
   - Virtual CPU: 0.25 vCPU
   - Memory: 0.5 GB
   - Auto scaling: 1-10 instances

4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`

### 5. Custom Domain (Optional)

- Add custom domain in App Runner console
- Update DNS records as instructed

## Cost Estimate

- **Compute**: $0.007/vCPU/hour + $0.004/GB memory/hour
- **Requests**: $0.0000025 per request
- **Typical monthly cost**: $15-30 for small to medium traffic

## Auto-scaling Configuration

```yaml
Min instances: 1
Max instances: 10
Concurrency: 100 requests per instance
```

---

## 🚀 Quick Deploy Commands

```bash
# 1. Create Dockerfile (see above)
# 2. Test locally
docker build -t math-practice-app .
docker run -p 3000:3000 math-practice-app

# 3. Commit and push
git add Dockerfile .dockerignore
git commit -m "Add Docker configuration"
git push origin main

# 4. Follow App Runner console setup
```
