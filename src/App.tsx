import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Landing } from './components/Landing';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { TechStack } from './components/TechStack';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { Admin } from './pages/Admin';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Handle hash changes for single-page routing
    const handleHashChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Check if current route is admin
  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <Admin />
        <Toaster theme="dark" />
      </>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main>
        <Landing />
        <About />
        <Projects />
        <TechStack />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" />
    </div>
  );
}
