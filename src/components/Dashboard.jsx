import React, { useState } from 'react';
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
  UserPlus
} from 'lucide-react';

export function Dashboard({ user }) {
  const navigate = useNavigate();
  const [sessionModal, setSessionModal] = useState({ isOpen: false, partnerId: null });
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '60',
    date: '',
    time: ''
  });

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

  // Mock data
  const suggestedConnections = [
    {
      id: 1,
      name: "Emma Watson",
      college: "Harvard University",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "Machine Learning", level: "expert" },
        { name: "Python", level: "advanced" }
      ],
      points: 3250,
      sessions: 28,
      matchPercentage: 95
    },
    {
      id: 2,
      name: "David Kim",
      college: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "UI/UX Design", level: "expert" },
        { name: "Figma", level: "advanced" }
      ],
      points: 2890,
      sessions: 22,
      matchPercentage: 88
    },
    {
      id: 3,
      name: "Sarah Chen",
      college: "MIT",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "DevOps", level: "advanced" },
        { name: "Docker", level: "intermediate" }
      ],
      points: 2150,
      sessions: 15,
      matchPercentage: 82
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "React Hooks Deep Dive",
      partner: "Emma Watson",
      date: "Today",
      time: "2:00 PM",
      type: "Video Call",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Python Data Analysis",
      partner: "David Kim",
      date: "Tomorrow",
      time: "10:00 AM",
      type: "Video Call",
      status: "pending"
    }
  ];

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
    { label: "Active Connections", value: "23", icon: Users, color: "text-purple-600" }
  ];

  const handleScheduleSession = (partnerId) => {
    setSessionModal({ isOpen: true, partnerId });
  };

  const handleSubmitSession = () => {
    if (!sessionForm.title || !sessionForm.date || !sessionForm.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Session scheduled successfully!');
    setSessionModal({ isOpen: false, partnerId: null });
    setSessionForm({
      title: '',
      description: '',
      type: 'video',
      duration: '60',
      date: '',
      time: ''
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-300">Ready to learn and share knowledge today?</p>
        </div>
        <Button onClick={() => navigate('/matching')} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Find Study Partners
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
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
          {/* Clean Skills Overview */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Target className="h-5 w-5 text-green-600" />
                    Your Teaching Skills
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
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
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{user.skillsCanTeach.length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {user.skillsCanTeach.filter(s => s.level === 'expert' || s.level === 'advanced').length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Advanced+</div>
                    </div>
                  </div>
                  
                  {/* Top Skills List */}
                  <div className="space-y-2">
                    {user.skillsCanTeach.slice(0, 4).map((skill, index) => {
                      const config = levelConfig[skill.level];
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{config.icon}</span>
                            <span className="font-medium text-sm dark:text-white">{skill.name}</span>
                          </div>
                          <span className={`text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {user.skillsCanTeach.length > 4 && (
                    <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                        View {user.skillsCanTeach.length - 4} more skills
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Add your skills to start teaching</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggested Connections with Cleaner Skills Display */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Users className="h-5 w-5 text-blue-600" />
                    Suggested Study Partners
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
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
                {suggestedConnections.map((connection) => (
                  <div key={connection.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={connection.avatar}
                          alt={connection.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold dark:text-white">{connection.name}</h4>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                              {connection.matchPercentage}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{connection.college}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Clean Skills Display */}
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-2">
                        <Target className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Can teach:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {connection.skillsCanTeach.map((skill, index) => {
                          const config = levelConfig[skill.level];
                          return (
                            <div key={index} className="flex items-center gap-1 text-xs">
                              <span className="font-medium dark:text-white">{skill.name}</span>
                              <span className={`${config.color}`}>({config.icon} {config.label})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{connection.points} points</span>
                        <span>{connection.sessions} sessions</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleScheduleSession(connection.id)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button size="sm">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm dark:text-white">{session.title}</h4>
                      <Badge 
                        variant={session.status === 'confirmed' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">with {session.partner}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{session.date} at {session.time}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Schedule New Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Clock className="h-5 w-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/qa')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/matching')}>
                <Users className="h-4 w-4 mr-2" />
                Find Study Partners
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/leaderboard')}>
                <Trophy className="h-4 w-4 mr-2" />
                View Leaderboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session Scheduling Modal */}
      <Dialog open={sessionModal.isOpen} onOpenChange={(open) => setSessionModal({ isOpen: open, partnerId: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Study Session</DialogTitle>
            <DialogDescription>
              Plan a learning session with your study partner
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-title">Session Title</Label>
              <Input
                id="session-title"
                value={sessionForm.title}
                onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., React Hooks Deep Dive"
              />
            </div>
            
            <div>
              <Label htmlFor="session-description">Description (Optional)</Label>
              <Textarea
                id="session-description"
                value={sessionForm.description}
                onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What topics will you cover?"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-type">Session Type</Label>
                <Select value={sessionForm.type} onValueChange={(value) => setSessionForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="inperson">In Person</SelectItem>
                    <SelectItem value="group">Group Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="session-duration">Duration</Label>
                <Select value={sessionForm.duration} onValueChange={(value) => setSessionForm(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-date">Date</Label>
                <Input
                  id="session-date"
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="session-time">Time</Label>
                <Input
                  id="session-time"
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSubmitSession} className="flex-1">
                Schedule Session
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSessionModal({ isOpen: false, partnerId: null })}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}