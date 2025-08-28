import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Save,
  AlertTriangle,
  Check
} from 'lucide-react';

export function Settings({ user, settings, onUpdateSettings }) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || '',
    bio: user?.bio || '',
    timezone: 'America/New_York',
    language: 'en'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    newMessages: true,
    questionAnswers: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showPoints: true,
    showCollege: true,
    allowMessages: true,
    showOnlineStatus: true
  });

  const [appearance, setAppearance] = useState({
    theme: settings.theme,
    fontSize: settings.fontSize,
    compactMode: settings.compactMode
  });

  const [saveStatus, setSaveStatus] = useState('');

  // Update local appearance state when global settings change
  useEffect(() => {
    setAppearance({
      theme: settings.theme,
      fontSize: settings.fontSize,
      compactMode: settings.compactMode
    });
  }, [settings]);

  const handleSave = () => {
    // Apply appearance settings globally
    onUpdateSettings(appearance);
    
    // Show save confirmation
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
    
    console.log('Saving settings...', { profile, notifications, privacy, appearance });
  };

  const handleThemeChange = (theme) => {
    const newAppearance = { ...appearance, theme };
    setAppearance(newAppearance);
    // Apply immediately for better UX
    onUpdateSettings(newAppearance);
  };

  const handleFontSizeChange = (fontSize) => {
    const newAppearance = { ...appearance, fontSize };
    setAppearance(newAppearance);
    // Apply immediately for better UX
    onUpdateSettings(newAppearance);
  };

  const handleCompactModeChange = (compactMode) => {
    const newAppearance = { ...appearance, compactMode };
    setAppearance(newAppearance);
    // Apply immediately for better UX
    onUpdateSettings(newAppearance);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion would be implemented here');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and privacy settings</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and bio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  value={profile.college}
                  onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full p-3 border rounded-lg resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  rows={4}
                  placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Set your timezone and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label>Session Reminders</Label>
                      <p className="text-sm text-gray-500">Get reminded about upcoming sessions</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sessionReminders}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sessionReminders: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label>New Messages</Label>
                      <p className="text-sm text-gray-500">Notify when you receive new messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.newMessages}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newMessages: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label>Question Answers</Label>
                      <p className="text-sm text-gray-500">Notify when your questions are answered</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.questionAnswers}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, questionAnswers: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-gray-500">Get a weekly summary of platform activity</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive updates about new features and tips</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Visibility</CardTitle>
              <CardDescription>Control who can see your information and how you appear to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-gray-500 mb-3">Who can see your full profile</p>
                <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Everyone</SelectItem>
                    <SelectItem value="students">Students only</SelectItem>
                    <SelectItem value="connections">My connections only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Points</Label>
                    <p className="text-sm text-gray-500">Display your points on your profile</p>
                  </div>
                  <Switch
                    checked={privacy.showPoints}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showPoints: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show College</Label>
                    <p className="text-sm text-gray-500">Display your college/university</p>
                  </div>
                  <Switch
                    checked={privacy.showCollege}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showCollege: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Messages</Label>
                    <p className="text-sm text-gray-500">Let other students message you</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowMessages: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-gray-500">Let others see when you're online</p>
                  </div>
                  <Switch
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <Label className="text-red-600">Delete Account</Label>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Display</CardTitle>
              <CardDescription>Customize how the platform looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${appearance.theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-4 w-4" />
                      <span className="font-medium">Light</span>
                    </div>
                    <div className="bg-white border rounded p-2">
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-1 bg-gray-100 rounded"></div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${appearance.theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-4 w-4" />
                      <span className="font-medium">Dark</span>
                    </div>
                    <div className="bg-gray-800 border rounded p-2">
                      <div className="h-2 bg-gray-600 rounded mb-1"></div>
                      <div className="h-1 bg-gray-700 rounded"></div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${appearance.theme === 'auto' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}
                    onClick={() => handleThemeChange('auto')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Auto</span>
                    </div>
                    <div className="flex rounded overflow-hidden">
                      <div className="flex-1 bg-white border-r p-1">
                        <div className="h-2 bg-gray-200 rounded mb-1"></div>
                        <div className="h-1 bg-gray-100 rounded"></div>
                      </div>
                      <div className="flex-1 bg-gray-800 p-1">
                        <div className="h-2 bg-gray-600 rounded mb-1"></div>
                        <div className="h-1 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Font Size</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Adjust text size for better readability</p>
                <Select value={appearance.fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (12px)</SelectItem>
                    <SelectItem value="medium">Medium (14px)</SelectItem>
                    <SelectItem value="large">Large (16px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Use a more condensed layout</p>
                </div>
                <Switch
                  checked={appearance.compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          {saveStatus === 'saved' ? (
            <>
              <Check className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}