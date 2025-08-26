import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  ChevronUp, 
  ChevronDown, 
  Star, 
  Filter,
  Clock,
  TrendingUp,
  Eye,
  MessageCircle,
  Check,
  X
} from 'lucide-react';

export function QAForum({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: [] });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');

  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to optimize React component re-renders?",
      content: "I'm working on a large React application and noticing performance issues. What are the best practices for preventing unnecessary re-renders?",
      author: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        points: 1234,
        college: "MIT"
      },
      tags: ["React", "Performance", "JavaScript"],
      upvotes: 24,
      answerCount: 8,
      views: 156,
      timeAgo: "2 hours ago",
      isAnswered: true,
      userVote: 0, // -1 for downvote, 0 for no vote, 1 for upvote
      answerList: [
        {
          id: 1,
          content: "Use React.memo for functional components and useMemo/useCallback hooks to prevent unnecessary re-renders. Also consider using React DevTools Profiler to identify bottlenecks.",
          author: {
            name: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
            points: 3456,
            college: "Stanford"
          },
          upvotes: 15,
          timeAgo: "1 hour ago",
          isAccepted: true,
          userVote: 0
        },
        {
          id: 2,
          content: "Don't forget about proper component structure. Sometimes lifting state up or using context can help reduce prop drilling and unnecessary renders.",
          author: {
            name: "Mike Johnson",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            points: 2890,
            college: "UC Berkeley"
          },
          upvotes: 8,
          timeAgo: "45 minutes ago",
          isAccepted: false,
          userVote: 0
        }
      ]
    },
    {
      id: 2,
      title: "Best practices for machine learning model deployment?",
      content: "I've trained a TensorFlow model and want to deploy it to production. What are the recommended approaches for model serving and monitoring?",
      author: {
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        points: 2156,
        college: "Harvard"
      },
      tags: ["Machine Learning", "TensorFlow", "DevOps"],
      upvotes: 18,
      answerCount: 5,
      views: 89,
      timeAgo: "4 hours ago",
      isAnswered: false,
      userVote: 0,
      answerList: []
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to use which?",
      content: "I'm confused about when to use CSS Grid versus Flexbox. Can someone explain the differences and best use cases?",
      author: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        points: 987,
        college: "NYU"
      },
      tags: ["CSS", "Frontend", "Design"],
      upvotes: 12,
      answerCount: 3,
      views: 67,
      timeAgo: "1 day ago",
      isAnswered: true,
      userVote: 0,
      answerList: []
    },
    {
      id: 4,
      title: "How to handle authentication in a microservices architecture?",
      content: "Working on a project with multiple microservices. What's the best way to handle user authentication across all services?",
      author: {
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
        points: 3421,
        college: "Stanford"
      },
      tags: ["Architecture", "Authentication", "Backend"],
      upvotes: 31,
      answerCount: 12,
      views: 234,
      timeAgo: "2 days ago",
      isAnswered: true,
      userVote: 0,
      answerList: []
    }
  ]);

  const popularTags = ["React", "JavaScript", "Python", "Machine Learning", "CSS", "Node.js", "Database", "Algorithm"];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || question.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleVote = (questionId, voteType, isAnswer = false, answerId = null) => {
    if (isAnswer && answerId) {
      // Handle answer voting
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answerList: q.answerList.map(answer => {
              if (answer.id === answerId) {
                const currentVote = answer.userVote;
                const newVote = voteType === 'up' ? (currentVote === 1 ? 0 : 1) : (currentVote === -1 ? 0 : -1);
                const voteDiff = newVote - currentVote;
                
                return {
                  ...answer,
                  upvotes: answer.upvotes + voteDiff,
                  userVote: newVote
                };
              }
              return answer;
            })
          };
        }
        return q;
      }));
    } else {
      // Handle question voting
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          const currentVote = q.userVote;
          const newVote = voteType === 'up' ? (currentVote === 1 ? 0 : 1) : (currentVote === -1 ? 0 : -1);
          const voteDiff = newVote - currentVote;
          
          return {
            ...q,
            upvotes: q.upvotes + voteDiff,
            userVote: newVote
          };
        }
        return q;
      }));
    }
    
    toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'}!`);
  };

  const handleAskQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      author: {
        name: user.name,
        avatar: user.avatar,
        points: user.points,
        college: user.college
      },
      tags: newQuestion.tags,
      upvotes: 0,
      answerCount: 0,
      views: 0,
      timeAgo: "Just now",
      isAnswered: false,
      userVote: 0,
      answerList: []
    };

    setQuestions(prev => [question, ...prev]);
    setIsAskingQuestion(false);
    setNewQuestion({ title: '', content: '', tags: [] });
    toast.success('Question posted successfully!');
  };

  const handleAddAnswer = (questionId) => {
    if (!newAnswer.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    const answer = {
      id: Date.now(),
      content: newAnswer,
      author: {
        name: user.name,
        avatar: user.avatar,
        points: user.points,
        college: user.college
      },
      upvotes: 0,
      timeAgo: "Just now",
      isAccepted: false,
      userVote: 0
    };

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answerList: [...q.answerList, answer],
          answerCount: q.answerCount + 1
        };
      }
      return q;
    }));

    setNewAnswer('');
    toast.success('Answer posted successfully!');
  };

  const addTag = (tag) => {
    if (!newQuestion.tags.includes(tag)) {
      setNewQuestion(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setNewQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const QuestionCard = ({ question }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 ${question.userVote === 1 ? 'text-blue-600' : ''}`}
              onClick={() => handleVote(question.id, 'up')}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="font-medium text-lg">{question.upvotes}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 ${question.userVote === -1 ? 'text-red-600' : ''}`}
              onClick={() => handleVote(question.id, 'down')}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 
                className="font-semibold text-lg hover:text-blue-600 cursor-pointer"
                onClick={() => setSelectedQuestion(question)}
              >
                {question.title}
              </h3>
              {question.isAnswered && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Answered
                </Badge>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{question.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stats and Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {question.answerCount} answers
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {question.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {question.timeAgo}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.avatar} alt={question.author.name} />
                  <AvatarFallback className="text-xs">
                    {question.author.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-medium">{question.author.name}</span>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {question.author.points}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuestionDetail = ({ question }) => (
    <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{question?.title}</DialogTitle>
        </DialogHeader>
        
        {question && (
          <div className="space-y-6">
            {/* Question */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 min-w-[60px]">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-1 ${question.userVote === 1 ? 'text-blue-600' : ''}`}
                  onClick={() => handleVote(question.id, 'up')}
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
                <span className="font-medium text-lg">{question.upvotes}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-1 ${question.userVote === -1 ? 'text-red-600' : ''}`}
                  onClick={() => handleVote(question.id, 'down')}
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1">
                <p className="mb-4">{question.content}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={question.author.avatar} alt={question.author.name} />
                    <AvatarFallback className="text-xs">
                      {question.author.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>Asked by <strong>{question.author.name}</strong> {question.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {question.answerList.length} Answer{question.answerList.length !== 1 ? 's' : ''}
              </h3>
              
              <div className="space-y-4">
                {question.answerList.map((answer) => (
                  <div key={answer.id} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`p-1 ${answer.userVote === 1 ? 'text-blue-600' : ''}`}
                          onClick={() => handleVote(question.id, 'up', true, answer.id)}
                        >
                          <ChevronUp className="h-5 w-5" />
                        </Button>
                        <span className="font-medium">{answer.upvotes}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`p-1 ${answer.userVote === -1 ? 'text-red-600' : ''}`}
                          onClick={() => handleVote(question.id, 'down', true, answer.id)}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                        {answer.isAccepted && (
                          <Check className="h-5 w-5 text-green-600 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="mb-3">{answer.content}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                            <AvatarFallback className="text-xs">
                              {answer.author.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>Answered by <strong>{answer.author.name}</strong> {answer.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Answer */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <Textarea
                placeholder="Write your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <Button onClick={() => handleAddAnswer(question.id)}>
                Post Answer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Q&A Forum</h1>
          <p className="text-gray-600 dark:text-gray-300">Get help from the community and share your knowledge</p>
        </div>
        <Dialog open={isAskingQuestion} onOpenChange={setIsAskingQuestion}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Get help from the community by asking a detailed question
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  placeholder="What's your programming question? Be specific."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="content">Question Details</Label>
                <Textarea
                  id="content"
                  placeholder="Provide more details about your question. Include code examples if relevant."
                  rows={6}
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="space-y-3">
                  {/* Selected tags */}
                  {newQuestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newQuestion.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Available tags */}
                  <div className="flex flex-wrap gap-2">
                    {popularTags
                      .filter(tag => !newQuestion.tags.includes(tag))
                      .map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAskQuestion} className="flex-1">
                  Post Question
                </Button>
                <Button variant="outline" onClick={() => setIsAskingQuestion(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTag === '' ? 'default' : 'outline'}
                onClick={() => setSelectedTag('')}
                size="sm"
              >
                All
              </Button>
              {popularTags.slice(0, 4).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  size="sm"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="unanswered" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Unanswered
          </TabsTrigger>
          <TabsTrigger value="my-questions" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            My Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          {filteredQuestions
            .sort((a, b) => b.upvotes - a.upvotes)
            .map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
        </TabsContent>

        <TabsContent value="unanswered" className="space-y-4">
          {filteredQuestions
            .filter(q => !q.isAnswered)
            .map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
        </TabsContent>

        <TabsContent value="my-questions" className="space-y-4">
          {filteredQuestions
            .filter(q => q.author.name === user.name)
            .map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          {filteredQuestions.filter(q => q.author.name === user.name).length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No questions yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't asked any questions yet.</p>
              <Button onClick={() => setIsAskingQuestion(true)}>
                Ask Your First Question
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Tag Cloud */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
          <CardDescription>Browse questions by topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag} 
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Detail Modal */}
      <QuestionDetail question={selectedQuestion} />
    </div>
  );
}