import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminHeader } from '../shared/AdminHeader';
import { 
  Clock, 
  DollarSign, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  User,
  FileText,
  Star,
  Send,
  Upload,
  Download,
  Plus
} from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  client: {
    name: string;
    avatar?: string;
    rating: number;
  };
  category: string;
  status: 'active' | 'pending' | 'completed' | 'disputed' | 'cancelled';
  budget: number;
  deadline: string;
  progress: number;
  description: string;
  createdAt: string;
  messages: number;
  lastActivity: string;
  deliverables: string[];
  requirements: string[];
}

interface GigManagementPageProps {
  isDashboardDarkMode?: boolean;
}

export function GigManagementPage({ isDashboardDarkMode = false }: GigManagementPageProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockGigs: Gig[] = [
      {
        id: '1',
        title: 'Logo Design for Tech Startup',
        client: {
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c9fd?w=100&h=100&fit=crop&crop=face',
          rating: 4.8
        },
        category: 'Design',
        status: 'active',
        budget: 1500,
        deadline: '2024-01-15',
        progress: 65,
        description: 'Create a modern, professional logo for a fintech startup. Need multiple variations and brand guidelines.',
        createdAt: '2024-01-02',
        messages: 12,
        lastActivity: '2 hours ago',
        deliverables: ['Logo design', 'Brand guidelines', 'File formats (SVG, PNG, JPG)'],
        requirements: ['Modern aesthetic', 'Scalable design', 'Professional appearance']
      },
      {
        id: '2',
        title: 'Website Development',
        client: {
          name: 'Marcus Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 4.9
        },
        category: 'Development',
        status: 'active',
        budget: 3500,
        deadline: '2024-01-25',
        progress: 30,
        description: 'Build a responsive portfolio website with modern design and smooth animations.',
        createdAt: '2024-01-05',
        messages: 8,
        lastActivity: '1 day ago',
        deliverables: ['Responsive website', 'Contact form', 'Portfolio gallery'],
        requirements: ['Mobile responsive', 'Fast loading', 'SEO optimized']
      },
      {
        id: '3',
        title: 'Brand Photography Session',
        client: {
          name: 'Emma Williams',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          rating: 5.0
        },
        category: 'Photography',
        status: 'completed',
        budget: 800,
        deadline: '2023-12-20',
        progress: 100,
        description: 'Professional brand photography for social media and website use.',
        createdAt: '2023-12-10',
        messages: 15,
        lastActivity: '1 week ago',
        deliverables: ['50+ edited photos', 'High-res images', 'Social media formats'],
        requirements: ['Natural lighting', 'Brand consistency', 'Multiple outfits']
      }
    ];
    setGigs(mockGigs);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#FF8D28] text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'disputed':
        return 'bg-red-500 text-white';
      case 'cancelled':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeGigs = gigs.filter(gig => gig.status === 'active' || gig.status === 'pending');
  const completedGigs = gigs.filter(gig => gig.status === 'completed' || gig.status === 'cancelled' || gig.status === 'disputed');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message via API
      setNewMessage('');
    }
  };

  const handleCreateGig = () => {
    console.log('Create new gig clicked');
  };

  return (
    <div className="max-w-7xl mx-auto">
        <AdminHeader
          title="Gig Management"
          description="Manage your active projects, track progress, and view gig history"
          createButtonText="Create Gig"
          onCreateClick={handleCreateGig}
          createButtonIcon={<Plus className="w-4 h-4" />}
          showViewToggle={false}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Gigs</p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {activeGigs.length}
                  </p>
                </div>
                <Clock className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {completedGigs.filter(g => g.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle2 className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Earnings</p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${completedGigs.reduce((sum, gig) => sum + (gig.status === 'completed' ? gig.budget : 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Messages</p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {gigs.reduce((sum, gig) => sum + gig.messages, 0)}
                  </p>
                </div>
                <MessageSquare className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full grid-cols-3 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="active" className={isDashboardDarkMode ? 'data-[state=active]:bg-white data-[state=active]:text-black' : ''}>
              Active Gigs ({activeGigs.length})
            </TabsTrigger>
            <TabsTrigger value="history" className={isDashboardDarkMode ? 'data-[state=active]:bg-white data-[state=active]:text-black' : ''}>
              History ({completedGigs.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className={isDashboardDarkMode ? 'data-[state=active]:bg-white data-[state=active]:text-black' : ''}>
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-6">
              {activeGigs.map((gig) => (
                <Card key={gig.id} className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={gig.client.avatar} />
                          <AvatarFallback>{gig.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className={`font-title text-lg mb-1 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gig.title}
                          </h3>
                          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Client: {gig.client.name} • {gig.category}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {gig.client.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(gig.status)}>
                          {getStatusIcon(gig.status)}
                          <span className="ml-1 capitalize">{gig.status}</span>
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedGig(gig)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                            <DialogHeader>
                              <DialogTitle className={isDashboardDarkMode ? 'text-white' : ''}>
                                {selectedGig?.title}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedGig && (
                              <div className="space-y-6">
                                {/* Gig Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className={`font-title text-lg mb-3 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Project Details
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-[#FF8D28]" />
                                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                          Budget: ${selectedGig.budget.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-[#FF8D28]" />
                                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                          Deadline: {new Date(selectedGig.deadline).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-[#FF8D28]" />
                                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                          Category: {selectedGig.category}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className={`font-title text-lg mb-3 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Progress
                                    </h4>
                                    <div className="space-y-3">
                                      <div>
                                        <div className="flex justify-between mb-1">
                                          <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            Completion
                                          </span>
                                          <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                            {selectedGig.progress}%
                                          </span>
                                        </div>
                                        <Progress value={selectedGig.progress} className="h-2" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Separator className={isDashboardDarkMode ? 'bg-gray-700' : ''} />

                                {/* Description */}
                                <div>
                                  <h4 className={`font-title text-lg mb-3 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Description
                                  </h4>
                                  <p className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    {selectedGig.description}
                                  </p>
                                </div>

                                {/* Requirements & Deliverables */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className={`font-title text-lg mb-3 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Requirements
                                    </h4>
                                    <ul className="space-y-2">
                                      {selectedGig.requirements.map((req, index) => (
                                        <li key={index} className={`flex items-start space-x-2 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          <span className="text-[#FF8D28] mt-1">•</span>
                                          <span>{req}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className={`font-title text-lg mb-3 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      Deliverables
                                    </h4>
                                    <ul className="space-y-2">
                                      {selectedGig.deliverables.map((deliverable, index) => (
                                        <li key={index} className={`flex items-start space-x-2 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          <span className="text-[#FF8D28] mt-1">•</span>
                                          <span>{deliverable}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <Separator className={isDashboardDarkMode ? 'bg-gray-700' : ''} />

                                {/* Communication */}
                                <div>
                                  <h4 className={`font-title text-lg mb-3 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Communication
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                      <Textarea
                                        placeholder="Send a message to your client..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className={isDashboardDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button onClick={handleSendMessage} className="bg-[#FF8D28] hover:bg-[#FF8D28]/90">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                      </Button>
                                      <Button variant="outline">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload File
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                  <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Contract
                                  </Button>
                                  {selectedGig.status === 'active' && (
                                    <Button className="bg-green-600 hover:bg-green-700">
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Mark Complete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-[#FF8D28]" />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          ${gig.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#FF8D28]" />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          Due: {new Date(gig.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-[#FF8D28]" />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {gig.messages} messages
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Progress: {gig.progress}%
                        </span>
                        <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Last activity: {gig.lastActivity}
                        </span>
                      </div>
                      <Progress value={gig.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-6">
              {completedGigs.map((gig) => (
                <Card key={gig.id} className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={gig.client.avatar} />
                          <AvatarFallback>{gig.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className={`font-title text-lg mb-1 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gig.title}
                          </h3>
                          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Client: {gig.client.name} • {gig.category}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {gig.client.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(gig.status)}>
                        {getStatusIcon(gig.status)}
                        <span className="ml-1 capitalize">{gig.status}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-[#FF8D28]" />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          ${gig.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#FF8D28]" />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          Completed: {new Date(gig.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#FF8D28]" />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {gig.deliverables.length} deliverables
                        </span>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>Completion Rate</span>
                      <span className={`font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>Average Rating</span>
                      <span className={`font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>On-time Delivery</span>
                      <span className={`font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>This Month</span>
                      <span className={`font-bold text-[#FF8D28]`}>$2,100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>Last Month</span>
                      <span className={`font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>$1,800</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>Total Lifetime</span>
                      <span className={`font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>$15,400</span>
                    </div>
                    <Separator className={isDashboardDarkMode ? 'bg-gray-700' : ''} />
                    <div className="flex justify-between items-center">
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>Average per Gig</span>
                      <span className={`font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>$1,283</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

