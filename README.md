# CryptoTracker

A real-time cryptocurrency tracking application with Next.js frontend and Node.js/Express backend.

## Features

- Real-time cryptocurrency price tracking
- User authentication with JWT
- Portfolio management
- Favorites system
- Interactive charts
- Dark/light theme toggle
- Responsive design

## Tech Stack

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Socket.IO** - Real-time communication
- **PostgreSQL** - Database
- **JWT** - Authentication

### Database
- **PostgreSQL** - Relational database

### Deployment
- **Vercel** - Frontend hosting
- **Render/Heroku** - Backend hosting

## Project Structure

```
├── backend/             # Backend API (Node.js + Express)
│   ├── src/             # Source code
│   │   ├── routes/      # API routes
│   │   └── server.ts    # Main server file
│   ├── package.json     # Backend dependencies
│   └── README.md        # Backend documentation
│
├── frontend/            # Frontend app (Next.js)
│   ├── components/       # React components
│   ├── pages/            # Next.js pages
│   ├── styles/           # CSS and Tailwind config
│   ├── types/            # TypeScript interfaces
│   ├── package.json      # Frontend dependencies
│   └── README.md        # Frontend documentation
│
├── docker-compose.yml   # Docker configuration
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (if running locally)

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

### Running the Application

#### Option 1: Using Docker (Recommended)
```bash
docker-compose up --build
```

#### Option 2: Running Services Separately

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories with the required environment variables.

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

## Deployment

### Frontend
Deploy to Vercel:
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy

### Backend
Deploy to Render or Heroku:
1. Create an account on Render or Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

## Development

### Adding New Features

1. Backend:
   - Add new routes in `backend/src/routes/`
   - Implement business logic in route handlers
   - Update database schema if needed

2. Frontend:
   - Create new pages in `frontend/pages/`
   - Add new components in `frontend/components/`
   - Update TypeScript interfaces in `frontend/types/`

### Testing

Run tests for both frontend and backend:
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if any)
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on the GitHub repository.