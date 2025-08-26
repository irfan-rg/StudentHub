import React, { useState } from 'react';
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
  MapPin, 
  Clock, 
  Filter,
  UserPlus,
  Video,
  Mail,
  TrendingUp,
  Target,
  BookOpen
} from 'lucide-react';

export function SkillMatching({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [connectionModal, setConnectionModal] = useState({ isOpen: false, student: null });
  const [sessionModal, setSessionModal] = useState({ isOpen: false, student: null });
  const [connectionMessage, setConnectionMessage] = useState('');
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '60',
    preferredTimes: ''
  });

  const levelLabels = {
    beginner: { 
      label: 'Beginner', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 
      icon: '🌱',
      borderColor: 'border-green-200 dark:border-green-700'
    },
    intermediate: { 
      label: 'Intermediate', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 
      icon: '📚',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    advanced: { 
      label: 'Advanced', 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', 
      icon: '🎯',
      borderColor: 'border-purple-200 dark:border-purple-700'
    },
    expert: { 
      label: 'Expert', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', 
      icon: '⭐',
      borderColor: 'border-yellow-200 dark:border-yellow-700'
    }
  };

  // Mock data for students
  const students = [
    {
      id: 1,
      name: "Emma Watson",
      college: "Harvard University",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "Machine Learning", level: "expert" },
        { name: "Python", level: "advanced" },
        { name: "Data Science", level: "advanced" },
        { name: "Statistics", level: "intermediate" }
      ],
      points: 3250,
      sessions: 28,
      rating: 4.9,
      availability: "Available now",
      matchPercentage: 95,
      isOnline: true,
      bio: "PhD student passionate about AI and machine learning. Love helping others understand complex concepts."
    },
    {
      id: 2,
      name: "David Kim",
      college: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "UI/UX Design", level: "expert" },
        { name: "Figma", level: "advanced" },
        { name: "Design Systems", level: "advanced" },
        { name: "Prototyping", level: "intermediate" }
      ],
      points: 2890,
      sessions: 22,
      rating: 4.8,
      availability: "Available today",
      matchPercentage: 88,
      isOnline: false,
      bio: "Design student with internship experience at top tech companies. Happy to share design knowledge!"
    },
    {
      id: 3,
      name: "Sarah Chen",
      college: "MIT",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "DevOps", level: "advanced" },
        { name: "Docker", level: "intermediate" },
        { name: "Kubernetes", level: "intermediate" },
        { name: "AWS", level: "beginner" }
      ],
      points: 2150,
      sessions: 15,
      rating: 4.7,
      availability: "Weekends only",
      matchPercentage: 82,
      isOnline: true,
      bio: "Computer Science major with focus on cloud infrastructure and DevOps practices."
    },
    {
      id: 4,
      name: "James Wilson",
      college: "Carnegie Mellon",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "React", level: "expert" },
        { name: "TypeScript", level: "advanced" },
        { name: "Node.js", level: "advanced" },
        { name: "GraphQL", level: "intermediate" }
      ],
      points: 3100,
      sessions: 31,
      rating: 4.9,
      availability: "Evenings preferred",
      matchPercentage: 91,
      isOnline: true,
      bio: "Full-stack developer and teaching assistant. Love mentoring students in modern web development."
    },
    {
      id: 5,
      name: "Lisa Park",
      college: "UC Berkeley",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
      skillsCanTeach: [
        { name: "Digital Marketing", level: "expert" },
        { name: "Content Writing", level: "advanced" },
        { name: "SEO", level: "intermediate" },
        { name: "Analytics", level: "intermediate" }
      ],
      points: 1950,
      sessions: 19,
      rating: 4.6,
      availability: "Flexible schedule",
      matchPercentage: 76,
      isOnline: false,
      bio: "Business major with marketing internship experience. Passionate about digital strategies and content creation."
    }
  ];

  // Get unique skills for filter
  const allSkills = [...new Set(students.flatMap(s => s.skillsCanTeach.map(skill => skill.name)))];
  const universities = [...new Set(students.map(s => s.college))];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skillsCanTeach.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = selectedSkill === 'all' || 
      student.skillsCanTeach.some(skill => skill.name === selectedSkill);
    
    const matchesUniversity = selectedUniversity === 'all' || 
      student.college === selectedUniversity;
    
    const matchesLevel = selectedLevel === 'all' || 
      student.skillsCanTeach.some(skill => skill.level === selectedLevel);
    
    return matchesSearch && matchesSkill && matchesUniversity && matchesLevel;
  });

  const handleConnect = (student) => {
    setConnectionModal({ isOpen: true, student });
  };

  const handleScheduleSession = (student) => {
    setSessionModal({ isOpen: true, student });
  };

  const handleSendConnection = () => {
    if (!connectionMessage.trim()) {
      toast.error('Please write a message');
      return;
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
      preferredTimes: ''
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold dark:text-white mb-2">Find Your Perfect Study Partner</h1>
        <p className="text-gray-600 dark:text-gray-300">Connect with students who can teach you new skills and learn from your expertise</p>
      </div>

      {/* Search and Filters */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, university, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
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
              
              <div>
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
              
              <div>
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
              
              <div className="flex items-end">
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

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">
          {filteredStudents.length} Study Partners Found
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <TrendingUp className="h-4 w-4" />
          Sorted by match percentage
        </div>
      </div>

      {/* Student Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
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
                    {student.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{student.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-3 w-3" />
                      {student.college}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {student.matchPercentage}% match
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {student.bio}
              </p>

              {/* Skills with Enhanced Display */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm dark:text-white">Can Teach</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {student.skillsCanTeach.slice(0, 3).map((skill, index) => {
                    const levelInfo = levelLabels[skill.level];
                    return (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg border ${levelInfo.borderColor} bg-gray-50 dark:bg-gray-700`}
                      >
                        <span className="font-medium text-sm dark:text-white">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{levelInfo.icon}</span>
                          <Badge className={`text-xs ${levelInfo.color}`}>
                            {levelInfo.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  
                  {student.skillsCanTeach.length > 3 && (
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-1">
                      +{student.skillsCanTeach.length - 3} more skills
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-sm text-blue-600 dark:text-blue-400">{student.points}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm text-green-600 dark:text-green-400">{student.sessions}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm text-yellow-600 dark:text-yellow-400">{student.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{student.availability}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleConnect(student)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleScheduleSession(student)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="text-center py-12 dark:bg-gray-800 dark:border-gray-700">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No students found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
            <div>
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
            <div>
              <Label htmlFor="session-title">Session Topic</Label>
              <Input
                id="session-title"
                value={sessionForm.title}
                onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What would you like to learn?"
              />
            </div>
            
            <div>
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
            
            <div>
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