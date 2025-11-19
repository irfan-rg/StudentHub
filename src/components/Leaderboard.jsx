import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Star, 
  Award, 
  TrendingUp, 
  Calendar,
  Users,
  MessageSquare,
  BookOpen,
  Crown,
  Medal,
  Zap
} from 'lucide-react';

export function Leaderboard({ user }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
      college: "Stanford",
      points: 4567,
      badges: ["ML Expert", "Top Contributor", "Helper"],
      sessionsCompleted: 89,
      questionsAnswered: 156,
      level: "Expert",
      trend: "up"
    },
    {
      rank: 2,
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      college: "MIT",
      points: 4234,
      badges: ["Design Pro", "Mentor", "Community Star"],
      sessionsCompleted: 72,
      questionsAnswered: 134,
      level: "Expert",
      trend: "up"
    },
    {
      rank: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      college: "Harvard",
      points: 3890,
      badges: ["Python Master", "Data Science Pro"],
      sessionsCompleted: 64,
      questionsAnswered: 98,
      level: "Advanced",
      trend: "down"
    },
    {
      rank: 4,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      college: "UC Berkeley",
      points: 3456,
      badges: ["Web Dev Expert", "JavaScript Pro"],
      sessionsCompleted: 58,
      questionsAnswered: 87,
      level: "Advanced",
      trend: "up"
    },
    {
      rank: 5,
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      college: "NYU",
      points: 3234,
      badges: ["Marketing Guru", "Analytics Pro"],
      sessionsCompleted: 45,
      questionsAnswered: 76,
      level: "Advanced",
      trend: "same"
    },
    {
      rank: 12,
      name: user?.name,
      avatar: user?.avatar,
      college: user?.college,
      points: user?.points || 2450,
      badges: user?.badges || ["Helper", "Quick Learner"],
      sessionsCompleted: user?.sessionsCompleted || 12,
      questionsAnswered: user?.questionsAnswered || 34,
      level: user?.level || "Intermediate",
      trend: "up",
      isCurrentUser: true
    }
  ];

  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first learning session",
      icon: "🎯",
      points: 50,
      rarity: "Common"
    },
    {
      name: "Helper",
      description: "Answer 10 questions in the forum",
      icon: "🤝",
      points: 100,
      rarity: "Common"
    },
    {
      name: "Quick Learner",
      description: "Complete 5 sessions in one week",
      icon: "⚡",
      points: 200,
      rarity: "Uncommon"
    },
    {
      name: "Knowledge Sharer",
      description: "Teach 5 different skills",
      icon: "📚",
      points: 300,
      rarity: "Rare"
    },
    {
      name: "Community Star",
      description: "Get 50 upvotes on your answers",
      icon: "⭐",
      points: 500,
      rarity: "Epic"
    },
    {
      name: "Mentor",
      description: "Complete 50 teaching sessions",
      icon: "👨‍🏫",
      points: 750,
      rarity: "Epic"
    },
    {
      name: "Legend",
      description: "Reach the top 10 on the leaderboard",
      icon: "👑",
      points: 1000,
      rarity: "Legendary"
    }
  ];

  const currentUserRank = leaderboardData.find(u => u.isCurrentUser)?.rank || 12;
  const pointsToNextRank = leaderboardData.find(u => u.rank === currentUserRank - 1)?.points - (user?.points || 2450);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold">#{rank}</span>;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <span className="w-4 h-4" />;
  };

  const LeaderboardRow = ({ user, index }) => (
    <Card className={`${user.isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-card'} hover:shadow-md transition-shadow border-border`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex items-center justify-center w-12 h-12">
            {getRankIcon(user.rank)}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                {user.isCurrentUser && <Badge variant="secondary">You</Badge>}
                {getTrendIcon(user.trend)}
              </div>
              <p className="text-sm text-muted-foreground">{user.college}</p>
              <div className="flex gap-2 mt-1">
                {user.badges.slice(0, 2).map((badge, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-bold text-lg text-foreground">{user.points.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>{user.sessionsCompleted} sessions</div>
              <div>{user.questionsAnswered} answers</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">🏆 Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among the community</p>
      </div>

      {/* Current User Stats */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-white text-gray-800">
                  {user?.name?.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-blue-100">Rank #{currentUserRank} • {user?.points} points</p>
                <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                  {user?.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 mb-1">Points to next rank</p>
              <p className="text-2xl font-bold">{pointsToNextRank > 0 ? pointsToNextRank : '🎉'}</p>
              {pointsToNextRank > 0 && (
                <Progress 
                  value={((user?.points || 2450) / ((user?.points || 2450) + pointsToNextRank)) * 100} 
                  className="mt-2 bg-white/20"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="points" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-card border-border">
          <TabsTrigger value="points" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Points
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="answers" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Answers
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="space-y-4">
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={selectedPeriod === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('all')}
              size="sm"
            >
              All Time
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
              size="sm"
            >
              This Month
            </Button>
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
              size="sm"
            >
              This Week
            </Button>
          </div>

          <div className="space-y-3">
            {leaderboardData.map((userData, index) => (
              <LeaderboardRow key={userData.name} user={userData} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="space-y-3">
            {leaderboardData
              .sort((a, b) => b.sessionsCompleted - a.sessionsCompleted)
              .map((userData, index) => (
                <LeaderboardRow key={userData.name} user={{...userData, rank: index + 1}} index={index} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="answers" className="space-y-4">
          <div className="space-y-3">
            {leaderboardData
              .sort((a, b) => b.questionsAnswered - a.questionsAnswered)
              .map((userData, index) => (
                <LeaderboardRow key={userData.name} user={{...userData, rank: index + 1}} index={index} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2 text-foreground">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        achievement.rarity === 'Legendary' ? 'border-purple-500 text-purple-700 dark:text-purple-300' :
                        achievement.rarity === 'Epic' ? 'border-orange-500 text-orange-700 dark:text-orange-300' :
                        achievement.rarity === 'Rare' ? 'border-blue-500 text-blue-700 dark:text-blue-300' :
                        'border-gray-500 text-gray-700 dark:text-muted-foreground'
                      }`}
                    >
                      {achievement.rarity}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {achievement.points}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievement Progress */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="h-5 w-5 text-yellow-500" />
            Your Progress
          </CardTitle>
          <CardDescription className="text-muted-foreground">Track your journey to the next achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Knowledge Sharer (Teach 5 skills)</span>
              <span className="text-muted-foreground">3/5</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Community Star (50 upvotes)</span>
              <span className="text-muted-foreground">20/50</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">Mentor (50 teaching sessions)</span>
              <span className="text-muted-foreground">12/50</span>
            </div>
            <Progress value={24} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

