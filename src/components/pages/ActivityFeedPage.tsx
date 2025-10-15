import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Eye, 
  Heart, 
  MessageSquare, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Clock, 
  User, 
  Calendar,
  Filter,
  Search,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowRight,
  ExternalLink,
  Palette,
  Briefcase,
  Building,
  Gavel,
  Ticket,
  GraduationCap,
  Target,
  Zap,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface ActivityFeedPageProps {
  isDashboardDarkMode?: boolean;
}

interface ActivityItem {
  id: string;
  type: 'view' | 'favorite' | 'purchase' | 'sale' | 'inquiry' | 'review' | 'profile_update' | 'listing_created' | 'listing_updated' | 'collaboration' | 'booking' | 'payment' | 'application' | 'notification';
  title: string;
  description: string;
  user?: {
    name: string;
    avatar?: string;
    username: string;
  };
  timestamp: string;
  metadata: {
    amount?: number;
    rating?: number;
    marketplaceType?: string;
    listingId?: string;
    status?: 'pending' | 'completed' | 'cancelled' | 'active' | 'expired';
    priority?: 'low' | 'medium' | 'high';
  };
}

const mockActivityData: ActivityItem[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Digital Artwork Sale Completed',
    description: 'Abstract Digital Painting #47 sold to Emma Wilson',
    user: {
      name: 'Emma Wilson',
      username: 'emmaw_art',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d0bd?w=40&h=40&fit=crop&crop=face'
    },
    timestamp: '2 minutes ago',
    metadata: {
      amount: 450,
      marketplaceType: 'asset',
      listingId: 'art_001',
      status: 'completed'
    }
  },
  {
    id: '2',
    type: 'inquiry',
    title: 'New Project Inquiry Received',
    description: 'Interest in UI/UX Design Services for mobile app project',
    user: {
      name: 'Tech Startup Inc.',
      username: 'techstartup',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face'
    },
    timestamp: '15 minutes ago',
    metadata: {
      amount: 2500,
      marketplaceType: 'talent',
      listingId: 'talent_005',
      status: 'pending',
      priority: 'high'
    }
  },
  {
    id: '3',
    type: 'view',
    title: 'High Profile View Activity',
    description: '25 new views on Photography Studio listing in the last hour',
    timestamp: '1 hour ago',
    metadata: {
      marketplaceType: 'studio',
      listingId: 'studio_003',
      status: 'active'
    }
  },
  {
    id: '4',
    type: 'review',
    title: 'New 5-Star Review Received',
    description: 'Excellent work on brand identity design project',
    user: {
      name: 'Creative Agency LLC',
      username: 'creativeagency',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    timestamp: '3 hours ago',
    metadata: {
      rating: 5,
      marketplaceType: 'talent',
      listingId: 'talent_002',
      status: 'completed'
    }
  },
  {
    id: '5',
    type: 'booking',
    title: 'Studio Booking Confirmed',
    description: 'Photography session booked for next weekend',
    user: {
      name: 'Sarah Martinez',
      username: 'sarahm_photo',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    timestamp: '5 hours ago',
    metadata: {
      amount: 320,
      marketplaceType: 'studio',
      listingId: 'studio_001',
      status: 'completed'
    }
  },
  {
    id: '6',
    type: 'listing_created',
    title: 'New Legal Services Listing Published',
    description: 'Intellectual Property Consultation now available',
    timestamp: '1 day ago',
    metadata: {
      marketplaceType: 'legal',
      listingId: 'legal_007',
      status: 'active'
    }
  },
  {
    id: '7',
    type: 'collaboration',
    title: 'Collaboration Request Received',
    description: 'Invitation to join "Modern Art Exhibition" project',
    user: {
      name: 'Metropolitan Gallery',
      username: 'metrogallery',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    timestamp: '1 day ago',
    metadata: {
      marketplaceType: 'collaboration',
      status: 'pending',
      priority: 'medium'
    }
  },
  {
    id: '8',
    type: 'payment',
    title: 'Payment Received',
    description: 'Invoice #INV-2024-003 paid by client',
    user: {
      name: 'Innovation Labs',
      username: 'innovationlabs',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face'
    },
    timestamp: '2 days ago',
    metadata: {
      amount: 1200,
      status: 'completed'
    }
  },
  {
    id: '9',
    type: 'favorite',
    title: 'Artwork Added to Favorites',
    description: 'Modern Abstract Series favorited by 3 collectors',
    timestamp: '2 days ago',
    metadata: {
      marketplaceType: 'asset',
      listingId: 'art_089',
      status: 'active'
    }
  },
  {
    id: '10',
    type: 'application',
    title: 'Event Ticket Application Approved',
    description: 'Your submission for "Digital Art Showcase 2024" has been approved',
    timestamp: '3 days ago',
    metadata: {
      marketplaceType: 'ticket',
      status: 'completed',
      priority: 'high'
    }
  }
];

export function ActivityFeedPage({ isDashboardDarkMode = false }: ActivityFeedPageProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivityData);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>(mockActivityData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter activities based on search term and filter
  useEffect(() => {
    let filtered = activities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedFilter);
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'sales':
          filtered = filtered.filter(activity => ['sale', 'purchase', 'payment'].includes(activity.type));
          break;
        case 'interactions':
          filtered = filtered.filter(activity => ['view', 'favorite', 'inquiry', 'review'].includes(activity.type));
          break;
        case 'listings':
          filtered = filtered.filter(activity => ['listing_created', 'listing_updated'].includes(activity.type));
          break;
        case 'notifications':
          filtered = filtered.filter(activity => ['notification', 'collaboration', 'application', 'booking'].includes(activity.type));
          break;
        default:
          break;
      }
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, selectedFilter, activeTab]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'favorite': return <Heart className="w-4 h-4" />;
      case 'purchase': return <ShoppingCart className="w-4 h-4" />;
      case 'sale': return <DollarSign className="w-4 h-4" />;
      case 'inquiry': return <MessageSquare className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'profile_update': return <User className="w-4 h-4" />;
      case 'listing_created': return <Plus className="w-4 h-4" />;
      case 'listing_updated': return <ArrowRight className="w-4 h-4" />;
      case 'collaboration': return <Target className="w-4 h-4" />;
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'payment': return <CheckCircle className="w-4 h-4" />;
      case 'application': return <Zap className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'favorite': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'purchase': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      case 'sale': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'inquiry': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'review': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      case 'profile_update': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300';
      case 'listing_created': return 'text-teal-600 bg-teal-100 dark:bg-teal-900 dark:text-teal-300';
      case 'listing_updated': return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-300';
      case 'collaboration': return 'text-pink-600 bg-pink-100 dark:bg-pink-900 dark:text-pink-300';
      case 'booking': return 'text-violet-600 bg-violet-100 dark:bg-violet-900 dark:text-violet-300';
      case 'payment': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300';
      case 'application': return 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-300';
      case 'notification': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getMarketplaceIcon = (type: string) => {
    switch (type) {
      case 'asset': return <Palette className="w-3 h-3" />;
      case 'talent': return <Briefcase className="w-3 h-3" />;
      case 'studio': return <Building className="w-3 h-3" />;
      case 'legal': return <Gavel className="w-3 h-3" />;
      case 'ticket': return <Ticket className="w-3 h-3" />;
      case 'education': return <GraduationCap className="w-3 h-3" />;
      case 'product_service': return <Package className="w-3 h-3" />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  const handleMarkAllRead = () => {
    console.log('Mark all read clicked');
  };

  return (
    <div className="p-6">

        {/* Activity Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Today's Activity
                  </p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    23
                  </p>
                </div>
                <div className="p-2 rounded-full bg-[#FF8D28]/20">
                  <Activity className="w-5 h-5 text-[#FF8D28]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    New Inquiries
                  </p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    7
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sales Today
                  </p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    $1,240
                  </p>
                </div>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Profile Views
                  </p>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    156
                  </p>
                </div>
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Eye className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              All Activity
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Sales & Payments
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                  <CardContent className="p-8 text-center">
                    <Activity className={`w-12 h-12 mx-auto mb-4 ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`font-title text-lg font-semibold mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      No Activity Found
                    </h3>
                    <p className={`${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No activity matches your current filters. Try adjusting your search or filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredActivities.map((activity) => (
                  <Card key={activity.id} className={`${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Activity Icon */}
                        <div className={`p-3 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {activity.title}
                              </h3>
                              {activity.metadata.marketplaceType && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                                  {getMarketplaceIcon(activity.metadata.marketplaceType)}
                                  <span className={`text-xs capitalize ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {activity.metadata.marketplaceType}
                                  </span>
                                </div>
                              )}
                              {activity.metadata.priority && getPriorityBadge(activity.metadata.priority)}
                            </div>
                            <div className="flex items-center gap-2">
                              {activity.metadata.amount && (
                                <Badge variant="outline" className="text-green-600 border-green-300">
                                  ${activity.metadata.amount.toLocaleString()}
                                </Badge>
                              )}
                              <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {activity.timestamp}
                              </span>
                            </div>
                          </div>

                          <p className={`text-sm mb-3 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activity.description}
                          </p>

                          {/* User Info and Actions */}
                          <div className="flex items-center justify-between">
                            {activity.user && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={activity.user.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {activity.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {activity.user.name}
                                </span>
                                {activity.metadata.rating && (
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < activity.metadata.rating! 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              {activity.metadata.listingId && (
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Listing
                                </Button>
                              )}
                              {activity.type === 'inquiry' && (
                                <Button size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Reply
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

