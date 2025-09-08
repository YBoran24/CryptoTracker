# Deployment Guide

This guide explains how to deploy the CryptoTracker application to production environments.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Docker (optional, for containerized deployment)
- PostgreSQL database (for production)
- Accounts on deployment platforms (Vercel, Render/Heroku)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CryptoTracker
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Create `.env` files in both `backend` and `frontend` directories
   - Configure database connection, API keys, and other settings

4. Run the application locally:
   ```bash
   # Run backend (from backend directory)
   npm run dev
   
   # Run frontend (from frontend directory)
   npm run dev
   ```

## Docker Deployment

The application includes Dockerfiles for both frontend and backend, plus a docker-compose.yml for easy deployment.

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com

2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Deploy from the frontend directory:
   ```bash
   cd frontend
   vercel
   ```

4. Follow the prompts to configure the deployment:
   - Set the project name
   - Select the framework (Next.js)
   - Configure environment variables

5. For subsequent deployments:
   ```bash
   vercel --prod
   ```

## Backend Deployment (Render)

1. Create a Render account at https://render.com

2. Create a new Web Service:
   - Connect your GitHub repository
   - Set the root directory to `backend`
   - Set the build command to `npm run build`
   - Set the start command to `npm start`
   - Add environment variables

3. Create a PostgreSQL database on Render:
   - Go to Dashboard > New > PostgreSQL
   - Configure database settings
   - Note the connection string

4. Update environment variables in your Web Service:
   - DATABASE_URL: Your PostgreSQL connection string
   - JWT_SECRET: A secure random string
   - Other API keys as needed

## Backend Deployment (Heroku)

1. Create a Heroku account at https://heroku.com

2. Install Heroku CLI:
   ```bash
   # On macOS
   brew tap heroku/brew && brew install heroku
   
   # On Windows/Linux, download from https://devcenter.heroku.com/articles/heroku-cli
   ```

3. Log in to Heroku:
   ```bash
   heroku login
   ```

4. Create a new Heroku app:
   ```bash
   cd backend
   heroku create your-app-name
   ```

5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set DB_HOST=your_db_host
   heroku config:set DB_PORT=5432
   heroku config:set DB_NAME=your_db_name
   heroku config:set DB_USER=your_db_user
   heroku config:set DB_PASSWORD=your_db_password
   ```

6. Deploy the application:
   ```bash
   git push heroku main
   ```

7. Provision a PostgreSQL database:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
FRONTEND_URL=https://your-frontend-url.com

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Database Configuration
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# API Keys
COINGECKO_API_KEY=your_coingecko_api_key
```

### Frontend (.env)
```env
# Backend API URL
BACKEND_URL=https://your-backend-url.com
```

## Database Setup

1. Create the required tables:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     name VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE portfolios (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     coin_id VARCHAR(100) NOT NULL,
     amount DECIMAL NOT NULL,
     purchase_price DECIMAL NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE favorites (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     coin_id VARCHAR(100) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Monitoring and Maintenance

1. Set up logging:
   - Use platform-specific logging solutions
   - Monitor error rates and response times

2. Set up alerts:
   - Configure uptime monitoring
   - Set up notifications for critical errors

3. Regular maintenance:
   - Update dependencies regularly
   - Monitor database performance
   - Backup database periodically

## Troubleshooting

### Common Issues

1. **CORS errors**:
   - Ensure FRONTEND_URL is correctly set in backend environment variables
   - Check that the frontend URL matches exactly

2. **Database connection failures**:
   - Verify database credentials
   - Check that the database is accessible from the backend service

3. **Authentication issues**:
   - Ensure JWT_SECRET is the same in development and production
   - Check that tokens are being properly stored and sent

### Getting Help

- Check the application logs for error messages
- Review the documentation for each service (Vercel, Render, Heroku)
- Consult the community forums for the technologies used