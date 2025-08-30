import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  BookOpen, 
  Star, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Calendar,
  Shield,
  Globe,
  Smartphone,
  Laptop
} from 'lucide-react';

export function Features({ onNavigate }) {
  const coreFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Skill Matching",
      description: "Our advanced algorithm analyzes your skills and learning goals to find the perfect study partners.",
      benefits: ["95% match accuracy", "Instant recommendations", "Personalized suggestions"],
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Interactive Q&A Forum",
      description: "Get instant help from peers with our community-driven question and answer platform.",
      benefits: ["Real-time responses", "Expert verification", "Searchable knowledge base"],
      color: "purple"
    },
    {
      icon: Calendar,
      title: "Smart Session Booking",
      description: "Schedule learning sessions with integrated calendar and availability matching.",
      benefits: ["Automated scheduling", "Timezone sync", "Reminder notifications"],
      color: "green"
    },
    {
      icon: Trophy,
      title: "Gamification System",
      description: "Stay motivated with points, badges, and leaderboards that track your progress.",
      benefits: ["Achievement tracking", "Progress visualization", "Competitive rankings"],
      color: "yellow"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Study with confidence using our university email verification system.",
      benefits: ["Institution validation", "Secure connections", "Trust indicators"],
      color: "red"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with students from universities worldwide in multiple languages.",
      benefits: ["500+ universities", "Multi-language support", "Cultural exchange"],
      color: "indigo"
    }
  ];

  const additionalFeatures = [
    {
      category: "Learning Tools",
      features: [
        "Virtual whiteboards for collaborative sessions",
        "Screen sharing and video conferencing",
        "Progress tracking and analytics",
        "Study goal setting and reminders",
        "Resource sharing and file uploads"
      ]
    },
    {
      category: "Communication",
      features: [
        "Real-time messaging system",
        "Group chat for study groups",
        "Voice and video calling",
        "Language translation support",
        "Offline message delivery"
      ]
    },
    {
      category: "Safety & Security",
      features: [
        "University email verification",
        "Report and moderation system",
        "Privacy controls and settings",
        "Secure data encryption",
        "Safe meeting guidelines"
      ]
    },
    {
      category: "Platform Access",
      features: [
        "Web application (all browsers)",
        "Mobile-responsive design",
        "Offline functionality",
        "Cross-device synchronization",
        "Progressive Web App (PWA)"
      ]
    }
  ];

  const integrations = [
    { name: "Google Calendar", description: "Sync your study sessions", icon: Calendar },
    { name: "Zoom", description: "Integrated video calls", icon: Laptop },
    { name: "Slack", description: "Study group communication", icon: MessageSquare },
    { name: "GitHub", description: "Code collaboration", icon: BookOpen }
  ];

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
    red: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Zap className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Powerful Features for Modern Learning
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover all the tools and features that make StudentHub the ultimate platform for collaborative learning
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => onNavigate('landing')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => onNavigate('pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-foreground">Core Features</h2>
            <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              Everything you need to enhance your learning journey and connect with fellow students
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 dark:bg-card dark:border-border">
                  <CardContent className="p-6">
                    <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${colorClasses[feature.color]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center dark:text-foreground">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-muted-foreground mb-4 text-center">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600 dark:text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="py-20 bg-gray-50 dark:bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-foreground">Complete Feature Set</h2>
            <p className="text-xl text-gray-600 dark:text-muted-foreground">
              Comprehensive tools for every aspect of collaborative learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((category, index) => (
              <Card key={index} className="dark:bg-card dark:border-border">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-foreground">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-foreground">Popular Integrations</h2>
            <p className="text-xl text-gray-600 dark:text-muted-foreground">
              Connect with tools you already use and love
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <Card key={index} className="text-center hover:shadow-md transition-shadow dark:bg-card dark:border-border">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold mb-2 dark:text-foreground">{integration.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">{integration.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Platform Statistics</h2>
            <p className="text-xl text-blue-100">Real numbers from our growing community</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Study Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 dark:text-foreground">Ready to Experience All Features?</h2>
          <p className="text-xl text-gray-600 dark:text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using StudentHub to enhance their learning
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => onNavigate('landing')}
            >
              Start Learning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('how-it-works')}
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

