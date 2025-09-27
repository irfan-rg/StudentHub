import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  Clock,
  UserPlus,
  MessageCircle,
  List
} from 'lucide-react';
import { notificationService } from '../services/api';

// Mock notification data - focused on 3 main categories
const mockNotifications = [
  {
    id: 1,
    type: 'session_reminder',
    title: 'Session Starting Soon',
    message: 'React Basics session with John Doe starts in 15 minutes',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionUrl: '/sessions',
    metadata: { sessionId: 123, mentorName: 'John Doe' }
  },
  {
    id: 2,
    type: 'session_reminder',
    title: 'Upcoming Session Tomorrow',
    message: 'JavaScript Advanced session with Sarah Chen at 2:00 PM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/sessions',
    metadata: { sessionId: 124, mentorName: 'Sarah Chen' }
  },
  {
    id: 3,
    type: 'connection_request',
    title: 'New Connection Request',
    message: 'Alex Kim wants to connect for Machine Learning help',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/matching',
    metadata: { userId: 456, userName: 'Alex Kim' }
  },
  {
    id: 4,
    type: 'connection_request',
    title: 'Connection Request',
    message: 'Maria Garcia would like to learn React from you',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/matching',
    metadata: { userId: 457, userName: 'Maria Garcia' }
  },
  {
    id: 5,
    type: 'qa_activity',
    title: 'New Answer on Your Question',
    message: 'Someone answered "How to optimize React performance?"',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/qa',
    metadata: { questionId: 789 }
  },
  {
    id: 6,
    type: 'qa_activity',
    title: 'Question Upvoted',
    message: 'Your question about Node.js got 5 upvotes',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/qa',
    metadata: { questionId: 790 }
  }
];

// Notification type configurations - 3 main categories
const notificationConfig = {
  session_reminder: {
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    priority: 'high',
    label: 'Session'
  },
  connection_request: {
    icon: UserPlus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    priority: 'medium',
    label: 'Connection'
  },
  qa_activity: {
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    priority: 'medium',
    label: 'Q&A'
  }
};

// Utility function to format relative time
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return timestamp.toLocaleDateString();
};

export default function NotificationWidget({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [lastFetch, setLastFetch] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('all');
  const scrollRef = useRef(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      // In production, replace mockNotifications with API call
      // const response = await notificationService.getNotifications();
      // setNotifications(response.data);
      
      // For now, use mock data but simulate API behavior
      setNotifications(mockNotifications);
      setLastFetch(Date.now());
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Initial load and auto-refresh notifications
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // WebSocket connection for real-time notifications (structure for future implementation)
  useEffect(() => {
    // TODO: Implement WebSocket connection when backend supports it
    // const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/notifications/ws`);
    // 
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   setNotifications(prev => [notification, ...prev]);
    // };
    // 
    // ws.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    // };
    // 
    // return () => {
    //   ws.close();
    // };
  }, [user?.id]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    try {
      // In production, uncomment this API call
      // await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert optimistic update on error
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: false } : n
        )
      );
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const previousState = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    try {
      // In production, uncomment this API call
      // await notificationService.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Revert optimistic update on error
      setNotifications(previousState);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setOpen(false);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    const previousState = notifications;
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    try {
      // In production, uncomment this API call
      // await notificationService.deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      // Revert optimistic update on error
      setNotifications(previousState);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    const previousState = notifications;
    setNotifications([]);
    
    try {
      // In production, uncomment this API call
      // await notificationService.clearAll();
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      // Revert optimistic update on error
      setNotifications(previousState);
    }
  };

  // Group notifications by priority and recency
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    // First sort by read status (unread first)
    if (a.read !== b.read) return a.read ? 1 : -1;
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = notificationConfig[a.type]?.priority || 'medium';
    const bPriority = notificationConfig[b.type]?.priority || 'medium';
    
    if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    }
    
    // Finally by timestamp (newest first)
    return b.timestamp - a.timestamp;
  });

  return (
    <>
      {createPortal(
        <>
          {/* Floating notification button */}
          <button
            aria-label="Open notifications"
            onClick={() => setOpen(prev => !prev)}
            className="relative rounded-full bg-primary text-primary-foreground shadow-lg p-4 hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-ring"
            style={{ position: 'fixed', top: 20, right: 20, zIndex: 2147483647 }}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <div 
                className="absolute -top-2 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold rounded-full"
                style={{ 
                  backgroundColor: '#ef4444',
                  color: 'white',
                  minWidth: '20px'
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </button>

          {/* Dim overlay */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                background: 'rgba(0,0,0,0.3)', 
                zIndex: 2147483646 
              }}
            />
          )}

          {/* Notification panel */}
          {open && (
            <div
              className="max-w-[calc(100%-2rem)]"
              style={{ 
                position: 'fixed', 
                top: 80, 
                right: 20, 
                zIndex: 2147483647, 
                width: '28rem', 
                maxHeight: '70vh', 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <Card className="bg-card border-border shadow-xl overflow-hidden">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadCount} new
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAll}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                        title="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="w-full text-xs"
                    >
                      Mark all as read
                    </Button>
                  )}
                  
                  {/* Category Tabs */}
                  <div className="flex gap-1 mt-3 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                        activeTab === 'all' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <List className="h-3 w-3" />
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab('session_reminder')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                        activeTab === 'session_reminder' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      Sessions
                    </button>
                    <button
                      onClick={() => setActiveTab('connection_request')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                        activeTab === 'connection_request' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <UserPlus className="h-3 w-3" />
                      Connections
                    </button>
                    <button
                      onClick={() => setActiveTab('qa_activity')}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                        activeTab === 'qa_activity' 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <MessageCircle className="h-3 w-3" />
                      Q&A
                    </button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  {sortedNotifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No notifications yet</p>
                      <p className="text-xs mt-1">We'll notify you about sessions, connections, and Q&A activity</p>
                    </div>
                  ) : (
                    <div
                      ref={scrollRef}
                      className="max-h-96 overflow-y-auto"
                      style={{ scrollbarWidth: 'thin' }}
                    >
                      {sortedNotifications.map((notification, index) => {
                        const config = notificationConfig[notification.type] || notificationConfig.qa_activity;
                        const IconComponent = config.icon;
                        
                        return (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`
                              p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50
                              ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500' : ''}
                              ${index === sortedNotifications.length - 1 ? 'border-b-0' : ''}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${config.bgColor} flex-shrink-0`}>
                                <IconComponent className={`h-4 w-4 ${config.color}`} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {formatRelativeTime(notification.timestamp)}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => deleteNotification(notification.id, e)}
                                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}
