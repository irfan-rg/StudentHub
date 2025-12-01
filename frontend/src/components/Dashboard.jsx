import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  Plus, 
  Users, 
  MessageSquare, 
  Calendar, 
  Trophy, 
  Star, 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp,
  ArrowRight,
  User,
  MapPin,
  Video,
  UserPlus,
  Edit,
  Trash
} from 'lucide-react';
import ChatbotWidget from './ChatbotWidget';
import NotificationWidget from './NotificationWidget';
import { useSessionStore } from '../stores/useSessionStore';
import { userService } from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';
import { useConnectionsStore } from '../stores/useConnectionsStore';

export function Dashboard({ user }) {
  const navigate = useNavigate();
  const [sessionModal, setSessionModal] = useState({ isOpen: false, partnerId: null, isEdit: false, sessionId: null });
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '60',
    date: '',
    time: '',
    partnerId: null,
    sessionLink: '' // Added sessionLink field
  });
  const sessions = useSessionStore(state => state.sessions);
  const joinedSessions = useSessionStore(state => state.joinedSessions);
  const createSession = useSessionStore(state => state.createSession);
  const updateSession = useSessionStore(state => state.updateSession);
  const deleteSession = useSessionStore(state => state.deleteSession);
  const loadSessions = useSessionStore(state => state.loadSessions);
  const loadJoinedSessions = useSessionStore(state => state.loadJoinedSessions);

  const suggestedConnectionsRaw = useConnectionsStore(state => state.suggested);
  const suggestedConnections = Array.isArray(suggestedConnectionsRaw) 
    ? suggestedConnectionsRaw.map((conn, index) => ({
        ...conn,
        matchPercentage: (typeof conn.matchPercentage === 'number' && conn.matchPercentage > 0) 
          ? conn.matchPercentage 
          : ((index * 37) % 41) + 60  // Same pseudo-random as SkillMatching
      })).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    : [];
  const connectionsRaw = useConnectionsStore(state => state.connections);
  const connections = Array.isArray(connectionsRaw) ? connectionsRaw : [];
  const connectionRequests = useConnectionsStore(state => state.connectionRequests);
  const sendConnectionRequest = useConnectionsStore(state => state.sendConnectionRequest);
  const deleteConnection = useConnectionsStore(state => state.deleteConnection);
  const setConnections = useConnectionsStore(state => state.setConnections);
  const loadSuggestedConnections = useConnectionsStore(state => state.loadSuggestedConnections);
  const loadConnections = useConnectionsStore(state => state.loadConnections);
  const updateUser = useAuthStore(state => state.updateUser);
  const [connectModal, setConnectModal] = useState({ isOpen: false, partnerId: null, message: '' });

  const levelConfig = {
    expert: { 
      label: 'Expert', 
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      icon: '⭐'
    },
    advanced: { 
      label: 'Advanced', 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      icon: '🎯'
    },
    intermediate: { 
      label: 'Intermediate', 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      icon: '📚'
    },
    beginner: { 
      label: 'Beginner', 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      icon: '🌱'
    }
  };

  // Suggested connections now come from store

  const recentActivity = [
    { type: "session_completed", message: "Completed session with Emma Watson", time: "2 hours ago" },
    { type: "question_answered", message: "Answered question about React State Management", time: "5 hours ago" },
    { type: "badge_earned", message: "Earned 'Quick Learner' badge", time: "1 day ago" },
    { type: "new_connection", message: "Connected with Sarah Chen", time: "2 days ago" }
  ];

  const stats = [
    { label: "Total Points", value: user.points, icon: Trophy, color: "text-yellow-600" },
    { label: "Sessions Completed", value: user.sessionsCompleted, icon: Calendar, color: "text-green-600" },
    { label: "Questions Answered", value: user.questionsAnswered, icon: MessageSquare, color: "text-blue-600" },
    { label: "Active Connections", value: connections.length, icon: Users, color: "text-purple-600" }
  ];

  const handleScheduleSession = (partnerId, sessionId = null, isEdit = false) => {
    if (isEdit && sessionId) {
      const sessionToEdit = sessions.find(session => session.id === sessionId);
      setSessionForm({
        title: sessionToEdit.title,
        description: sessionToEdit.description || '',
        type: sessionToEdit.type,
        duration: '60',
        date: sessionToEdit.date,
        time: sessionToEdit.time,
        partnerId: suggestedConnections.find(conn => conn.name === sessionToEdit.partner)?.id || null,
        sessionLink: sessionToEdit.sessionLink || '' // Include sessionLink in edit
      });
    } else {
      setSessionForm({
        title: '',
        description: '',
        type: 'video',
        duration: '60',
        date: '',
        time: '',
        partnerId: partnerId,
        sessionLink: '' // Initialize sessionLink
      });
    }
    setSessionModal({ isOpen: true, partnerId, isEdit, sessionId });
  };

  const handleSubmitSession = () => {
    if (!sessionForm.title || !sessionForm.date || !sessionForm.time || !sessionForm.partnerId) {
      toast.error('Please fill in all required fields, including a partner');
      return;
    }
    
    const partnerName = suggestedConnections.find(conn => (conn.id?.toString() || conn._id?.toString()) === (sessionForm.partnerId?.toString()))?.name;
    if (sessionModal.isEdit && sessionModal.sessionId) {
      updateSession(sessionModal.sessionId, { title: sessionForm.title, partner: partnerName, date: sessionForm.date, time: sessionForm.time, type: sessionForm.type, status: 'pending', sessionLink: sessionForm.sessionLink });
      toast.success('Session updated successfully!');
    } else {
      createSession({ title: sessionForm.title, partner: partnerName, date: sessionForm.date, time: sessionForm.time, type: sessionForm.type, sessionLink: sessionForm.sessionLink });
      toast.success('Session scheduled successfully!');
    }
    setSessionModal({ isOpen: false, partnerId: null, isEdit: false, sessionId: null });
    setSessionForm({
      title: '',
      description: '',
      type: 'video',
      duration: '60',
      date: '',
      time: '',
      partnerId: null,
      sessionLink: ''
    });
  };

  const handleDeleteSession = (sessionId) => {
    deleteSession(sessionId);
    toast.success('Session deleted successfully!');
  };

  const handleConnectRequest = async (partnerId) => {
    const partnerToConnect = suggestedConnections.find(conn => (conn.id?.toString() || conn._id?.toString()) === (partnerId?.toString()));
    if (partnerToConnect && !connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (partnerId?.toString()))) {
      try {
        await sendConnectionRequest(partnerId);
      } catch (err) {
        toast.error(err.message || 'Failed to send connection request');
        return;
      }
      setConnectModal({ isOpen: false, partnerId: null, message: '' });
      toast.success(`Connection request sent to ${partnerToConnect.name}`);
    } else if (connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (partnerId?.toString()))) {
      toast.info('Already connected');
    } else {
      toast.error('Invalid partner');
    }
  };

  const handleDeleteConnection = (connectionId) => {
    deleteConnection(connectionId);
    toast.success('Connection deleted');
  };

  const [editConnection, setEditConnection] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', college: '' });

  const handleEditConnection = (connection) => {
    setEditConnection(connection.id);
    setEditForm({ name: connection.name, college: connection.college });
  };

  const handleSaveEdit = () => {
    const updated = connections.map(conn =>
      ((conn._id?.toString() || conn.id?.toString()) === (editConnection?.toString())) ? { ...conn, name: editForm.name, college: editForm.college } : conn
    );
    setConnections(updated);
    setEditConnection(null);
    setEditForm({ name: '', college: '' });
    toast.success('Connection updated');
  };

  const handleCancelEdit = () => {
    setEditConnection(null);
    setEditForm({ name: '', college: '' });
  };

  useEffect(() => {
    // refresh profile from server when dashboard mounts so points are current
    (async () => {
      try {
        const profile = await userService.getProfile();
        if (profile && profile.user) updateUser(profile.user);
      } catch (err) {
        console.warn('Dashboard profile refresh failed', err);
      }
    })();
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadSuggestedConnections(),
          loadConnections(),
          loadJoinedSessions()
        ]);
        console.log('Dashboard loaded connections:', connections.length);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadInitialData();

    // Poll connections in background to reflect status updates from other users
    const interval = setInterval(() => {
      loadConnections();
      loadSuggestedConnections();
    }, 10000);
    return () => clearInterval(interval);
  }, [loadSuggestedConnections, loadConnections, loadJoinedSessions]);

  useEffect(() => {
    // Log connections when they change
    console.log('Connections updated:', connections);
  }, [connections]);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground font-medium mt-4">Ready to learn and share knowledge today?</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Suggested Connections with Cleaner Skills Display */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                    <Users className="h-5 w-5 text-blue-600" />
                    Suggested Study Partners
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-4 font-medium">
                    AI-matched partners based on your learning goals
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/matching')}>
                  See All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedConnections
                  .filter(connection => !connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (connection._id?.toString() || connection.id?.toString())))
                  .slice(0, 3)
                  .length > 0 ? (
                  suggestedConnections
                    .filter(connection => !connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (connection._id?.toString() || connection.id?.toString())))
                    .slice(0, 3)
                    .map((connection) => (
                  <div key={connection.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={connection.avatar}
                          alt={connection.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-medium text-foreground">{connection.name}</h4>
                          <p className="text-sm font-medium mt-2 text-muted-foreground">{connection.college}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs mb-2 px-2 py-1">
                          {connection.matchPercentage}% Match
                        </Badge>
                        {/* <Button 
                          size="sm"
                          disabled={connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (connection._id?.toString() || connection.id?.toString())) || connectionRequests[connection.id]}
                          onClick={() => setConnectModal({ isOpen: true, partnerId: connection.id, message: '' })}
                        >
                          {connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (connection._id?.toString() || connection.id?.toString())) ? (
                            <Badge>Connected</Badge>
                          ) : connectionRequests[connection.id] ? (
                            <Badge variant="secondary">Pending</Badge>
                          ) : (
                            <UserPlus className="h-3 w-3" />
                          )}
                        </Button> */}
                      </div>
                    </div>
                    
                    {/* Clean Skills Display */}
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-2">
                        <Target className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-medium text-muted-foreground">Can teach:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {connection.skillsCanTeach.map((skill, index) => {
                          const config = levelConfig[skill.level];
                          return (
                            <div key={index} className="flex items-center gap-1 text-sm">
                              <span className="font-medium text-foreground">{skill.name}</span>
                              <span className={`${config.color}`}>({config.icon} {config.label})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{connection.points} Points</span>
                        <span>{connection.sessionsCompleted} Sessions</span>
                      </div>
                       <div className="flex gap-2">
                         <Button 
                           size="sm"
                           disabled={connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (connection._id?.toString() || connection.id?.toString())) || connectionRequests[connection.id]}
                           onClick={() => setConnectModal({ isOpen: true, partnerId: connection.id, message: '' })}
                         >
                           {connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (connection._id?.toString() || connection.id?.toString())) ? (
                             <span className="text-xs font-semibold text-green-700">Connected</span>
                           ) : connectionRequests[connection.id] ? (
                             <span className="text-xs font-semibold text-yellow-700">Pending</span>
                           ) : (
                             <span className="flex items-center gap-1 text-xs font-semibold">Connect</span>
                           )}
                         </Button>
                       </div>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      You've connected with all suggested study partners. Check back later for new matches!
                    </p>
                    <Button variant="outline" onClick={() => navigate('/matching')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Explore More Matches
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Clean Skills Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                    <Target className="h-5 w-5 text-green-600" />
                    Your Teaching Skills
                  </CardTitle>
                    <CardDescription className="text-muted-foreground mt-4 font-medium">
                    Skills ready to share with the community
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user.skillsCanTeach && user.skillsCanTeach.length > 0 ? (
                <div className="space-y-4">
                  {/* Quick Overview */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{user.skillsCanTeach.length}</div>
                      <div className="text-xs text-muted-foreground">Total Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {user.skillsCanTeach.filter(s => s.level === 'expert' || s.level === 'advanced').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Advanced+</div>
                    </div>
                  </div>
                  
                  {/* Top Skills List */}
                  <div className="space-y-2">
                    {user.skillsCanTeach.slice(0, 4).map((skill, index) => {
                      const config = levelConfig[skill.level];
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{config.icon}</span>
                            <span className="font-medium text-sm text-foreground">{skill.name}</span>
                          </div>
                          <span className={`text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {user.skillsCanTeach.length > 4 && (
                    <div className="text-center pt-2 border-t border-border">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                        View {user.skillsCanTeach.length - 4} more skills
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm mb-2">Add your skills to start teaching</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  // Filter out sessions that are completed or in the past and sort by nearest time
                  const now = new Date();
                  const upcoming = (Array.isArray(joinedSessions) ? joinedSessions : [])
                    .filter(s => {
                      const st = (s.status || '');
                      if (st === 'completed' || st === 'done' || st === 'cancelled' || st === 'cancelled') return false;
                      if (s.dateIso) {
                        const d = new Date(s.dateIso);
                        if (!isNaN(d.getTime()) && d < now) return false;
                      }
                      return true;
                    })
                    .sort((a, b) => {
                      const da = a.dateIso ? new Date(a.dateIso).getTime() : 0;
                      const db = b.dateIso ? new Date(b.dateIso).getTime() : 0;
                      return da - db;
                    });
                  if (upcoming.length === 0) {
                    return (
                      <p className="text-xs text-muted-foreground text-center py-4">No upcoming sessions yet</p>
                    );
                  }
                  return upcoming.slice(0, 3).map((session) => {
                    // Fallback: if partner is a 24-char ObjectId string, try to resolve name from
                    // connections or suggestedConnections already loaded in the Dashboard to avoid additional API calls
                    let partnerName = session.partner;
                    if (partnerName && typeof partnerName === 'string' && /^[a-fA-F0-9]{24}$/.test(partnerName)) {
                      const c = connections.find(conn => (conn._id?.toString() || conn.id?.toString()) === (partnerName?.toString()))
                          || suggestedConnections.find(conn => (conn._id?.toString() || conn.id?.toString()) === (partnerName?.toString()));
                      if (c) partnerName = c.name;
                    }
                    return (
                      <div key={session.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-md text-foreground ">{session.title}</h4>
                        <Badge 
                          variant={session.status === 'confirmed' ? 'default' : 'outline'}
                          className="text-xs  px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground"> {partnerName || session.partner}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm  text-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{session.date} at {session.time}</span>
                      </div>
                      {/* {session.sessionLink && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>Link: {session.sessionLink}</span>
                        </div>
                      )} */}
                    </div>
                  );
                  })
                })()}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/sessions?tab=manage')}
                >
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connections */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground font-bold">
                <Users className="h-5 w-5 text-purple-600" />
                Connections
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-4 font-medium">
                Your existing study partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.length > 0 ? (
                  connections.slice(0, 5).map((connection) => (
                    <div key={connection.id} className="p-3 border border-border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={connection.avatar}
                          alt={connection.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{connection.name}</h4>
                          <p className="text-sm font-medium text-muted-foreground">{connection.college}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteConnection(connection.id)}>
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm mb-2">No connections yet</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/matching')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Find Connections
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connect Request Modal */}
      <Dialog open={connectModal.isOpen} onOpenChange={(open) => setConnectModal({ isOpen: open, partnerId: null, message: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
            <DialogDescription>
              Send a message to {suggestedConnections.find(conn => (conn.id?.toString() || conn._id?.toString()) === (connectModal.partnerId?.toString()))?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="connect-message">Message (Optional)</Label>
              <Textarea
                id="connect-message"
                value={connectModal.message}
                onChange={(e) => setConnectModal(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message..."
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleConnectRequest(connectModal.partnerId)} className="flex-1">
                Send Request
              </Button>
              <Button variant="outline" onClick={() => setConnectModal({ isOpen: false, partnerId: null, message: '' })} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ChatbotWidget user={user} />
      <NotificationWidget user={user} />
    </div>
  );
}