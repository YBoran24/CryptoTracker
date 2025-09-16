# Render Deployment Guide for CryptoTracker Backend

This guide explains how to deploy the CryptoTracker backend to Render.

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub account with the repository forked/cloned
3. Node.js knowledge

## Deployment Steps

### 1. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

#### Service Settings
- **Name**: `cryptotracker-backend`
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (or `backend` if deploying from root)

#### Build Settings
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2. Environment Variables

Add the following environment variables in the Render dashboard:

| Variable | Value | Notes |
|----------|-------|-------|
| DATABASE_URL | `sqlite:./cryptotracker.db` | SQLite database file |
| JWT_SECRET | `your_production_jwt_secret_here` | Change this to a strong secret |
| FRONTEND_URL | `https://your-frontend.vercel.app` | Your Vercel frontend URL |

### 3. Advanced Settings (Optional)

- **Auto-Deploy**: Enabled (recommended)
- **Health Check Path**: `/health`
- **Instance Count**: 1 (can be increased for production)

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically start the deployment process
3. Wait for the build and deployment to complete

### 5. Verify Deployment

1. Once deployed, visit your service URL
2. Test the health endpoint: `https://your-service.onrender.com/health`
3. Check the logs in the Render dashboard for any errors

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure all dependencies are listed in package.json
   - Check that the build command is correct

2. **Database Connection Issues**
   - Verify DATABASE_URL is set correctly
   - For SQLite, ensure the file path is correct

3. **Environment Variables Not Set**
   - Check that all required environment variables are added in the Render dashboard
   - Make sure there are no extra spaces in the values

4. **Port Issues**
   - Ensure your application listens on the port specified by the `PORT` environment variable
   - In your server.ts file, use: `const PORT = process.env.PORT || 5003;`

### Checking Logs

1. Go to your service in the Render dashboard
2. Click on "Logs" tab
3. Review recent logs for any error messages

### Health Check

Render will periodically check your service health by accessing the health check path.
Make sure your application responds correctly to GET requests at `/health`.

## Scaling

For production usage:

1. **Increase Instance Count**: In the "Settings" tab, increase instance count
2. **Add Custom Domain**: In the "Settings" tab, add your custom domain
3. **Enable SSL**: Render automatically provides SSL for custom domains
4. **Set Up Alerts**: Configure notifications for deployment failures or performance issues

## Environment Variables Reference

### Required Variables
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `FRONTEND_URL`: URL of your frontend application

### Optional Variables
- `COINGECKO_API_KEY`: CoinGecko API key for higher rate limits
- `PORT`: Port to listen on (Render will set this automatically)

## Best Practices

1. **Security**
   - Use strong, unique secrets for JWT_SECRET
   - Never commit secrets to version control
   - Rotate secrets periodically

2. **Performance**
   - Monitor your service's performance
   - Use appropriate instance sizes for your traffic
   - Consider caching for frequently accessed data

3. **Monitoring**
   - Set up logging and monitoring
   - Configure alerts for critical issues
   - Regularly review logs for potential issues

4. **Backups**
   - For production, consider using a managed database service with automatic backups
   - For SQLite, ensure the database file is backed up regularly

## Updating Your Deployment

To update your deployment after making changes:

1. Push your changes to GitHub
2. Render will automatically start a new deployment (if auto-deploy is enabled)
3. Or manually trigger a deployment from the Render dashboard

## Support

If you encounter issues not covered in this guide:

1. Check the [Render documentation](https://render.com/docs)
2. Review your application logs
3. Contact Render support if it's an infrastructure issue
4. Check the application's error handling and logging