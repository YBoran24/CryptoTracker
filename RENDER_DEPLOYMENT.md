# Render Deployment Guide

This guide will help you deploy the CryptoTracker application to Render using Docker.

## Prerequisites

1. A Render account (free or paid tier)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: CryptoTracker
   - **Region**: Choose your preferred region
   - **Branch**: main (or your default branch)
   - **Root Directory**: Leave empty (root of repository)
   - **Environment**: Docker
   - **Dockerfile Path**: Dockerfile (should be auto-detected)
   - **Plan**: Free or paid as per your needs

### 2. Configure Environment Variables

In the "Advanced" section, add these environment variables:

```
# Frontend variables
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com/api

# Backend variables
DATABASE_URL=sqlite:./cryptotracker.db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
FRONTEND_URL=https://your-frontend-service.onrender.com
```

Note: Replace `your-backend-service.onrender.com` and `your-frontend-service.onrender.com` with your actual service URLs after deployment.

### 3. Deploy

Click "Create Web Service" to start the deployment process.

## Troubleshooting

### Common Issues and Solutions

1. **Docker build errors**:
   - Ensure your Dockerfile is in the root of your repository
   - Check that all necessary files are included and not excluded in .dockerignore

2. **Missing build scripts**:
   - The Dockerfile now uses a multi-stage build process to properly build both frontend and backend

3. **Database issues**:
   - The application uses SQLite for simplicity, which works well on Render
   - Data will persist as long as the service is not destroyed

4. **CORS errors**:
   - Ensure `FRONTEND_URL` environment variable is set correctly in your backend
   - The backend is configured to accept requests from the frontend URL

5. **Port configuration**:
   - The frontend runs on port 3000
   - The backend runs on port 5003
   - Both are exposed in the Dockerfile

## Post-Deployment Steps

1. After deployment, note the URLs of your services:
   - Frontend: https://your-service-name.onrender.com
   - Backend API: https://your-service-name.onrender.com/api

2. Update the `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` environment variables with the actual URLs if needed.

3. Test the application by:
   - Visiting the frontend URL
   - Checking that cryptocurrency data loads
   - Testing user registration and login
   - Verifying that the coin detail pages work correctly

## Scaling Considerations

For production use:

1. **Database**: Consider migrating to PostgreSQL for better performance and data persistence
2. **Environment Variables**: Use strong, unique secrets for JWT_SECRET in production
3. **Custom Domain**: Add a custom domain in the Render dashboard
4. **Health Checks**: Implement health check endpoints for better monitoring

## Support

If you encounter any issues during deployment:

1. Check the build logs in your Render dashboard
2. Verify all environment variables are set correctly
3. Ensure your repository structure matches the expected format
4. Confirm that the Dockerfile is in the root directory