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
  Eye, 
  Building,
  Edit,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Users,
  Briefcase,
  Target,
  Handshake,
  CreditCard
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { InvestorSearchFilters } from '../../shared/InvestorSearchFilters';
import { InvestorCard } from '../../shared/InvestorCard';

import { useAuth } from '../../providers/AuthProvider';
import {
  useInvestorData,
  InvestorProfile,
  InvestorFilters,
  investorFilterConfig
} from '../../shared/data/InvestorDataService';

interface AdminStats {
  totalInvestors: number;
  myProfile: number;
  totalConnections: number;
  dealsMade: number;
  averageInvestment: number;
  successRate: number;
}

interface InvestorsAdminProps {
  isDashboardDarkMode?: boolean;
}

export const InvestorsAdmin: React.FC<InvestorsAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchInvestorProfiles } = useInvestorData();
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-investors');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [1000, 10000000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const filterConfig: FilterConfig = investorFilterConfig;

  const handleInvestorClick = (investorId: string) => {
    router.push(`/dashboard/investors/${investorId}`);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Convert FilterState to InvestorFilters
      const investorFilters: InvestorFilters = {
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
      const data = await fetchInvestorProfiles(investorFilters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setInvestors(data);

      // Calculate admin stats from the loaded data
      const myProfiles = data.filter(investor => investor.isOwner).length;
      setAdminStats({
        totalInvestors: data.length,
        myProfile: myProfiles,
        totalConnections: data.reduce((sum, investor) => sum + (investor.totalInvestments || 0), 0),
        dealsMade: data.reduce((sum, investor) => sum + (investor.successfulExits || 0), 0),
        averageInvestment: data.length > 0
          ? data.reduce((sum, investor) => sum + (investor.minimumInvestment || 0), 0) / data.length
          : 0,
        successRate: data.length > 0
          ? (data.reduce((sum, investor) => sum + (investor.successfulExits || 0), 0) / data.reduce((sum, investor) => sum + (investor.totalInvestments || 1), 0)) * 100
          : 0,
      });
    } catch (error) {
      console.error('Error loading admin investor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestor = () => {
    router.push('/dashboard/create-investor');
  };

  const handleEditInvestor = (investorId: string) => {
    router.push(`/dashboard/edit-investor/${investorId}`);
  };

  const handleViewAnalytics = (investorId: string) => {
    router.push(`/dashboard/analytics/investor/${investorId}`);
  };

  // Investors are already filtered by the data service based on activeTab
  const filteredInvestors = investors;

  const showFilterSidebar = activeTab === 'all-investors' || activeTab === 'active' || activeTab === 'pending';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Content Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Action buttons section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCreateInvestor}
              className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Investor Profile
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Admin Stats Dashboard */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Investors</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalInvestors}
                    </p>
                  </div>
                  <Briefcase className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connections</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalConnections}
                    </p>
                  </div>
                  <Handshake className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deals Made</p>
                    <p className="text-2xl font-title text-[#FF8D28]">
                      {adminStats.dealsMade}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-[#FF8D28]" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Investment</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${(adminStats.averageInvestment / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <DollarSign className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.successRate.toFixed(1)}%
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
            <TabsTrigger value="all-investors">All Investors</TabsTrigger>
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
            resultCount={filteredInvestors.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${!showFilterSidebar ? 'w-full' : ''}`}>
          {/* All Investors Tab */}
          {(activeTab === 'all-investors' || activeTab === 'active' || activeTab === 'pending' || activeTab === 'my-profile') && (
            <div className="space-y-6 mt-0">
              {/* Search and Category Section */}
              <InvestorSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                isDarkMode={isDashboardDarkMode}
                resultCount={filteredInvestors.length}
              />

              {/* Investor Cards Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInvestors.map((investor) => (
                    <InvestorCard
                      key={investor.id}
                      investorProfile={investor}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleInvestorClick}
                      viewMode="grid"
                      adminActions={investor.isOwner ? {
                        onEdit: () => handleEditInvestor(investor.id),
                        onAnalytics: () => handleViewAnalytics(investor.id),
                      } : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvestors.map((investor) => (
                    <InvestorCard
                      key={investor.id}
                      investorProfile={investor}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleInvestorClick}
                      viewMode="list"
                      adminActions={investor.isOwner ? {
                        onEdit: () => handleEditInvestor(investor.id),
                        onAnalytics: () => handleViewAnalytics(investor.id),
                      } : undefined}
                    />
                  ))}
                </div>
              )}

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Empty state */}
              {filteredInvestors.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No investors found</h3>
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

