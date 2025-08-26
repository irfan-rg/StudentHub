import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { X, Plus, Star, BookOpen, Users, ArrowRight } from 'lucide-react';

export function AuthModal({ isOpen, onClose, mode, onLogin, onSignup, onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    educationLevel: '',
  });
  
  const [skillsCanTeach, setSkillsCanTeach] = useState([]);
  const [skillsWantToLearn, setSkillsWantToLearn] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const availableSkills = [
    // Programming & Development
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML/CSS', 'TypeScript',
    'Angular', 'Vue.js', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    
    // Data & Analytics
    'Data Science', 'Machine Learning', 'Data Analysis', 'Statistics', 'SQL', 'R Programming',
    'Power BI', 'Tableau', 'Excel', 'Google Analytics',
    
    // Design & Creative
    'UI/UX Design', 'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Figma',
    'Video Editing', 'Animation', '3D Modeling', 'Photography',
    
    // Business & Management
    'Digital Marketing', 'Project Management', 'Business Analysis', 'Financial Analysis',
    'Content Writing', 'Social Media Marketing', 'SEO', 'Public Speaking',
    
    // Academic Subjects
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology',
    'History', 'Literature', 'Philosophy', 'Sociology',
    
    // Languages
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
    'Portuguese', 'Italian', 'Russian',
    
    // Other Skills
    'DevOps', 'Cloud Computing', 'Cybersecurity', 'Blockchain', 'Game Development',
    'Mobile Development', 'Research Skills', 'Technical Writing', 'Networking'
  ];

  const levelLabels = {
    beginner: { label: 'Beginner', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: '🌱' },
    intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: '📚' },
    advanced: { label: 'Advanced', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', icon: '🎯' },
    expert: { label: 'Expert', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: '⭐' }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkillCanTeach = (skillName, level) => {
    if (!skillsCanTeach.find(skill => skill.name === skillName)) {
      setSkillsCanTeach(prev => [...prev, { name: skillName, level }]);
    }
  };

  const removeSkillCanTeach = (skillName) => {
    setSkillsCanTeach(prev => prev.filter(skill => skill.name !== skillName));
  };

  const toggleSkillWantToLearn = (skillName) => {
    setSkillsWantToLearn(prev => 
      prev.includes(skillName) 
        ? prev.filter(skill => skill !== skillName)
        : [...prev, skillName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'signin') {
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all fields');
        return;
      }
      
      // Simulate login
      toast.success('Welcome back!');
      onLogin(formData);
      onClose();
    } else {
      if (currentStep === 1) {
        // Validate basic info
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          toast.error('Please fill in all fields');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Validate profile info
        if (!formData.college || !formData.educationLevel) {
          toast.error('Please complete your profile information');
          return;
        }
        
        setCurrentStep(3);
      } else {
        // Final step - skills
        if (skillsCanTeach.length === 0 && skillsWantToLearn.length === 0) {
          toast.error('Please select at least one skill you can teach or want to learn');
          return;
        }
        
        const userData = {
          ...formData,
          skillsCanTeach,
          skillsWantToLearn
        };
        
        toast.success('Account created successfully!');
        onSignup(userData);
        onClose();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      college: '',
      educationLevel: '',
    });
    setSkillsCanTeach([]);
    setSkillsWantToLearn([]);
    setCurrentStep(1);
  };

  const handleModeSwitch = () => {
    resetForm();
    onSwitchMode();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {mode === 'signin' ? 'Welcome Back!' : 'Join StudentHub'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'signin' 
              ? 'Sign in to continue your learning journey'
              : 'Create your account and start connecting with students worldwide'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signin' ? (
            // Sign In Form
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">University Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@university.edu"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleModeSwitch}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </>
          ) : (
            // Sign Up Form with Steps
            <>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Step {currentStep} of 3
                </span>
              </div>

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                    <p className="text-gray-600 dark:text-gray-300">Let's start with your basic details</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">University Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@university.edu"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use your university email for verification
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password (min 6 characters)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
                    <p className="text-gray-600 dark:text-gray-300">Tell us about your academic background</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="e.g., MIT, Stanford University"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select value={formData.educationLevel} onValueChange={(value) => handleSelectChange('educationLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate/Masters</SelectItem>
                        <SelectItem value="phd">PhD/Doctorate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">Skills & Interests</h3>
                    <p className="text-gray-600 dark:text-gray-300">Select skills you can teach and want to learn</p>
                  </div>

                  {/* Skills I Can Teach */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="h-5 w-5 text-yellow-600" />
                        Skills I Can Teach
                      </CardTitle>
                      <CardDescription>
                        Choose skills you're confident teaching others and specify your level
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Selected Skills */}
                        {skillsCanTeach.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {skillsCanTeach.map((skill) => {
                              const levelInfo = levelLabels[skill.level];
                              return (
                                <div key={skill.name} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900 rounded-lg p-2">
                                  <span className="font-medium text-sm">{skill.name}</span>
                                  <Badge className={`text-xs ${levelInfo.color}`}>
                                    {levelInfo.icon} {levelInfo.label}
                                  </Badge>
                                  <button
                                    type="button"
                                    onClick={() => removeSkillCanTeach(skill.name)}
                                    className="ml-1 text-gray-500 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Skill Selection */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                          {availableSkills
                            .filter(skill => !skillsCanTeach.find(s => s.name === skill))
                            .map((skill) => (
                              <div key={skill} className="space-y-1">
                                <div className="text-sm font-medium">{skill}</div>
                                <div className="flex gap-1">
                                  {(['beginner', 'intermediate', 'advanced', 'expert']).map((level) => {
                                    const levelInfo = levelLabels[level];
                                    return (
                                      <button
                                        key={level}
                                        type="button"
                                        onClick={() => addSkillCanTeach(skill, level)}
                                        className={`text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${levelInfo.color}`}
                                        title={`Add ${skill} as ${levelInfo.label}`}
                                      >
                                        {levelInfo.icon}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills I Want to Learn */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Skills I Want to Learn
                      </CardTitle>
                      <CardDescription>
                        Select skills you're interested in learning from others
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Selected Skills */}
                        {skillsWantToLearn.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {skillsWantToLearn.map((skill) => (
                              <Badge key={skill} variant="outline" className="bg-green-50 dark:bg-green-900">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => toggleSkillWantToLearn(skill)}
                                  className="ml-1 text-gray-500 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Skill Selection */}
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                          {availableSkills
                            .filter(skill => !skillsWantToLearn.includes(skill))
                            .map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkillWantToLearn(skill)}
                                className="text-sm p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                              >
                                <Plus className="h-3 w-3 inline mr-1" />
                                {skill}
                              </button>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" size="lg">
                  {currentStep === 3 ? 'Create Account' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleModeSwitch}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}