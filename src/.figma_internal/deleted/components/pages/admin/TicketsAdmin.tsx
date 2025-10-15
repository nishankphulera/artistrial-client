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
  Calendar,
  CheckCircle,
  Users,
  Ticket
} from 'lucide-react';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { TicketSearchFilters } from '../../shared/TicketSearchFilters';
import { TicketCard } from '../../shared/TicketCard';
import { AdminHeader } from '../../shared/AdminHeader';
import { useAuth } from '../../providers/AuthProvider';
import {
  useTicketData,
  TicketListing,
  TicketFilters,
  ticketFilterConfig
} from '../../shared/data/TicketDataService';

interface AdminStats {
  totalEvents: number;
  myEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  averageAttendance: number;
  upcomingEvents: number;
}

interface TicketsAdminProps {
  isDashboardDarkMode?: boolean;
}

export const TicketsAdmin: React.FC<TicketsAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchTicketListings } = useTicketData();
  const [events, setEvents] = useState<TicketListing[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-events');

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

  const filterConfig: FilterConfig = ticketFilterConfig;

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Convert FilterState to TicketFilters
      const ticketFilters: TicketFilters = {
        searchTerm: filters.searchTerm,
        category: Array.isArray(filters.category) ? filters.category : [],
        subcategory: Array.isArray(filters.subcategory) ? filters.subcategory : [],
        location: filters.location,
        priceRange: filters.priceRange,
        availability: filters.availability,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      };

      // Use the unified data service
      const data = await fetchTicketListings(ticketFilters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setEvents(data);

      // Calculate admin stats from the loaded data
      const myEvents = data.filter(event => event.isOwner).length;
      setAdminStats({
        totalEvents: data.length,
        myEvents: myEvents,
        totalTicketsSold: data.reduce((sum, event) => sum + (event.sales || 0), 0),
        totalRevenue: data
          .filter(event => event.isOwner)
          .reduce((sum, event) => sum + (event.earnings || 0), 0),
        averageAttendance: data.length > 0 
          ? Math.round(data.reduce((sum, event) => sum + ((event.sales || 0) / event.totalTickets * 100), 0) / data.length)
          : 0,
        upcomingEvents: data.filter(event => new Date(event.eventDate) > new Date()).length,
      });
    } catch (error) {
      console.error('Error loading admin event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    router.push('/dashboard/create-event');
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/dashboard/edit-event/${eventId}`);
  };

  const handleViewAnalytics = (eventId: string) => {
    router.push(`/dashboard/analytics/event/${eventId}`);
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  // Events are already filtered by the data service based on activeTab
  const filteredEvents = events;

  const showFilterSidebar = activeTab === 'all-events' || activeTab === 'upcoming' || activeTab === 'completed';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminHeader
          title="Event Management"
          description="Manage your events, track ticket sales, and analyze performance."
          createButtonText="Create Event"
          onCreateClick={handleCreateEvent}
          createButtonIcon={<Plus className="w-4 h-4" />}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Admin Stats Dashboard */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Events</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalEvents}
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>My Events</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.myEvents}
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tickets Sold</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalTicketsSold.toLocaleString()}
                    </p>
                  </div>
                  <Ticket className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</p>
                    <p className="text-2xl font-title text-[#FF8D28]">
                      ${(adminStats.totalRevenue / 1000).toFixed(0)}K
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Attendance</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.averageAttendance}%
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.upcomingEvents}
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
            <TabsTrigger value="all-events">All Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
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
            resultCount={filteredEvents.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${!showFilterSidebar ? 'w-full' : ''}`}>
          {/* All Events Tab */}
          {(activeTab === 'all-events' || activeTab === 'upcoming' || activeTab === 'completed' || activeTab === 'my-events') && (
            <div className="space-y-6 mt-0">
              {/* Search and Category Section */}
              <TicketSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                isDarkMode={isDashboardDarkMode}
                layoutConfig={{
                  categorySpan: 'lg:col-span-2',
                  subcategorySpan: 'lg:col-span-3',
                  searchSpan: 'lg:col-span-7'
                }}
              />

              {/* Event Cards Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <TicketCard
                      key={event.id}
                      ticket={event}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleEventClick}
                      viewMode="grid"
                      adminActions={event.isOwner ? {
                        onEdit: () => handleEditEvent(event.id),
                        onAnalytics: () => handleViewAnalytics(event.id),
                      } : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <TicketCard
                      key={event.id}
                      ticket={event}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleEventClick}
                      viewMode="list"
                      adminActions={event.isOwner ? {
                        onEdit: () => handleEditEvent(event.id),
                        onAnalytics: () => handleViewAnalytics(event.id),
                      } : undefined}
                    />
                  ))}
                </div>
              )}

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Empty state */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No events found</h3>
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

