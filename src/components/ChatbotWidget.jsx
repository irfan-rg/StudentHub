import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

// Lightweight, client-only chatbot widget
export default function ChatbotWidget({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [personalizationOn, setPersonalizationOn] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const topTeachSkill = useMemo(() => {
    if (!user?.skillsCanTeach?.length) return null;
    return user.skillsCanTeach.find(s => ['expert', 'advanced'].includes(s.level)) || user.skillsCanTeach[0];
  }, [user]);
  const topLearnSkill = useMemo(() => {
    if (!user?.skillsWantToLearn?.length) return null;
    return user.skillsWantToLearn[0];
  }, [user]);

  const suggestedPrompts = useMemo(() => {
    const prompts = [];
    if (topLearnSkill) prompts.push(`Who can teach me ${topLearnSkill}?`);
    if (topTeachSkill) prompts.push(`Find students who want to learn ${topTeachSkill.name}`);
    prompts.push('What should I do next?');
    prompts.push('Show my points and rank');
    prompts.push('Draft a question about React');
    return prompts.slice(0, 5);
  }, [topLearnSkill, topTeachSkill]);

  const addBot = (content, actions = []) => {
    setMessages(prev => [...prev, { role: 'bot', content, actions, ts: Date.now() }]);
  };
  const addUser = (content) => {
    setMessages(prev => [...prev, { role: 'user', content, ts: Date.now() }]);
  };

  const handleAction = (action) => {
    if (!action) return;
    switch (action.type) {
      case 'navigate':
        navigate(action.to);
        break;
      case 'prefill_question': {
        navigate('/qa');
        break;
      }
      default:
        break;
    }
  };

  const intentReply = (text) => {
    const q = text.toLowerCase();

    // Simple routes
    if (q.includes('who can teach') || q.startsWith('who can teach')) {
      const skill = text.replace(/who can teach( me)?/i, '').trim() || topLearnSkill || 'a skill you like';
      return {
        content: `You can find peers who teach ${skill} in Matching. I can take you there now.`,
        actions: [
          { label: 'View matches', type: 'navigate', to: `/matching?skill=${encodeURIComponent(skill)}` }
        ]
      };
    }

    if (q.includes('find students') || q.includes('who wants to learn')) {
      const skill = text.replace(/find students( who want to learn)?/i, '').trim() || (topTeachSkill?.name || 'your skill');
      return {
        content: `Great idea. Try posting a session offer for ${skill} or browsing Matching to invite students.`,
        actions: [
          { label: 'Open Matching', type: 'navigate', to: `/matching?skill=${encodeURIComponent(skill)}` },
          { label: 'Go to Sessions', type: 'navigate', to: '/sessions' }
        ]
      };
    }

    if (q.includes('what should i do next') || q.includes('next')) {
      const name = personalizationOn ? user?.name?.split(' ')[0] : 'there';
      const pointers = [];
      if (topLearnSkill) pointers.push(`- Connect with a mentor for ${topLearnSkill}`);
      if (topTeachSkill) pointers.push(`- Offer a 30-min intro session on ${topTeachSkill.name}`);
      pointers.push('- Ask a question in the forum');
      return {
        content: `Here are smart next steps ${name}:
${pointers.join('\n')}`,
        actions: [
          topLearnSkill ? { label: `Find ${topLearnSkill} mentors`, type: 'navigate', to: `/matching?skill=${encodeURIComponent(topLearnSkill)}` } : null,
          { label: 'Create session', type: 'navigate', to: '/sessions' },
          { label: 'Ask a question', type: 'navigate', to: '/qa' }
        ].filter(Boolean)
      };
    }

    if (q.includes('points') || q.includes('rank') || q.includes('leaderboard')) {
      const points = user?.points ?? 0;
      return {
        content: `You currently have ${points} points. Check the leaderboard to see your position and top contributors.`,
        actions: [
          { label: 'View Leaderboard', type: 'navigate', to: '/leaderboard' }
        ]
      };
    }

    if (q.includes('question') || q.startsWith('draft')) {
      const base = personalizationOn && topLearnSkill ? `How to get better at ${topLearnSkill}?` : 'How to learn React effectively?';
      return {
        content: `Here is a draft you can use in Q&A:\n\n"${base}"\n\nI can take you to the Q&A page to post it.`,
        actions: [
          { label: 'Go to Q&A', type: 'navigate', to: '/qa' }
        ]
      };
    }

    if (q.includes('profile') || q.includes('update skills') || q.includes('skills')) {
      return {
        content: 'You can update your profile and skills here. Keeping skills accurate improves matches.',
        actions: [
          { label: 'Open Profile', type: 'navigate', to: '/profile' }
        ]
      };
    }

    // Fallback
    return {
      content: 'I can help you find matches, plan sessions, post questions, check points, or update your profile. Try one of the prompts below.',
      actions: []
    };
  };

  const handleSend = () => {
    const text = query.trim();
    if (!text) return;
    addUser(text);
    const { content, actions } = intentReply(text);
    addBot(content, actions);
    setQuery('');
  };

  const handlePromptClick = (prompt) => {
    addUser(prompt);
    const { content, actions } = intentReply(prompt);
    addBot(content, actions);
  };

  return (
    <>
      {createPortal(
        <>
          {/* Floating button */}
          <button
            aria-label="Open assistant"
            onClick={() => setOpen(prev => !prev)}
            className="rounded-full bg-primary text-primary-foreground shadow-lg p-4 hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-ring"
            style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2147483647 }}
          >
            <MessageCircle className="h-6 w-6" />
          </button>

          {/* Dim overlay */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', zIndex: 2147483646 }}
            />
          )}

          {/* Panel */}
          {open && (
            <div
              className="max-w-[calc(100%-2rem)]"
              style={{ position: 'fixed', bottom: 88, right: 16, zIndex: 2147483647, width: '30rem', maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}
            >
              <Card className="bg-card border-border shadow-xl overflow-hidden">
                <CardHeader className="py-2 px-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Study Assistant
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                        title="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {personalizationOn ? 'Personalized' : 'Generic'} suggestions
                    </div>
                    <button
                      className="text-sm underline text-blue-700 dark:text-blue-300"
                      onClick={() => setPersonalizationOn((v) => !v)}
                    >
                      {personalizationOn ? 'Turn off' : 'Turn on'}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0 text-sm"
                  style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '65vh' }}
                >
                  {/* Suggested prompts */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        className="text-sm px-2 py-1 rounded-md bg-muted hover:bg-muted/50 text-foreground"
                        onClick={() => handlePromptClick(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Chat area */}
                  <div
                    ref={scrollRef}
                    className="border border-border rounded-md p-2 bg-background text-sm overflow-y-auto overflow-x-hidden"
                    style={{ maxHeight: '45vh', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {messages.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Ask me about matches, sessions, points, or posting in Q&A. I’ll tailor suggestions using your profile.
                      </div>
                    )}
                    {messages.map((m, idx) => (
                      <div key={idx} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block max-w-[85%] rounded-md px-2 py-1 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                          {m.content}
                        </div>
                        {m.actions && m.actions.length > 0 && (
                          <div className={`mt-2 flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.actions.map((a, i) => (
                              <Button key={i} size="sm" variant="outline" onClick={() => handleAction(a)} className="text-sm">
                                {a.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Ask something..."
                      className="text-sm"
                    />
                    <Button onClick={handleSend} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}


