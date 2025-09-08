# Project Structure

This document explains the organization of the CryptoTracker application.

## Overall Structure

```
CryptoTracker/
├── backend/                 # Backend API (Node.js + Express)
├── frontend/                # Frontend app (Next.js)
├── docker-compose.yml       # Docker configuration
├── README.md                # Main project documentation
├── DEPLOYMENT.md            # Deployment guide
└── PROJECT_STRUCTURE.md     # This file
```

## Backend Structure

```
backend/
├── src/                     # Source code
│   ├── routes/              # API routes
│   │   ├── auth.ts          # Authentication routes
│   │   ├── coins.ts         # Cryptocurrency data routes
│   │   ├── user.ts          # User-specific routes
│   │   └── index.ts         # Route registration
│   ├── server.ts            # Main server file
├── __tests__/               # Test files
├── dist/                    # Compiled TypeScript files
├── node_modules/            # Dependencies
├── package.json             # Backend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest configuration
├── Dockerfile               # Docker configuration
├── .env                     # Environment variables
└── README.md                # Backend documentation
```

### Backend Routes

1. **Authentication Routes** (`/api/auth`)
   - `POST /register` - User registration
   - `POST /login` - User login

2. **Coins Routes** (`/api/coins`)
   - `GET /` - Get all cryptocurrencies
   - `GET /:id` - Get specific cryptocurrency by ID

3. **User Routes** (`/api/user`)
   - `GET /favorites` - Get user's favorite cryptocurrencies
   - `POST /favorites/:coinId` - Add cryptocurrency to favorites
   - `DELETE /favorites/:coinId` - Remove cryptocurrency from favorites
   - `GET /portfolio` - Get user's portfolio
   - `POST /portfolio` - Add item to portfolio
   - `PUT /portfolio/:coinId` - Update portfolio item
   - `DELETE /portfolio/:coinId` - Remove item from portfolio

## Frontend Structure

```
frontend/
├── components/              # React components
│   ├── CoinTable.tsx        # Cryptocurrency data table
│   ├── Navbar.tsx           # Navigation bar
│   ├── ThemeToggle.tsx      # Dark/light theme toggle
│   ├── SearchBar.tsx        # Search component
│   ├── PriceAlert.tsx       # Price alert component
│   ├── PortfolioForm.tsx    # Portfolio form component
│   ├── Notification.tsx     # Notification component
│   └── ProtectedRoute.tsx   # Protected route component
├── context/                 # React context providers
│   ├── AuthContext.tsx      # Authentication context
│   └── NotificationContext.tsx # Notification context
├── pages/                   # Next.js pages
│   ├── index.tsx            # Homepage
│   ├── coins.tsx            # Cryptocurrency list page
│   ├── coin/[id].tsx        # Cryptocurrency detail page
│   ├── portfolio.tsx        # User portfolio page
│   ├── favorites.tsx        # User favorites page
│   ├── login.tsx            # Login page
│   ├── register.tsx         # Registration page
│   └── _app.tsx             # App component
├── services/                # Service modules
│   ├── api.ts               # API service
│   └── socket.ts            # WebSocket service
├── styles/                  # CSS and styling files
│   └── globals.css          # Global styles
├── types/                   # TypeScript interfaces
├── public/                  # Static assets
├── __tests__/               # Test files
├── node_modules/            # Dependencies
├── package.json             # Frontend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── jest.config.js           # Jest configuration
├── jest.setup.ts            # Jest setup
├── Dockerfile               # Docker configuration
└── README.md                # Frontend documentation
```

## Key Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Typed superset of JavaScript
- **Socket.IO** - Real-time communication
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Axios** - HTTP client

### Frontend
- **Next.js** - React framework
- **React** - UI library
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library
- **Socket.IO Client** - Real-time communication client
- **Axios** - HTTP client

## Data Flow

1. **Frontend** makes API requests to **Backend**
2. **Backend** processes requests and interacts with **PostgreSQL Database**
3. **Backend** returns data to **Frontend**
4. **Frontend** renders UI with received data
5. **Socket.IO** enables real-time communication between **Frontend** and **Backend**

## Authentication Flow

1. User registers or logs in through **Frontend**
2. **Frontend** sends credentials to **Backend** `/api/auth` routes
3. **Backend** validates credentials and generates JWT token
4. **Frontend** stores token in localStorage
5. **Frontend** includes token in Authorization header for subsequent requests
6. **Backend** middleware validates token for protected routes

## Real-time Updates

1. **Frontend** connects to **Backend** via Socket.IO
2. **Frontend** subscribes to price updates for specific cryptocurrencies
3. **Backend** sends real-time price updates through WebSocket connection
4. **Frontend** updates UI with new price data

## Deployment Architecture

```
Users → Vercel (Frontend) ↔ Render/Heroku (Backend) ↔ PostgreSQL (Database)
```

- **Frontend** deployed to Vercel
- **Backend** deployed to Render or Heroku
- **Database** hosted on managed PostgreSQL service