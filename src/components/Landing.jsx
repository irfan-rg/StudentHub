import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { BookOpen, Users, Trophy, MessageSquare, Star, Zap, CheckCircle, ArrowRight, Play, Mail, Lock, GraduationCap } from 'lucide-react';

export function Landing({ onLogin, loading, error }) {
  const navigate = useNavigate();
  const [signInModal, setSignInModal] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    setSignInModal(true);
  };

  const handleSignInSubmit = () => {
    if (!signInForm.email || !signInForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Call the login function passed from App
    onLogin({ email: signInForm.email, password: signInForm.password });
    setSignInModal(false);
    setSignInForm({ email: '', password: '' });
  };

  const features = [
    {
      icon: Users,
      title: "Smart Matching",
      description: "AI-powered algorithm connects you with students who have complementary skills",
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Q&A Forum",
      description: "Get instant help from peers and share your knowledge with the community",
      color: "purple"
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Earn points, badges, and climb leaderboards as you learn and teach",
      color: "pink"
    },
    {
      icon: BookOpen,
      title: "Session Booking",
      description: "Schedule one-on-one or group learning sessions with ease",
      color: "green"
    },
    {
      icon: Star,
      title: "Progress Tracking",
      description: "Monitor your learning journey and celebrate achievements",
      color: "yellow"
    },
    {
      icon: Zap,
      title: "Instant Connections",
      description: "Connect with students worldwide in real-time",
      color: "red"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      college: "Stanford University",
      quote: "This platform helped me find amazing study partners and improved my coding skills significantly!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marcus Johnson",
      college: "MIT",
      quote: "The Q&A forum is incredible. I get answers to complex problems within minutes!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      college: "Harvard",
      quote: "Love the gamification aspect. It makes learning and helping others so much more engaging!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "100K+", label: "Study Sessions" },
    { number: "500+", label: "Universities" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <BookOpen className="h-12 w-12" />
              </div>
              
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-16 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Student Hub
            </h1>

            <p className="text-xl md:text-3xl mb-8 font-semibold mt-8 text-blue-100 max-w-2xl mx-auto">
            AI-Powered Student Hub
            </p>

            <p className="text-xl md:text-2xl mb-8  text-blue-100 max-w-2xl mx-auto">
              Connect, Learn, and Share Knowledge with Students Worldwide
            </p>


            {/* Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">{stat.number}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div> */}
            
              <div className="flex justify-center gap-4 flex-wrap">
               <Button 
                 size="lg"
                 className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold mt-8"
                 onClick={handleGetStarted}
                 disabled={loading}
               >
                 Get Started Free
                 <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
               <Button 
                 size="lg" 
                 className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold mt-8"
                 onClick={handleSignIn}
                 disabled={loading}
               >
                 Sign In
               </Button>
              </div>
            
            {/* Display error if any */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            

          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-pulse text-white">
          <Users className="h-16 w-16" />
        </div>
        <div className="absolute top-32 right-20 opacity-20 animate-pulse delay-1000 text-white">
          <Trophy className="h-16 w-16" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 animate-pulse delay-2000 text-white">
          <MessageSquare className="h-16 w-16" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-pulse delay-3000 text-white">
          <GraduationCap className="h-16 w-16" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900" data-section="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Why Students Love Our Platform</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the features that make learning and teaching more engaging than ever
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
                purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
                pink: "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400",
                green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
                yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
                red: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
              };
              
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${colorClasses[feature.color]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Get started in just 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Create Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">Sign up and tell us about your skills and learning goals with skill levels</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Get Matched</h3>
              <p className="text-gray-600 dark:text-gray-300">Our AI finds the perfect study partners based on your complementary skills</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Start Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">Connect, collaborate, and grow your knowledge together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">What Students Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Hear from our community of learners</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.college}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of students who are already learning and growing together
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
                                                   <Button 
                size="lg" 
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                onClick={handleGetStarted}
                disabled={loading}
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/about">
                <Button 
                  size="lg" 
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Learn About Us
                </Button>
              </Link>
          </div>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">StudentHub</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connecting students worldwide for collaborative learning and knowledge sharing.
            </p>
          </div>
          
          {/* Essential Links */}
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            <Link 
              to="/faq"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              FAQ
            </Link>
            <Link 
              to="/contact"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Contact Us
            </Link>
            <Link 
              to="/about"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              to="/blog"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Blog
            </Link>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudentHub. All rights reserved.</p>
            <p className="text-sm mt-2">Built by students from SDM Institute of Technology, Ujire, Karnataka, India</p>
          </div>
        </div>
      </footer>

      {/* Simple Sign In Modal */}
      <Dialog open={signInModal} onOpenChange={setSignInModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>
              Sign in to your Student Hub account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-email"
                  type="email"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signin-password"
                  type="password"
                  value={signInForm.password}
                  onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSignInSubmit} 
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSignInModal(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    setSignInModal(false);
                    handleGetStarted();
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={loading}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}