import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { toast } from 'sonner';
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
  Trash,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { useQAStore } from '../stores/useQAStore';

export function QAForum({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
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
  const loading = useQAStore(state => state.loading);
  const error = useQAStore(state => state.error);
  const loadQuestions = useQAStore(state => state.loadQuestions);
  const askQuestion = useQAStore(state => state.askQuestion);
  const addAnswer = useQAStore(state => state.addAnswer);
  const voteQuestion = useQAStore(state => state.voteQuestion);
  const voteAnswer = useQAStore(state => state.voteAnswer);
  const deleteQuestion = useQAStore(state => state.deleteQuestion);
  const deleteAnswer = useQAStore(state => state.deleteAnswer);
    const [deletingIds, setDeletingIds] = useState({});
  const setCurrentUserId = useQAStore(state => state.setCurrentUserId);

  const location = useLocation();

  useEffect(() => {
    // Set current user ID for vote tracking
    if (user?.id || user?._id) {
      setCurrentUserId(user.id || user._id);
    }

    // Load questions from backend
    loadQuestions().then(() => {
      // If URL has questionId param, open that thread and scroll into view
      try {
        const query = new URLSearchParams(location.search);
        const qid = query.get('questionId');
        if (qid) {
          const found = useQAStore.getState().questions.find(q => String(q.id) === String(qid));
          if (found) {
            setSelectedQuestion(found);
            setIsThreadModalOpen(true);
            setTimeout(() => {
              const el = document.getElementById(`question-${found.id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
        }
      } catch (err) {
        console.error('Failed to open question from URL param', err);
      }
    }).catch((error) => {
      console.error('Failed to load questions:', error);
      toast.error('Failed to load questions');
    });
  }, [user, loadQuestions, setCurrentUserId]);

  // Sync selectedQuestion with store when questions change
  useEffect(() => {
    if (selectedQuestion) {
      const updatedQuestion = questions.find(q => q.id === selectedQuestion.id);
      if (updatedQuestion && JSON.stringify(updatedQuestion) !== JSON.stringify(selectedQuestion)) {
        setSelectedQuestion(updatedQuestion);
      }
    }
  }, [questions, selectedQuestion]);

  const popularTags = ["React", "JavaScript", "Python", "Machine Learning", "CSS", "Node.js", "Database", "Algorithm"];
  const TITLE_MAX = 120;
  const BODY_MAX = 1000;

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

  const handleVote = async (questionId, voteType, isAnswer = false, answerId = null) => {
    try {
      if (isAnswer && answerId) {
        await voteAnswer(questionId, answerId, voteType);
        toast.success(`Answer ${voteType === 'up' ? 'upvoted' : 'downvoted'}!`);
      } else {
        await voteQuestion(questionId, voteType);
        toast.success(`Question ${voteType === 'up' ? 'upvoted' : 'downvoted'}!`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to vote');
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }
    if (newQuestion.title.length > TITLE_MAX || newQuestion.content.length > BODY_MAX) {
      toast.error('Character limits exceeded. Please shorten your title or content to post.');
      return;
    }

    try {
      await askQuestion({
        title: newQuestion.title,
        description: newQuestion.content,
        tags: newQuestion.tags
      });
      setIsAskingQuestion(false);
      setNewQuestion({ title: '', content: '', tags: [] });
      toast.success('Question posted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to post question');
    }
  };

  const handleAnswerChange = (e) => {
    setNewAnswer(e.target.value);
  };

  const handleAddAnswer = useCallback(async (questionId) => {
    if (!newAnswer.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    try {
      await addAnswer(questionId, newAnswer);
      setNewAnswer('');
      toast.success('Answer posted successfully!');
      
      // Reload questions to get updated data
      await loadQuestions();
    } catch (error) {
      toast.error(error.message || 'Failed to post answer');
    }
  }, [newAnswer, addAnswer, loadQuestions]);

  const addTag = (tag) => {
    if (!tag) return;
    const normalized = tag.trim();
    if (!normalized) return;
    const duplicate = newQuestion.tags.some(t => String(t).toLowerCase() === normalized.toLowerCase());
    if (!duplicate) {
      setNewQuestion(prev => ({ ...prev, tags: [...prev.tags, normalized] }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    setNewQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (!val) return;
      addTag(val);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowTagSuggestions(true);
    }
  };

  const suggestions = (() => {
    const q = tagInput.trim().toLowerCase();
    if (!q) return [];
    const matched = popularTags.filter(t => t.toLowerCase().includes(q) && !newQuestion.tags.includes(t));
    const customSuggestion = (!popularTags.some(t => t.toLowerCase() === q) && !newQuestion.tags.includes(tagInput.trim())) ? [tagInput.trim()] : [];
    return [...customSuggestion, ...matched].slice(0, 8);
  })();

  const QuestionCard = ({ question }) => (
    <Card id={`question-${question.id}`} className="w-full hover:shadow-md transition-shadow bg-card border-border cursor-pointer" onClick={() => {
      setSelectedQuestion(question);
      setIsThreadModalOpen(true);
    }}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 hover:bg-blue-50 ${question.userVote === 1 ? 'text-blue-600 bg-blue-50' : 'text-muted-foreground hover:text-blue-600'}`}
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
              className={`p-1 hover:bg-red-50 ${question.userVote === -1 ? 'text-red-600 bg-red-50' : 'text-muted-foreground hover:text-red-600'}`}
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
                {/* card-level Delete removed - delete is only available inside the modal (author-only) */}
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

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-semibold">Failed to load questions</p>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => loadQuestions()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Q&A Forum</h1>
        <p className="text-muted-foreground">Ask questions, share knowledge, and learn from peers</p>
        </div>

        {/* Ask Question Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsAskingQuestion(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
          <Plus className="h-4 w-4" />
            Ask a Question
          </Button>
        </div>

      {/* Ask Question Dialog */}
      <Dialog open={isAskingQuestion} onOpenChange={setIsAskingQuestion}>
        <DialogContent className="max-w-none w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] rounded-lg border border-border bg-card p-6 shadow-lg" style={{ maxWidth: '900px' }}>
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>
              Share your question with the community. Be specific and include relevant tags.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }} className=" py-4">
            <div className='space-y-3'>
              <Label htmlFor="title">Question Title</Label>
              <div>
                <Input
                  id="title"
                  placeholder="What's your question? Be specific..."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 w-full"
                  maxLength={TITLE_MAX}
                />
              </div>
              <div className={`text-sm text-right mt-1 ${newQuestion.title.length > TITLE_MAX ? 'text-red-500' : 'text-muted-foreground'}`}>
                {`${(newQuestion.title || '').length}/${TITLE_MAX}`}
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="content">Question Details</Label>
              <div>
                <Textarea
                  id="content"
                  placeholder="Provide more context, code examples, or specific details..."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="mt-1 w-full"
                  maxLength={BODY_MAX}
                />
              </div>
              <div className={`text-sm text-right mt-1 ${newQuestion.content.length > BODY_MAX ? 'text-red-500' : 'text-muted-foreground'}`}>
                {`${(newQuestion.content || '').length}/${BODY_MAX}`}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="mt-2">
                <div className="relative">
                  <Input
                    id="tag-input"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true); }}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                    onFocus={() => setShowTagSuggestions(true)}
                    className="mt-1 w-full"
                  />
                  {showTagSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 bg-card border border-border mt-1 rounded-md shadow-lg max-h-44 overflow-auto">
                      {suggestions.map(s => (
                        <li key={s} className="px-3 py-2 hover:bg-muted/30 cursor-pointer" onMouseDown={(e) => { e.preventDefault(); addTag(s); }}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
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
            <div className="flex justify-between items-center gap-3">
              <div className="text-sm text-muted-foreground">Be concise and add tags to help others find your question</div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setIsAskingQuestion(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!(newQuestion.title.trim() && newQuestion.content.trim()) || newQuestion.title.length > TITLE_MAX || newQuestion.content.length > BODY_MAX} className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${!(newQuestion.title.trim() && newQuestion.content.trim()) || newQuestion.title.length > TITLE_MAX || newQuestion.content.length > BODY_MAX ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Question
                </Button>
              </div>
            </div>
          </form>
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

      {/* Popular Tags */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 font-semibold">
            <Tag className="h-5 w-5 text-blue-600" />
            Popular Tags
          </CardTitle>
          {/* <CardDescription className="text-muted-foreground">Browse questions by topic</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Badge 
                key={tag} 
                variant={selectedTag === tag ? "default" : "outline"}
                className="w-8 h-8 cursor-pointer hover:bg-accent/50 transition-colors font-medium flex items-center justify-center"
                onClick={() => {
                  const newTag = selectedTag === tag ? '' : tag;
                  setSelectedTag(newTag);
                  setFilterTag(newTag);
                }}
              >
                {tag}
              </Badge>
            ))}
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
          {filteredQuestions
            .slice()
            .sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((question) => (
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
              .slice()
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
            .slice()
            .filter(q => q.author.name === user.name)
            .sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())
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
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => toast.success('Coming Soon!')}>
                          <Heart className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => toast.success('Share feature coming soon!')}>
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        {/* show delete when the current user is the author of the question */}
                        {user && (String(user.id || user._id) === String(selectedQuestion?.raw?.askedBy?.id || selectedQuestion?.raw?.askedBy?._id || selectedQuestion?.raw?.askedBy)) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Delete question"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('Delete this question? This cannot be undone.')) return;
                              try {
                                setDeletingIds((prev) => ({ ...prev, [selectedQuestion.id]: true }));
                                await deleteQuestion(selectedQuestion.id);
                                // Close thread modal now that the question is gone
                                setSelectedQuestion(null);
                                setIsThreadModalOpen(false);
                                toast.success('Question deleted');
                              } catch (err) {
                                toast.error(err.message || 'Failed to delete question');
                              } finally {
                                setDeletingIds((prev) => ({ ...prev, [selectedQuestion.id]: false }));
                              }
                            }}
                            className="text-muted-foreground hover:text-foreground p-1 flex items-center gap-2"
                            disabled={Boolean(deletingIds[selectedQuestion.id])}
                          >
                            {deletingIds[selectedQuestion.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) :(
                              <>
                                <Trash className="h-4 w-4" />
                                <span className="text-sm">Delete</span>
                              </>
                            )}
                          </Button>
                        )}
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
                  {(selectedQuestion?.answerList || []).slice().sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime()).map((answer) => (
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
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1 flex items-center gap-2" onClick={() => toast.info(`Reply feature Coming Soon!`)}>
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                              {user && (String(user.id || user._id) === String(answer.raw?.answeredBy?.id || answer.raw?.answeredBy?._id || answer.raw?.answeredBy)) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      aria-label="Delete answer"
                                      className="text-muted-foreground hover:text-foreground p-1 flex items-center gap-2"
                                      onClick={async () => {
                                        if (!confirm('Delete this answer? This cannot be undone.')) return;
                                        try {
                                          setDeletingIds(prev => ({ ...prev, [`${selectedQuestion.id}-${answer.id}`]: true }));
                                          await deleteAnswer(selectedQuestion.id, answer.id);
                                          toast.success('Answer deleted');
                                        } catch (err) {
                                          toast.error(err.message || 'Failed to delete answer');
                                        } finally {
                                          setDeletingIds(prev => ({ ...prev, [`${selectedQuestion.id}-${answer.id}`]: false }));
                                        }
                                      }}
                                      disabled={Boolean(deletingIds[`${selectedQuestion.id}-${answer.id}`])}
                                    >
                                      {deletingIds[`${selectedQuestion.id}-${answer.id}`] ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <>
                                          <Trash className="h-4 w-4" />
                                          <span className="text-sm">Delete</span>
                                        </>
                                      )}
                                    </Button>
                                  )}
                          </div>
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