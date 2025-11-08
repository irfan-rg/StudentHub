import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts@2.15.2';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { userService, skillsService } from '../services/api';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTeach, setSelectedCategoryTeach] = useState('all');
  const [selectedCategoryLearn, setSelectedCategoryLearn] = useState('all');

  // Skills database organized by categories
  const skillsDatabase = {
    'Programming & Development': [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Vue.js', 'Angular', 
      'Node.js', 'Django', 'Flask', 'Spring Boot', 'TypeScript', 'PHP', 'Ruby', 
      'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native'
    ],
    'Data Science & Analytics': [
      'Machine Learning', 'Deep Learning', 'Data Analysis', 'Statistics', 
      'SQL', 'R', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 
      'Data Visualization', 'Tableau', 'Power BI', 'Big Data', 'Hadoop', 'Spark'
    ],
    'Design & Creative': [
      'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Creative Suite', 
      'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'Branding', 
      'Illustration', 'Photography', 'Video Editing', 'Animation', '3D Modeling'
    ],
    'Business & Management': [
      'Project Management', 'Digital Marketing', 'SEO', 'Content Marketing', 
      'Social Media Marketing', 'Business Analysis', 'Finance', 'Accounting', 
      'Entrepreneurship', 'Strategy', 'Operations', 'Product Management', 
      'Sales', 'Customer Service'
    ],
    'Cloud & DevOps': [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'DevOps', 
      'CI/CD', 'Infrastructure as Code', 'Terraform', 'Monitoring', 
      'Linux', 'System Administration', 'Networking', 'Security'
    ],
    'Other Skills': [
      'Writing', 'Research', 'Public Speaking', 'Teaching', 'Languages', 
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Psychology', 
      'Economics', 'Law', 'Music', 'Art History', 'Philosophy'
    ]
  };

  const allSkills = Object.values(skillsDatabase).flat();

  // Avatar management state
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const AVAILABLE_AVATARS = [
    'https://avatar.iran.liara.run/public/40',
    'https://avatar.iran.liara.run/public/48',
    'https://avatar.iran.liara.run/public/32',
    'https://avatar.iran.liara.run/public/36',
    'https://avatar.iran.liara.run/public/81',
    'https://avatar.iran.liara.run/public/73',
    'https://avatar.iran.liara.run/public/85',
    'https://avatar.iran.liara.run/public/78'
  ];

  const levelLabels = {
    beginner: { label: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: '🌱' },
    intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: '📚' },
    advanced: { label: 'Advanced', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', icon: '🎯' },
    expert: { label: 'Expert', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300', icon: '⭐' }
  };

  // Filtered skills for teaching based on category and search
  const filteredSkillsForTeaching = selectedCategoryTeach === 'all'
    ? allSkills.filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    : skillsDatabase[selectedCategoryTeach]?.filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  // Filtered skills for learning based on category and search
  const filteredSkillsForLearning = selectedCategoryLearn === 'all'
    ? allSkills.filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    : skillsDatabase[selectedCategoryLearn]?.filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const addTeachSkill = (name, level) => {
    if (!teachSkills.find((s) => s.name === name)) {
      setTeachSkills((prev) => [...prev, { name, level }]);
    }
  };

  const removeTeachSkill = (name) => {
    setTeachSkills((prev) => prev.filter((s) => {
      const skillName = typeof s === 'string' ? s : s.name;
      return skillName !== name;
    }));
  };

  const toggleLearnSkill = (name) => {
    setLearnSkills((prev) => {
      const hasSkill = prev.some(s => {
        const skillName = typeof s === 'string' ? s : s.name;
        return skillName === name;
      });
      
      if (hasSkill) {
        return prev.filter((s) => {
          const skillName = typeof s === 'string' ? s : s.name;
          return skillName !== name;
        });
      } else {
        return [...prev, name];
      }
    });
  };

  const levels = ['beginner','intermediate','advanced','expert'];

  const updateTeachSkillLevel = (name, newLevel) => {
    setTeachSkills((prev) => prev.map((s) => {
      const skillName = typeof s === 'string' ? s : s.name;
      if (skillName === name) {
        return typeof s === 'object' ? { ...s, level: newLevel } : { name: s, level: newLevel };
      }
      return s;
    }));
    const label = levelLabels[newLevel]?.label || newLevel;
    toast.success(`Level updated to ${label}`);
  };

  const handleSaveSkills = async () => {
    try {
      // Prepare skills data - convert to format backend expects
      const teachSkillsData = teachSkills
        .map(skill => {
          // Handle string format
          if (typeof skill === 'string') {
            return { name: skill, level: 'beginner', category: '' };
          }
          // Handle object format
          if (typeof skill === 'object' && skill !== null) {
            const skillName = skill.name || (typeof skill === 'string' ? skill : null);
            if (!skillName) {
              console.warn('Invalid teach skill:', skill);
              return null;
            }
            return {
              name: skillName,
              level: skill.level || 'beginner',
              category: skill.category || ''
            };
          }
          console.warn('Invalid teach skill format:', skill);
          return null;
        })
        .filter(skill => skill !== null && skill.name); // Remove invalid skills

      const learnSkillsData = learnSkills
        .map(skill => {
          // Handle string format
          if (typeof skill === 'string') {
            return { name: skill, category: '' };
          }
          // Handle object format
          if (typeof skill === 'object' && skill !== null) {
            const skillName = skill.name || (typeof skill === 'string' ? skill : null);
            if (!skillName) {
              console.warn('Invalid learn skill:', skill);
              return null;
            }
            return {
              name: skillName,
              category: skill.category || ''
            };
          }
          console.warn('Invalid learn skill format:', skill);
          return null;
        })
        .filter(skill => skill !== null && skill.name); // Remove invalid skills

      console.log('Updating skills...', { 
        teachSkillsData, 
        learnSkillsData,
        originalTeach: teachSkills,
        originalLearn: learnSkills
      });

      // Call both API endpoints separately to see which one fails
      try {
        const teachResult = await skillsService.updateSkillsToTeach(teachSkillsData);
        console.log('Teach skills updated:', teachResult);
      } catch (error) {
        console.error('Failed to update teach skills:', error);
        throw new Error(`Failed to update teaching skills: ${error.message}`);
      }

      try {
        const learnResult = await skillsService.updateSkillsToLearn(learnSkillsData);
        console.log('Learn skills updated:', learnResult);
      } catch (error) {
        console.error('Failed to update learn skills:', error);
        throw new Error(`Failed to update learning skills: ${error.message}`);
      }

      // Update local state if onUpdateUser function is provided
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          skillsCanTeach: teachSkills,
          skillsWantToLearn: learnSkills
        });
      }

      toast.success('Skills updated successfully!');
      setManageSkillsOpen(false);
    } catch (error) {
      console.error('Skills update error:', error);
      toast.error(`Failed to update skills: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      // Call API to update profile in database
      await userService.updateProfile(formData);

      // Update local state if onUpdateUser function is provided
      if (onUpdateUser) {
        onUpdateUser({ ...user, ...formData });
      }
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    }
  };

  const handleSelectAvatarFromGallery = async () => {
    if (!selectedAvatar) return;
    // Optimistic UI: update and close immediately
    if (onUpdateUser) {
      onUpdateUser({ ...user, avatar: selectedAvatar });
    }
    setAvatarDialogOpen(false);
    toast.success('Profile photo updated');
    try {
      await userService.updateProfile({ avatar: selectedAvatar });
    } catch (err) {
      // Silent fallback; keep optimistic avatar
      console.warn('Avatar update failed on server, keeping local change');
    }
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be ≤ 2 MB');
      return;
    }
    try {
      setIsUploading(true);
      const form = new FormData();
      form.append('file', file);
      const data = await userService.uploadAvatar(form);
      const newUrl = data?.avatar || data?.url || data; // backend returns avatar URL
      if (newUrl) {
        if (onUpdateUser) {
          onUpdateUser({ ...user, avatar: newUrl });
        }
        toast.success('Profile photo uploaded');
        setAvatarDialogOpen(false);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      // reset input value so same file can be selected again if needed
      event.target.value = '';
    }
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

  // Get top skills to display (use local state so changes reflect immediately)
  const topSkills = (teachSkills || []).slice(0, 6);
  const expertSkills = (teachSkills || []).filter(s => {
    const level = typeof s === 'object' ? s.level : 'beginner';
    return level === 'expert';
  }).length;
  const advancedSkills = (teachSkills || []).filter(s => {
    const level = typeof s === 'object' ? s.level : 'beginner';
    return level === 'advanced';
  }).length;

  const totalPoints = Math.max(user.points ?? 0, 0);
  const pointsGoal = Math.max(user.pointsGoal ?? 3000, totalPoints || 1);
  const sessionsCompleted = Math.max(user.sessionsCompleted ?? 0, 0);
  const sessionsGoal = Math.max(user.sessionTarget ?? 20, sessionsCompleted || 1);
  const questionsAnswered = Math.max(user.questionsAnswered ?? 0, 0);
  const answeredGoal = Math.max(user.questionsAnsweredGoal ?? 40, questionsAnswered || 1);
  const questionsAsked = Math.max(user.questionsAsked ?? 0, 0);
  const askedGoal = Math.max(user.questionsAskedGoal ?? 30, questionsAsked || 1);

  const radarMetrics = [
    {
      key: 'points',
      label: 'Points',
      value: totalPoints,
      goal: pointsGoal,
      unit: 'pts',
      score: Math.min(100, Math.round((totalPoints / pointsGoal) * 100))
    },
    {
      key: 'sessions',
      label: 'Sessions',
      value: sessionsCompleted,
      goal: sessionsGoal,
      unit: 'sessions',
      score: Math.min(100, Math.round((sessionsCompleted / sessionsGoal) * 100))
    },
    {
      key: 'answered',
      label: 'Answers',
      value: questionsAnswered,
      goal: answeredGoal,
      unit: 'answers',
      score: Math.min(100, Math.round((questionsAnswered / answeredGoal) * 100))
    },
    {
      key: 'asked',
      label: 'Questions',
      value: questionsAsked,
      goal: askedGoal,
      unit: 'questions',
      score: Math.min(100, Math.round((questionsAsked / askedGoal) * 100))
    }
  ];

  const radarData = radarMetrics.map((metric) => ({
    metric: metric.label,
    score: metric.score,
    raw: metric.value,
    goal: metric.goal,
    unit: metric.unit
  }));

  const radarChartConfig = {
    score: { label: 'Progress', color: 'hsl(221, 83%, 53%)' }
  };

  const levelLabel = user.level || 'Member';

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
                   className="w-24 h-24 rounded-full mx-auto mb-3 object-cover ring-4 ring-blue-100 dark:ring-blue-900"
                 />
                {isEditing ? (
                 <div className="space-y-3">
                    <div className="flex justify-center mb-2">
                      <Button size="sm" variant="outline" onClick={() => setAvatarDialogOpen(true)}>
                        Change Photo
                      </Button>
                    </div>
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
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Performance Snapshot
                </CardTitle>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  {levelLabel}
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                Radar view of how you&apos;re tracking toward your goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <ChartContainer config={radarChartConfig} className="h-56 w-full max-w-xs sm:max-w-sm">
                  <RadarChart outerRadius="80%" data={radarData}>
                    <PolarGrid strokeDasharray="4 4" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Radar
                      name="Progress"
                      dataKey="score"
                      stroke="var(--color-score)"
                      fill="var(--color-score)"
                      fillOpacity={0.25}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideIndicator
                          labelKey="metric"
                          formatter={(value, _name, item) => {
                            const raw = Number(item?.payload?.raw ?? 0);
                            const unit = item?.payload?.unit ? ` ${item.payload.unit}` : '';
                            return (
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-foreground">
                                  {raw.toLocaleString()}
                                  {unit}
                                </span>
                                <span className="text-xs text-muted-foreground">{Number(value)}% of goal</span>
                              </div>
                            );
                          }}
                        />
                      }
                    />
                  </RadarChart>
                </ChartContainer>

                <div className="w-full space-y-3">
                  {radarMetrics.map((metric) => (
                    <div
                      key={metric.key}
                      className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{metric.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Goal: {metric.goal.toLocaleString()} {metric.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {metric.value.toLocaleString()} {metric.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">{metric.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                        <span className="font-medium text-sm text-foreground">
                          {typeof skill === 'string' ? skill : skill.name}
                        </span>
                        {typeof skill === 'object' && skill.category && (
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                        )}
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
                          key={skill._id || index}
                          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-foreground">
                              {typeof skill === 'string' ? skill : skill.name}
                            </span>
                            {typeof skill === 'object' && skill.category && (
                              <span className="text-xs text-muted-foreground">{skill.category}</span>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                              <Badge variant="outline" className="text-xs capitalize cursor-pointer">
                                {typeof skill === 'object' ? skill.level : 'beginner'}
                              </Badge>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {['beginner','intermediate','advanced','expert'].map((lvl) => (
                                <DropdownMenuItem key={lvl} onClick={() => updateTeachSkillLevel(typeof skill === 'string' ? skill : skill.name, lvl)}>
                                  {levelLabels?.[lvl]?.label || lvl}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <DialogTitle className="text-xl font-bold text-foreground">Manage Skills</DialogTitle>
            <DialogDescription className="text-muted-foreground">Update your teaching skills and learning goals</DialogDescription>
          </DialogHeader>

          <div className="mb-4 space-y-3">
            <Label htmlFor="skill-search">Search Skills</Label>
            <Input
              id="skill-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for skills..."
              className="w-full"
            />
          </div>

          <Tabs defaultValue="learn" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn">Skills I Want to Learn</TabsTrigger>
              <TabsTrigger value="teach">Skills I Can Teach</TabsTrigger>
            </TabsList>

            <TabsContent value="teach" className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                <Button
                  size="sm"
                  variant={selectedCategoryTeach === 'all' ? 'default' : 'outline'}
                  className="h-8"
                  onClick={() => setSelectedCategoryTeach('all')}
                >
                  All Categories
                </Button>
                {Object.keys(skillsDatabase).map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategoryTeach === category ? 'default' : 'outline'}
                    className="h-8"
                    onClick={() => setSelectedCategoryTeach(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {teachSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {teachSkills.map((s) => {
                    const skillName = typeof s === 'string' ? s : s.name;
                    const skillLevel = typeof s === 'object' ? s.level : 'beginner';
                    const info = levelLabels[skillLevel] || levelLabels.beginner;
                    return (
                      <span key={skillName || Math.random()} className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs ${info.color}`}>
                        {info.icon} {skillName}
                        <button onClick={() => removeTeachSkill(skillName)} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                {filteredSkillsForTeaching
                  .filter((n) => {
                    // Check if skill already exists in teachSkills array
                    return !teachSkills.some(s => {
                      const skillName = typeof s === 'string' ? s : s.name;
                      return skillName === n;
                    });
                  })
                  .map((name) => (
                    <div key={name} className="space-y-1">
                      <div className="text-sm font-medium text-foreground text-center mt-2">{name}</div>
                      <div className="flex gap-1 justify-center">
                        {['beginner','intermediate','advanced','expert'].map((lvl) => {
                          const info = levelLabels[lvl];
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => addTeachSkill(name, lvl)}
                              className={`text-xs px-2 py-1 rounded border hover:bg-accent ${info.color}`}
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
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                <Button
                  size="sm"
                  variant={selectedCategoryLearn === 'all' ? 'default' : 'outline'}
                  className="h-8"
                  onClick={() => setSelectedCategoryLearn('all')}
                >
                  All Categories
                </Button>
                {Object.keys(skillsDatabase).map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategoryLearn === category ? 'default' : 'outline'}
                    className="h-8"
                    onClick={() => setSelectedCategoryLearn(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {learnSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {learnSkills.map((skill) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <span key={skillName || Math.random()} className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
                        {skillName}
                        <button onClick={() => toggleLearnSkill(skillName)} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto">
                {filteredSkillsForLearning
                  .filter((name) => {
                    // Check if skill already exists in learnSkills array
                    return !learnSkills.some(s => {
                      const skillName = typeof s === 'string' ? s : s.name;
                      return skillName === name;
                    });
                  })
                  .map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleLearnSkill(name)}
                      className="text-sm p-2 border border-border rounded hover:bg-accent text-left text-foreground"
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

      {/* Avatar Picker Modal */}
      <Dialog open={avatarDialogOpen} onOpenChange={(open) => { setAvatarDialogOpen(open); if (!open) setSelectedAvatar(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ maxWidth: '640px', width: '640px' }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Profile Photo</DialogTitle>
            <DialogDescription className="text-md font-semibold">Choose one of our avatars</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="grid grid-cols-4 gap-3">
                {AVAILABLE_AVATARS.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelectedAvatar(src)}
                    className={`relative rounded-full p-0 ring-2 ${selectedAvatar === src ? 'ring-blue-500' : 'ring-transparent'} hover:ring-blue-400`}
                    title="Select avatar"
                  >
                    <img src={src} alt="Avatar option" className="w-20 h-20 rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Upload option removed as per requirement */}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSelectAvatarFromGallery} disabled={!selectedAvatar || isUploading} className="flex-1">
              Save Selection
            </Button>
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)} disabled={isUploading} className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}