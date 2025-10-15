import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Grid, 
  List, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Building,
  Calendar,
  Star,
  CheckCircle,
  Users
} from 'lucide-react';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { StudioCard } from '../../shared/StudioCard';
import { StudioSearchFilters } from '../../shared/StudioSearchFilters';

import { useAuth } from '../../providers/AuthProvider';
import {
  useStudioData,
  Studio,
  StudioFilters,
  studioFilterConfig
} from '../../shared/data/StudioDataService';

interface AdminStats {
  totalStudios: number;
  myListings: number;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  occupancyRate: number;
}

interface StudiosAdminProps {
  isDashboardDarkMode?: boolean;
}

export const StudiosAdmin: React.FC<StudiosAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchStudioProfiles } = useStudioData();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-studios');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 500],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const filterConfig: FilterConfig = studioFilterConfig as FilterConfig;

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Convert FilterState to StudioFilters
      const studioFilters: StudioFilters = {
        searchTerm: filters.searchTerm || '',
        category: Array.isArray(filters.category) ? filters.category : [],
        subcategory: Array.isArray(filters.subcategory) ? filters.subcategory : [],
        location: filters.location,
        priceRange: filters.priceRange,
        availability: filters.availability,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      };

      // Use the unified data service
      const data = await fetchStudioProfiles(studioFilters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setStudios(data);

      // Calculate admin stats from the loaded data
      const myListings = data.filter(studio => studio.isOwner).length;
      setAdminStats({
        totalStudios: data.length,
        myListings: myListings,
        totalBookings: data.reduce((sum, studio) => sum + (studio.bookingsCount || 0), 0),
        totalEarnings: data
          .filter(studio => studio.isOwner)
          .reduce((sum, studio) => sum + (studio.earnings || 0), 0),
        averageRating: data.length > 0 
          ? data.reduce((sum, studio) => sum + (studio.rating || 0), 0) / data.length 
          : 0,
        occupancyRate: Math.round(
          data.filter(studio => studio.availability !== 'Available').length / Math.max(data.length, 1) * 100
        ),
      });
    } catch (error) {
      console.error('Error loading admin studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudio = () => {
    router.push('/dashboard/create-studio');
  };

  const handleStudioClick = (studioId: string) => {
    router.push(`/dashboard/studio/${studioId}`);
  };

  const handleBookStudio = (studio: Studio) => {
    // Handle booking logic here
    console.log('Book studio:', studio);
  };

  // Studios are already filtered by the data service based on activeTab
  const filteredStudios = studios;

  const showFilterSidebar = activeTab === 'all-studios' || activeTab === 'active' || activeTab === 'pending';

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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Studios</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalStudios}
                    </p>
                  </div>
                  <Building className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>My Listings</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.myListings}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Bookings</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalBookings}
                    </p>
                  </div>
                  <Calendar className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Earnings</p>
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
                      {adminStats.averageRating}★
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Occupancy Rate</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.occupancyRate}%
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full max-w-2xl grid-cols-4 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="all-studios">All Studios</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area with Filter Sidebar */}
      <div className="flex h-full">
        {/* Filter Sidebar - only show on listing tabs */}
        {showFilterSidebar && (
          <FilterSidebar
            config={filterConfig}
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredStudios.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${!showFilterSidebar ? 'w-full' : ''}`}>
          {/* All Studios Tab */}
          {(activeTab === 'all-studios' || activeTab === 'active' || activeTab === 'pending' || activeTab === 'my-listings') && (
            <div className="space-y-6 mt-0">
              {/* Search and Category Section */}
              <StudioSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                isDarkMode={isDashboardDarkMode}
                layoutConfig={{
                  categorySpan: 'lg:col-span-2',
                  subcategorySpan: 'lg:col-span-3',
                  searchSpan: 'lg:col-span-7'
                }}
              />

              {/* Studio Cards Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio as any}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onBook={handleBookStudio as any}
                      onCardClick={handleStudioClick}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio as any}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onBook={handleBookStudio as any}
                      onCardClick={handleStudioClick}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredStudios.length} studio{filteredStudios.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Empty state */}
              {filteredStudios.length === 0 && (
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No studios found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

