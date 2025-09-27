import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Video, MapPin, Plus, List, User, Clock, CheckCircle, PlayCircle, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Sessions({ user }) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('create');

  // Check for tab parameter in URL and set active tab accordingly
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'manage') {
      setActiveTab('manage');
    }
  }, [searchParams]);

  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '60',
    preferredTimes: '',
    meetingLink: '',
    meetingAddress: ''
  });

  const [sessions, setSessions] = useState([]);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [joinedSessions, setJoinedSessions] = useState([
    {
      id: 1,
      title: "Advanced React Patterns",
      description: "Learn advanced React patterns and best practices",
      type: "video",
      duration: "90",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      creator: "Emma Watson",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-15",
      time: "14:00",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      description: "Introduction to ML concepts and algorithms",
      type: "inperson",
      duration: "120",
      meetingAddress: "MIT Campus, Building 32, Room 101",
      creator: "David Kim",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-20",
      time: "10:00",
      status: "upcoming"
    },
    {
      id: 3,
      title: "UI/UX Design Workshop",
      description: "Hands-on workshop for design principles",
      type: "video",
      duration: "60",
      meetingLink: "https://zoom.us/j/123456789",
      creator: "Sarah Chen",
      creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      date: "2024-01-10",
      time: "16:00",
      status: "completed"
    }
  ]);

  const handleCreateSession = () => {
    if (!sessionForm.title.trim()) {
      toast.error('Please provide a session title');
      return;
    }
    if (sessionForm.type === 'video' && !sessionForm.meetingLink.trim()) {
      toast.error('Please provide a meeting link for a video session');
      return;
    }
    if (sessionForm.type === 'inperson' && !sessionForm.meetingAddress.trim()) {
      toast.error('Please provide a location for an in-person session');
      return;
    }

    const newSession = {
      id: Date.now(),
      ...sessionForm,
      createdBy: user?.name || 'You'
    };
    setSessions(prev => [newSession, ...prev]);
    toast.success('Session created');
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

  // Cancel/remove handlers
  const cancelJoinedSession = (id) => {
    setJoinedSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
    toast.success('Session cancelled');
  };

  const removeCreatedSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success('Removed from your created sessions');
  };

  // Rating handlers
  const openRatingDialog = (session) => {
    setSelectedSession(session);
    setRating(session.rating || 0);
    setRatingComment(session.ratingComment || '');
    setRatingDialogOpen(true);
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setJoinedSessions(prev => prev.map(s => 
      s.id === selectedSession.id 
        ? { ...s, rating, ratingComment } 
        : s
    ));
    
    toast.success('Rating submitted successfully!');
    setRatingDialogOpen(false);
    setSelectedSession(null);
    setRating(0);
    setRatingComment('');
  };

  const handleRatingCancel = () => {
    setRatingDialogOpen(false);
    setSelectedSession(null);
    setRating(0);
    setRatingComment('');
  };

  // Calculate average rating for completed sessions
  const getAverageRating = () => {
    const completedSessions = joinedSessions.filter(s => s.status === 'completed' && s.rating);
    if (completedSessions.length === 0) return 0;
    
    const totalRating = completedSessions.reduce((sum, session) => sum + session.rating, 0);
    return (totalRating / completedSessions.length).toFixed(1);
  };

  const openInNewTab = (url) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error('Could not open link');
    }
  };

  const handleOpenGoogleMeet = () => {
    openInNewTab('https://meet.new');
    toast.message('Google Meet', {
      description: 'A new Google Meet tab has been opened. Create the meeting, copy the link, then click Paste to auto-fill.',
    });
  };

  const handleOpenZoom = () => {
    openInNewTab('https://zoom.us/start/videomeeting');
    toast.message('Zoom', {
      description: 'A Zoom tab has been opened. Create the meeting, copy the link, then click Paste to auto-fill.',
    });
  };

  const copyMeetingLinkToClipboard = async () => {
    try {
      const link = sessionForm.meetingLink?.trim();
      if (!link) {
        toast.error('No meeting link to copy');
        return;
      }
      await navigator.clipboard.writeText(link);
      toast.success('Meeting link copied');
    } catch (err) {
      toast.error('Clipboard access denied');
    }
  };

  const pasteMeetingLinkFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.error('Clipboard is empty');
        return;
      }
      const trimmed = text.trim();
      const looksLikeMeeting = /https?:\/\/meet\.google\.com\/[a-z0-9-]+/i.test(trimmed) || /https?:\/\/(?:[a-z0-9.-]*zoom\.us)\/[a-zA-Z0-9/?=&_.-]+/i.test(trimmed);
      setSessionForm(prev => ({ ...prev, meetingLink: trimmed }));
      if (looksLikeMeeting) {
        toast.success('Meeting link pasted');
      } else {
        toast.warning('Pasted text may not be a meeting link');
      }
    } catch (err) {
      toast.error('Clipboard access denied');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-4">Create and track your study sessions</p>
        </div>
      </div>

      {/* Sessions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-card border-border">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Session
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            My Sessions
          </TabsTrigger>
        </TabsList>

                 {/* Create Session Tab */}
         <TabsContent value="create" className="space-y-6">
           <div className="flex flex-col lg:flex-row gap-6">
             {/* Create Session Form - 50% width */}
             <div className="lg:w-1/2 flex-1">
               <Card className="bg-card border-border">
                 <CardHeader>
                   <CardTitle className="font-bold text-2xl">Create a new session</CardTitle>
                   <CardDescription className="mt-2">Set details and share with a study partner</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
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

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                       <div className="flex gap-2 items-center">
                         <div className="relative flex-1">
                           <Input
                             id="meeting-link"
                             value={sessionForm.meetingLink}
                             onChange={(e) => setSessionForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                             placeholder="Paste Google Meet/Zoom link"
                             className="pr-10"
                           />
                           <button
                             type="button"
                             onClick={pasteMeetingLinkFromClipboard}
                             title="Paste meeting link"
                             aria-label="Paste meeting link"
                             className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-foreground bg-muted px-2 py-1 rounded border border-border hover:bg-muted/80"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                               <path d="M19 2h-3.18C15.4.84 14.3 0 13 0h-2c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 18H5V4h2v2h10V4h2v16z"/>
                               <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z"/>
                             </svg>
                           </button>
                         </div>
                         <Button variant="outline" size="icon" onClick={handleOpenGoogleMeet} title="Create Google Meet" aria-label="Create Google Meet">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                             <path fill="#1e8e3e" d="M6 14c0-2.21 1.79-4 4-4h14v28H10c-2.21 0-4-1.79-4-4V14z"/>
                             <path fill="#34a853" d="M24 10h8l6 6v16l-6 6h-8z"/>
                             <path fill="#fbbc05" d="M38 16h4c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4h-4z"/>
                             <path fill="#ea4335" d="M24 38h8l6-6H24z" opacity=".8"/>
                           </svg>
                         </Button>
                         <Button variant="outline" size="icon" onClick={handleOpenZoom} title="Create Zoom Meeting" aria-label="Create Zoom Meeting">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                             <path fill="#2D8CFF" d="M6 16c0-3.314 2.686-6 6-6h12c3.314 0 6 2.686 6 6v16c0 3.314-2.686 6-6 6H12c-3.314 0-6-2.686-6-6V16z"/>
                             <path fill="#2D8CFF" d="M30 22l10-6v16l-10-6z" opacity=".8"/>
                           </svg>
                         </Button>
                       </div>
                       <div className="text-xs text-muted-foreground flex items-center gap-2"><Video className="h-3 w-3" /> Use the icons to create a meeting, then click Paste</div>
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
                       <div className="text-xs text-muted-foreground flex items-center gap-2"><MapPin className="h-3 w-3" /> Provide a clear address</div>
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
                     <Button onClick={handleCreateSession} className="flex-1">
                       <Calendar className="h-4 w-4 mr-2" />
                       Create Session
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Created Sessions List - 50% width */}
             <div className="lg:w-1/2 flex-1">
               <Card className="bg-card border-border h-fit">
                 <CardHeader>
                   <CardTitle className="text-2xl font-bold">Your Created Sessions</CardTitle>
                   <CardDescription className="text-m mt-2">Recently created sessions</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   {sessions.length === 0 && (
                     <div className="text-m text-muted-foreground text-center py-4">No sessions created yet</div>
                   )}
                   {sessions.slice(0, 5).map((s) => (
                     <div key={s.id} className="p-3 rounded-lg border bg-muted/40">
                       <div className="font-medium text-sm text-foreground truncate flex items-center justify-between gap-3">
                         <span className="truncate">{s.title}</span>
                         <Button
                           variant="outline"
                           onClick={() => removeCreatedSession(s.id)}
                           className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                         >
                           Remove
                         </Button>
                       </div>
                       <div className="text-xs text-muted-foreground mt-1">
                         {s.type === 'video' ? 'Video' : 'In Person'} • {s.duration} mins
                       </div>
                       {s.description && (
                         <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</div>
                       )}
                     </div>
                   ))}
                   {sessions.length > 5 && (
                     <div className="text-xs text-muted-foreground text-center py-2">
                       +{sessions.length - 5} more sessions
                     </div>
                   )}
                 </CardContent>
               </Card>
             </div>
           </div>
         </TabsContent>

                 {/* Manage Sessions Tab */}
         <TabsContent value="manage" className="space-y-6">
           {/* Joined Sessions */}
           <Card className="bg-card border-border">
             <CardHeader>
               <CardTitle className="font-bold text-2xl">Sessions You've Joined</CardTitle>
               <CardDescription className="mt-2">Sessions you've signed up for from other creators</CardDescription>
             </CardHeader>
            <CardContent className="space-y-4">
              {joinedSessions.length === 0 && (
                <div className="text-sm text-muted-foreground">No joined sessions yet. Find sessions in the Skill Matching section.</div>
              )}

              {joinedSessions.length > 0 && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Pending (left) */}
                  <div className="lg:w-1/2 flex-1">
                    <Card className="bg-card border-border h-fit">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2"><Clock className="h-4 w-4" /> Pending</CardTitle>
                        <CardDescription className="mt-1">Upcoming and in-progress sessions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {joinedSessions.filter(s => s.status !== 'completed' && s.status !== 'cancelled').map((session) => (
                          <div key={session.id} className="p-4 rounded-lg border bg-muted/40">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={session.creatorAvatar} alt={session.creator} />
                                    <AvatarFallback>{session.creator?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-foreground">{session.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Created by {session.creator} • {session.type === 'video' ? 'Video' : 'In Person'} • {session.duration} mins
                                    </div>
                                  </div>
                                </div>
                                {session.description && (
                                  <div className="text-sm text-muted-foreground mb-2">{session.description}</div>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {session.date} at {session.time}
                                  </div>
                                  {session.type === 'video' && session.meetingLink && (
                                    <a href={session.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">
                                      <Video className="h-3 w-3" />
                                      Join Meeting
                                    </a>
                                  )}
                                  {session.type === 'inperson' && session.meetingAddress && (
                                    <div className="flex items-center gap-1 text-foreground">
                                      <MapPin className="h-3 w-3" />
                                      {session.meetingAddress}
                                    </div>
                                  )}
                                </div>
                               </div>
                               <div className="flex flex-col items-center gap-2">
                                 <Badge className={'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'}>
                                   <Clock className="h-3 w-3 mr-1" />
                                   Upcoming
                                 </Badge>
                                 <Button
                                   variant="outline"
                                   onClick={() => cancelJoinedSession(session.id)}
                                   className="h-7 mt-3 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
                                 >
                                   Cancel
                                 </Button>
                               </div>
                            </div>
                          </div>
                        ))}
                        {joinedSessions.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length === 0 && (
                          <div className="text-sm text-muted-foreground">No pending sessions.</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Completed (right) */}
                  <div className="lg:w-1/2 flex-1">
                    <Card className="bg-card border-border h-fit">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Completed</CardTitle>
                        <CardDescription className="mt-1">Sessions you've already finished</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {joinedSessions.filter(s => s.status === 'completed').map((session) => (
                          <div key={session.id} className="p-4 rounded-lg border bg-muted/40">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={session.creatorAvatar} alt={session.creator} />
                                    <AvatarFallback>{session.creator?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-foreground">{session.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                      Created by {session.creator} • {session.type === 'video' ? 'Video' : 'In Person'} • {session.duration} mins
                                    </div>
                                  </div>
                                </div>
                                {session.description && (
                                  <div className="text-sm text-muted-foreground mb-2">{session.description}</div>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {session.date} at {session.time}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <Badge className={'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 mb-2'}>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-muted-foreground mb-2">
                                    <Star className="h-5 w-5 inline mr-1 mb-1 text-yellow-400" />
                                    {getAverageRating()}/5
                                  </div>
                                  <button
                                    onClick={() => openRatingDialog(session)}
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 underline"
                                  >
                                    Rate
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {joinedSessions.filter(s => s.status === 'completed').length === 0 && (
                          <div className="text-sm text-muted-foreground">No completed sessions yet.</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Session</DialogTitle>
            <DialogDescription>
              How was your experience with "{selectedSession?.title}"?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="rating-comment">Comment (Optional)</Label>
              <Textarea
                id="rating-comment"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your thoughts about the session..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleRatingSubmit} className="flex-1">
                Submit Rating
              </Button>
              <Button variant="outline" onClick={handleRatingCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

