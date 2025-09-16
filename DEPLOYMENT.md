# Deployment Guide for CryptoTracker

This guide explains how to deploy both the frontend and backend of the CryptoTracker application.

## Prerequisites

1. Node.js v16+ installed
2. Git installed
3. Accounts for deployment platforms (Vercel for frontend, Render/Heroku for backend)

## Backend Deployment

### Local Development Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory with the following content:
```env
# SQLite Connection (for local development)
DATABASE_URL=sqlite:./cryptotracker.db

# JWT Secret - Change this in production!
JWT_SECRET=my_jwt_secret_key_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CoinGecko API Key (optional)
COINGECKO_API_KEY=
```

3. Start the backend server:
```bash
npm run dev
```

### Deploying to Render (Recommended)

1. Create an account at [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following values:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Environment variables:
     ```env
     DATABASE_URL=sqlite:./cryptotracker.db
     JWT_SECRET=your_production_jwt_secret_here
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

### Deploying to Heroku

1. Create an account at [Heroku](https://heroku.com)
2. Install Heroku CLI
3. Login to Heroku CLI:
```bash
heroku login
```

4. Create a new app:
```bash
heroku create your-app-name
```

5. Set environment variables:
```bash
heroku config:set DATABASE_URL=sqlite:./cryptotracker.db
heroku config:set JWT_SECRET=your_production_jwt_secret_here
heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
```

6. Deploy:
```bash
git push heroku main
```

## Frontend Deployment

### Deploying to Vercel

1. Create an account at [Vercel](https://vercel.com)
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Navigate to the frontend directory:
```bash
cd frontend
```

4. Deploy:
```bash
vercel
```

5. Set environment variables in Vercel dashboard:
   - Name: `BACKEND_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend-app.onrender.com`)

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | Database connection string | sqlite:./cryptotracker.db |
| JWT_SECRET | Secret key for JWT tokens | your_secret_key_here |
| FRONTEND_URL | URL of the frontend application | https://your-frontend.vercel.app |
| COINGECKO_API_KEY | Optional CoinGecko API key | your_api_key_here |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| BACKEND_URL | URL of the backend API | https://your-backend.onrender.com |

## Database Information

The application currently uses SQLite for data storage. For production deployments, you might want to consider using PostgreSQL or another production-grade database.

### SQLite Database Schema

The application creates the following tables:

1. **users** - Stores user account information
2. **favorites** - Stores user's favorite cryptocurrencies
3. **portfolio** - Stores user's cryptocurrency portfolio

## Troubleshooting

### Common Issues

1. **"Kripto para veri bilgisi alınamadı" Error**
   - Make sure your BACKEND_URL environment variable is set correctly in Vercel
   - Ensure your backend is running and accessible
   - Check that CORS is properly configured in your backend

2. **Authentication Issues**
   - Verify that JWT_SECRET is set correctly in your backend
   - Check that the secret is the same in both development and production

3. **Database Connection Issues**
   - Ensure DATABASE_URL is correctly set
   - Check that the database file is accessible (for SQLite)

### Checking Deployment Status

1. View logs in deployment platform dashboard
2. Check environment variables are set correctly
3. Verify all required services are running

## Best Practices

1. **Security**: Always use strong, unique secrets for JWT_SECRET in production
2. **Environment Variables**: Never commit sensitive information to version control
3. **Database**: For production, consider using a managed database service
4. **Monitoring**: Set up logging and monitoring for your deployed applications