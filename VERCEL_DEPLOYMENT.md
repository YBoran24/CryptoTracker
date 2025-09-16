# Vercel Deployment Guide for CryptoTracker Frontend

This guide explains how to properly deploy the CryptoTracker frontend to Vercel with the correct configuration.

## Prerequisites

1. Make sure your backend is deployed and accessible via a public URL
2. Have your Vercel account ready

## Deployment Steps

### 1. Deploy Backend First

Before deploying the frontend, ensure your backend is deployed and running. You can use Render, Heroku, or any other hosting service.

After deploying your backend, note down the public URL. It should look something like:
```
https://your-backend-app.onrender.com
```

### 2. Configure Environment Variables in Vercel

When deploying to Vercel, you need to set the environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following environment variable:

```
BACKEND_URL=https://your-backend-app.onrender.com
```

### 3. Update next.config.js (Already done)

The [next.config.js](file:///c:/Users/erenc/CryptoTracker/frontend/next.config.js) file has been updated to properly handle the BACKEND_URL environment variable:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5003'
  }
}

module.exports = nextConfig
```

### 4. Deploy Using Vercel CLI

1. Install Vercel CLI if you haven't already:
```bash
npm install -g vercel
```

2. Navigate to the project root directory (not the frontend directory):
```bash
cd ..
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the prompts:
   - Set the project name
   - Select the framework (Next.js)
   - When asked for the "What is the main directory of your project?", enter `frontend`
   - Configure environment variables when prompted

### 5. Set Environment Variables in Vercel Dashboard

After the initial deployment:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add the following variable:
   - Name: `BACKEND_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend-app.onrender.com`)

### 6. Redeploy

After setting the environment variables, you need to redeploy:

1. Go to the "Deployments" tab
2. Click on the "..." menu for the latest deployment
3. Select "Redeploy"

## Troubleshooting

### Common Issues

1. **"Kripto para veri bilgisi alınamadı" Error**
   - Make sure your BACKEND_URL environment variable is set correctly in Vercel
   - Ensure your backend is running and accessible
   - Check that CORS is properly configured in your backend

2. **404 Errors**
   - Make sure your frontend routing is configured correctly
   - Check that all required pages exist in the `pages` directory
   - Verify that your Vercel project is configured to use Next.js

3. **CORS Errors**
   - Ensure your backend CORS configuration allows requests from your Vercel domain
   - Check that the FRONTEND_URL environment variable is set correctly in your backend

4. **Build Errors with Dynamic Routes**
   - If you encounter errors like "Cannot read properties of undefined", it's usually because dynamic routes ([id].tsx) are trying to access properties of undefined objects during static generation
   - Make sure to add proper null/undefined checks in your components
   - Use fallback values in getStaticProps for dynamic routes
   - Set fallback: 'blocking' in getStaticPaths for better handling of non-pre-rendered paths
   - For complex dynamic routes, consider using getServerSideProps instead of getStaticProps

### Checking Deployment Status

1. View logs in Vercel dashboard:
   - Go to your project
   - Click on "Deployments"
   - Select the latest deployment to view logs

2. Check environment variables:
   - Go to Settings > Environment Variables
   - Verify all variables are set correctly

### Testing the Deployment

1. After deployment, visit your Vercel URL
2. Check that the main page loads correctly
3. Try navigating to the coins page
4. Verify that cryptocurrency data is displayed (not the error message)

## Best Practices

1. **Environment Variables**: Always use environment variables for configuration that changes between environments
2. **Error Handling**: The frontend now has improved error handling for network issues
3. **Fallback Data**: The backend provides demo data when the CoinGecko API is not accessible
4. **CORS Configuration**: The backend is configured to handle CORS properly for various origins
5. **Dynamic Routes**: For dynamic routes like `/coin/[id]`, always implement proper error handling and fallback mechanisms to prevent build errors
6. **Static Generation**: For pages that require dynamic data, consider using client-side fetching instead of static generation to avoid build errors

## Updating Your Deployment

To update your deployment after making changes:

1. Commit your changes to git
2. Push to your repository
3. Vercel will automatically deploy the new changes
4. Or use `vercel --prod` to deploy manually

## Vercel Configuration Files

### Root Configuration

The root directory includes a [vercel.json](file:///c:/Users/erenc/CryptoTracker/vercel.json) file that tells Vercel how to handle the project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "BACKEND_URL": "https://your-backend-url.com"
  },
  "github": {
    "silent": true
  },
  "outputDirectory": "frontend"
}
```

### Frontend Configuration

The frontend directory has its own configuration files:
- [next.config.js](file:///c:/Users/erenc/CryptoTracker/frontend/next.config.js) - Next.js configuration
- [.env.local](file:///c:/Users/erenc/CryptoTracker/frontend/.env.local) - Local environment variables (not committed to git)

### Backend Configuration

The backend directory also includes a [vercel.json](file:///c:/Users/erenc/CryptoTracker/vercel.json) file for backend deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### Project Structure for Vercel

To ensure proper deployment to Vercel, we've added a placeholder `pages` directory in the root of the project. This helps Vercel correctly identify the Next.js project:

```
/pages/
  index.js (placeholder redirect file)
/frontend/
  pages/ (actual Next.js pages)
  next.config.js
  package.json
/backend/
  src/
  package.json
```

The placeholder file in the root `/pages` directory simply redirects to the actual frontend application.

### Handling Build Issues

If you encounter build issues locally:

1. Don't worry - these are often due to version mismatches between your local environment and Vercel's build environment
2. Vercel will correctly build and deploy your application using its own environment
3. If you still have issues on Vercel, check the deployment logs for specific error messages
4. Make sure all dependencies are properly listed in `package.json` files

### Dynamic Routes Best Practices

For dynamic routes like `/coin/[id]`:

1. Always implement proper error handling in components
2. Use fallback values in getStaticProps
3. Implement null/undefined checks before accessing object properties
4. Set fallback: 'blocking' in getStaticPaths for better handling
5. Provide meaningful error messages to users when data is not available
6. For complex dynamic routes that require real-time data, consider using client-side fetching instead of static generation
7. Return minimal data in getStaticProps and fetch detailed data on the client side