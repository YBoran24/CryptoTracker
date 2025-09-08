import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ProtectedRoute from '@/components/ProtectedRoute'; // ✅ buraya import
import { useRouter } from 'next/router';

const protectedRoutes = ['/portfolio', '/favorites']; // ✅ sadece bunlar login ister

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isProtected = protectedRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            {isProtected ? (
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default MyApp;
