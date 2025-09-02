import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      details: 'support@studenthub.com',
      color: 'blue'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      details: 'Available 9 AM - 6 PM EST',
      color: 'green'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      details: '+91 8256 123456',
      color: 'purple'
    },
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Browse our comprehensive FAQ and guides',
      details: 'Self-service 24/7',
      color: 'orange',
      link: '/faq'
    }
  ];

  const supportCategories = [
    'General Question',
    'Technical Issue',
    'Account Problem',
    'Billing & Payments',
    'Safety & Privacy',
    'Feature Request',
    'Partnership Inquiry',
    'Media & Press'
  ];

  const officeLocations = [
    {
      city: 'Ujire',
      address: '321 Knowledge Park, Tech Hub\nUjire, Karnataka 574240',
      phone: '+91 8256 123456',
      email: 'ujire@studenthub.com'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <MessageSquare className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Have questions, feedback, or need support? We're here to help you succeed on your learning journey.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How Can We Help?</h2>
            <p className="text-xl text-muted-foreground">
              Choose the best way to reach us based on your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const CardComponent = method.link ? Link : 'div';
              const cardProps = method.link ? { to: method.link } : {};
              
              return (
                <CardComponent key={index} {...cardProps}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer bg-card border-border h-full">
                    <CardContent className="p-6">
                      <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${colorClasses[method.color]}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{method.title}</h3>
                      <p className="text-muted-foreground mb-3">{method.description}</p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{method.details}</p>
                    </CardContent>
                  </Card>
                </CardComponent>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-20 bg-background dark:bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground mb-4">Send us a Message</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 ">
                      <div className="space-y-3">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@university.edu"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="message">Description</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Clock className="h-5 w-5" />
                      Response Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-foreground">Email Support</p>
                        <p className="text-sm text-muted-foreground">Within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-foreground">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Real-time during business hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-foreground">Critical Issues</p>
                        <p className="text-sm text-muted-foreground">Within 4 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-5 w-5" />
                      Office Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {officeLocations.map((location, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-foreground">{location.city}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{location.address}</p>
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="text-muted-foreground">{location.phone}</span>
                          <span className="text-blue-600 dark:text-blue-400">{location.email}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Quick Actions</h2>
            <p className="text-muted-foreground">
              Common tasks you might want to do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/faq">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-all bg-card border-border h-full">
                <CardContent className="p-6">
                  <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-foreground">Browse FAQ</h3>
                  <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-all bg-card border-border h-full">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-foreground">Safety Center</h3>
                  <p className="text-sm text-muted-foreground">Learn about safety and privacy</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/">
              <Card className="text-center cursor-pointer hover:shadow-lg transition-all bg-card border-border h-full">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-foreground">Get Started</h3>
                  <p className="text-sm text-muted-foreground">Start your learning journey</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}

