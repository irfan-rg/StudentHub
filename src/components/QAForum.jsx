import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
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
  X,
  Reply,
  Heart,
  Share,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQAStore } from '../stores/useQAStore';

export function QAForum({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: [] });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [filterAnswered, setFilterAnswered] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [popularPage, setPopularPage] = useState(0);
  const [myQuestionsPage, setMyQuestionsPage] = useState(0);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const itemsPerPage = 10;

  const questions = useQAStore(state => state.questions);
  const addQuestion = useQAStore(state => state.addQuestion);
  const addAnswer = useQAStore(state => state.addAnswer);
  const voteQuestion = useQAStore(state => state.voteQuestion);
  const voteAnswer = useQAStore(state => state.voteAnswer);

  useEffect(() => {
    // TODO: Fetch from backend e.g., api.get('/questions').then(setQuestions).catch(() => setQuestions(mocks));
  }, []);

  const popularTags = ["React", "JavaScript", "Python", "Machine Learning", "CSS", "Node.js", "Database", "Algorithm"];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || question.tags.includes(filterTag);
    const matchesAnswered = filterAnswered === 'all' || 
                          (filterAnswered === 'answered' && question.isAnswered) || 
                          (filterAnswered === 'unanswered' && !question.isAnswered);
    const matchesTime = filterTime === 'all' || 
  (filterTime === 'last24h' && (Date.now() - new Date(question.createdAt).getTime()) < 24 * 60 * 60 * 1000) || 
  (filterTime === 'last7d' && (Date.now() - new Date(question.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000);
    return matchesSearch && matchesTag && matchesAnswered && matchesTime;
  });

  const handleVote = (questionId, voteType, isAnswer = false, answerId = null) => {
    if (isAnswer && answerId) {
      voteAnswer(questionId, answerId, voteType);
    } else {
      voteQuestion(questionId, voteType);
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
      createdAt: new Date(),
      isAnswered: false,
        userVote: 0,
        answerList: []
      };
    addQuestion(question);
      setIsAskingQuestion(false);
      setNewQuestion({ title: '', content: '', tags: [] });
      toast.success('Question posted successfully!');
  };

  const handleAnswerChange = (e) => {
    setNewAnswer(e.target.value);
  };

  const handleAddAnswer = useCallback((questionId) => {
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

      addAnswer(questionId, answer);
      if (selectedQuestion && selectedQuestion.id === questionId) {
        const updated = { ...selectedQuestion, answerList: [answer, ...selectedQuestion.answerList], answerCount: (selectedQuestion.answerCount || 0) + 1 };
        setSelectedQuestion(updated);
      }

      setNewAnswer('');
      toast.success('Answer posted successfully!');
  }, [newAnswer, user]);

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
    <Card className="hover:shadow-md transition-shadow bg-card border-border cursor-pointer" onClick={() => {
      setSelectedQuestion(question);
      setIsThreadModalOpen(true);
    }}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 ${question.userVote === 1 ? 'text-blue-600' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleVote(question.id, 'up');
              }}
              aria-label="Upvote question"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="font-medium text-lg text-foreground">{question.upvotes}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 ${question.userVote === -1 ? 'text-red-600' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleVote(question.id, 'down');
              }}
              aria-label="Downvote question"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg hover:text-blue-600 text-foreground">
                {question.title}
              </h3>
              {question.isAnswered && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  <Check className="h-3 w-3 mr-1" />
                  Answered
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-3 line-clamp-2">{question.content}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-accent/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterTag(tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  <span className="font-medium text-foreground">{question.author.name}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
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

  // Custom pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    const maxVisiblePages = 5;
    const startPage = Math.max(0, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages);
    
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
                    <Button 
          variant="outline"
                      size="sm" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center gap-1"
                    >
          <ChevronLeft className="h-4 w-4" />
          Previous
                    </Button>
        
        {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map(pageNum => (
                    <Button 
            key={pageNum}
            variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm" 
            onClick={() => onPageChange(pageNum)}
            className="min-w-[40px]"
                    >
            {pageNum + 1}
                    </Button>
        ))}
        
                            <Button 
          variant="outline"
                              size="sm" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="flex items-center gap-1"
                            >
          Next
          <ChevronRight className="h-4 w-4" />
                            </Button>
                              </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">💬 Q&A Forum</h1>
        <p className="text-muted-foreground">Ask questions, share knowledge, and learn from peers</p>
        </div>

        {/* Ask Question Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsAskingQuestion(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
          <Plus className="h-4 w-4 mr-2" />
            Ask a Question
          </Button>
        </div>

      {/* Ask Question Dialog */}
      <Dialog open={isAskingQuestion} onOpenChange={setIsAskingQuestion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>
              Share your question with the community. Be specific and include relevant tags.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Question Title</Label>
              <Input
                id="title"
                placeholder="What's your question? Be specific..."
                value={newQuestion.title}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content">Question Details</Label>
              <Textarea
                id="content"
                placeholder="Provide more context, code examples, or specific details..."
                value={newQuestion.content}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={newQuestion.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newQuestion.tags.map(tag => (
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
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAskingQuestion(false)}>
              Cancel
            </Button>
            <Button onClick={handleAskQuestion}>
              Post Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>

        {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                />
              </div>
              <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
                <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Questions</DialogTitle>
                  <DialogDescription>
                    Adjust filters to refine your search
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Tag</Label>
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="w-full p-2 border rounded bg-background border-border text-foreground"
                    >
                      <option value="">All Tags</option>
                      {popularTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Answered Status</Label>
                    <select
                      value={filterAnswered}
                      onChange={(e) => setFilterAnswered(e.target.value)}
                      className="w-full p-2 border rounded bg-background border-border text-foreground"
                    >
                      <option value="all">All</option>
                      <option value="answered">Answered</option>
                      <option value="unanswered">Unanswered</option>
                    </select>
                  </div>
                  <div>
                    <Label>Time Range</Label>
                    <select
                      value={filterTime}
                      onChange={(e) => setFilterTime(e.target.value)}
                      className="w-full p-2 border rounded bg-background border-border text-foreground"
                    >
                      <option value="all">All Time</option>
                      <option value="last24h">Last 24 Hours</option>
                      <option value="last7d">Last 7 Days</option>
                    </select>
                  </div>
                  <Button onClick={() => setFiltersOpen(false)} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="bg-card border-border">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="my-questions" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            My Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
            {filteredQuestions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((question) => (
                <QuestionCard key={question.id} question={question} />
            ))}
          {filteredQuestions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredQuestions.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
            {filteredQuestions
              .sort((a, b) => b.upvotes - a.upvotes)
              .slice(popularPage * itemsPerPage, (popularPage + 1) * itemsPerPage)
              .map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            }
          {filteredQuestions.length > 0 && (
            <Pagination
              currentPage={popularPage}
              totalPages={Math.ceil(filteredQuestions.length / itemsPerPage)}
              onPageChange={setPopularPage}
              className="mt-6"
            />
          )}
        </TabsContent>

        <TabsContent value="my-questions" className="space-y-4">
                {filteredQuestions
                  .filter(q => q.author.name === user.name)
                  .slice(myQuestionsPage * itemsPerPage, (myQuestionsPage + 1) * itemsPerPage)
                  .map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))
                }
          {filteredQuestions.filter(q => q.author.name === user.name).length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No questions yet</h3>
              <p className="text-muted-foreground mb-4">You haven't asked any questions yet.</p>
              <Button onClick={() => setIsAskingQuestion(true)}>
                Ask Your First Question
              </Button>
              </div>
          )}
          {filteredQuestions.filter(q => q.author.name === user.name).length > 0 && (
            <Pagination
              currentPage={myQuestionsPage}
              totalPages={Math.ceil(filteredQuestions.filter(q => q.author.name === user.name).length / itemsPerPage)}
              onPageChange={setMyQuestionsPage}
              className="mt-6"
            />
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Popular Tags</CardTitle>
            <CardDescription className="text-muted-foreground">Browse questions by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent/50"
                  onClick={() => setFilterTag(selectedTag === tag ? '' : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Question Thread Modal */}
      <Dialog open={isThreadModalOpen} onOpenChange={setIsThreadModalOpen}>
        <DialogContent className="w-[90vw] h-[85vh] max-w-none p-0 overflow-hidden flex flex-col" style={{ maxWidth: '90vw', height: '85vh', width: '90vw', minHeight: '85vh' }}>
          <DialogHeader className="px-4 py-3 border-b bg-muted/20">
            <DialogTitle className="text-lg font-bold">
              {selectedQuestion?.title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={selectedQuestion?.author.avatar} alt={selectedQuestion?.author.name} />
                  <AvatarFallback className="text-xs">
                    {selectedQuestion?.author.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectedQuestion?.author.name}</span>
      </div>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedQuestion?.timeAgo}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-1 min-h-0 max-h-full" style={{ height: '100%' }}>
            {/* Left Panel - Question */}
            <div className="w-1/2 flex flex-col border-r min-h-0" style={{ width: '50%', minWidth: '50%', maxWidth: '50%' }}>
              <ScrollArea className="flex-1 overflow-y-auto min-h-0">
                <div className="px-4 pt-2 pb-6">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center gap-2 min-w-[40px]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`p-2 h-8 w-8 rounded-full hover:bg-blue-50 ${selectedQuestion?.userVote === 1 ? 'text-blue-600 bg-blue-50' : 'text-muted-foreground'}`}
                        onClick={() => selectedQuestion && handleVote(selectedQuestion.id, 'up')}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <span className="font-bold text-lg">{selectedQuestion?.upvotes}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`p-2 h-8 w-8 rounded-full hover:bg-red-50 ${selectedQuestion?.userVote === -1 ? 'text-red-600 bg-red-50' : 'text-muted-foreground'}`}
                        onClick={() => selectedQuestion && handleVote(selectedQuestion.id, 'down')}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <p className="text-foreground leading-relaxed">
                        {selectedQuestion?.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {selectedQuestion?.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Heart className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Right Panel - Answers */}
            <div className="w-1/2 flex flex-col min-h-0" style={{ width: '50%', minWidth: '50%', maxWidth: '50%' }}>
              <div className="px-4 py-2 border-b bg-muted/10 flex-shrink-0">
                <h3 className="text-base font-semibold">
                  {selectedQuestion?.answerList?.length || 0} Answer{(selectedQuestion?.answerList?.length || 0) !== 1 ? 's' : ''}
                </h3>
              </div>
              
              {/* Answers List - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0" style={{ minHeight: '300px' }}>
                <div className="px-4 pt-2 pb-4 space-y-3">
                  {selectedQuestion?.answerList?.map((answer) => (
                    <div key={answer.id} className="border rounded-lg p-3 hover:bg-muted/20 transition-colors">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-2 min-w-[40px]">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`p-1 h-6 w-6 rounded-full hover:bg-blue-50 ${answer.userVote === 1 ? 'text-blue-600 bg-blue-50' : 'text-muted-foreground'}`}
                            onClick={() => selectedQuestion && handleVote(selectedQuestion.id, 'up', true, answer.id)}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-sm">{answer.upvotes}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`p-1 h-6 w-6 rounded-full hover:bg-red-50 ${answer.userVote === -1 ? 'text-red-600 bg-red-50' : 'text-muted-foreground'}`}
                            onClick={() => selectedQuestion && handleVote(selectedQuestion.id, 'down', true, answer.id)}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          {answer.isAccepted && (
                            <Check className="h-4 w-4 text-green-600 mt-1" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <p className="text-foreground leading-relaxed">{answer.content}</p>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                                <AvatarFallback className="text-xs">
                                  {answer.author.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{answer.author.name}</span>
                              <span>•</span>
                              <span>{answer.timeAgo}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedQuestion?.answerList?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No answers yet. Be the first to help!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Add Answer Section - Sticky at Bottom */}
              <div className="flex-shrink-0 border-t bg-background">
                <div className="p-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/20">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Add Your Answer
                    </h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your knowledge and help others..."
                        value={newAnswer}
                        onChange={handleAnswerChange}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback className="text-xs">
                              {user?.name?.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>Answering as <strong>{user?.name}</strong></span>
                        </div>
                        <Button 
                          onClick={() => selectedQuestion && handleAddAnswer(selectedQuestion.id)}
                          disabled={!newAnswer.trim()}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Post Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

