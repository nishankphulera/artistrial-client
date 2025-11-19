'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Grid, 
  List, 
  Plus,
  Users,
  Search
} from 'lucide-react';
import { FilterSidebar, FilterConfig, FilterState } from '@/components/shared/FilterSidebar';
import { TalentSearchFilters } from '@/components/shared/TalentSearchFilters';
import { TalentCard } from '@/components/shared/TalentCard';
import { FeaturedListings } from '@/components/shared/FeaturedListings';
import { FeaturedArtists } from '@/components/shared/FeaturedArtists';
import { useAuth } from '@/components/providers/AuthProvider';
import { CREATE_ROUTES } from '@/utils/routes';
import { apiUrl } from '@/utils/api';

interface TalentProfile {
  id: number;
  user_id: number;
  title: string;
  category: string;
  description: string;
  hourly_rate?: number;
  fixed_price?: number;
  pricing_type: 'hourly' | 'fixed' | 'both';
  skills: string[];
  experience: string;
  availability?: string;
  delivery_time?: string;
  location?: string;
  is_remote: boolean;
  portfolio_urls: string[];
  languages: string[];
  status: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface TalentMarketplacePageProps {
  isDashboardDarkMode?: boolean;
}

export function TalentMarketplacePage({
  isDashboardDarkMode = false,
}: TalentMarketplacePageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 500],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest',
    experience: 'all',
  });

  const filterConfig: FilterConfig = {
    categories: [
      { value: 'music', label: 'Music' },
      { value: 'design', label: 'Design' },
      { value: 'writing', label: 'Writing' },
      { value: 'photography', label: 'Photography' },
      { value: 'video', label: 'Video' },
      { value: 'development', label: 'Development' }
    ],
    locations: [
      { value: 'all', label: 'All Locations' },
      { value: 'Remote', label: 'Remote' },
      { value: 'New York', label: 'New York' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'London', label: 'London' }
    ],
    priceRange: { min: 0, max: 500 },
    availability: true,
    rating: true,
    customFilters: [
      {
        name: 'experience',
        type: 'select',
        options: [
          { value: '0-2', label: '0-2 years' },
          { value: '3-5', label: '3-5 years' },
          { value: '6-10', label: '6-10 years' },
          { value: '10+', label: '10+ years' },
        ],
      },
    ],
    moduleType: 'talent',
  };

  useEffect(() => {
    loadTalents();
  }, [filters]);

  const loadTalents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        // For now, just use the first category selected
        params.append('category', filters.category[0]);
      }
      if (filters.location && filters.location !== 'all') {
        const loc = filters.location.toLowerCase() === 'remote' ? 'remote' : filters.location;
        params.append('location', loc);
      }
      if (filters.availability && filters.availability !== 'all') params.append('availability', filters.availability);
      if (filters.sortBy) params.append('sort', filters.sortBy);
      if (filters.priceRange) {
        params.append('min_price', filters.priceRange[0].toString());
        params.append('max_price', filters.priceRange[1].toString());
      }
      params.append('status', 'active');
      params.append('limit', '50');

      const response = await fetch(`${apiUrl('talents')}?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setTalents(data);
      } else {
        console.error('Failed to fetch talents');
      }
    } catch (error) {
      console.error('Error loading talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTalent = (talent: any) => {
    if (!user) {
      alert('Please sign in to book talent');
      return;
    }
    console.log('Booking talent:', talent);
    // Handle booking logic here
  };

  // Client-side filtering for better UX
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch =
      !filters.searchTerm ||
      talent.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      talent.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      talent.skills?.some((skill) =>
        skill
          .toLowerCase()
          .includes((filters.searchTerm || '').toLowerCase()),
      );

    const matchesCategory =
      !Array.isArray(filters.category) ||
      filters.category.length === 0 ||
      filters.category.some((category) =>
        talent.category
          .toLowerCase()
          .includes(category.toLowerCase()),
      );

    const matchesSubcategory =
      !Array.isArray(filters.subcategory) ||
      filters.subcategory.length === 0 ||
      filters.subcategory.some((subcategory) => {
        const needle = subcategory.toLowerCase();
        return (
          talent.title?.toLowerCase().includes(needle) ||
          talent.description?.toLowerCase().includes(needle) ||
          (Array.isArray(talent.skills) && talent.skills.some((s) => s.toLowerCase().includes(needle)))
        );
      });

    const matchesLocation = (() => {
      if (filters.location === 'all') return true;
      const filterLoc = (filters.location || '').toLowerCase();
      
      // Handle remote filter
      if (filterLoc === 'remote') {
        return talent.is_remote === true;
      }
      
      // Handle other locations - check if location field contains the filter value
      if (talent.location) {
        const talentLoc = talent.location.toLowerCase();
        return talentLoc.includes(filterLoc);
      }
      
      return false;
    })();

    const matchesAvailability =
      filters.availability === 'all' ||
      talent.availability?.toLowerCase() ===
        filters.availability.toLowerCase();

    const matchesPrice = (() => {
      // Extract prices, handling both string and number types
      const hourlyRate = talent.hourly_rate !== null && talent.hourly_rate !== undefined
        ? (typeof talent.hourly_rate === 'string' ? parseFloat(talent.hourly_rate) : Number(talent.hourly_rate))
        : null;
      const fixedPrice = talent.fixed_price !== null && talent.fixed_price !== undefined
        ? (typeof talent.fixed_price === 'string' ? parseFloat(talent.fixed_price) : Number(talent.fixed_price))
        : null;
      
      const minPrice = filters.priceRange[0] || 0;
      const maxPrice = filters.priceRange[1] || 500;
      
      // If no pricing info at all, show the talent (might be negotiable)
      if (hourlyRate === null && fixedPrice === null) {
        return true;
      }
      
      // Check if hourly rate falls within the range
      if (hourlyRate !== null && !isNaN(hourlyRate) && hourlyRate > 0) {
        if (hourlyRate >= minPrice && hourlyRate <= maxPrice) {
          return true;
        }
      }
      
      // Check if fixed price falls within the range
      if (fixedPrice !== null && !isNaN(fixedPrice) && fixedPrice > 0) {
        if (fixedPrice >= minPrice && fixedPrice <= maxPrice) {
          return true;
        }
      }
      
      // Neither price is in range
      return false;
    })();

    const matchesExperience = (() => {
      if (!filters.experience || filters.experience === 'all') return true;
      const experienceStr = (talent.experience || '').toLowerCase();
      
      // Extract the minimum years from experience string
      // Examples: "5+ years" -> 5, "3-5 years" -> 3, "10+ years" -> 10
      const yearsMatch = experienceStr.match(/(\d+)\+?/);
      if (!yearsMatch) return true;
      
      const minYears = parseInt(yearsMatch[1]);
      
      switch (filters.experience) {
        case '0-2':
          return minYears >= 0 && minYears <= 2;
        case '3-5':
          return minYears >= 3 && minYears <= 5;
        case '6-10':
          return minYears >= 6 && minYears <= 10;
        case '10+':
          return minYears >= 10;
        default:
          return true;
      }
    })();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubcategory &&
      matchesLocation &&
      matchesAvailability &&
      matchesPrice &&
      matchesExperience
    );
  });

  // Apply sorting
  const sortedTalents = [...filteredTalents].sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price_low': {
        const getPrice = (talent: TalentProfile) => {
          const hourly = typeof talent.hourly_rate === 'string' ? parseFloat(talent.hourly_rate) : (talent.hourly_rate ?? 0);
          const fixed = typeof talent.fixed_price === 'string' ? parseFloat(talent.fixed_price) : (talent.fixed_price ?? 0);
          return hourly > 0 ? hourly : (fixed > 0 ? fixed : 0);
        };
        return getPrice(a) - getPrice(b);
      }
      case 'price_high': {
        const getPrice = (talent: TalentProfile) => {
          const hourly = typeof talent.hourly_rate === 'string' ? parseFloat(talent.hourly_rate) : (talent.hourly_rate ?? 0);
          const fixed = typeof talent.fixed_price === 'string' ? parseFloat(talent.fixed_price) : (talent.fixed_price ?? 0);
          return hourly > 0 ? hourly : (fixed > 0 ? fixed : 0);
        };
        return getPrice(b) - getPrice(a);
      }
      case 'rating':
        // Rating not implemented yet, fall back to newest
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

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
          resultCount={sortedTalents.length}
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
                  onClick={() => router.push(CREATE_ROUTES.TALENT)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Talent
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

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search talents by name, skills, or description..."
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className={`pl-10 ${isDashboardDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
              />
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
                {sortedTalents.length} talent{sortedTalents.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Talents Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {sortedTalents.map((talent) => {
                // Transform API talent format to TalentCard format
                const transformedTalent = {
                  id: talent.id.toString(),
                  name: talent.display_name || talent.username || 'Unknown',
                  profession: talent.category || talent.title || 'Creative Professional',
                  location: talent.location || 'Remote',
                  rating: 4.5, // Default rating, can be fetched from API if available
                  hourlyRate: talent.hourly_rate || talent.fixed_price || 0,
                  skills: talent.skills || [],
                  experience: talent.experience || 'Not specified',
                  avatar: talent.avatar_url || '/api/placeholder/150/150',
                  availability: (talent.availability === 'available' ? 'Available' : talent.availability === 'busy' ? 'Busy' : 'Booked') as 'Available' | 'Busy' | 'Booked',
                  portfolio: talent.portfolio_urls || [],
                  bio: talent.description || '',
                  totalReviews: 0, // Can be fetched from API if available
                  totalProjects: 0, // Can be fetched from API if available
                  responseTime: talent.delivery_time || 'Not specified',
                  userId: talent.user_id?.toString(),
                  user_id: talent.user_id,
                };
                return (
                  <TalentCard
                    key={talent.id}
                    talent={transformedTalent}
                    isDashboardDarkMode={isDashboardDarkMode}
                    onBookTalent={handleBookTalent}
                    viewMode={viewMode}
                    hideContactButton={true}
                  />
                );
              })}
            </div>

            {/* Empty state */}
            {sortedTalents.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No talent found.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilters({
                    searchTerm: '',
                    category: [],
                    subcategory: [],
                    location: 'all',
                    priceRange: [0, 500],
                    availability: 'all',
                    minRating: 0,
                    sortBy: 'newest',
                    experience: 'all',
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

