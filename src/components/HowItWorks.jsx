import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  UserPlus, 
  Search, 
  MessageSquare, 
  Calendar, 
  Trophy, 
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Users,
  BookOpen,
  Star,
  Zap
} from 'lucide-react';

export function HowItWorks({ onNavigate }) {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up with your university email and tell us about your skills and learning goals",
      details: [
        "Verify your university email for trust and security",
        "Add skills you can teach and want to learn",
        "Set your learning preferences and availability",
        "Upload a profile picture and write a brief bio"
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
    },
    {
      number: "02",
      icon: Search,
      title: "Get Matched",
      description: "Our AI algorithm finds the perfect study partners based on your complementary skills",
      details: [
        "Advanced matching considers skill overlap and learning goals",
        "Location and timezone preferences for better coordination",
        "University and education level compatibility",
        "Personality and learning style matching"
      ],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
    },
    {
      number: "03",
      icon: MessageSquare,
      title: "Connect & Communicate",
      description: "Start conversations, ask questions, and build meaningful learning relationships",
      details: [
        "Send connection requests to potential study partners",
        "Use our Q&A forum for quick help from the community",
        "Join study groups based on subjects or interests",
        "Exchange messages and share learning resources"
      ],
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop"
    },
    {
      number: "04",
      icon: Calendar,
      title: "Schedule Sessions",
      description: "Book one-on-one or group study sessions with integrated calendar management",
      details: [
        "Choose between video calls or in-person meetings",
        "Automated scheduling with timezone conversion",
        "Session reminders and calendar integration",
        "Flexible rescheduling and cancellation options"
      ],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop"
    },
    {
      number: "05",
      icon: BookOpen,
      title: "Learn Together",
      description: "Engage in collaborative learning sessions with tools for effective knowledge sharing",
      details: [
        "Virtual whiteboards for visual learning",
        "Screen sharing for coding and presentations",
        "Resource sharing and file collaboration",
        "Session recording for future reference"
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
    },
    {
      number: "06",
      icon: Trophy,
      title: "Track Progress",
      description: "Earn points, badges, and climb leaderboards as you help others and achieve your goals",
      details: [
        "Points for teaching sessions and helping peers",
        "Badges for achievements and milestones",
        "Progress tracking for your learning journey",
        "Leaderboards to stay motivated and competitive"
      ],
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop"
    }
  ];

  const benefits = [
    {
      title: "Personalized Learning",
      description: "Get matched with students who complement your skills and learning style",
      icon: Users,
      color: "blue"
    },
    {
      title: "Flexible Scheduling",
      description: "Learn on your own schedule with 24/7 availability across timezones",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Safe Environment",
      description: "University verification and moderation ensure a secure learning space",
      icon: CheckCircle,
      color: "purple"
    },
    {
      title: "Skill Exchange",
      description: "Teach what you know and learn what you need in a balanced exchange",
      icon: Star,
      color: "yellow"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400", 
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <PlayCircle className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How StudentHub Works
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              From signup to success - discover how easy it is to start learning with StudentHub
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('landing')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">6 Simple Steps to Success</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow this proven process to maximize your learning experience
            </p>
          </div>
          
          <div className="space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`flex items-center gap-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                        {step.number}
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 dark:text-white">{step.title}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{step.description}</p>
                    
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Image */}
                  <div className="flex-1">
                    <div className="relative">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="rounded-xl shadow-2xl w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Why This Process Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Built on proven learning principles and student feedback
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 dark:bg-gray-900 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${colorClasses[benefit.color]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 dark:text-white">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Success Timeline</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what you can achieve at each milestone
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
              
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    Day 1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 dark:text-white">Profile Complete & First Matches</h4>
                    <p className="text-gray-600 dark:text-gray-300">Set up your profile and get your first AI-powered study partner recommendations</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    Week 1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 dark:text-white">First Study Sessions</h4>
                    <p className="text-gray-600 dark:text-gray-300">Complete your first learning sessions and start building your reputation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    Month 1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 dark:text-white">Steady Learning Rhythm</h4>
                    <p className="text-gray-600 dark:text-gray-300">Establish regular study sessions and earn your first badges</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3 Months
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 dark:text-white">Skill Mastery</h4>
                    <p className="text-gray-600 dark:text-gray-300">Achieve significant progress in your target skills and become a mentor to others</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of students who have already transformed their learning experience
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('landing')}
            >
              Start Learning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => onNavigate('features')}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}