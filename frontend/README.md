# CryptoTracker Frontend

This is the frontend for the CryptoTracker application, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Real-time cryptocurrency price tracking
- Interactive charts with Recharts
- User portfolio management
- Favorites system
- Dark/light theme toggle
- Responsive design for mobile and desktop

## Tech Stack

- **Next.js** - React framework for production
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library built on D3
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```

## Project Structure

```
├── components/          # Reusable components
├── pages/               # Next.js pages
├── styles/              # Global styles and Tailwind config
├── types/               # TypeScript interfaces
├── public/              # Static assets
```

## Pages

- **Home** (`/`) - Displays a list of top cryptocurrencies
- **Coin Details** (`/coin/[id]`) - Detailed view of a specific cryptocurrency
- **Portfolio** (`/portfolio`) - User's cryptocurrency portfolio
- **Favorites** (`/favorites`) - User's favorite cryptocurrencies

## Components

- **Navbar** - Navigation bar with links to all pages
- **CoinTable** - Sortable table displaying cryptocurrency data
- **ThemeToggle** - Component to switch between light and dark modes

## Styling

The application uses Tailwind CSS for styling with a dark mode option. The theme can be toggled using the button in the navbar.

## API Integration

The frontend connects to the backend API at `http://localhost:5000` by default. This can be configured in the `next.config.js` file.

## Deployment

The frontend can be deployed to Vercel with a single click.