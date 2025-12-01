import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  Search, 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  Clock,
  MapPin, 
  Filter,
  UserPlus,
  Video,
  Mail,
  TrendingUp,
  Target,
  BookOpen,
  Trash
} from 'lucide-react';
import { useConnectionsStore } from '../stores/useConnectionsStore';
import { userService } from '../services/api';

// Move levelLabels outside component to prevent recreation on every render
const levelLabels = {
  beginner: { 
    label: 'Beginner', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', 
    icon: '🌱',
    borderColor: 'border-green-200 dark:border-green-700'
  },
  intermediate: { 
    label: 'Intermediate', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', 
    icon: '📚',
    borderColor: 'border-blue-200 dark:border-blue-700'
  },
  advanced: { 
    label: 'Advanced', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', 
    icon: '🎯',
    borderColor: 'border-purple-200 dark:border-purple-700'
  },
  expert: { 
    label: 'Expert', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', 
    icon: '⭐',
    borderColor: 'border-yellow-200 dark:border-yellow-700'
  }
};

export function SkillMatching({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'connected'
  const [connectionModal, setConnectionModal] = useState({ isOpen: false, student: null });
  const [sessionModal, setSessionModal] = useState({ isOpen: false, student: null });
  const [connectionMessage, setConnectionMessage] = useState('');
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '60',
    preferredTimes: '',
    meetingLink: '',
    meetingAddress: ''
  });

  // Connections + suggestions store
  const connectionsRaw = useConnectionsStore(state => state.connections);
  const connections = Array.isArray(connectionsRaw) ? connectionsRaw : [];
  const connectionRequests = useConnectionsStore(state => state.connectionRequests);
  const suggestedRaw = useConnectionsStore(state => state.suggested);
  const suggested = Array.isArray(suggestedRaw) ? suggestedRaw : [];
  const sendConnectionRequest = useConnectionsStore(state => state.sendConnectionRequest);
  const loadConnections = useConnectionsStore(state => state.loadConnections);
  const loadSuggestedConnections = useConnectionsStore(state => state.loadSuggestedConnections);
  const deleteConnection = useConnectionsStore(state => state.deleteConnection);

  // State for students data (driven by ML suggestions)
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load connections + suggestions on mount
  useEffect(() => {
    const loadInitial = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          loadConnections(),
          loadSuggestedConnections()
        ]);
      } catch (e) {
        console.error('Error loading matching data:', e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitial();

    // Poll connections in the background to pick up accept/decline updates from other users
    const interval = setInterval(() => {
      loadConnections();
      // keep suggested updated in case ML suggestions change
      loadSuggestedConnections();
    }, 10000); // every 10s
    return () => clearInterval(interval);
  }, [loadConnections, loadSuggestedConnections]);

  // Whenever suggestions or searchTerm change, update students list
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let base = [];
        if (searchTerm && searchTerm.trim().length > 1) {
          // Use global search API
          base = await userService.searchUsers(searchTerm.trim());
        } else {
          // Use ML suggestions
          base = Array.isArray(suggested) ? [...suggested] : [];
        }
        // Apply skill filter
        if (selectedSkill && selectedSkill !== 'all') {
          base = base.filter((s) =>
            s.skillsCanTeach?.some((sk) => sk.name === selectedSkill)
          );
        }
        // Apply university filter
        if (selectedUniversity && selectedUniversity !== 'all') {
          base = base.filter((s) => s.college === selectedUniversity);
        }
        // Apply level filter
        if (selectedLevel && selectedLevel !== 'all') {
          base = base.filter((s) =>
            s.skillsCanTeach?.some((sk) => sk.level === selectedLevel)
          );
        }
        setStudents(base);
      } catch (e) {
        setError('Failed to search users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [suggested, searchTerm, selectedSkill, selectedUniversity, selectedLevel]);

  // Get unique skills for filter (from suggestions)
  const allSkills = useMemo(() => {
    const source = Array.isArray(suggested) ? suggested : [];
    return [...new Set(source.flatMap(s => s.skillsCanTeach?.map(skill => skill.name) || []))];
  }, [suggested]);
  
  const universities = useMemo(() => {
    const source = Array.isArray(suggested) ? suggested : [];
    return [...new Set(source.map(s => s.college || s.university).filter(Boolean))];
  }, [suggested]);

  // Exclude connected users from discovery list and add a temporary random match%
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];

    const base = !Array.isArray(connections) || connections.length === 0
      ? students
      : students.filter(student => {
          const isNotConnected = !connections.some(conn => 
            (conn._id?.toString() || conn.id?.toString()) === (student._id?.toString() || student.id?.toString())
          );
          return isNotConnected;
        });

    // Add a stable random-looking percentage if none provided
    const withPercent = base.map((student, index) => {
      if (typeof student.matchPercentage === 'number' && student.matchPercentage > 0) return student;
      const pseudoRandom = ((index * 37) % 41) + 60; // 60–100 range
      return { ...student, matchPercentage: pseudoRandom };
    });

    // Sort by matchPercentage descending
    return withPercent.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
  }, [students, connections]);

  const handleConnect = (student) => {
    setConnectionModal({ isOpen: true, student });
  };

  const handleScheduleSession = (student) => {
    setSessionModal({ isOpen: true, student });
  };

  const handleSendConnection = async () => {
    if (!connectionMessage.trim()) {
      toast.error('Please write a message');
      return;
    }
    if (connectionModal.student?.id) {
      try {
        await sendConnectionRequest(connectionModal.student.id);
      } catch (err) {
        toast.error(err.message || 'Failed to send connection request');
        return;
      }
    }
    toast.success(`Connection request sent to ${connectionModal.student?.name}!`);
    setConnectionModal({ isOpen: false, student: null });
    setConnectionMessage('');
  };

  const handleSubmitSessionRequest = () => {
    if (!sessionForm.title.trim()) {
      toast.error('Please provide a session title');
      return;
    }
    
    toast.success(`Session request sent to ${sessionModal.student?.name}!`);
    setSessionModal({ isOpen: false, student: null });
    setSessionForm({
      title: '',
      description: '',
      type: 'video',
      duration: '60',
      preferredTimes: '',
      meetingLink: '',
      meetingAddress: ''
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Find Your Perfect Study Partner</h1>
        <p className="text-muted-foreground font-medium">Connect with students who can teach you new skills and learn from your expertise</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="space-y-4 mb-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, university, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2 mt-4">
                <Label>Skill</Label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="All skills" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {allSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                <Label>University</Label>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All universities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map(uni => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                <Label>Skill Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">🌱 Beginner</SelectItem>
                    <SelectItem value="intermediate">📚 Intermediate</SelectItem>
                    <SelectItem value="advanced">🎯 Advanced</SelectItem>
                    <SelectItem value="expert">⭐ Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSkill('all');
                    setSelectedUniversity('all');
                    setSelectedLevel('all');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'discover' ? 'default' : 'outline'}
          onClick={() => setActiveTab('discover')}
          className="flex-1 justify-center"
        >
          Discover ({filteredStudents.length})
        </Button>
        <Button
          variant={activeTab === 'connected' ? 'default' : 'outline'}
          onClick={() => setActiveTab('connected')}
          className="flex-1 justify-center"
        >
          Connected ({connections.length})
        </Button>
      </div>

      {/* Results */}
      {activeTab === 'discover' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isLoading ? 'Loading...' : `${filteredStudents.length} Study Partners Found`}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Sorted by match percentage
            </div>
          </div>

          {isLoading && (
            <Card className="text-center py-12 bg-card border-border">
              <CardContent>
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  <p className="text-muted-foreground">Loading study partners...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && error && (
            <Card className="text-center py-12 bg-card border-border">
              <CardContent>
                <p className="text-red-500">Error: {error}</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && (
            <>
              {/* Student Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200 bg-card border-border">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                      {/* <MapPin className="h-3 w-3" /> */}
                      {student.college}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  {student.matchPercentage}% match
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {student.bio}
              </p>

              {/* Skills with Enhanced Display */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm text-foreground">Can Teach</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {student.skillsCanTeach?.slice(0, 3)?.map((skill, index) => {
                    const levelInfo = levelLabels[skill.level];
                    return (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg border ${levelInfo.borderColor} bg-muted/50`}
                      >
                        <span className="font-medium text-sm text-foreground">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{levelInfo.icon}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${levelInfo.color}`}>
                            {levelInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {student.skillsCanTeach?.length > 3 && (
                    <div className="text-center text-xs text-muted-foreground py-1">
                      +{student.skillsCanTeach.length - 3} more skills
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 py-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-sm text-blue-600 dark:text-blue-400">{student.points}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm text-green-600 dark:text-green-400">{(student.sessions ?? student.sessionsCompleted ?? '—')}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm text-yellow-600 dark:text-yellow-400">{student.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {/* Availability */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  {/* availability text only; removed timer icon for clarity */}
                  <span className="text-muted-foreground">{student.availability}</span>
                </div>

              {/* Actions */}
              <Button 
                size="sm" 
                variant="default" 
                className="w-full bg-black text-white px-3 py-1 rounded "
                onClick={() => handleConnect(student)}
                disabled={connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (student._id?.toString() || student.id?.toString())) || !!connectionRequests[student.id]}
              >
                {connections.some(conn => (conn._id?.toString() || conn.id?.toString()) === (student._id?.toString() || student.id?.toString())) ? (
                  <span className="text-sm font-semibold text-green-700">Connected</span>
                ) : connectionRequests[student.id] ? (
                  <span className="flex text-sm font-semibold text-yellow-700"><Clock className="h-4 w-4 mr-2" />Pending</span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-semibold"><UserPlus className="h-4 w-4 mr-2" />Connect</span>
                )}
              </Button>
            </CardContent>
          </Card>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <Card className="text-center py-12 bg-card border-border">
                  <CardContent>
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters to find more study partners.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      setSelectedSkill('all');
                      setSelectedUniversity('all');
                      setSelectedLevel('all');
                    }}>
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}

      {/* Connected Users Tab */}
      {activeTab === 'connected' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {connections.length} Connected Study Partners
            </h2>
          </div>

          {/* Connected Users Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((student) => {
              // Get full student data from suggestions if available and merge with connection
              const fullStudentData = Array.isArray(students) ? students.find(s => s.id === student.id) : null;
              const details = { ...(fullStudentData || {}), ...(student || {}) };
              return (
                <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200 bg-card border-border">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{student.name}</h3>
                          <p className="text-sm text-muted-foreground font-medium">{student.college}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant="secondary" className="text-xs mb-2">Connected</Badge>
                        <Button size="s" variant="destructive" className="px-2 py-2" onClick={() => {
                          if (!window.confirm('Remove this connection?')) return;
                          const idToDelete = student.id?.toString() || student._id?.toString();
                          deleteConnection(idToDelete).then(() => {
                            toast.success('Connection removed');
                          }).catch(e => {
                            console.error('Error removing connection:', e);
                            toast.error('Failed to remove connection');
                          });
                        }}>Remove</Button>
                      </div>
                    </div>

                    {/* Skills */}
                    {details?.skillsCanTeach && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Can teach</p>
                        <div className="flex flex-wrap gap-1">
                          {details?.skillsCanTeach?.slice(0, 3)?.map((skill) => (
                            <Badge key={skill.name} variant="outline" className="text-xs">
                              {skill.name}
                            </Badge>
                          )) || []}
                          {details?.skillsCanTeach?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{details.skillsCanTeach.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rating & Availability */}
                    {details && (
                      <div className="flex items-center gap-2 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-foreground">{details.rating?.average || 'N/A'}</span>
                          <span className="text-muted-foreground">({details.rating?.count || 0})</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{details.availability}</span>
                      </div>
                    )}

                    {/* Remove link */}
                    {/* removed bottom-right Remove button (moved to header) */}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {connections.length === 0 && (
            <Card className="text-center py-12 bg-card border-border">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No connections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start connecting with study partners in the Discover tab.
                </p>
                <Button variant="outline" onClick={() => setActiveTab('discover')}>
                  Go to Discover
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Connection Modal */}
      <Dialog open={connectionModal.isOpen} onOpenChange={(open) => setConnectionModal({ isOpen: open, student: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect with {connectionModal.student?.name}</DialogTitle>
            <DialogDescription>
              Send a connection request to start learning together
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="connection-message">Personal Message</Label>
              <Textarea
                id="connection-message"
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                placeholder="Hi! I'd love to connect and learn from your expertise in..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleSendConnection} className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Send Request
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setConnectionModal({ isOpen: false, student: null })}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Request Modal */}
      <Dialog open={sessionModal.isOpen} onOpenChange={(open) => setSessionModal({ isOpen: open, student: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Session with {sessionModal.student?.name}</DialogTitle>
            <DialogDescription>
              Schedule a learning session to gain new skills
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="session-title">Session Topic</Label>
              <Input
                id="session-title"
                value={sessionForm.title}
                onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What would you like to learn?"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="session-description">Additional Details</Label>
              <Textarea
                id="session-description"
                value={sessionForm.description}
                onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Any specific topics or questions you'd like to cover?"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="session-type">Session Type</Label>
                <Select value={sessionForm.type} onValueChange={(value) => setSessionForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Session</SelectItem>
                    <SelectItem value="inperson">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
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
            {sessionForm.type === 'video' && (
              <div className="space-y-3">
                <Label htmlFor="meeting-link">Meeting Link</Label>
                <Input
                  id="meeting-link"
                  value={sessionForm.meetingLink}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="Paste Google Meet/Zoom/Teams link"
                />
              </div>
            )}
            {sessionForm.type === 'inperson' && (
              <div className="space-y-3">
                <Label htmlFor="meeting-address">Location</Label>
                <Input
                  id="meeting-address"
                  value={sessionForm.meetingAddress}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, meetingAddress: e.target.value }))}
                  placeholder="Enter address or location to meet"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="preferred-times">Preferred Times</Label>
              <Input
                id="preferred-times"
                value={sessionForm.preferredTimes}
                onChange={(e) => setSessionForm(prev => ({ ...prev, preferredTimes: e.target.value }))}
                placeholder="e.g., Weekday evenings, Saturday mornings"
              />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleSubmitSessionRequest} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Send Request
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSessionModal({ isOpen: false, student: null })}
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

