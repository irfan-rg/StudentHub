import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ui/theme-toggle';
import { 
  Home, 
  User, 
  Users, 
  MessageSquare, 
  Trophy, 
  Settings as SettingsIcon, 
  LogOut,
  Star,
  Zap
} from 'lucide-react';

export function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/matching', label: 'Skill Matching', icon: Users },
    { path: '/qa', label: 'Q&A Forum', icon: MessageSquare },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    return currentPath === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg z-10">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        {/* Logo and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">StudyHub</span>
        </div>
        
        {/* User Info with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {user?.name?.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sidebar-foreground">{user?.name}</p>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-sm text-sidebar-foreground/70">{user?.points} pts</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block w-full"
          >
            <Button
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive(item.path)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Badges Section */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <h4 className="font-medium mb-3 text-sidebar-foreground">Recent Badges</h4>
        <div className="flex flex-wrap gap-2">
          {user?.badges?.slice(0, 3).map((badge, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}