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
  Scale,
  CheckCircle,
  Users,
  Star
} from 'lucide-react';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { LegalSearchFilters } from '../../shared/LegalSearchFilters';
import { LegalCard } from '../../shared/LegalCard';
import { AdminHeader } from '../../shared/AdminHeader';
import { useAuth } from '../../providers/AuthProvider';
import {
  useLegalData,
  LegalService,
  LegalFilters,
  legalFilterConfig
} from '../../shared/data/LegalDataService';

interface AdminStats {
  totalLawyers: number;
  myProfile: number;
  totalConsultations: number;
  totalRevenue: number;
  averageHourlyRate: number;
  clientSatisfaction: number;
}

interface LegalServicesAdminProps {
  isDashboardDarkMode?: boolean;
}

export const LegalServicesAdmin: React.FC<LegalServicesAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchLegalServices } = useLegalData();
  const [lawyers, setLawyers] = useState<LegalService[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-lawyers');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [100, 1000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const filterConfig: FilterConfig = legalFilterConfig;

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Convert FilterState to LegalFilters
      const legalFilters: LegalFilters = {
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
      const data = await fetchLegalServices(legalFilters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setLawyers(data);

      // Calculate admin stats from the loaded data
      const myProfiles = data.filter(lawyer => lawyer.isOwner).length;
      setAdminStats({
        totalLawyers: data.length,
        myProfile: myProfiles,
        totalConsultations: data.reduce((sum, lawyer) => sum + (lawyer.totalConsultations || 0), 0),
        totalRevenue: data
          .filter(lawyer => lawyer.isOwner)
          .reduce((sum, lawyer) => sum + (lawyer.totalEarnings || 0), 0),
        averageHourlyRate: data.length > 0
          ? data.reduce((sum, lawyer) => sum + (lawyer.hourlyRate || 0), 0) / data.length
          : 0,
        clientSatisfaction: data.length > 0
          ? data.reduce((sum, lawyer) => sum + (lawyer.clientSatisfaction || 0), 0) / data.length
          : 0,
      });
    } catch (error) {
      console.error('Error loading admin legal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    router.push('/dashboard/create-legal');
  };

  const handleEditProfile = (lawyerId: string) => {
    router.push(`/dashboard/edit-legal/${lawyerId}`);
  };

  const handleViewAnalytics = (lawyerId: string) => {
    router.push(`/dashboard/analytics/legal/${lawyerId}`);
  };

  const handleLawyerClick = (lawyerId: string) => {
    router.push(`/dashboard/lawyers/${lawyerId}`);
  };

  // Lawyers are already filtered by the data service based on activeTab
  const filteredLawyers = lawyers;

  const showFilterSidebar = activeTab === 'all-lawyers' || activeTab === 'active' || activeTab === 'pending';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminHeader
          title="Legal Services Management"
          description="Manage legal profiles, client consultations, and track service performance."
          createButtonText="Create Legal Profile"
          onCreateClick={handleCreateProfile}
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Lawyers</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalLawyers}
                    </p>
                  </div>
                  <Scale className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>My Profile</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.myProfile ? '✓' : '✗'}
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Consultations</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalConsultations}
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rate</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${adminStats.averageHourlyRate.toFixed(0)}
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Satisfaction</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.clientSatisfaction.toFixed(1)}%
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
            <TabsTrigger value="all-lawyers">All Lawyers</TabsTrigger>
            <TabsTrigger value="my-profile">My Profile</TabsTrigger>
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
            resultCount={filteredLawyers.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${!showFilterSidebar ? 'w-full' : ''}`}>
          {/* All Lawyers Tab */}
          {(activeTab === 'all-lawyers' || activeTab === 'active' || activeTab === 'pending' || activeTab === 'my-profile') && (
            <div className="space-y-6 mt-0">
              {/* Search and Category Section */}
              <LegalSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                isDarkMode={isDashboardDarkMode}
                layoutConfig={{
                  categorySpan: 'lg:col-span-2',
                  subcategorySpan: 'lg:col-span-3',
                  searchSpan: 'lg:col-span-7'
                }}
              />

              {/* Legal Cards Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLawyers.map((lawyer) => (
                    <LegalCard
                      key={lawyer.id}
                      lawyer={lawyer}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleLawyerClick}
                      viewMode="grid"
                      adminActions={lawyer.isOwner ? {
                        onEdit: () => handleEditProfile(lawyer.id),
                        onAnalytics: () => handleViewAnalytics(lawyer.id),
                      } : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLawyers.map((lawyer) => (
                    <LegalCard
                      key={lawyer.id}
                      lawyer={lawyer}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleLawyerClick}
                      viewMode="list"
                      adminActions={lawyer.isOwner ? {
                        onEdit: () => handleEditProfile(lawyer.id),
                        onAnalytics: () => handleViewAnalytics(lawyer.id),
                      } : undefined}
                    />
                  ))}
                </div>
              )}

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Empty state */}
              {filteredLawyers.length === 0 && (
                <div className="text-center py-12">
                  <Scale className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No lawyers found</h3>
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

