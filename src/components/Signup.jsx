import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  ArrowRight,
  User,
  GraduationCap,
  Target,
  BookOpen,
  CheckCircle,
  Mail,
  MapPin,
  Star,
  Lightbulb,
  Zap
} from 'lucide-react';

export function Signup({ onSignup, loading, error }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    educationLevel: '',
    bio: '',
    skillsCanTeach: [],
    skillsWantToLearn: []
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Comprehensive skills database organized by categories
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

  const knowledgeLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Just getting started' },
    { value: 'intermediate', label: 'Intermediate', icon: '📚', description: 'Comfortable with basics' },
    { value: 'advanced', label: 'Advanced', icon: '🎯', description: 'Strong expertise' },
    { value: 'expert', label: 'Expert', icon: '⭐', description: 'Deep mastery' }
  ];

  const [skillSearchTeach, setSkillSearchTeach] = useState('');
  const [skillSearchLearn, setSkillSearchLearn] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSkillsForTeaching = selectedCategory === 'all' 
    ? allSkills.filter(skill => skill.toLowerCase().includes(skillSearchTeach.toLowerCase()))
    : skillsDatabase[selectedCategory]?.filter(skill => skill.toLowerCase().includes(skillSearchTeach.toLowerCase())) || [];

  const filteredSkillsForLearning = allSkills.filter(skill => 
    skill.toLowerCase().includes(skillSearchLearn.toLowerCase())
  );

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.college || !formData.educationLevel) {
        toast.error('Please complete your educational information');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skill, level, type) => {
    if (type === 'teach') {
      const existingIndex = formData.skillsCanTeach.findIndex(s => s.name === skill);
      if (existingIndex >= 0) {
        // Remove skill
        setFormData(prev => ({
          ...prev,
          skillsCanTeach: prev.skillsCanTeach.filter(s => s.name !== skill)
        }));
      } else {
        // Add skill with level
        setFormData(prev => ({
          ...prev,
          skillsCanTeach: [...prev.skillsCanTeach, { name: skill, level }]
        }));
      }
    } else {
      const exists = formData.skillsWantToLearn.includes(skill);
      if (exists) {
        setFormData(prev => ({
          ...prev,
          skillsWantToLearn: prev.skillsWantToLearn.filter(s => s !== skill)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          skillsWantToLearn: [...prev.skillsWantToLearn, skill]
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (formData.skillsCanTeach.length === 0) {
      toast.error('Please add at least one skill you can teach');
      return;
    }
    
    onSignup(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Let's get started
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create your account to join the knowledge sharing community
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-2 h-12"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className="mt-2 h-12"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create a secure password"
                  className="mt-2 h-12"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Tell us about your education
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Help us understand your academic background
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="college" className="text-base">College/University</Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                  placeholder="e.g., Stanford University, MIT, Harvard"
                  className="mt-2 h-12"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="educationLevel" className="text-base">Education Level</Label>
                <Select 
                  value={formData.educationLevel} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, educationLevel: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select your current education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate/Masters</SelectItem>
                    <SelectItem value="phd">PhD/Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio" className="text-base">Brief Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself, your interests, and what you're passionate about..."
                  rows={4}
                  className="mt-2"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What can you teach?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Share your expertise and help other students learn
              </p>
            </div>

            <div className="space-y-6">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  disabled={loading}
                >
                  All Categories
                </Button>
                {Object.keys(skillsDatabase).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    disabled={loading}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Search */}
              <div>
                <Input
                  placeholder="Search for skills..."
                  value={skillSearchTeach}
                  onChange={(e) => setSkillSearchTeach(e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </div>

              {/* Selected Skills */}
              {formData.skillsCanTeach.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                    Selected Skills ({formData.skillsCanTeach.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsCanTeach.map((skill, index) => {
                      const levelInfo = knowledgeLevels.find(l => l.value === skill.level);
                      return (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                        >
                          {skill.name} ({levelInfo?.icon} {levelInfo?.label})
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredSkillsForTeaching.map((skill, index) => {
                  const isSelected = formData.skillsCanTeach.some(s => s.name === skill);
                  return (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{skill}</span>
                        {isSelected && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {knowledgeLevels.map(level => (
                          <Button
                            key={level.value}
                            variant={isSelected && formData.skillsCanTeach.find(s => s.name === skill)?.level === level.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSkillToggle(skill, level.value, 'teach')}
                            className="text-xs h-8"
                            disabled={loading}
                          >
                            {level.icon} {level.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What do you want to learn?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set your learning goals to get matched with the right mentors
              </p>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <Input
                  placeholder="Search for skills you want to learn..."
                  value={skillSearchLearn}
                  onChange={(e) => setSkillSearchLearn(e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </div>

              {/* Selected Learning Goals */}
              {formData.skillsWantToLearn.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                    Learning Goals ({formData.skillsWantToLearn.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsWantToLearn.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {filteredSkillsForLearning.map((skill, index) => {
                  const isSelected = formData.skillsWantToLearn.includes(skill);
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => handleSkillToggle(skill, null, 'learn')}
                      className="h-auto p-3 text-left justify-start"
                      disabled={loading}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <CheckCircle className="h-4 w-4" />}
                        <span className="text-sm">{skill}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">Ready to join the community!</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-purple-700 dark:text-purple-300">
                  <div>
                    <span className="font-medium">Teaching:</span> {formData.skillsCanTeach.length} skills
                  </div>
                  <div>
                    <span className="font-medium">Learning:</span> {formData.skillsWantToLearn.length} goals
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
              disabled={loading}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Join Student Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% complete
            </span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Display error if any */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {renderStep()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    <Zap className="h-4 w-4" />
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}