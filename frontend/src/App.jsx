import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Landing } from './components/Landing';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { SkillMatching } from './components/SkillMatching';
import { QAForum } from './components/QAForum';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { Sidebar } from './components/Navigation';
import {Sessions} from './components/Sessions';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { useAuthStore } from './stores/useAuthStore';
import { FullPageLoading, LoadingSpinner } from './components/ui/loading';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './contexts/ThemeContext';

// Using Zustand store for auth, no inline API mocks here

// Protected Route Component
function ProtectedRoute({ children, user, loading }) {
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <FullPageLoading text="Loading..." />;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

// Public Route Component (redirects authenticated users)
function PublicRoute({ children, user, loading }) {
  // Show loading state while checking authentication
  if (loading) {
    return <FullPageLoading text="Loading..." />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Using Zustand store instead of custom AuthProvider

// Main App Layout Component
function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading) || false;
  const error = useAuthStore(state => state.error) || null;
  const login = useAuthStore(state => state.login);
  const signup = useAuthStore(state => state.signup);
  const logout = useAuthStore(state => state.logout);
  const sessionExpired = useAuthStore(state => state.sessionExpired);
  const setSessionExpired = useAuthStore(state => state.setSessionExpired);
  const updateUser = useAuthStore(state => state.updateUser);

  // Initialize persisted store once
  const initialize = useAuthStore(state => state.initialize);
  useEffect(() => { initialize(); }, [initialize]);

  const location = useLocation();
  const isLoggedIn = !!user;
  
  // Add a small loading state for route transitions - MUST be before any early returns
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  
  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Pages that should not show sidebar
  const noSidebarRoutes = ['/signup', '/faq', '/contact', '/about', '/blog'];
  const showSidebar = isLoggedIn && !noSidebarRoutes.includes(location.pathname);

  // Show loading state while checking authentication - AFTER all hooks are declared
  if (loading) {
    return <FullPageLoading text="Loading your Student Hub..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Route transition loading indicator */}
      {isRouteChanging && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
        </div>
      )}
      
      {showSidebar && (
        <Sidebar 
          user={user}
          onLogout={logout}
        />
      )}
      <main className={showSidebar ? "pl-64" : ""} style={showSidebar ? { paddingLeft: '16rem' } : undefined}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute user={user} loading={loading}>
              <LandingPage 
                loading={loading}
                error={error}
                handleLogin={(creds, redirectPath) => {
                  login(creds).then(() => {
                    const safePath = typeof redirectPath === 'string' && redirectPath.startsWith('/') ? redirectPath : '/dashboard';
                    console.log('Login successful, redirecting to:', safePath);
                    navigate(safePath, { replace: true });
                  }).catch(() => {});
                }}
              />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute user={user} loading={loading}>
              <SignupPage 
                loading={loading}
                error={error}
                handleSignup={async (userData) => {
                  try {
                    await signup(userData);
                    navigate('/dashboard', { replace: true });
                  } catch (e) {}
                }}
              />
            </PublicRoute>
          } />

          {/* Public Info Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user} loading={loading}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute user={user} loading={loading}>
              <ProfilePage user={user} updateUser={updateUser} />
            </ProtectedRoute>
          } />

          

          <Route path="/matching" element={
            <ProtectedRoute user={user} loading={loading}>
              <SkillMatching user={user} />
            </ProtectedRoute>
          } />

          <Route path="/qa" element={
            <ProtectedRoute user={user} loading={loading}>
              <QAForum user={user} />
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute user={user} loading={loading}>
              <Leaderboard user={user} />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute user={user} loading={loading}>
              <SettingsPage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/sessions" element={
            <ProtectedRoute user={user} loading={loading}>
              <Sessions user={user} />
            </ProtectedRoute>
          } />

          {/* Catch-all route - redirect to dashboard if logged in, landing if not */}
          <Route path="*" element={
            loading ? (
              <FullPageLoading text="Loading..." />
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>
      </main>
      {/* Notification widget is intentionally only shown on Dashboard */}
      <Toaster position="bottom-right" />
      {/* Global session expired modal */}
      <Dialog open={sessionExpired} onOpenChange={(open) => { if (!open) setSessionExpired(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your session has expired</DialogTitle>
            <DialogDescription>
              For your security, we have logged you out. Please log in again to continue using the platform.
            </DialogDescription>
          </DialogHeader>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => { setSessionExpired(false); }}>
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={async () => {
                    await logout();
                    setSessionExpired(false);
                    navigate('/', { replace: true });
                  }}
                >Log in to continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Page Wrapper Components
function LandingPage({ user, loading, error, handleLogin }) {
  const location = useLocation();
  const fromPath = (location.state && location.state.from && location.state.from.pathname) ? location.state.from.pathname : '/dashboard';
  return <Landing onLogin={(creds) => handleLogin(creds, fromPath)} loading={loading} error={error} />;
}

function SignupPage({ user, loading, error, handleSignup }) {
  const navigate = useNavigate();
  return <Signup onSignup={handleSignup} onBack={() => navigate('/')} loading={loading} error={error} />;
}

function ProfilePage({ user, updateUser }) {
  return <Profile user={user} onUpdateUser={updateUser} />;
}



function SettingsPage({ user }) {
  const { theme } = useTheme();
  const [settings, setSettings] = useState({
    theme: theme,
    fontSize: 'medium',
    compactMode: false
  });

  // Settings Handler
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // TODO: Save settings to backend if user is logged in
    if (user) {
      // api.updateUserSettings(user.id, { ...settings, ...newSettings });
    }
  };

  // Update settings when theme changes
  useEffect(() => {
    setSettings(prev => ({ ...prev, theme }));
  }, [theme]);

  // Font Size Management
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      small: '12px',
      medium: '14px',
      large: '16px'
    };

    root.style.setProperty('--font-size', fontSizes[settings.fontSize]);
  }, [settings.fontSize]);

  // Compact Mode Management
  useEffect(() => {
    const root = document.documentElement;
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [settings.compactMode]);

  return <Settings user={user} settings={settings} onUpdateSettings={updateSettings} />;
}

// Main App Component
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppLayout />
      </Router>
    </ErrorBoundary>
  );
}