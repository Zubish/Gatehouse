import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGatehouse } from './context/GatehouseContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MusaAssistantDrawer } from './components/views/MusaAssistantDrawer';
import { Bot } from 'lucide-react';
import type { ViewRoute } from './types';
import { AppRoutes } from './components/routes/AppRoutes';

export function App() {
  const { setActiveTab } = useGatehouse();
  const [isMusaOpen, setIsMusaOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  let currentView: ViewRoute = 'landing';
  if (pathname === '/') currentView = 'landing';
  else currentView = pathname.substring(1) as ViewRoute;

  useEffect(() => {
    setActiveTab(currentView);
  }, [currentView, setActiveTab]);

  const handleNavigate = (view: ViewRoute) => {
    if (view === 'landing') {
      navigate('/');
    } else {
      navigate(`/${view}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicFullWidthPage = [
    'landing',
    'login',
    'register',
    'public-reg',
    'my-passes',
    'privacy-policy',
    'terms-of-service',
    'security-sla',
    'admin',
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {isPublicFullWidthPage && (
        <Topbar currentView={currentView} onNavigate={handleNavigate} />
      )}

      <div className="flex-1 flex w-full">
        {!isPublicFullWidthPage && (
          <Sidebar currentView={currentView} onNavigate={handleNavigate} />
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <AppRoutes />
        </main>
      </div>

      <button
        onClick={() => setIsMusaOpen(!isMusaOpen)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-full shadow-2xl shadow-indigo-600/50 flex items-center space-x-2 transition-all group"
        title="Open Musa AI Gate Assistant"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-bold text-xs pr-1">Musa AI</span>
      </button>

      <MusaAssistantDrawer isOpen={isMusaOpen} onClose={() => setIsMusaOpen(false)} />

      {isPublicFullWidthPage && !['landing', 'privacy-policy', 'terms-of-service', 'security-sla'].includes(currentView) && (
        <footer className="border-t border-border/40 py-6 text-center text-xs font-mono text-muted-foreground">
          <div className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Gatehouse Inc. All rights reserved. &bull;{' '}
            <button onClick={() => handleNavigate('terms-of-service')} className="hover:underline hover:text-foreground cursor-pointer">
              Terms of Service
            </button>{' '}
            &bull;{' '}
            <button onClick={() => handleNavigate('privacy-policy')} className="hover:underline hover:text-foreground cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
