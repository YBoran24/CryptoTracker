import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Added state for admin login toggle
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      router.push('/portfolio');
    } catch (err) {
      setError('Geçersiz e-posta veya şifre');
    } finally {
      setLoading(false);
    }
  };

  // Added admin login credentials
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For demo purposes, using hardcoded admin credentials
    // In a real application, this would be handled by the backend
    if (email === 'admin@cryptotracker.com' && password === 'admin123') {
      // Simulate admin login
      const adminUser = {
        id: 0,
        email: 'admin@cryptotracker.com',
        name: 'Admin',
        role: 'admin'
      };
      
      const token = 'admin-token'; // This would be a real JWT in production
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      // Update auth context
      window.location.href = '/portfolio';
    } else {
      setError('Geçersiz yönetici kimlik bilgileri');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>CryptoTracker - Giriş</title>
          <meta name="description" content="CryptoTracker hesabınıza giriş yapın" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {isAdminLogin ? 'Yönetici Girişi' : 'Hesabınıza giriş yapın'}
            </h2>
          </div>
          
          {/* Toggle between user and admin login */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`px-4 py-2 rounded-md ${
                !isAdminLogin 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Kullanıcı Girişi
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`px-4 py-2 rounded-md ${
                isAdminLogin 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Yönetici Girişi
            </button>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={isAdminLogin ? handleAdminLogin : handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  E-posta adresi
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                  placeholder={isAdminLogin ? "admin@cryptotracker.com" : "E-posta adresi"}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                  placeholder={isAdminLogin ? "admin123" : "Şifre"}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifrenizi mi unuttunuz?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? (isAdminLogin ? 'Giriş yapılıyor...' : 'Giriş yapılıyor...') : (isAdminLogin ? 'Yönetici Girişi' : 'Giriş yap')}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hesabınız yok mu?{' '}
              <button
                onClick={() => router.push('/register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Kayıt ol
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}