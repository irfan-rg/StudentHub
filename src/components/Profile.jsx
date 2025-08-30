import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Star, 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Award,
  ArrowRight,
  Settings
} from 'lucide-react';

export function Profile({ user, onUpdateUser }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    college: user.college,
    educationLevel: user.educationLevel,
    bio: user.bio || "Passionate about learning and sharing knowledge with fellow students."
  });

  const [manageSkillsOpen, setManageSkillsOpen] = useState(false);
  const [teachSkills, setTeachSkills] = useState(user.skillsCanTeach || []);
  const [learnSkills, setLearnSkills] = useState(user.skillsWantToLearn || []);

  const availableSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML/CSS', 'TypeScript',
    'Angular', 'Vue.js', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Data Science', 'Machine Learning', 'Data Analysis', 'Statistics', 'SQL', 'R Programming',
    'Power BI', 'Tableau', 'Excel', 'Google Analytics',
    'UI/UX Design', 'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Figma',
    'Video Editing', 'Animation', '3D Modeling', 'Photography',
    'Digital Marketing', 'Project Management', 'Business Analysis', 'Financial Analysis',
    'Content Writing', 'Social Media Marketing', 'SEO', 'Public Speaking',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology',
    'History', 'Literature', 'Philosophy', 'Sociology',
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
    'Portuguese', 'Italian', 'Russian',
    'DevOps', 'Cloud Computing', 'Cybersecurity', 'Blockchain', 'Game Development',
    'Mobile Development', 'Research Skills', 'Technical Writing', 'Networking'
  ];

  const levelLabels = {
    beginner: { label: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: '🌱' },
    intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: '📚' },
    advanced: { label: 'Advanced', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', icon: '🎯' },
    expert: { label: 'Expert', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: '⭐' }
  };

  const addTeachSkill = (name, level) => {
    if (!teachSkills.find((s) => s.name === name)) {
      setTeachSkills((prev) => [...prev, { name, level }]);
    }
  };

  const removeTeachSkill = (name) => {
    setTeachSkills((prev) => prev.filter((s) => s.name !== name));
  };

  const toggleLearnSkill = (name) => {
    setLearnSkills((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);
  };

  const handleSaveSkills = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        skillsCanTeach: teachSkills,
        skillsWantToLearn: learnSkills
      });
    }
    setManageSkillsOpen(false);
  };

  const handleSave = () => {
    // Update user data if onUpdateUser function is provided
    if (onUpdateUser) {
      onUpdateUser({ ...user, ...formData });
    }
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      college: user.college,
      educationLevel: user.educationLevel,
      bio: user.bio || "Passionate about learning and sharing knowledge with fellow students."
    });
    setIsEditing(false);
  };

  // Get top skills to display
  const topSkills = (user.skillsCanTeach || []).slice(0, 6);
  const expertSkills = (user.skillsCanTeach || []).filter(s => s.level === 'expert').length;
  const advancedSkills = (user.skillsCanTeach || []).filter(s => s.level === 'advanced').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your information and skills</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setManageSkillsOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Skills
          </Button>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-100 dark:ring-blue-900"
                />
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="college">College/University</Label>
                      <Input
                        id="college"
                        value={formData.college}
                        onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="educationLevel">Education Level</Label>
                      <Select 
                        value={formData.educationLevel} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, educationLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="graduate">Graduate/Masters</SelectItem>
                          <SelectItem value="phd">PhD/Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mt-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{user.college}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mt-1">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm capitalize">{user.educationLevel?.replace('-', ' ')}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{user.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  {user.level}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-semibold text-foreground">{user.sessionsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions Answered</span>
                <span className="font-semibold text-foreground">{user.questionsAnswered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions Asked</span>
                <span className="font-semibold text-foreground">{user.questionsAsked}</span>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.badges?.map((badge, index) => (
                  <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    <Star className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                )) || <p className="text-muted-foreground text-sm">No badges yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Skills and Bio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell others about yourself, your interests, and learning goals..."
                    rows={4}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Learning Goals */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Learning Goals
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-4">
                {user.skillsWantToLearn?.length || 0} skills you want to master
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.skillsWantToLearn && user.skillsWantToLearn.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {user.skillsWantToLearn.map((skill, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                        >
                        <span className="font-medium text-sm text-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      We'll help you find mentors for these skills through our AI matching system.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No learning goals set</h3>
                  <p className="text-muted-foreground mb-4">
                    Add skills you want to learn to get matched with the right mentors
                  </p>
                  <Button variant="outline" onClick={() => setManageSkillsOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set Learning Goals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Minimal Skills Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Target className="h-5 w-5 text-green-600" />
                    Teaching Skills
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-4">
                    {user.skillsCanTeach?.length || 0} skills available for sharing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {user.skillsCanTeach && user.skillsCanTeach.length > 0 ? (
                <div className="space-y-6">
                  {/* Skills Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-foreground">
                        {user.skillsCanTeach.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                        {expertSkills}
                      </div>
                      <div className="text-xs text-muted-foreground">Expert Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {advancedSkills}
                      </div>
                      <div className="text-xs text-muted-foreground">Advanced Level</div>
                    </div>
                  </div>
                  
                  {/* Top Skills Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Skills</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {topSkills.map((skill, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                        >
                          <span className="font-medium text-sm text-foreground">{skill.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={() => setManageSkillsOpen(true)}
                      variant="ghost" 
                      className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      View and manage all skills
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No teaching skills added</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your skills to start teaching and helping other students
                  </p>
                  <Button onClick={() => setManageSkillsOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Controls */}
          {isEditing && (
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Manage Skills Modal */}
      <Dialog open={manageSkillsOpen} onOpenChange={setManageSkillsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ maxWidth: '900px', width: '900px' }}> 
          <DialogHeader>
            <DialogTitle>Manage Skills</DialogTitle>
            <DialogDescription>Update your teaching skills and learning goals</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="learn" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn">Skills I Want to Learn</TabsTrigger>
              <TabsTrigger value="teach">Skills I Can Teach</TabsTrigger>
            </TabsList>

            <TabsContent value="teach" className="space-y-4">
              {teachSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {teachSkills.map((s) => {
                    const info = levelLabels[s.level];
                    return (
                      <span key={s.name} className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs ${info.color}`}>
                        {info.icon} {s.name}
                        <button onClick={() => removeTeachSkill(s.name)} className="text-gray-500 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                {availableSkills
                  .filter((n) => !teachSkills.find((s) => s.name === n))
                  .map((name) => (
                    <div key={name} className="space-y-1">
                      <div className="text-sm font-medium dark:text-foreground text-center mt-2">{name}</div>
                      <div className="flex gap-1 justify-center">
                        {['beginner','intermediate','advanced','expert'].map((lvl) => {
                          const info = levelLabels[lvl];
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => addTeachSkill(name, lvl)}
                              className={`text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 ${info.color}`}
                              title={`Add ${name} as ${info.label}`}
                            >
                              {info.icon}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learn" className="space-y-4">
              {learnSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {learnSkills.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                      {name}
                      <button onClick={() => toggleLearnSkill(name)} className="text-gray-500 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto">
                {availableSkills
                  .filter((name) => !learnSkills.includes(name))
                  .map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleLearnSkill(name)}
                      className="text-sm p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      <Plus className="h-3 w-3 inline mr-1" />
                      {name}
                    </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSaveSkills} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Skills
            </Button>
            <Button variant="outline" onClick={() => setManageSkillsOpen(false)} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

