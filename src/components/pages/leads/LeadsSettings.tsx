import React, { useState } from 'react';
import { Settings, Bell, Filter, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { AdminHeader } from '../../shared/AdminHeader';
import { toast } from 'sonner';

interface LeadsSettingsProps {
  isDashboardDarkMode?: boolean;
}

export const LeadsSettings: React.FC<LeadsSettingsProps> = ({ isDashboardDarkMode = false }) => {
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    browserNotifications: true,
    soundAlerts: false,
    urgentLeadsOnly: false,
    notificationFrequency: 'immediate',
    
    // Filtering Preferences
    minBudget: 5000,
    maxBudget: 500000,
    preferredIndustries: ['Technology', 'Healthcare'],
    excludedSources: [],
    priorityLevels: ['high', 'medium'],
    
    // Performance Settings
    autoCapture: false,
    quickActions: true,
    keyboardShortcuts: true,
    darkModeSync: true
  });

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Architecture', 'Fashion', 
    'Education', 'Marketing', 'Manufacturing', 'Real Estate', 'Entertainment'
  ];

  const sources = [
    'Website Contact', 'LinkedIn', 'Google Ads', 'Facebook Ads', 
    'Referrals', 'Industry Events', 'Cold Outreach', 'Content Marketing'
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings to backend/localStorage
    localStorage.setItem('leadsSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      emailNotifications: true,
      browserNotifications: true,
      soundAlerts: false,
      urgentLeadsOnly: false,
      notificationFrequency: 'immediate',
      minBudget: 5000,
      maxBudget: 500000,
      preferredIndustries: ['Technology', 'Healthcare'],
      excludedSources: [],
      priorityLevels: ['high', 'medium'],
      autoCapture: false,
      quickActions: true,
      keyboardShortcuts: true,
      darkModeSync: true
    });
    toast.success('Settings reset to defaults');
  };

  const toggleIndustry = (industry: string) => {
    const current = settings.preferredIndustries;
    const updated = current.includes(industry)
      ? current.filter(i => i !== industry)
      : [...current, industry];
    updateSetting('preferredIndustries', updated);
  };

  const toggleSource = (source: string) => {
    const current = settings.excludedSources as string[];
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source];
    updateSetting('excludedSources', updated);
  };

  return (
    <div className={`p-6 space-y-6 ${isDashboardDarkMode ? 'bg-[#171717] text-white' : 'bg-gray-50'}`}>
      <AdminHeader
        title="Leads Settings"
        description="Configure your lead management preferences and notifications"
        createButtonText="Save Settings"
        onCreateClick={handleSave}
        createButtonIcon={<Save className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
        additionalActions={
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        }
      />

      {/* Settings Tabs */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="filtering">Filtering</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Email notifications
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Receive email alerts for new leads
                  </p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Browser notifications
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Show desktop notifications for urgent leads
                  </p>
                </div>
                <Switch 
                  checked={settings.browserNotifications}
                  onCheckedChange={(checked) => updateSetting('browserNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Sound alerts
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Play sound when new leads appear
                  </p>
                </div>
                <Switch 
                  checked={settings.soundAlerts}
                  onCheckedChange={(checked) => updateSetting('soundAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Urgent leads only
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Only notify for high priority leads
                  </p>
                </div>
                <Switch 
                  checked={settings.urgentLeadsOnly}
                  onCheckedChange={(checked) => updateSetting('urgentLeadsOnly', checked)}
                />
              </div>

              <Separator className={isDashboardDarkMode ? 'bg-gray-700' : ''} />

              <div>
                <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Notification Frequency
                </Label>
                <p className={`text-sm mb-3 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  How often to send notifications
                </p>
                <Select 
                  value={settings.notificationFrequency} 
                  onValueChange={(value) => updateSetting('notificationFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filtering" className="space-y-6">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                <Filter className="w-5 h-5" />
                Lead Filtering Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minBudget" className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Minimum Budget ($)
                  </Label>
                  <Input
                    id="minBudget"
                    type="number"
                    value={settings.minBudget}
                    onChange={(e) => updateSetting('minBudget', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxBudget" className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Maximum Budget ($)
                  </Label>
                  <Input
                    id="maxBudget"
                    type="number"
                    value={settings.maxBudget}
                    onChange={(e) => updateSetting('maxBudget', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator className={isDashboardDarkMode ? 'bg-gray-700' : ''} />

              <div>
                <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Preferred Industries
                </Label>
                <p className={`text-sm mb-3 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select industries you want to focus on
                </p>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant={settings.preferredIndustries.includes(industry) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        settings.preferredIndustries.includes(industry)
                          ? 'bg-[#FF8D28] text-white hover:bg-[#FF8D28]/90'
                          : ''
                      }`}
                      onClick={() => toggleIndustry(industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Excluded Sources
                </Label>
                <p className={`text-sm mb-3 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lead sources to exclude from your stream
                </p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <Badge
                      key={source}
                      variant={(settings.excludedSources as string[]).includes(source) ? "destructive" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Priority Levels
                </Label>
                <p className={`text-sm mb-3 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Which priority levels to show
                </p>
                <div className="flex space-x-2">
                  {['high', 'medium', 'low'].map((priority) => (
                    <Badge
                      key={priority}
                      variant={settings.priorityLevels.includes(priority) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors capitalize ${
                        settings.priorityLevels.includes(priority)
                          ? 'bg-[#FF8D28] text-white hover:bg-[#FF8D28]/90'
                          : ''
                      }`}
                      onClick={() => {
                        const updated = settings.priorityLevels.includes(priority)
                          ? settings.priorityLevels.filter(p => p !== priority)
                          : [...settings.priorityLevels, priority];
                        updateSetting('priorityLevels', updated);
                      }}
                    >
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                <Settings className="w-5 h-5" />
                Performance & Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Auto-capture qualified leads
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Automatically capture leads that meet your criteria
                  </p>
                </div>
                <Switch 
                  checked={settings.autoCapture}
                  onCheckedChange={(checked) => updateSetting('autoCapture', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Quick action buttons
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Show quick capture and dismiss buttons
                  </p>
                </div>
                <Switch 
                  checked={settings.quickActions}
                  onCheckedChange={(checked) => updateSetting('quickActions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Keyboard shortcuts
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enable keyboard shortcuts for faster actions
                  </p>
                </div>
                <Switch 
                  checked={settings.keyboardShortcuts}
                  onCheckedChange={(checked) => updateSetting('keyboardShortcuts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Sync with dashboard theme
                  </Label>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Match the lead interface theme to dashboard
                  </p>
                </div>
                <Switch 
                  checked={settings.darkModeSync}
                  onCheckedChange={(checked) => updateSetting('darkModeSync', checked)}
                />
              </div>

              {settings.keyboardShortcuts && (
                <>
                  <Separator className={isDashboardDarkMode ? 'bg-gray-700' : ''} />
                  <div>
                    <Label className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Keyboard Shortcuts
                    </Label>
                    <div className={`mt-3 space-y-2 text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex justify-between">
                        <span>Capture lead</span>
                        <kbd className={`px-2 py-1 rounded text-xs ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          Space
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>View details</span>
                        <kbd className={`px-2 py-1 rounded text-xs ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          Enter
                        </kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Dismiss lead</span>
                        <kbd className={`px-2 py-1 rounded text-xs ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          X
                        </kbd>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

