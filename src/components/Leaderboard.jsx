import React, { useState, useEffect } from 'react';
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
  Zap,
  Loader2
} from 'lucide-react';
import { leaderboardService } from '../services/api';

export function Leaderboard({ user }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [activeTab, setActiveTab] = useState('points');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard('points');
  }, []);

  const fetchLeaderboard = async (filter) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leaderboardService.getLeaderboard(filter, 50);
      
      if (response && response.topUsers) {
        setLeaderboardData(response.topUsers);
        setCurrentUserRank(response.currentUserRank);
        setCurrentUserData(response.currentUser || null);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'points') fetchLeaderboard('points');
    else if (value === 'sessions') fetchLeaderboard('sessionsCompleted');
    else if (value === 'answers') fetchLeaderboard('questionsAnswered');
  };

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

  // Find current user in leaderboard or use separate data
  const currentUserInLeaderboard = leaderboardData.find(u => u._id === user?._id);
  const displayCurrentUser = currentUserInLeaderboard || currentUserData || user;
  const displayCurrentUserRank = currentUserRank || 0;
  
  // Calculate points to next rank
  const nextRankUser = leaderboardData.find(u => u.rank === displayCurrentUserRank - 1);
  const pointsToNextRank = nextRankUser ? nextRankUser.points - (displayCurrentUser?.points || 0) : 0;

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold">#{rank}</span>;
  };

  const LeaderboardRow = ({ userData, index }) => {
    const isCurrentUser = userData._id === user?._id;
    
    return (
      <Card className={`${isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-card'} hover:shadow-md transition-shadow border-border`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="flex items-center justify-center w-12 h-12">
              {getRankIcon(userData.rank)}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{userData.name}</h3>
                  {isCurrentUser && <Badge variant="secondary">You</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{userData.college}</p>
                <div className="flex gap-2 mt-1">
                  {(userData.badges || []).slice(0, 2).map((badge, idx) => (
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
                <span className="font-bold text-lg text-foreground">{userData.points?.toLocaleString() || 0}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>{userData.sessionsCompleted || 0} sessions</div>
                <div>{userData.questionsAnswered || 0} answers</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">🏆 Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among the community</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              onClick={() => fetchLeaderboard(activeTab === 'sessions' ? 'sessionsCompleted' : activeTab === 'answers' ? 'questionsAnswered' : 'points')} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Current User Stats */}
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white">
                    <AvatarImage src={displayCurrentUser?.avatar} alt={displayCurrentUser?.name} />
                    <AvatarFallback className="bg-white text-gray-800">
                      {displayCurrentUser?.name?.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{displayCurrentUser?.name}</h2>
                    <p className="text-blue-100">Rank #{displayCurrentUserRank} • {displayCurrentUser?.points || 0} points</p>
                    <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                      {displayCurrentUser?.badges?.[0] || 'Member'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 mb-1">Points to next rank</p>
                  <p className="text-2xl font-bold">{pointsToNextRank > 0 ? pointsToNextRank : '🎉'}</p>
                  {pointsToNextRank > 0 && (
                    <Progress 
                      value={((displayCurrentUser?.points || 0) / ((displayCurrentUser?.points || 0) + pointsToNextRank)) * 100} 
                      className="mt-2 bg-white/20"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
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
              <div className="space-y-3">
                {leaderboardData.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No leaderboard data available
                    </CardContent>
                  </Card>
                ) : (
                  leaderboardData.map((userData, index) => (
                    <LeaderboardRow key={userData._id} userData={userData} index={index} />
                  ))
                )}
              </div>
              {currentUserData && !currentUserInLeaderboard && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Rank</h3>
                  <LeaderboardRow userData={currentUserData} index={0} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <div className="space-y-3">
                {leaderboardData.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No leaderboard data available
                    </CardContent>
                  </Card>
                ) : (
                  leaderboardData.map((userData, index) => (
                    <LeaderboardRow key={userData._id} userData={userData} index={index} />
                  ))
                )}
              </div>
              {currentUserData && !currentUserInLeaderboard && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Rank</h3>
                  <LeaderboardRow userData={currentUserData} index={0} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="answers" className="space-y-4">
              <div className="space-y-3">
                {leaderboardData.length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No leaderboard data available
                    </CardContent>
                  </Card>
                ) : (
                  leaderboardData.map((userData, index) => (
                    <LeaderboardRow key={userData._id} userData={userData} index={index} />
                  ))
                )}
              </div>
              {currentUserData && !currentUserInLeaderboard && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Rank</h3>
                  <LeaderboardRow userData={currentUserData} index={0} />
                </div>
              )}
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
                  <span className="text-foreground">Sessions Completed</span>
                  <span className="text-muted-foreground">{displayCurrentUser?.sessionsCompleted || 0}/50</span>
                </div>
                <Progress value={((displayCurrentUser?.sessionsCompleted || 0) / 50) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Questions Answered</span>
                  <span className="text-muted-foreground">{displayCurrentUser?.questionsAnswered || 0}/50</span>
                </div>
                <Progress value={((displayCurrentUser?.questionsAnswered || 0) / 50) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Total Points</span>
                  <span className="text-muted-foreground">{displayCurrentUser?.points || 0}/1000</span>
                </div>
                <Progress value={((displayCurrentUser?.points || 0) / 1000) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}