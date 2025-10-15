import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Grid, 
  List, 
  Search, 
  Plus,
  Camera,
  Video,
  Palette,
  Music,
  FileText,
  Mic,
  ChevronDown,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FilterSidebar, FilterConfig, FilterState } from '../shared/FilterSidebar';
import { TalentCard } from '../shared/TalentCard';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  projectId,
  publicAnonKey,
} from '@/utils/supabase/info';

interface TalentProfile {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
  experience: string;
  avatar: string;
  availability: 'Available' | 'Busy' | 'Booked';
  portfolio: string[];
  bio?: string;
  total_reviews?: number;
  featuredImage?: string;
  totalReviews?: number;
  totalProjects?: number;
  responseTime?: string;
  earnings?: number;
}

interface TalentMarketplacePageProps {
  isDashboardDarkMode?: boolean;
}

export function TalentMarketplacePage({
  isDashboardDarkMode = false,
}: TalentMarketplacePageProps) {
  const { user } = useAuth();
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

  // Category structure with main categories and subcategories
  const categoryStructure = {
    photographer: {
      label: 'Photography',
      icon: <Camera className="h-4 w-4" />,
      subcategories: [
        { value: 'portrait', label: 'Portrait Photography' },
        { value: 'wedding', label: 'Wedding Photography' },
        { value: 'commercial', label: 'Commercial Photography' },
        { value: 'fashion', label: 'Fashion Photography' },
        { value: 'event', label: 'Event Photography' },
        { value: 'product', label: 'Product Photography' },
      ],
    },
    video: {
      label: 'Video Production',
      icon: <Video className="h-4 w-4" />,
      subcategories: [
        { value: 'corporate', label: 'Corporate Video' },
        { value: 'wedding', label: 'Wedding Videography' },
        { value: 'music', label: 'Music Videos' },
        { value: 'documentary', label: 'Documentary' },
        { value: 'commercial', label: 'Commercial Video' },
        { value: 'editing', label: 'Video Editing' },
      ],
    },
    artist: {
      label: 'Digital Art',
      icon: <Palette className="h-4 w-4" />,
      subcategories: [
        { value: 'illustration', label: 'Digital Illustration' },
        { value: 'character', label: 'Character Design' },
        { value: 'concept', label: 'Concept Art' },
        { value: 'ui', label: 'UI/UX Design' },
        { value: '3d', label: '3D Modeling' },
      ],
    },
    music: {
      label: 'Music Production',
      icon: <Music className="h-4 w-4" />,
      subcategories: [
        { value: 'recording', label: 'Recording' },
        { value: 'mixing', label: 'Mixing & Mastering' },
        { value: 'composition', label: 'Music Composition' },
        { value: 'sound', label: 'Sound Design' },
      ],
    },
    designer: {
      label: 'Graphic Design',
      icon: <Palette className="h-4 w-4" />,
      subcategories: [
        { value: 'logo', label: 'Logo Design' },
        { value: 'web', label: 'Web Design' },
        { value: 'print', label: 'Print Design' },
        { value: 'branding', label: 'Brand Identity' },
        { value: 'packaging', label: 'Packaging Design' },
      ],
    },
    writer: {
      label: 'Writing',
      icon: <FileText className="h-4 w-4" />,
      subcategories: [
        { value: 'copy', label: 'Copywriting' },
        { value: 'content', label: 'Content Writing' },
        { value: 'technical', label: 'Technical Writing' },
        { value: 'creative', label: 'Creative Writing' },
        { value: 'script', label: 'Scriptwriting' },
      ],
    },
    voice: {
      label: 'Voice Over',
      icon: <Mic className="h-4 w-4" />,
      subcategories: [
        { value: 'commercial', label: 'Commercial VO' },
        { value: 'narration', label: 'Narration' },
        { value: 'character', label: 'Character Voices' },
        { value: 'audiobook', label: 'Audiobook Narration' },
      ],
    },
  };

  const filterConfig: FilterConfig = {
    categories: Object.entries(categoryStructure).map(
      ([key, category]) => ({
        value: key,
        label: category.label,
        icon: category.icon,
      }),
    ),
    locations: [
      { value: 'New York', label: 'New York' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'Austin', label: 'Austin' },
      { value: 'Nashville', label: 'Nashville' },
      { value: 'Chicago', label: 'Chicago' },
      { value: 'Remote', label: 'Remote' },
    ],
    priceRange: { min: 0, max: 200 },
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
    loadSampleData();
  }, [filters]);

  const loadSampleData = async () => {
    // Create sample talent profiles for demo
    const sampleTalents = [
      {
        id: 'talent1',
        name: 'Sarah Johnson',
        profession: 'Portrait Photographer',
        location: 'New York, NY',
        rating: 4.9,
        hourlyRate: 85,
        skills: [
          'Portrait Photography',
          'Studio Lighting',
          'Adobe Lightroom',
          'Professional Headshots',
        ],
        experience: '8 years',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        availability: 'Available' as const,
        portfolio: [
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
        ],
        bio: 'Professional portrait photographer with 8 years of experience specializing in executive headshots and artistic portraits.',
        total_reviews: 23,
        totalReviews: 23,
        totalProjects: 156,
        responseTime: '2 hours',
        earnings: 13200,
        featuredImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
      },
      {
        id: 'talent2',
        name: 'Marcus Chen',
        profession: 'Video Editing Specialist',
        location: 'Los Angeles, CA',
        rating: 4.8,
        hourlyRate: 75,
        skills: [
          'After Effects',
          'Premiere Pro',
          'Motion Graphics',
          'Color Grading',
        ],
        experience: '6 years',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        availability: 'Busy' as const,
        portfolio: [
          'https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
        ],
        bio: 'Creative video editing specialist focusing on post-production and motion graphics for commercial projects.',
        total_reviews: 18,
        totalReviews: 18,
        totalProjects: 89,
        responseTime: '4 hours',
        earnings: 8900,
        featuredImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop',
      },
      {
        id: 'talent3',
        name: 'Emily Rodriguez',
        profession: 'Character Designer',
        location: 'Austin, TX',
        rating: 4.7,
        hourlyRate: 60,
        skills: [
          'Character Design',
          'Digital Illustration',
          'Procreate',
          'Concept Art',
        ],
        experience: '5 years',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        availability: 'Available' as const,
        portfolio: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        ],
        bio: 'Digital character designer specializing in unique characters for games, animation, and books.',
        total_reviews: 12,
        totalReviews: 12,
        totalProjects: 67,
        responseTime: '1 hour',
        earnings: 4200,
        featuredImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      },
    ];

    setTalents(sampleTalents);
  };

  const loadTalents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.searchTerm)
        params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        filters.category.forEach(cat => params.append('category', cat));
      }
      if (filters.location !== 'all')
        params.append('location', filters.location);
      if (filters.availability !== 'all')
        params.append('availability', filters.availability);
      if (filters.minRating > 0)
        params.append('min_rating', filters.minRating.toString());
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/talent?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.talents.length > 0) {
          setTalents(data.talents);
        }
      }
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

  const filteredTalents = talents.filter((talent) => {
    const matchesSearch =
      !filters.searchTerm ||
      talent.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      talent.profession
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      talent.skills?.some((skill) =>
        skill
          .toLowerCase()
          .includes((filters.searchTerm || '').toLowerCase()),
      );

    const matchesMainCategory =
      !Array.isArray(filters.category) ||
      filters.category.length === 0 ||
      filters.category.some((category) =>
        talent.profession
          .toLowerCase()
          .includes(category.toLowerCase()),
      );

    const matchesSubcategory =
      !Array.isArray(filters.subcategory) ||
      filters.subcategory.length === 0 ||
      filters.subcategory.some((subcategory) =>
        talent.profession
          .toLowerCase()
          .includes(subcategory.toLowerCase()),
      );

    const matchesLocation =
      filters.location === 'all' ||
      talent.location.includes(filters.location);

    const matchesAvailability =
      filters.availability === 'all' ||
      talent.availability.toLowerCase() ===
        filters.availability.toLowerCase();

    const matchesRating =
      (talent.rating || 0) >= filters.minRating;

    const matchesPrice =
      talent.hourlyRate >= filters.priceRange[0] &&
      talent.hourlyRate <= filters.priceRange[1];

    return (
      matchesSearch &&
      matchesMainCategory &&
      matchesSubcategory &&
      matchesLocation &&
      matchesAvailability &&
      matchesRating &&
      matchesPrice
    );
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

          {/* Talents Grid */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredTalents.map((talent) => (
              <TalentCard
                key={talent.id}
                talent={talent as any}
                isDashboardDarkMode={isDashboardDarkMode}
                onBookTalent={handleBookTalent}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

