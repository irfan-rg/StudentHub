import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Plus,
  Search,
  Target,
  BookOpen,
  Edit,
  Trash2,
  Star,
  Award
} from 'lucide-react';

export function SkillsManagement({ user, onUpdateUser }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 'beginner' });

  // Organize skills by categories
  const skillCategories = {
    'Programming': ['React', 'JavaScript', 'Python', 'Java', 'TypeScript', 'Node.js'],
    'Design': ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    'Data Science': ['Machine Learning', 'Data Analysis', 'Statistics', 'SQL'],
    'Business': ['Project Management', 'Marketing', 'Finance', 'Entrepreneurship'],
    'Other': []
  };

  // Categorize user skills
  const categorizedSkills = (user.skillsCanTeach || []).reduce((acc, skill) => {
    let category = 'Other';
    for (const [cat, skills] of Object.entries(skillCategories)) {
      if (skills.includes(skill.name)) {
        category = cat;
        break;
      }
    }
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const levelConfig = {
    beginner: { label: 'Beginner', color: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
    intermediate: { label: 'Intermediate', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    advanced: { label: 'Advanced', color: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    expert: { label: 'Expert', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' }
  };

  const categories = Object.keys(skillCategories);
  const filteredCategories = selectedCategory === 'all' ? categories : [selectedCategory];

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }
    
    // Update user skills if onUpdateUser function is provided
    if (onUpdateUser) {
      const updatedSkills = [...(user.skillsCanTeach || []), { name: newSkill.name, level: newSkill.level }];
      onUpdateUser({ ...user, skillsCanTeach: updatedSkills });
    }
    
    toast.success(`Added ${newSkill.name} to your teaching skills`);
    setIsAddingSkill(false);
    setNewSkill({ name: '', category: '', level: 'beginner' });
  };

  const handleRemoveSkill = (skillName) => {
    // Update user skills if onUpdateUser function is provided
    if (onUpdateUser) {
      const updatedSkills = (user.skillsCanTeach || []).filter(skill => skill.name !== skillName);
      onUpdateUser({ ...user, skillsCanTeach: updatedSkills });
    }
    
    toast.success(`Removed ${skillName} from your teaching skills`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-normal text-gray-900 dark:text-gray-100">Skills Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Organize and manage your teaching capabilities</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsAddingSkill(true)}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {user.skillsCanTeach?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {Object.keys(categorizedSkills).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {user.skillsCanTeach?.filter(s => s.level === 'expert').length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Expert Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
              {user.sessionsCompleted || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Sessions Taught</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-6 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory('all')}
              className="text-sm"
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-16">
          {filteredCategories.map(category => {
            const categorySkills = categorizedSkills[category] || [];
            const filteredSkills = categorySkills.filter(skill =>
              skill.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredSkills.length === 0 && searchTerm) return null;

            return (
              <div key={category}>
                <div className="flex items-center space-x-3 mb-8">
                  <h2 className="text-xl font-normal text-gray-900 dark:text-gray-100">{category}</h2>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {filteredSkills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill, index) => {
                      const config = levelConfig[skill.level];
                      return (
                        <Card key={index} className="border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors bg-white dark:bg-gray-900">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="text-lg font-normal text-gray-900 dark:text-gray-100">
                                {skill.name}
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveSkill(skill.name)}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge className={`${config.badge} border-0 font-normal`}>
                                {config.label}
                              </Badge>
                              
                              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <Star className="h-3 w-3" />
                                <span>4.8</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No skills found matching your search' : `No skills in ${category} yet`}
                    </p>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddingSkill(true)}
                      className="mt-2"
                    >
                      Add a {category.toLowerCase()} skill
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Learning Goals Section */}
        <div className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-8">
            <BookOpen className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-normal text-gray-900 dark:text-gray-100">Learning Goals</h2>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user.skillsWantToLearn?.length || 0} goal{(user.skillsWantToLearn?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          
          {user.skillsWantToLearn && user.skillsWantToLearn.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {user.skillsWantToLearn.map((skill, index) => (
                <div 
                  key={index}
                  className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-gray-200 dark:hover:border-gray-700 transition-colors bg-white dark:bg-gray-900"
                >
                  <span className="text-sm font-normal text-gray-900 dark:text-gray-100">{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No learning goals set yet</p>
              <Button variant="ghost" className="mt-2">
                Add learning goals
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Add a skill you can teach to other students
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name</label>
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, Python, Design Systems"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Proficiency Level</label>
              <select 
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddSkill} className="flex-1">
                Add Skill
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingSkill(false)}
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