# CryptoTracker

CryptoTracker is a real-time cryptocurrency tracking application designed to help users monitor and manage their crypto assets effectively.

## Features

- Real-time cryptocurrency price tracking
- User authentication using JWT
- Portfolio management (add, update, delete)
- Favorites system for quick access
- Interactive charts for price visualization
- Dark/light theme toggle for user experience
- Responsive design for cross-device compatibility

## Technology Stack

### Frontend
- Next.js (latest version)
- TypeScript
- Tailwind CSS
- Recharts for charting
- Socket.IO Client

### Backend
- Node.js v16+
- Express
- TypeScript
- Socket.IO
- SQLite (for local development)
- JWT for authentication

### Deployment
- Frontend: Vercel
- Backend: Render or Heroku

## Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CryptoTracker
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### Environment Setup

Create a `.env` file in the backend directory with the following content:
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

### Running the Application

#### Using Docker (Recommended)
```bash
docker-compose up --build
```

#### Running Services Separately

1. Start backend:
```bash
cd backend
npm run dev
```

2. Start frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5003/api

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Docker Deployment

The application now includes a multi-stage Dockerfile for deployment:

```bash
docker build -t cryptotracker .
docker run -p 3000:3000 -p 5003:5003 cryptotracker
```

This will run both the frontend (port 3000) and backend (port 5003) services in a single container.

## Project Structure

```
├── backend
│   ├── src
│   │   ├── routes     # API route handlers
│   │   ├── services   # External API integrations
│   │   ├── db.ts      # Database connection setup
│   │   └── server.ts  # Main server entry point
│   └── ...
├── frontend
│   ├── components     # Reusable UI components
│   ├── pages          # Next.js pages and routing
│   ├── context        # Global state management
│   ├── services       # API and WebSocket clients
│   └── ...
├── Dockerfile         # Multi-stage Docker build
├── docker-compose.yml # Docker configuration
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cryptocurrency data provided by CoinGecko API
- Real-time updates powered by Socket.IO