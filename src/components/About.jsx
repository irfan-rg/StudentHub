import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Heart, 
  Target, 
  Lightbulb, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  ArrowRight,
  MapPin,
  GraduationCap,
  Code,
  Palette
} from 'lucide-react';

export function About() {
  const teamMembers = [
    {
      name: "Dheemanth S.H",
      role: "Backend Development Lead",
      specialization: "Backend Architecture & Database Design",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      skills: ["Java", "Spring Boot", "Database Design", "API Development"]
    },
    {
      name: "Mohan Kumar S",
      role: "Backend Developer",
      specialization: "Server Architecture & Integration",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      skills: ["Java", "Microservices", "Cloud Computing", "DevOps"]
    },
    {
      name: "Mohammed Irfan G",
      role: "Frontend Developer",
      specialization: "User Interface & Experience Design",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      skills: ["React", "TypeScript", "UI/UX Design", "Frontend Architecture"]
    },
    {
      name: "Monisha Aradhya CM",
      role: "Frontend Developer",
      specialization: "Interactive Design & User Experience",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
      skills: ["React", "JavaScript", "Design Systems", "User Experience"]
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Create your own learning profile",
      description: "Highlight the skills you have and those you want to develop",
      color: "blue"
    },
    {
      icon: Target,
      title: "Instantly get matched",
      description: "Connect with other students to learn, teach, or start group sessions",
      color: "purple"
    },
    {
      icon: MessageSquare,
      title: "Ask questions & answer others",
      description: "Build your knowledge together through interactive forums",
      color: "green"
    },
    {
      icon: Trophy,
      title: "Progress & earn badges",
      description: "See how you grow with fun, gamified feedback",
      color: "yellow"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Built by students, for students. We understand the challenges because we face them too."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Using AI and modern technology to solve real educational problems."
    },
    {
      icon: BookOpen,
      title: "Collaborative Learning",
      description: "We believe learning is better when done together, not in isolation."
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
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
                <Heart className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Welcome to AI-Powered Student Hub – where students connect, learn, teach, and grow together!
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Our Story</h2>
              <div className="flex items-center justify-center gap-2 mb-8">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-lg text-gray-600 dark:text-gray-300">
                  SDM Institute of Technology, Ujire, Karnataka, India
                </span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We're a passionate team of final-year Computer Science students at SDM Institute of Technology, Ujire, Karnataka, India, 
                working on our major project under VTU. This hub is designed and built by <strong>Dheemanth S.H</strong>, <strong>Mohan Kumar S</strong>, 
                <strong>Mohammed Irfan G</strong>, and <strong>Monisha Aradhya CM</strong>, with backend development led by Dheemanth and Mohan Kumar, 
                and frontend development by Mohammed Irfan and Monisha.
              </p>
              
              <Card className="mb-8 border-l-4 border-l-blue-600 dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 dark:text-white">Guided by Excellence</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our journey is guided by <strong>Mr. Adarsh Karanth</strong>, whose 17 years of IT experience and expertise 
                        in Java and full-stack frameworks have been crucial to our vision.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Why We Built This */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">Why did we build this?</h2>
            
            <Card className="mb-12 dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-8">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  As students ourselves, we often struggled to find the right resources when we wanted to learn a new skill, 
                  explore unknown subjects, or get clear guidance. The internet is full of information—but picking what fits 
                  your needs or levels is hard, and sometimes overwhelming.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  That's where the idea for this student hub began: <strong>a place where students can connect directly, share their skills, 
                  teach each other, solve doubts, and discover new interests—all powered by smart AI matchmaking.</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">What makes us different?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Built by students, for students - in a friendly, supportive space
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${colorClasses[feature.color]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The passionate students behind AI-Powered Student Hub
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 dark:bg-gray-900 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1 dark:text-white">{member.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{member.specialization}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              We believe learning shouldn't be a solo journey. With AI-Powered Student Hub, you can find help, 
              offer support, and grow your skills together—whether you're studying for exams or just curious about something new.
            </p>
            <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-lg mb-6">
                Become part of a growing, collaborative student community, and let's make knowledge-sharing easier, 
                smarter, and more exciting for everyone.
              </p>
              <Link to="/">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Join us now!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Built with Modern Technology</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Cutting-edge tools and frameworks for the best student experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Backend Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">☕</div>
                    <span className="font-medium dark:text-white">Java</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">🍃</div>
                    <span className="font-medium dark:text-white">Spring Boot</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">🗄️</div>
                    <span className="font-medium dark:text-white">Database</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">🤖</div>
                    <span className="font-medium dark:text-white">AI/ML</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  Frontend Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">⚛️</div>
                    <span className="font-medium dark:text-white">React</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">📘</div>
                    <span className="font-medium dark:text-white">JavaScript</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">🎨</div>
                    <span className="font-medium dark:text-white">Tailwind CSS</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <span className="font-medium dark:text-white">Modern UI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}