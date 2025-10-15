import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Grid, 
  List, 
  Plus,
  Users
} from 'lucide-react';
import { FilterSidebar, FilterConfig, FilterState } from '../shared/FilterSidebar';
import { TalentSearchFilters } from '../shared/TalentSearchFilters';
import { TalentCard } from '../shared/TalentCard';
import { FeaturedListings } from '../shared/FeaturedListings';
import { FeaturedArtists } from '../shared/FeaturedArtists';
import { useAuth } from '../providers/AuthProvider';
import { 
  useTalentData, 
  TalentProfile, 
  TalentFilters,
  talentFilterConfig 
} from '../shared/data/TalentDataService';

interface TalentMarketplacePageProps {
  isDashboardDarkMode?: boolean;
}

export function TalentMarketplacePage({
  isDashboardDarkMode = false,
}: TalentMarketplacePageProps) {
  const { user } = useAuth();
  const { fetchTalentProfiles } = useTalentData();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 200],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest',
  });

  const filterConfig: FilterConfig = talentFilterConfig;

  useEffect(() => {
    loadTalents();
  }, [filters]);

  const loadTalents = async () => {
    try {
      setLoading(true);
      
      // Convert FilterState to TalentFilters
      const talentFilters: TalentFilters = {
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
      const data = await fetchTalentProfiles(talentFilters, {
        context: 'public',
        userId: user?.id,
      });

      setTalents(data);
    } catch (error) {
      console.error('Error loading talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTalent = (talent: TalentProfile) => {
    if (!user) {
      alert('Please sign in to book talent');
      return;
    }
    console.log('Booking talent:', talent);
    // Handle booking logic here
  };

  // Talents are already filtered by the data service
  const filteredTalents = talents;

  return (
    <div
      className={`w-full min-h-screen ${
        isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'
      }`}
    >
      <div className="flex h-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          config={filterConfig}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredTalents.length}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">
                Talent Marketplace
              </h1>
              <p className="text-muted-foreground">
                Connect with talented artists, photographers,
                videographers, and creative professionals. Find
                the perfect freelancer for your next project.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              {user && (
                <Button
                  onClick={() => console.log('Create profile')}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Profile
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Sections */}
          <FeaturedListings 
            isDashboardDarkMode={isDashboardDarkMode}
            onListingClick={(id) => console.log('Featured listing clicked:', id)}
            onViewAll={() => console.log('View all featured listings')}
          />
          
          <FeaturedArtists 
            isDashboardDarkMode={isDashboardDarkMode}
            onArtistClick={(id) => console.log('Featured artist clicked:', id)}
          />

          {/* Search and Category Section */}
          <TalentSearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            isDarkMode={isDashboardDarkMode}
          />

          {/* Results and Grid */}
          <div className="space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredTalents.length} talent{filteredTalents.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Talents Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredTalents.map((talent) => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  isDashboardDarkMode={isDashboardDarkMode}
                  onBookTalent={handleBookTalent}
                  viewMode={viewMode}
                />
              ))}
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
        </div>
      </div>
    </div>
  );
}

