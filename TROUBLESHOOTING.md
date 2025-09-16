# Troubleshooting Guide for CryptoTracker

This guide will help you diagnose and fix common issues with the CryptoTracker application, particularly the "Kripto paralar verisi alınamadı: Bilinmeyen hata" error.

## Common Issues and Solutions

### 1. Backend Not Running or Not Accessible

**Symptoms:**
- "Kripto paralar verisi alınamadı: Bilinmeyen hata" message
- "Sunucuya bağlanılamadı" error

**Solutions:**
1. Make sure the backend server is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Check if the backend is accessible by visiting:
   - http://localhost:5003/health (should return {"status":"OK",...})
   - http://localhost:5003/api/coins (should return cryptocurrency data)

3. Verify the PORT in your backend [.env](file:///c:/Users/erenc/CryptoTracker/backend/.env) file is set to 5003:
   ```
   PORT=5003
   ```

### 2. Frontend-Backend Communication Issues

**Symptoms:**
- "Kripto paralar verisi alınamadı: Bilinmeyen hata" message
- CORS errors in browser console

**Solutions:**
1. Check your frontend [.env.local](file:///c:/Users/erenc/CryptoTracker/frontend/.env.local) file:
   ```
   BACKEND_URL=http://localhost:5003
   ```

2. Verify the FRONTEND_URL in your backend [.env](file:///c:/Users/erenc/CryptoTracker/backend/.env) file:
   ```
   FRONTEND_URL=http://localhost:3000
   ```

3. If deploying to Vercel, make sure to set the BACKEND_URL environment variable in your Vercel project settings:
   - Name: `BACKEND_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend-app.onrender.com`)

### 3. CoinGecko API Issues

**Symptoms:**
- "CoinGecko API is not accessible" errors
- Demo data showing instead of real data

**Solutions:**
1. Check your internet connection
2. Visit https://api.coingecko.com/api/v3/ping in your browser to verify CoinGecko API is accessible
3. If you have a CoinGecko API key, add it to your backend [.env](file:///c:/Users/erenc/CryptoTracker/backend/.env) file:
   ```
   COINGECKO_API_KEY=your_coingecko_api_key_here
   ```

### 4. Environment Variable Issues

**Symptoms:**
- "Bilinmeyen hata" messages
- Unexpected behavior

**Solutions:**
1. Ensure all required environment variables are set:
   - Frontend: [frontend/.env.local](file:///c:/Users/erenc/CryptoTracker/frontend/.env.local)
   - Backend: [backend/.env](file:///c:/Users/erenc/CryptoTracker/backend/.env)

2. Restart both frontend and backend servers after changing environment variables

## Debugging Steps

### Step 1: Check Backend Health

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Visit http://localhost:5003/health in your browser
3. You should see:
   ```json
   {
     "status": "OK",
     "message": "CryptoTracker API is running",
     "timestamp": "2023-..."
   }
   ```

### Step 2: Check Coins API Endpoint

1. Visit http://localhost:5003/api/coins in your browser
2. You should see JSON data with cryptocurrency information

### Step 3: Check Frontend Environment

1. Verify [frontend/.env.local](file:///c:/Users/erenc/CryptoTracker/frontend/.env.local) contains:
   ```
   BACKEND_URL=http://localhost:5003
   ```

2. Restart the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

### Step 4: Check Browser Console

1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Look for any error messages when loading the coins page

### Step 5: Check Network Tab

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Reload the coins page
4. Look for failed requests to `/api/coins`
5. Check the response status and error messages

## Deployment Issues

### Vercel Deployment

1. Make sure to set the BACKEND_URL environment variable in Vercel:
   - Go to your Vercel project dashboard
   - Settings > Environment Variables
   - Add: `BACKEND_URL` = `https://your-deployed-backend-url.com`

2. Redeploy your frontend after setting environment variables

### Backend Deployment

1. When deploying your backend, make sure to:
   - Set the PORT environment variable (typically 80 or 443 for production)
   - Set the FRONTEND_URL to your Vercel domain (e.g., `https://your-frontend.vercel.app`)
   - Configure any required database connections

## Common Error Messages and Solutions

### "Kripto paralar verisi alınamadı: Bilinmeyen hata"

This usually indicates a communication issue between frontend and backend. Check:
1. Is the backend server running?
2. Are the BACKEND_URL and FRONTEND_URL environment variables set correctly?
3. Are there any CORS errors in the browser console?

### "Sunucuya bağlanılamadı"

This indicates the frontend cannot reach the backend server. Check:
1. Is the backend server running on the specified port?
2. Is there a firewall blocking the connection?
3. Are the URLs in environment variables correct?

### "CoinGecko API is not accessible"

This indicates issues connecting to the CoinGecko API. Check:
1. Is your internet connection working?
2. Can you access https://api.coingecko.com/api/v3/ping in your browser?
3. Do you need to use a CoinGecko API key for higher rate limits?

## Additional Debugging Tips

1. **Enable detailed logging**: The backend now includes more detailed error logging. Check the terminal where you're running the backend server for error messages.

2. **Check browser developer tools**: The Network tab will show you exactly what requests are being made and what responses are received.

3. **Test API endpoints directly**: You can test backend endpoints directly in your browser or using tools like Postman to isolate where the issue is occurring.

4. **Verify environment variables**: Make sure all environment variables are set correctly in both frontend and backend.

5. **Restart servers**: After making configuration changes, always restart both frontend and backend servers.