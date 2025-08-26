import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Landing } from './components/Landing';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { SkillMatching } from './components/SkillMatching';
import { SkillsManagement } from './components/SkillsManagement';
import { QAForum } from './components/QAForum';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { Sidebar } from './components/Navigation';
import { Toaster } from './components/ui/sonner';

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
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('authToken');
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to landing page but save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

// Public Route Component (redirects authenticated users)
function PublicRoute({ children }) {
  const isLoggedIn = localStorage.getItem('authToken');
  
  if (isLoggedIn) {
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
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // TODO: Verify token with backend
          // const userData = await api.getProfile(JSON.parse(savedUser).id);
          
          // For now, use saved user data
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Session verification failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  // Authentication Handlers
  const handleLogin = async (credentials) => {
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
      const location = window.location.state?.from?.pathname || '/dashboard';
      navigate(location, { replace: true });
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
function AppLayout({ user, handleLogout }) {
  const location = useLocation();
  const isLoggedIn = !!user;
  
  // Pages that should not show sidebar
  const noSidebarRoutes = ['/signup', '/skills-management'];
  const showSidebar = isLoggedIn && !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {showSidebar && (
        <Sidebar 
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className={showSidebar ? "ml-64" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <AuthProvider>
                <LandingPage />
              </AuthProvider>
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute>
              <AuthProvider>
                <SignupPage />
              </AuthProvider>
            </PublicRoute>
          } />

          {/* Public Info Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <AuthProvider>
                <ProfilePage />
              </AuthProvider>
            </ProtectedRoute>
          } />

          <Route path="/skills-management" element={
            <ProtectedRoute>
              <AuthProvider>
                <SkillsManagementPage />
              </AuthProvider>
            </ProtectedRoute>
          } />

          <Route path="/matching" element={
            <ProtectedRoute>
              <SkillMatching user={user} />
            </ProtectedRoute>
          } />

          <Route path="/qa" element={
            <ProtectedRoute>
              <QAForum user={user} />
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard user={user} />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <AuthProvider>
                <SettingsPage />
              </AuthProvider>
            </ProtectedRoute>
          } />

          {/* Catch-all route - redirect to dashboard if logged in, landing if not */}
          <Route path="*" element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          } />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

// Page Wrapper Components
function LandingPage({ user, loading, error, handleLogin }) {
  return <Landing onLogin={handleLogin} loading={loading} error={error} />;
}

function SignupPage({ user, loading, error, handleSignup }) {
  const navigate = useNavigate();
  return <Signup onSignup={handleSignup} onBack={() => navigate('/')} loading={loading} error={error} />;
}

function ProfilePage({ user, updateUser }) {
  return <Profile user={user} onUpdateUser={updateUser} />;
}

function SkillsManagementPage({ user, updateUser }) {
  const navigate = useNavigate();
  return <SkillsManagement user={user} onBack={() => navigate('/profile')} onUpdateUser={updateUser} />;
}

function SettingsPage({ user }) {
  const [settings, setSettings] = useState({
    theme: 'light',
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

  // Theme Management
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

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
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}