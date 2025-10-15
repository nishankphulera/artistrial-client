import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  UserPlus,
  Check,
  X,
  MessageSquare,
  MoreVertical,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  Grid,
  List,
  SortAsc,
  SortDesc,
  UserCheck,
  UserX,
  Clock,
  Eye,
  Badge as BadgeIcon,
  Building,
  Palette,
  Gavel,
  GraduationCap,
  Camera,
  Ticket,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { AdminHeader } from '../shared/AdminHeader';

interface ConnectionsPageProps {
  isDashboardDarkMode?: boolean;
}

interface Connection {
  id: string;
  userId: string;
  name: string;
  title: string;
  avatar?: string;
  coverImage?: string;
  category: 'asset-marketplace' | 'talent-marketplace' | 'studios' | 'legal-services' | 'product-services' | 'education' | 'tickets' | 'investors';
  location: string;
  joinedDate: string;
  lastActive: string;
  isOnline: boolean;
  mutualConnections: number;
  projectsCompleted: number;
  rating: number;
  isVerified: boolean;
  bio: string;
  specialties: string[];
  connectionDate: string;
  messageCount: number;
  collaborationCount: number;
  status: 'active' | 'inactive' | 'blocked';
}

interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  fromUserTitle: string;
  fromUserLocation: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  mutualConnections: number;
  category: string;
  projectHistory: number;
  rating: number;
  isVerified: boolean;
}

const categoryConfig = {
  'asset-marketplace': { 
    label: 'Digital Assets', 
    icon: Palette, 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
  },
  'talent-marketplace': { 
    label: 'Talent & Freelancers', 
    icon: Users, 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
  },
  'studios': { 
    label: 'Studios & Spaces', 
    icon: Building, 
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
  },
  'legal-services': { 
    label: 'Legal Services', 
    icon: Gavel, 
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
  },
  'product-services': { 
    label: 'Product Services', 
    icon: Briefcase, 
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' 
  },
  'education': { 
    label: 'Education', 
    icon: GraduationCap, 
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
  },
  'tickets': { 
    label: 'Events & Tickets', 
    icon: Ticket, 
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' 
  },
  'investors': { 
    label: 'Investors', 
    icon: TrendingUp, 
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' 
  }
};

const mockConnections: Connection[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Emma Wilson',
    title: 'Digital Artist & NFT Creator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d0bd?w=40&h=40&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop',
    category: 'asset-marketplace',
    location: 'San Francisco, CA',
    joinedDate: '2023-01-15',
    lastActive: '2 hours ago',
    isOnline: true,
    mutualConnections: 12,
    projectsCompleted: 45,
    rating: 4.9,
    isVerified: true,
    bio: 'Creating unique digital art and NFT collections with a focus on environmental themes.',
    specialties: ['Digital Art', 'NFT Creation', 'Concept Art', '3D Modeling'],
    connectionDate: '2024-02-15',
    messageCount: 23,
    collaborationCount: 3,
    status: 'active'
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Alex Chen',
    title: 'Full-Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    category: 'talent-marketplace',
    location: 'New York, NY',
    joinedDate: '2022-11-20',
    lastActive: '1 day ago',
    isOnline: false,
    mutualConnections: 8,
    projectsCompleted: 67,
    rating: 4.8,
    isVerified: true,
    bio: 'Experienced developer specializing in React, Node.js, and blockchain applications.',
    specialties: ['React', 'Node.js', 'Blockchain', 'Web3'],
    connectionDate: '2024-01-20',
    messageCount: 15,
    collaborationCount: 2,
    status: 'active'
  },
  {
    id: '3',
    userId: 'user3',
    name: 'Creative Studio Labs',
    title: 'Co-working Space & Production Studio',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
    category: 'studios',
    location: 'Los Angeles, CA',
    joinedDate: '2023-03-10',
    lastActive: '3 hours ago',
    isOnline: true,
    mutualConnections: 25,
    projectsCompleted: 120,
    rating: 4.7,
    isVerified: true,
    bio: 'Premium creative workspace and production studio serving artists and content creators.',
    specialties: ['Video Production', 'Photography', 'Audio Recording', 'Post-Production'],
    connectionDate: '2024-03-05',
    messageCount: 8,
    collaborationCount: 1,
    status: 'active'
  },
  {
    id: '4',
    userId: 'user4',
    name: 'Sarah Martinez',
    title: 'Entertainment Lawyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop',
    category: 'legal-services',
    location: 'Chicago, IL',
    joinedDate: '2023-05-12',
    lastActive: '1 hour ago',
    isOnline: true,
    mutualConnections: 15,
    projectsCompleted: 89,
    rating: 4.9,
    isVerified: true,
    bio: 'Specialized in intellectual property, contracts, and entertainment law for creative professionals.',
    specialties: ['IP Law', 'Contract Negotiation', 'Copyright', 'Entertainment Law'],
    connectionDate: '2024-02-28',
    messageCount: 12,
    collaborationCount: 4,
    status: 'active'
  },
  {
    id: '5',
    userId: 'user5',
    name: 'Design Academy Pro',
    title: 'Online Design Education Platform',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
    category: 'education',
    location: 'Austin, TX',
    joinedDate: '2023-02-08',
    lastActive: '5 hours ago',
    isOnline: false,
    mutualConnections: 18,
    projectsCompleted: 200,
    rating: 4.8,
    isVerified: true,
    bio: 'Comprehensive online courses in design, digital art, and creative business management.',
    specialties: ['Design Education', 'Digital Art Courses', 'Business Skills', 'Mentorship'],
    connectionDate: '2024-01-10',
    messageCount: 6,
    collaborationCount: 1,
    status: 'active'
  },
  {
    id: '6',
    userId: 'user6',
    name: 'Innovation Capital',
    title: 'Creative Industry Investment Fund',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
    category: 'investors',
    location: 'Silicon Valley, CA',
    joinedDate: '2023-04-20',
    lastActive: '2 days ago',
    isOnline: false,
    mutualConnections: 22,
    projectsCompleted: 75,
    rating: 4.6,
    isVerified: true,
    bio: 'Investing in creative technology startups and digital art platforms.',
    specialties: ['Startup Funding', 'Creative Tech', 'Digital Platforms', 'Strategic Planning'],
    connectionDate: '2024-03-12',
    messageCount: 4,
    collaborationCount: 0,
    status: 'active'
  }
];

const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    fromUserId: 'user7',
    fromUserName: 'Metropolitan Gallery',
    fromUserAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    fromUserTitle: 'Contemporary Art Gallery',
    fromUserLocation: 'New York, NY',
    message: 'Hi! We\'d love to connect and discuss potential collaboration opportunities for our upcoming digital art exhibition featuring emerging NFT artists.',
    timestamp: '2 hours ago',
    status: 'pending',
    mutualConnections: 5,
    category: 'asset-marketplace',
    projectHistory: 15,
    rating: 4.7,
    isVerified: true
  },
  {
    id: 'req2',
    fromUserId: 'user8',
    fromUserName: 'TechStart Incubator',
    fromUserAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
    fromUserTitle: 'Startup Incubator & Accelerator',
    fromUserLocation: 'Boston, MA',
    message: 'We\'re interested in connecting with talented developers and designers for our portfolio companies. Your work caught our attention!',
    timestamp: '5 hours ago',
    status: 'pending',
    mutualConnections: 12,
    category: 'talent-marketplace',
    projectHistory: 25,
    rating: 4.8,
    isVerified: true
  },
  {
    id: 'req3',
    fromUserId: 'user9',
    fromUserName: 'Creative Minds Collective',
    fromUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    fromUserTitle: 'Artist Community & Co-working Space',
    fromUserLocation: 'Portland, OR',
    message: 'We\'re building a community of digital artists and would love to have you join our network. Great opportunities for collaboration!',
    timestamp: '1 day ago',
    status: 'pending',
    mutualConnections: 8,
    category: 'studios',
    projectHistory: 30,
    rating: 4.6,
    isVerified: false
  }
];

export function ConnectionsPage({ isDashboardDarkMode = false }: ConnectionsPageProps) {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(mockConnectionRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'activity' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('connections');

  const filteredConnections = useMemo(() => {
    let filtered = connections.filter(connection => {
      const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           connection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           connection.specialties.some(specialty => 
                             specialty.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesCategory = selectedCategory === 'all' || connection.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort connections
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.connectionDate);
          bValue = new Date(b.connectionDate);
          break;
        case 'activity':
          aValue = new Date(a.lastActive);
          bValue = new Date(b.lastActive);
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [connections, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleAcceptConnection = (requestId: string) => {
    setConnectionRequests(connectionRequests.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleDeclineConnection = (requestId: string) => {
    setConnectionRequests(connectionRequests.map(req => 
      req.id === requestId ? { ...req, status: 'declined' } : req
    ));
  };

  const renderConnectionCard = (connection: Connection) => {
    const categoryInfo = categoryConfig[connection.category];
    const CategoryIcon = categoryInfo.icon;

    return (
      <Card key={connection.id} className={`p-3 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {connection.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-title font-medium truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {connection.name}
              </h3>
              {connection.isVerified && (
                <BadgeIcon className="w-4 h-4 text-blue-500" />
              )}
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                <CategoryIcon className="w-3 h-3 mr-1" />
                {categoryInfo.label}
              </Badge>
            </div>
            
            <p className={`text-sm mb-2 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
              {connection.title}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {connection.location}
              </span>
              <span className="flex items-center gap-1 font-medium text-[#FF8D28]">
                <Users className="w-3 h-3" />
                {connection.mutualConnections} mutual
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {connection.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3">
              <MessageSquare className="w-3 h-3 mr-1" />
              Message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <UserX className="w-4 h-4 mr-2" />
                  Remove Connection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  };

  const handleFindPeople = () => {
    console.log('Find people clicked');
  };

  return (
    <div className="p-6">
        <AdminHeader
          title="Connections"
          description="Manage your professional network and connection requests across all marketplaces"
          createButtonText="Find People"
          onCreateClick={handleFindPeople}
          createButtonIcon={<UserPlus className="w-4 h-4" />}
          showViewToggle={false}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted p-1 h-auto">
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Connections
              <Badge variant="secondary" className="text-xs">
                {connections.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Requests
              {connectionRequests.filter(req => req.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {connectionRequests.filter(req => req.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            {/* Filters and Controls */}
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        placeholder="Search connections by name, title, or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className="w-4 h-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Sort by Name</SelectItem>
                        <SelectItem value="date">Sort by Date</SelectItem>
                        <SelectItem value="activity">Sort by Activity</SelectItem>
                        <SelectItem value="rating">Sort by Rating</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connections List */}
            <div className="space-y-4">
              {filteredConnections.map(renderConnectionCard)}
            </div>

            {filteredConnections.length === 0 && (
              <div className="text-center py-12">
                <Users className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`font-title text-lg font-semibold mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Connections Found
                </h3>
                <p className={`${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start connecting with other professionals to build your network.'
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Connection Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="space-y-4">
              {connectionRequests.filter(req => req.status === 'pending').map((request) => (
                <Card key={request.id} className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={request.fromUserAvatar} />
                          <AvatarFallback>
                            {request.fromUserName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {request.isVerified && (
                          <div className="absolute -bottom-1 -right-1">
                            <BadgeIcon className="w-5 h-5 text-blue-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className={`font-title font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {request.fromUserName}
                            </h3>
                            <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {request.fromUserTitle}
                            </p>
                          </div>
                          <span className={`text-xs ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {request.timestamp}
                          </span>
                        </div>
                        
                        <p className={`text-sm mb-4 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {request.message}
                        </p>
                        
                        <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.fromUserLocation}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {request.mutualConnections} mutual connections
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {request.projectHistory} projects
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {request.rating}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {request.category}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleAcceptConnection(request.id)}
                            className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept Connection
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDeclineConnection(request.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                          <Button variant="ghost">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {connectionRequests.filter(req => req.status === 'pending').length === 0 && (
                <div className="text-center py-12">
                  <UserPlus className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`font-title text-lg font-semibold mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No Pending Requests
                  </h3>
                  <p className={`${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    You're all caught up! New connection requests will appear here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

