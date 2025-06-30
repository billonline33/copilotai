# AWS Amplify Deployment Troubleshooting

## Common Issues and Solutions

### Issue 1: npm ci fails with "package-lock.json not found"

**Symptoms:**

- Build fails with error: `npm ci can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync`
- Missing `package-lock.json` file

**Solution:**

1. Ensure `amplify.yml` exists in your project root with the following configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
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

2. **If amplify.yml is not being detected:**

   - Go to AWS Amplify Console → Your App → Build settings
   - Click "Edit"
   - Switch from "App build specification file (amplify.yml)" to custom build settings
   - Paste the YAML configuration above
   - Save changes

3. **Force a new deployment:**
   - Go to your app dashboard
   - Click "Run build" or "Redeploy this version"

### Issue 2: Build Configuration Not Applied

**Symptoms:**

- Amplify still tries to run `npm ci` despite `amplify.yml` being present
- Build settings don't reflect your `amplify.yml` file

**Solution:**

1. **Check Build Settings Detection:**

   - AWS Amplify Console → Your App → Build settings
   - Look for "App build specification found" message

2. **Manual Override:**

   - If automatic detection fails, manually set build commands:
   - Build settings → Edit → Use custom build specification
   - Copy the YAML from `amplify.yml`

3. **Clear Cache:**
   - Build settings → Edit → Advanced settings
   - Clear build cache if available
   - Redeploy

### Issue 3: Environment or Regional Issues

**Symptoms:**

- Intermittent build failures
- Timeouts during npm install

**Solution:**

1. **Check Node.js Version:**

   - Add to preBuild commands:

   ```yaml
   preBuild:
     commands:
       - node --version
       - npm --version
       - npm install
   ```

2. **Increase Build Timeout:**
   - Build settings → Advanced settings
   - Increase build timeout if available

### Issue 4: Next.js Specific Issues

**Symptoms:**

- Build succeeds but deployment fails
- Runtime errors in production

**Solution:**

1. **Verify Next.js Configuration:**

   - Ensure `next.config.ts` doesn't have conflicting settings
   - Test build locally: `npm run build`

2. **Check Output Directory:**
   - Verify `baseDirectory: .next` in `amplify.yml`
   - Ensure Next.js is generating static files

## Testing Your Local Build

Before deploying, always test locally:

```bash
# Install dependencies
npm install

# Run build
npm run build

# Test the built app (optional)
npm start
```

If local build fails, fix issues before deploying to Amplify.

## Manual Deployment Verification

After successful deployment:

1. **Test All Routes:**

   - Main page: `https://your-app.amplify.aws/`
   - Math practice: `https://your-app.amplify.aws/math-practice`

2. **Test Features:**

   - To-do list functionality
   - Math questions generation
   - Progress tracking
   - Mobile responsiveness

3. **Check Browser Console:**
   - Look for any JavaScript errors
   - Verify all assets load correctly

## Getting Help

If issues persist:

1. **Check Build Logs:**

   - Amplify Console → Your App → Build history
   - Click on failed build to see detailed logs

2. **Common Log Locations:**

   - Provision: Infrastructure setup
   - Build: npm install and build process
   - Deploy: File deployment to CDN

3. **Contact Support:**
   - Include build logs
   - Mention this is a Next.js React app
   - Reference this troubleshooting guide
