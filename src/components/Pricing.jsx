import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  CheckCircle, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Users, 
  MessageSquare, 
  Calendar,
  Trophy,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function Pricing({ onNavigate }) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with basic learning features",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Users,
      color: "gray",
      popular: false,
      features: [
        { name: "Up to 5 study connections", included: true },
        { name: "Basic Q&A forum access", included: true },
        { name: "2 study sessions per month", included: true },
        { name: "Basic profile customization", included: true },
        { name: "Community support", included: true },
        { name: "AI-powered matching", included: false },
        { name: "Unlimited sessions", included: false },
        { name: "Priority support", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Video recording", included: false }
      ]
    },
    {
      name: "Student",
      description: "Enhanced features for active learners and contributors",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      icon: Star,
      color: "blue",
      popular: true,
      features: [
        { name: "Unlimited study connections", included: true },
        { name: "Full Q&A forum access", included: true },
        { name: "Unlimited study sessions", included: true },
        { name: "Advanced profile features", included: true },
        { name: "Priority matching algorithm", included: true },
        { name: "Session recording & playback", included: true },
        { name: "Progress analytics", included: true },
        { name: "Email support", included: true },
        { name: "Group study sessions", included: true },
        { name: "Custom badges", included: false }
      ]
    },
    {
      name: "Pro",
      description: "Premium experience with exclusive features and priority support",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      icon: Crown,
      color: "purple",
      popular: false,
      features: [
        { name: "Everything in Student plan", included: true },
        { name: "Advanced AI matching", included: true },
        { name: "Unlimited group sessions", included: true },
        { name: "Custom badges & achievements", included: true },
        { name: "Priority support (24/7)", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "Session templates", included: true },
        { name: "API access", included: true },
        { name: "Early access to new features", included: true },
        { name: "Personal success manager", included: true }
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be charged or credited accordingly."
    },
    {
      question: "Is there a student discount?",
      answer: "Yes! Students with verified .edu email addresses get 50% off all paid plans. The discount is automatically applied during signup."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Absolutely! You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use enterprise-grade security measures to protect your data, including encryption, secure servers, and regular security audits."
    }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Unlimited Q&A Access",
      description: "Get help from thousands of students worldwide"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered session scheduling across timezones"
    },
    {
      icon: Trophy,
      title: "Gamification System",
      description: "Earn points, badges, and climb leaderboards"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "University email verification for trust and safety"
    }
  ];

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (!isAnnual || plan.monthlyPrice === 0) return 0;
    return Math.round(((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12)) * 100);
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Choose the perfect plan for your learning journey. Start free and upgrade as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`${!isAnnual ? 'text-white' : 'text-blue-200'}`}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400"
              />
              <span className={`${isAnnual ? 'text-white' : 'text-blue-200'}`}>Annual</span>
              {isAnnual && (
                <Badge className="bg-green-500 text-white ml-2">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = getPrice(plan);
              const savings = getSavings(plan);
              
              return (
                <Card 
                  key={index} 
                  className={`relative ${
                    plan.popular 
                      ? 'ring-2 ring-blue-600 scale-105 shadow-2xl dark:ring-blue-400' 
                      : 'hover:shadow-lg'
                  } transition-all duration-300 dark:bg-gray-800 dark:border-gray-700`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${
                      plan.color === 'gray' ? 'bg-gray-100 dark:bg-gray-700' :
                      plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-purple-100 dark:bg-purple-900'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        plan.color === 'gray' ? 'text-gray-600 dark:text-gray-300' :
                        plan.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`} />
                    </div>
                    <CardTitle className="text-2xl dark:text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold dark:text-white">${price}</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {price === 0 ? '' : `/${isAnnual ? 'year' : 'month'}`}
                        </span>
                      </div>
                      {savings > 0 && (
                        <div className="text-green-600 text-sm mt-1">
                          Save {savings}% annually
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => onNavigate('landing')}
                    >
                      {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            feature.included 
                              ? 'text-gray-900 dark:text-gray-100' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">What You Get</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Core features available across all plans
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about our pricing
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of students already using StudentHub to enhance their education
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('landing')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => onNavigate('contact')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}