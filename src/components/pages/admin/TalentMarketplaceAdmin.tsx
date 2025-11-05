'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  Grid, 
  List, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Users,
  Edit,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { TalentSearchFilters } from '../../shared/TalentSearchFilters';
import { FavoritesButton } from '../../shared/FavoritesButton';
import { TalentCard } from '../../shared/TalentCard';
import { FeaturedListings } from '../../shared/FeaturedListings';
import { FeaturedArtists } from '../../shared/FeaturedArtists';

import { useAuth } from '../../providers/AuthProvider';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { 
  useTalentData, 
  TalentProfile, 
  TalentFilters,
  talentFilterConfig 
} from '../../shared/data/TalentDataService';

interface BookingRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  projectTitle: string;
  budget: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  message: string;
}

interface AdminStats {
  totalTalents: number;
  myProfile: boolean;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
}

interface TalentMarketplaceAdminProps {
  isDashboardDarkMode?: boolean;
}

export const TalentMarketplaceAdmin: React.FC<TalentMarketplaceAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchTalentProfiles } = useTalentData();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-talents');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 200],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const filterConfig: FilterConfig = talentFilterConfig as FilterConfig;

  // Dashboard talent detail navigation handler
  const handleTalentClick = (talentId: string) => {
    router.push(`/dashboard/talent/${talentId}`);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock admin stats
      setAdminStats({
        totalTalents: 1250,
        myProfile: true,
        totalBookings: 12,
        totalEarnings: 5400,
        averageRating: 4.9,
        responseRate: 98,
      });

      // Mock booking requests
      const mockBookings: BookingRequest[] = [
        {
          id: 'booking1',
          clientName: 'Michael Thompson',
          clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          projectTitle: 'Executive Headshots for Corporate Website',
          budget: 850,
          timeline: '2 weeks',
          status: 'pending',
          createdAt: '2 hours ago',
          message: 'Hi Sarah, we need professional headshots for our executive team. Looking for a clean, corporate style with neutral backgrounds.'
        },
        {
          id: 'booking2', 
          clientName: 'Jennifer Wu',
          clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          projectTitle: 'Wedding Photography Package',
          budget: 2500,
          timeline: '3 months',
          status: 'accepted',
          createdAt: '1 day ago',
          message: 'We love your portfolio! Would you be available for our wedding on June 15th? Looking for 8-hour coverage including reception.'
        }
      ];

      setBookings(mockBookings);

      // Load talent data using unified service
      const talentFilters: TalentFilters = {
        searchTerm: filters.searchTerm || '',
        category: Array.isArray(filters.category) ? filters.category : [],
        subcategory: Array.isArray(filters.subcategory) ? filters.subcategory : [],
        location: filters.location,
        priceRange: filters.priceRange,
        availability: filters.availability,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      };

      const talentData = await fetchTalentProfiles(talentFilters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setTalents(talentData);
    } catch (error) {
      console.error('Error loading admin talent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    router.push('/dashboard/create-talent');
  };

  const handleEditProfile = (talentId: string) => {
    router.push(`/dashboard/edit-talent-profile/${talentId}`);
  };

  const handleViewAnalytics = (talentId: string) => {
    router.push(`/dashboard/analytics/talent/${talentId}`);
  };

  // Talents are already filtered by the unified data service
  const filteredTalents = talents;

  const showFilterSidebar = activeTab === 'all-talents' || activeTab === 'active' || activeTab === 'pending';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Stats Section */}
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Admin Stats Dashboard */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Talents</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalTalents}
                    </p>
                  </div>
                  <Users className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Bookings</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.totalBookings}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</p>
                    <p className="text-2xl font-title text-[#FF8D28]">
                      ${adminStats.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#FF8D28]" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.averageRating}
                    </p>
                  </div>
                  <Star className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Response Rate</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.responseRate}%
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profile Status</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.myProfile ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full max-w-3xl grid-cols-5 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="all-talents">All Talents</TabsTrigger>
            <TabsTrigger value="my-profiles">My Profiles</TabsTrigger>
            <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full">
        {/* Filter Sidebar - Only show for browsing tabs */}
        {showFilterSidebar && (
          <FilterSidebar
            config={filterConfig}
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredTalents.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">

          {/* All Talents Tab */}
          {(activeTab === 'all-talents' || activeTab === 'active' || activeTab === 'pending' || activeTab === 'my-profiles') && (
            <div className="space-y-6 mt-0">
              {/* Featured Sections - Only show for browsing tabs */}
              {(activeTab === 'all-talents' || activeTab === 'active' || activeTab === 'pending') && (
                <>
                  <FeaturedListings 
                    isDashboardDarkMode={isDashboardDarkMode}
                    onListingClick={(id) => handleTalentClick(id)}
                    onViewAll={() => console.log('View all featured listings')}
                  />
                  
                  <FeaturedArtists 
                    isDashboardDarkMode={isDashboardDarkMode}
                    onArtistClick={(id) => handleTalentClick(id)}
                  />
                </>
              )}

              {/* Search and Category Section */}
              <TalentSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                isDarkMode={isDashboardDarkMode}
                layoutConfig={{
                  categorySpan: 'lg:col-span-2',
                  subcategorySpan: 'lg:col-span-3',
                  searchSpan: 'lg:col-span-7'
                }}
              />

              {/* Talent Cards Grid/List - This is the critical section with onCardClick! */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTalents.map((talent) => (
                    <TalentCard
                      key={talent.id}
                      talent={talent}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleTalentClick}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTalents.map((talent) => (
                    <TalentCard
                      key={talent.id}
                      talent={talent}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleTalentClick}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredTalents.length} talent{filteredTalents.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Empty state */}
              {filteredTalents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No talents found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Booking Requests Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold">No booking requests</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      When clients send you booking requests, they'll appear here.
                    </p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <Card key={booking.id} className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={booking.clientAvatar} />
                              <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{booking.projectTitle}</h4>
                              <p className="text-sm text-muted-foreground">from {booking.clientName}</p>
                              <p className="text-sm mt-2">{booking.message}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Budget: ${booking.budget}</span>
                                <span>Timeline: {booking.timeline}</span>
                                <span>Sent: {booking.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={booking.status === 'pending' ? 'secondary' : booking.status === 'accepted' ? 'default' : 'destructive'}>
                              {booking.status}
                            </Badge>
                            {booking.status === 'pending' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Decline
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message Client
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

