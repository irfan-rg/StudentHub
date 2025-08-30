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
import { Toaster } from './components/ui/sonner';
import { FullPageLoading, LoadingSpinner } from './components/ui/loading';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './contexts/ThemeContext';

// API Configuration - Update these for your backend
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Helper Functions for Backend Integration
const api = {
  // Authentication endpoints
  login: async (credentials) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // }).then(res => res.json());
    
    // Mock response for now
    return Promise.resolve({ user: mockUser, token: 'mock-token' });
  },
  
  signup: async (userData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/auth/signup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // }).then(res => res.json());
    
    // Mock response for now
    return Promise.resolve({ user: { ...mockUser, ...userData }, token: 'mock-token' });
  },
  
  // User endpoints
  getProfile: async (userId) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/users/${userId}`).then(res => res.json());
    return Promise.resolve(mockUser);
  },
  
  updateProfile: async (userId, userData) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/users/${userId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // }).then(res => res.json());
    return Promise.resolve({ ...mockUser, ...userData });
  },
  
  // Skills endpoints
  getSkills: async () => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/skills`).then(res => res.json());
    return Promise.resolve([]);
  },
  
  // Sessions endpoints
  getSessions: async (userId) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/sessions/user/${userId}`).then(res => res.json());
    return Promise.resolve([]);
  }
};

// Mock user data - Remove this when connecting to backend
const mockUser = {
  id: 1,
  name: "Alex Chen",
  email: "alex.chen@university.edu",
  college: "MIT",
  educationLevel: "Undergraduate",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  skillsCanTeach: [
    { name: "React", level: "advanced" },
    { name: "JavaScript", level: "expert" },
    { name: "Python", level: "intermediate" },
    { name: "Data Analysis", level: "intermediate" },
    { name: "UI/UX Design", level: "advanced" },
    { name: "Machine Learning", level: "beginner" },
    { name: "TypeScript", level: "advanced" },
    { name: "Node.js", level: "intermediate" }
  ],
  skillsWantToLearn: ["Machine Learning", "DevOps", "System Design", "Advanced Statistics"],
  points: 2450,
  badges: ["Helper", "Quick Learner", "Top Contributor"],
  level: "Advanced",
  sessionsCompleted: 12,
  questionsAnswered: 34,
  questionsAsked: 18
};

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

// Auth Context Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            // TODO: Verify token with backend
            // const userData = await api.getProfile(JSON.parse(savedUser).id);
            
            // For now, use saved user data
            const userData = JSON.parse(savedUser);
            setUser(userData);
          } catch (error) {
            console.error('Session verification failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        // Add a small delay to ensure smooth transitions
        setTimeout(() => setLoading(false), 100);
      }
    };

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Authentication check timed out, setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    checkExistingSession();

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Authentication Handlers
  const handleLogin = async (credentials, redirectPath) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await api.login(credentials);
      
      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      
      // Navigate to dashboard or the page they were trying to access
      const safePath = typeof redirectPath === 'string' && redirectPath.startsWith('/')
        ? redirectPath
        : '/dashboard';
      navigate(safePath, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await api.signup(userData);
      
      // Store auth data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return React.cloneElement(children, {
    user,
    loading,
    error,
    handleLogin,
    handleSignup,
    handleLogout,
    updateUser
  });
}

// Main App Layout Component
function AppLayout({ 
  user, 
  loading, 
  error, 
  handleLogin, 
  handleSignup, 
  handleLogout, 
  updateUser 
}) {
  const location = useLocation();
  const isLoggedIn = !!user;
  
  // Pages that should not show sidebar
  const noSidebarRoutes = ['/signup', '/faq', '/contact', '/about', '/blog'];
  const showSidebar = isLoggedIn && !noSidebarRoutes.includes(location.pathname);

  // Show loading state while checking authentication
  if (loading) {
    return <FullPageLoading text="Loading your Student Hub..." />;
  }

  // Add a small loading state for route transitions
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  
  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
          onLogout={handleLogout}
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
                handleLogin={handleLogin}
              />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute user={user} loading={loading}>
              <SignupPage 
                loading={loading}
                error={error}
                handleSignup={handleSignup}
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
      <Toaster position="bottom-right" />
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
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}