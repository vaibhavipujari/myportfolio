import { useState, useEffect } from 'react';
import { getSession, onAuthStateChange } from '../lib/auth';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { CreateAdminAccount } from '../components/admin/CreateAdminAccount';
import { motion } from 'motion/react';

type View = 'login' | 'signup' | 'dashboard';

export function Admin() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're returning from OAuth callback
    const hash = window.location.hash;
    const isOAuthCallback = hash.includes('access_token') || hash.includes('error');

    if (isOAuthCallback) {
      console.log('OAuth callback detected, waiting for session...');
      setIsLoading(true);
      // Give Supabase time to process the OAuth callback
      setTimeout(() => {
        checkAuth();
      }, 1000);
    } else {
      checkAuth();
    }

    // Check for signup hash
    if (hash === '#signup') {
      setCurrentView('signup');
      setIsLoading(false);
    }

    // Listen for hash changes (but ignore OAuth hashes)
    const handleHashChange = () => {
      const newHash = window.location.hash;
      // Ignore OAuth callback hashes
      if (newHash.includes('access_token') || newHash.includes('error')) {
        return;
      }

      if (newHash === '#signup') {
        setCurrentView('signup');
      } else if (newHash === '' || newHash === '#') {
        // Only change to login if not authenticated
        if (!isAuthenticated) {
          setCurrentView('login');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((session) => {
      console.log('Auth state changed:', !!session);
      setIsAuthenticated(!!session);
      if (session) {
        console.log('Session detected, showing dashboard');
        setCurrentView('dashboard');
        setIsLoading(false);
        // Clean up OAuth hash from URL
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (window.location.hash !== '#signup') {
        setCurrentView('login');
      }
    });

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const session = await getSession();
      console.log('Session:', session);
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    console.log('Login handler called');
    await checkAuth();
  };

  const handleLogout = () => {
    console.log('Logout handler called');
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleShowSignup = () => {
    setCurrentView('signup');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleAccountCreated = () => {
    setCurrentView('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </motion.div>
      </div>
    );
  }

  if (currentView === 'signup') {
    return <CreateAdminAccount onAccountCreated={handleAccountCreated} onBackToLogin={handleShowLogin} />;
  }

  if (isAuthenticated && currentView === 'dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <AdminLogin onLogin={handleLogin} />;
}
