import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Users, 
  Shield,
  CreditCard,
  Settings,
  ArrowRight
} from 'lucide-react';

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle, count: 24 },
    { id: 'getting-started', name: 'Getting Started', icon: Book, count: 6 },
    { id: 'matching', name: 'Skill Matching', icon: Users, count: 5 },
    { id: 'sessions', name: 'Study Sessions', icon: MessageSquare, count: 4 },
    { id: 'safety', name: 'Safety & Privacy', icon: Shield, count: 4 },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCard, count: 3 },
    { id: 'technical', name: 'Technical Support', icon: Settings, count: 2 }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create my StudentHub account?',
      answer: 'Creating your StudentHub account is simple! Click "Get Started Free" on our homepage, enter your university email address, and follow the verification steps. You\'ll need to verify your email and set up your profile with your skills and learning goals.',
      tags: ['signup', 'account', 'verification']
    },
    {
      category: 'getting-started',
      question: 'What information do I need to provide during signup?',
      answer: 'You\'ll need your university email address, full name, college/university, education level, and information about skills you can teach and want to learn. You can also add a profile picture and bio to help others connect with you.',
      tags: ['profile', 'signup', 'information']
    },
    {
      category: 'getting-started',
      question: 'Do I need to verify my university email?',
      answer: 'Yes! University email verification is required to ensure our community consists of verified students. This helps maintain trust and safety within our platform.',
      tags: ['verification', 'email', 'university']
    },
    {
      category: 'matching',
      question: 'How does the AI matching algorithm work?',
      answer: 'Our AI algorithm analyzes your skills, learning goals, schedule preferences, location, and education level to find the best study partners. It looks for complementary skills where you can teach each other and similar learning styles for effective collaboration.',
      tags: ['algorithm', 'matching', 'AI']
    },
    {
      category: 'matching',
      question: 'Can I filter my matches by specific criteria?',
      answer: 'Absolutely! You can filter matches by skills, university, location, education level, availability, and more. Our advanced search helps you find exactly the type of study partner you\'re looking for.',
      tags: ['filters', 'search', 'criteria']
    },
    {
      category: 'matching',
      question: 'How accurate are the match percentages?',
      answer: 'Our match percentages are based on multiple factors including skill compatibility, learning goals alignment, schedule overlap, and communication preferences. Most users find 80%+ matches to be highly compatible study partners.',
      tags: ['accuracy', 'percentage', 'compatibility']
    },
    {
      category: 'sessions',
      question: 'How do I schedule a study session?',
      answer: 'Click "Book Session" on any student\'s profile, choose your preferred time from their availability, select the session type (video, in-person, or group), and add any specific topics you\'d like to focus on. They\'ll receive a notification to confirm.',
      tags: ['scheduling', 'booking', 'sessions']
    },
    {
      category: 'sessions',
      question: 'What types of study sessions are available?',
      answer: 'We offer one-on-one video sessions, in-person meetings (if you\'re in the same location), and group study sessions. You can also choose between teaching sessions, learning sessions, or collaborative study sessions.',
      tags: ['types', 'video', 'group', 'in-person']
    },
    {
      category: 'sessions',
      question: 'Can I reschedule or cancel a session?',
      answer: 'Yes! You can reschedule or cancel sessions up to 2 hours before the scheduled time. Both participants will be notified of any changes. We encourage giving as much notice as possible to be respectful of others\' time.',
      tags: ['reschedule', 'cancel', 'changes']
    },
    {
      category: 'safety',
      question: 'How do you ensure user safety?',
      answer: 'We verify all users through university email addresses, have a comprehensive reporting system, provide safety guidelines for meetings, and moderate our platform regularly. We also offer privacy controls so you can control who can contact you.',
      tags: ['safety', 'verification', 'moderation']
    },
    {
      category: 'safety',
      question: 'What should I do if I encounter inappropriate behavior?',
      answer: 'Report any inappropriate behavior immediately using the report button on profiles or in messages. Our moderation team reviews all reports within 24 hours and takes appropriate action, including warnings or account suspension.',
      tags: ['reporting', 'inappropriate', 'moderation']
    },
    {
      category: 'safety',
      question: 'Can I control who can see my profile and contact me?',
      answer: 'Yes! You have full control over your privacy settings. You can limit who can see your profile, send you messages, or book sessions with you. You can also block specific users if needed.',
      tags: ['privacy', 'control', 'blocking']
    },
    {
      category: 'billing',
      question: 'Is StudentHub really free to use?',
      answer: 'Yes! Our basic plan is completely free and includes access to the Q&A forum, basic matching, and limited study sessions. Premium plans offer unlimited sessions, advanced features, and priority support.',
      tags: ['free', 'pricing', 'basic']
    },
    {
      category: 'billing',
      question: 'How do I upgrade or cancel my subscription?',
      answer: 'You can upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes take effect immediately, and you\'ll be charged or credited accordingly. No cancellation fees.',
      tags: ['upgrade', 'cancel', 'subscription']
    },
    {
      category: 'billing',
      question: 'Do you offer student discounts?',
      answer: 'Yes! All students with verified .edu email addresses automatically receive a 50% discount on all premium plans. The discount is applied at checkout and continues as long as your email remains verified.',
      tags: ['discount', 'student', 'pricing']
    },
    {
      category: 'technical',
      question: 'What devices and browsers are supported?',
      answer: 'StudentHub works on all modern web browsers (Chrome, Firefox, Safari, Edge) and is fully responsive for mobile devices. We also offer a Progressive Web App (PWA) that you can install on your phone or computer.',
      tags: ['compatibility', 'browsers', 'mobile']
    },
    {
      category: 'technical',
      question: 'I\'m having trouble with video calls. What should I do?',
      answer: 'First, check your internet connection and ensure your browser has permission to access your camera and microphone. If issues persist, try refreshing the page or switching browsers. Contact support if the problem continues.',
      tags: ['video', 'technical', 'troubleshooting']
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <HelpCircle className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about StudentHub. Can't find what you're looking for? Contact our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories and FAQ Content */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4">
              <Card className="sticky top-6 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Categories</CardTitle>
                  <CardDescription className="text-muted-foreground">Browse by topic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    const categoryCount = category.id === 'all' 
                      ? filteredFAQs.length 
                      : faqs.filter(faq => faq.category === category.id).length;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'hover:bg-accent/50 text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {categoryCount}
                        </Badge>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:w-3/4">
              {filteredFAQs.length === 0 ? (
                <Card className="text-center py-12 bg-card border-border">
                  <CardContent>
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or browse a different category.
                    </p>
                    <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => {
                    const isExpanded = expandedItems.has(index);
                    
                    return (
                      <Card key={index} className="bg-card border-border">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="w-full text-left p-6 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-foreground pr-4">
                                {faq.question}
                              </h3>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {faq.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="px-6 pb-6">
                              <div className="border-t border-border pt-4">
                                <p className="text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="py-20 bg-background dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 dark:text-foreground">Still Need Help?</h2>
            <p className="text-gray-600 dark:text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our support team is here to help you get the most out of StudentHub.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">
                  Contact Support
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

