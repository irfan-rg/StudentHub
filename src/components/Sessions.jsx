import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Video, MapPin, Plus, List, User, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Sessions({ user }) {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-4">Create and track your study sessions</p>
        </div>
      </div>

      {/* Sessions Tabs */}
      <Tabs defaultValue="create" className="space-y-4">
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
                  <Input
                    id="meeting-link"
                    value={sessionForm.meetingLink}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                    placeholder="Paste Google Meet/Zoom/Teams link"
                  />
                  <div className="text-xs text-muted-foreground flex items-center gap-2"><Video className="h-3 w-3" /> Share a valid link</div>
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
               {joinedSessions.map((session) => (
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
                     <Badge 
                       className={
                         session.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                         session.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                         'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                       }
                     >
                       {session.status === 'upcoming' && <Clock className="h-3 w-3 mr-1" />}
                       {session.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                       {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                     </Badge>
                   </div>
                 </div>
               ))}
             </CardContent>
           </Card>

           {/* Created Sessions */}
           <Card className="bg-card border-border">
             <CardHeader>
               <CardTitle className="font-bold text-2xl">Sessions You've Created</CardTitle>
               <CardDescription className="mt-2">Sessions you've created for others to join</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               {sessions.length === 0 && (
                 <div className="text-sm text-muted-foreground">No created sessions yet. Create one in the Create Session tab.</div>
               )}
               {sessions.map((s) => (
                 <div key={s.id} className="p-4 rounded-lg border bg-muted/40">
                   <div className="flex items-center justify-between">
                     <div>
                       <div className="font-medium text-foreground">{s.title}</div>
                       <div className="text-xs text-muted-foreground">{s.type === 'video' ? 'Video' : 'In Person'} • {s.duration} mins</div>
                     </div>
                   </div>
                   {s.description && (
                     <div className="mt-2 text-sm text-muted-foreground">{s.description}</div>
                   )}
                   <div className="mt-2 text-sm">
                     {s.type === 'video' && s.meetingLink && (
                       <a href={s.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">Join link</a>
                     )}
                     {s.type === 'inperson' && s.meetingAddress && (
                       <span className="text-foreground">Location: {s.meetingAddress}</span>
                     )}
                   </div>
                 </div>
               ))}
             </CardContent>
           </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}


