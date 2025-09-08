# CryptoTracker Backend

This is the backend API for the CryptoTracker application, built with Node.js, Express, and TypeScript.

## Features

- User authentication with JWT
- Real-time cryptocurrency price updates with Socket.IO
- RESTful API for cryptocurrency data
- User portfolio and favorites management
- PostgreSQL database integration

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Typed superset of JavaScript
- **Socket.IO** - Real-time communication
- **PostgreSQL** - Database
- **JWT** - Authentication

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your values.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Coins
- `GET /api/coins` - Get all coins
- `GET /api/coins/:id` - Get specific coin by ID

### User
- `GET /api/user/favorites` - Get user favorites
- `POST /api/user/favorites/:coinId` - Add coin to favorites
- `DELETE /api/user/favorites/:coinId` - Remove coin from favorites
- `GET /api/user/portfolio` - Get user portfolio
- `POST /api/user/portfolio` - Add coin to portfolio
- `PUT /api/user/portfolio/:coinId` - Update coin in portfolio
- `DELETE /api/user/portfolio/:coinId` - Remove coin from portfolio

## Real-time Updates

The application uses Socket.IO for real-time price updates. Clients can connect to the WebSocket server and receive live updates.

## Database

The application uses PostgreSQL for storing user data, portfolios, and favorites.

## Deployment

The backend can be deployed to services like Render or Heroku.