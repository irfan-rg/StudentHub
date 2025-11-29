import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// Input removed: menu-driven assistant
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Sparkles, Users, BookOpen, FileText, MessageSquare, PlusCircle, TrendingUp, Trophy, User , Clock, Award, Reply, Settings} from 'lucide-react';

// Lightweight, client-only chatbot widget
export default function ChatbotWidget({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Menu-driven assistant
  // menuStack tracks navigation history for go-back functionality
  const [menuStack, setMenuStack] = useState([]);
  const [currentMenu, setCurrentMenu] = useState('main');
  // no scrollRef necessary for the simplified, menu-focused UI

  // (No scrolling to handle in the simplified menu-only interface)

  // no input focus since we're menu-driven

  // Keyboard shortcuts: Esc to close; M to jump to main menu; B to go back
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key.toLowerCase() === 'm') goToMainMenu();
      if (e.key.toLowerCase() === 'b') handleAction({ type: 'back' });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuStack, currentMenu, open]);

  // When the assistant panel opens for the first time, show Main Menu
  useEffect(() => {
    if (open) {
      goToMainMenu();
    }
  }, [open]);

  // Centralized IVR menu structure built from the current user (if any)
  const topLearnSkills = useMemo(() => (user?.skillsWantToLearn || []).slice(0, 3).map(s => (typeof s === 'string' ? s : s.name)), [user]);
  // Teaching skills removed from this IVR to simplify UX — we no longer expose a Find Students menu

  const menus = useMemo(() => {
    const learnSkills = topLearnSkills;
    // teachSkills removed; teach menu no longer part of IVR

    const learnMenu = [
      { label: 'View Mentors', type: 'navigate', to: '/matching', icon: <Users className="h-4 w-4" />, desc: 'Browse mentors for the skills you want.' },
      ...learnSkills.map(skill => ({ label: `${skill} Mentors`, type: 'navigate',icon: <BookOpen className="h-4 w-4" />, to: `/matching?skill=${encodeURIComponent(skill)}`, desc: `Mentors for ${skill}` })),
      { label: 'Back', type: 'back', icon: <Reply className="h-4 w-4" />, desc: 'Return to main menu' }
    ];

    // teachMenu intentionally removed per request — we won't include 'Find Students' in the main menu

    const profileTo = '/profile' + (user?.id ? `?id=${user.id}` : '');
    return {
      main: [
        { label: 'Find Mentor', type: 'menu', menu: 'learn', icon: <Users className="h-5 w-5" />, desc: 'Find mentors who teach the skills you want to learn.' },
        { label: 'Q&A Forum', type: 'menu', menu: 'qa', icon: <MessageSquare className="h-5 w-5" />, desc: 'Ask questions or browse community answers.' },
        { label: 'Create Session', type: 'menu', menu: 'session', icon: <PlusCircle className="h-5 w-5" />, desc: 'Schedule a study session with peers.' },
        { label: 'Leaderboard', type: 'menu', menu: 'leaderboard', icon: <Trophy className="h-5 w-5" />, desc: 'Check top contributors and your rank.' },
        { label: 'Profile', type: 'menu', menu: 'profile', icon: <User className="h-5 w-5" />, desc: 'Update skills and public profile.' }
      ],
      learn: learnMenu,
      // 'teach' menu intentionally removed – not included in menus
      qa: [
        { label: 'Go to Q&A Forum', type: 'navigate', to: '/qa', icon: <MessageSquare className="h-4 w-4" />, desc: 'Read or ask community questions.' },
        { label: 'My Questions', type: 'navigate',icon: <MessageCircle className="h-4 w-4" />, to: '/qa?mine=true', desc: 'See questions you asked' },
        { label: 'Top Questions', type: 'navigate',icon: <TrendingUp className="h-4 w-4" />, to: '/qa?sort=top', desc: 'Browse popular community questions' },
        { label: 'Back', type: 'back', icon: <Reply className="h-4 w-4" />, desc: 'Return to main menu' }
      ],
      session: [
        { label: 'Create Session', type: 'navigate', to: '/sessions', icon: <PlusCircle className="h-4 w-4" />, desc: 'Host a study session with peers.' },
        { label: 'Quick 30-min', type: 'navigate',icon: <Clock className="h-4 w-4" />, to: '/sessions?duration=30', desc: 'Schedule a short 30-minute session' },
        { label: '1-hour Deep Dive', type: 'navigate',icon: <Clock className="h-4 w-4" />, to: '/sessions?duration=60', desc: 'Schedule a 1-hour session' },
        { label: 'Upload Materials', type: 'navigate', to: '/sessions?upload=true', icon: <FileText className="h-4 w-4" />, desc: 'Attach materials to a session.' },
        { label: 'Back', type: 'back', icon: <Reply className="h-4 w-4" />, desc: 'Return to main menu' }
      ],
      leaderboard: [
        { label: 'View Leaderboard', type: 'navigate', to: '/leaderboard', icon: <Trophy className="h-4 w-4" />, desc: 'See top contributors and ranks.' },
        { label: 'My Rank', type: 'navigate',icon: <Award className="h-4 w-4" />, to: '/leaderboard?me=true', desc: 'See where you stand' },
        { label: 'Back', type: 'back', icon: <Reply className="h-4 w-4" />, desc: 'Return to main menu' }
      ],
      profile: [
        { label: 'Edit Profile', type: 'navigate', to: '/profile', icon: <User className="h-4 w-4" />, desc: 'Update profile and skills to improve matches.' },
        { label: 'View Profile', type: 'navigate',icon: <Settings className="h-4 w-4" />, to: profileTo, desc: 'View your public profile' },
        { label: 'Back', type: 'back', icon: <Reply className="h-4 w-4" />, desc: 'Return to main menu' }
      ]
    };
  }, [user]);

  // Note: Menu definitions have been centralized in the `menus` object above. These functions were removed.

  // No message state; menu-driven UI, so addBot/addUser removed

  const pushMenu = (menuKey) => {
    setMenuStack(prev => [...prev, currentMenu]);
    setCurrentMenu(menuKey);
  };

  const popMenu = () => {
    let prevMenu = 'main';
    setMenuStack(prev => {
      const copy = [...prev];
      const popped = copy.pop();
      prevMenu = popped || 'main';
      return copy;
    });
    setCurrentMenu(prevMenu);
    return prevMenu;
  };

  const getMenuTitle = (key) => {
    switch (key) {
      case 'learn': return 'Find Mentor';
      // case 'teach' removed because 'Find Students' has been removed from main menu
      case 'qa': return 'Q&A Forum';
      case 'session': return 'Create Session';
      case 'leaderboard': return 'Leaderboard';
      case 'profile': return 'Profile';
      case 'main':
      default:
        return 'Main Menu';
    }
  };

  const presentMenu = (menuKey) => {
    // Switch the visible menu
    setCurrentMenu(menuKey);
  };

  const goToMainMenu = () => {
    setMenuStack([]);
    setCurrentMenu('main');
  };

  const getActionsForMenu = (menuKey) => {
    return menus[menuKey] || menus.main;
  };

  const handleAction = (action) => {
    if (!action) return;
    const { type, menu, to, label } = action;
    switch (type) {
      case 'navigate':
        navigate(to);
        setOpen(false);
        break;
      case 'menu':
        // Present submenu
        pushMenu(menu);
        presentMenu(menu);
        break;
      case 'back': {
        const prev = popMenu();
        if (prev === 'main') goToMainMenu();
        else presentMenu(prev);
        break;
      }
      default:
        break;
    }
  };

  // handler kept for compatibility but not used directly; presentMenu(menuKey) is preferred

  // Input-free / menu-driven: No handleSend function required.

  // Not used but kept for compatibility if we want to wire up prompts later

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
                <CardHeader className="px-4 pt-4 pb-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex font-bold items-center gap-2">
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
                </CardHeader>
                <CardContent className="pb-3 text-sm"
                  style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '65vh' }}
                >
                  {/* Header and action list for current menu */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-base font-medium">{getMenuTitle(currentMenu)}</div>
                        <div className="text-xs text-muted-foreground">{menuStack.length ? `Back to ${getMenuTitle(menuStack[menuStack.length-1] || 'main')}` : 'Use the menu below'}</div>
                        {currentMenu === 'learn' && topLearnSkills.length > 0 && (
                          <div className="text-xs text-muted-foreground">Learning: {topLearnSkills.join(', ')}</div>
                        )}
                        {/* Teaching details removed — 'Find Students' menu no longer present */}
                    </div>
                    <div className="flex items-center gap-2">
                      {menuStack.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction({ type: 'back' })} title="Back">Back</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => goToMainMenu()} title="Main menu">Main</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {getActionsForMenu(currentMenu).map((a, i) => (
                      <button
                        key={i}
                        onClick={() => handleAction(a)}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/50 text-left"
                        aria-label={a.label}
                      >
                        <div className="flex items-center justify-center w-8 h-8 text-muted-foreground">{a.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{a.label}</div>
                          {a.desc && <div className="text-xs text-muted-foreground">{a.desc}</div>}
                        </div>
                        <div className="text-muted-foreground text-xs">{a.type === 'navigate' ? 'Open' : a.type === 'menu' ? 'Explore' : ''}</div>
                      </button>
                    ))}
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


