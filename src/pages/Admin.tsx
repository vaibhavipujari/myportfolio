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
    checkAuth();

    // Check for signup hash
    if (window.location.hash === '#signup') {
      setCurrentView('signup');
      setIsLoading(false);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#signup') {
        setCurrentView('signup');
      } else {
        setCurrentView('login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((session) => {
      console.log('Auth state changed:', !!session);
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentView('dashboard');
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

  if (currentView === 'login' || !isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
