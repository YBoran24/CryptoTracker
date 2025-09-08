import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:5003/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login for specific routes that require authentication
    if (error.response?.status === 401) {
      const requiresAuth = [
        
        '/user/portfolio'
      ];
      
      // Check if the request URL requires authentication
      // We need to check the full URL path, not just if it includes the path
      const requestUrl = error.config?.url || '';
      const shouldRedirect = requiresAuth.some(path => 
        requestUrl.endsWith(path)
      );
      
      if (shouldRedirect) {
        // Handle unauthorized access for protected routes
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // For other routes (like /coins), we just return the error to be handled by the calling function
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) => 
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
};

// Coins API
export const coinsAPI = {
  getAllCoins: () => api.get('/coins'),
  getCoinById: (id: string) => api.get(`/coins/${id}`),
};

// User API
export const userAPI = {
  getFavorites: () => api.get('/user/favorites'),
  addFavorite: (coinId: string) => api.post(`/user/favorites/${coinId}`),
  removeFavorite: (coinId: string) => api.delete(`/user/favorites/${coinId}`),
  getPortfolio: () => api.get('/user/portfolio'),
  addToPortfolio: (data: { coinId: string; amount: number; purchasePrice: number }) => 
    api.post('/user/portfolio', data),
  updatePortfolio: (coinId: string, data: { amount: number; purchasePrice: number }) => 
    api.put(`/user/portfolio/${coinId}`, data),
  removeFromPortfolio: (coinId: string) => api.delete(`/user/portfolio/${coinId}`),
};

export default api;