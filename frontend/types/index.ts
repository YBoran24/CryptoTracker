export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | undefined;
  price_change_percentage_24h: number | undefined;
  market_cap: number | undefined;
  total_volume: number | undefined;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role?: string; // Added role field for admin functionality
  favorites: string[];
  portfolio: PortfolioItem[];
}

export interface PortfolioItem {
  coinId: string;
  amount: number;
  purchasePrice: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role?: string; // Added role field for admin functionality
  };
}