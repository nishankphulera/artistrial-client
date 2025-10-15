import { projectId, publicAnonKey } from '@/utils/supabase/info';

export interface TalentProfile {
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
  bio: string;
  totalReviews: number;
  totalProjects: number;
  responseTime: string;
  earnings?: number;
  status?: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  featuredImage?: string;
  userId?: string;
}

export interface TalentFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  experience?: string;
}

export interface TalentDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified talent data - single source of truth
const baseTalentData: TalentProfile[] = [
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
    availability: 'Available',
    portfolio: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
    ],
    bio: 'Professional portrait photographer with 8 years of experience specializing in executive headshots and artistic portraits.',
    totalReviews: 23,
    totalProjects: 156,
    responseTime: '2 hours',
    earnings: 13200,
    status: 'active',
    featuredImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
    userId: 'user1', // Mock user ID for ownership
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
    availability: 'Busy',
    portfolio: [
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    ],
    bio: 'Creative video editing specialist focusing on post-production and motion graphics for commercial projects.',
    totalReviews: 18,
    totalProjects: 89,
    responseTime: '4 hours',
    earnings: 8900,
    status: 'active',
    featuredImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop',
    userId: 'user2',
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
    availability: 'Available',
    portfolio: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    ],
    bio: 'Digital character designer specializing in unique characters for games, animation, and books.',
    totalReviews: 12,
    totalProjects: 67,
    responseTime: '1 hour',
    earnings: 4200,
    status: 'active',
    featuredImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    userId: 'user3',
  },
];

export const useTalentData = () => {
  const fetchTalentProfiles = async (
    filters: Partial<TalentFilters> = {},
    context: TalentDataContext = { context: 'public' }
  ): Promise<TalentProfile[]> => {
    try {
      // Try to fetch from API first
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        filters.category.forEach(cat => params.append('category', cat));
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      if (filters.availability && filters.availability !== 'all') {
        params.append('availability', filters.availability);
      }
      if (filters.minRating && filters.minRating > 0) {
        params.append('min_rating', filters.minRating.toString());
      }
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/talent?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.talents && data.talents.length > 0) {
          return processFilteredData(data.talents, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading talents from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for talent profiles');
    return processFilteredData([...baseTalentData], filters, context);
  };

  const processFilteredData = (
    data: TalentProfile[],
    filters: Partial<TalentFilters>,
    context: TalentDataContext
  ): TalentProfile[] => {
    let processedData = data.map(talent => ({
      ...talent,
      isOwner: context.userId ? talent.userId === context.userId : false,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-profiles':
          processedData = processedData.filter(talent => talent.isOwner);
          break;
        case 'active':
          processedData = processedData.filter(talent => talent.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(talent => talent.status === 'pending');
          break;
        case 'all-talents':
        default:
          // Show all for 'all-talents' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(talent =>
        talent.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        talent.profession.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        talent.skills?.some(skill =>
          skill.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        )
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(talent =>
        filters.category!.some(category =>
          talent.profession.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (Array.isArray(filters.subcategory) && filters.subcategory.length > 0) {
      processedData = processedData.filter(talent =>
        filters.subcategory!.some(subcategory =>
          talent.profession.toLowerCase().includes(subcategory.toLowerCase())
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      processedData = processedData.filter(talent =>
        talent.location.includes(filters.location!)
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      processedData = processedData.filter(talent =>
        talent.availability.toLowerCase() === filters.availability!.toLowerCase()
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(talent =>
        (talent.rating || 0) >= filters.minRating!
      );
    }

    if (filters.priceRange) {
      processedData = processedData.filter(talent =>
        talent.hourlyRate >= filters.priceRange![0] &&
        talent.hourlyRate <= filters.priceRange![1]
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        processedData.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        processedData.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'rating':
        processedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'experience':
        // Sort by experience years (extract number from experience string)
        processedData.sort((a, b) => {
          const aYears = parseInt(a.experience.split(' ')[0]) || 0;
          const bYears = parseInt(b.experience.split(' ')[0]) || 0;
          return bYears - aYears;
        });
        break;
      case 'newest':
      default:
        // Sort by creation date (mock - using id for now)
        processedData.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return processedData;
  };

  return {
    fetchTalentProfiles,
  };
};

// Filter configuration for talent
export const talentFilterConfig = {
  categories: [
    { value: 'photographer', label: 'Photography', icon: null },
    { value: 'video', label: 'Video Production', icon: null },
    { value: 'artist', label: 'Digital Art', icon: null },
    { value: 'music', label: 'Music Production', icon: null },
    { value: 'designer', label: 'Graphic Design', icon: null },
    { value: 'writer', label: 'Writing', icon: null },
    { value: 'voice', label: 'Voice Over', icon: null },
  ],
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

