import { projectId, publicAnonKey } from '@/utils/supabase/info';

export interface Studio {
  id: string;
  name: string;
  type: string;
  location: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  hourlyRate: number;
  dailyRate?: number;
  capacity: number;
  equipment: string[];
  features: string[];
  amenities?: string[];
  images: string[];
  availability: 'Available' | 'Limited' | 'Booked';
  rating: number;
  total_reviews: number;
  description: string;
  policies?: string[];
  owner_id?: string;
  userId?: string;
  isOwner?: boolean;
  status?: 'active' | 'pending' | 'paused';
  earnings?: number;
  bookingsCount?: number;
}

export interface StudioFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  capacity?: number;
}

export interface StudioDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified studio data - single source of truth
const baseStudioData: Studio[] = [
  {
    id: 'studio1',
    name: 'LightBox Photography Studio',
    type: 'Photography',
    location: 'Manhattan, NY',
    address: '123 West 42nd Street, New York, NY',
    coordinates: { lat: 40.7549, lng: -73.9840 },
    hourlyRate: 150,
    dailyRate: 1000,
    capacity: 8,
    equipment: ['Professional Lighting', 'Backdrop Systems', 'Canon 5D Mark IV', 'Tripods'],
    features: ['Natural Light', 'Cyclorama Wall', 'Props Available', 'Dressing Room'],
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Parking'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    availability: 'Available',
    rating: 4.8,
    total_reviews: 24,
    description: 'Modern photography studio with natural light and professional equipment for fashion, portrait, and commercial shoots.',
    policies: ['No smoking', '24-hour cancellation policy', 'Damage deposit required'],
    userId: 'user1',
    status: 'active',
    earnings: 5200,
    bookingsCount: 18,
  },
  {
    id: 'studio2',
    name: 'SoundWave Recording Studio',
    type: 'Recording',
    location: 'Hollywood, CA',
    address: '456 Sunset Boulevard, Los Angeles, CA',
    coordinates: { lat: 34.0928, lng: -118.3287 },
    hourlyRate: 200,
    dailyRate: 1400,
    capacity: 12,
    equipment: ['Pro Tools HDX', 'Neve 1073 Preamps', 'ATC Monitors', 'Vintage Microphones'],
    features: ['Isolation Booth', 'Live Room', 'Control Room', 'Lounge Area'],
    amenities: ['WiFi', 'Coffee Bar', 'Valet Parking', 'Security'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    availability: 'Limited',
    rating: 4.9,
    total_reviews: 56,
    description: 'Professional recording studio with state-of-the-art equipment and acoustically treated rooms for music production.',
    policies: ['Engineer required', 'Minimum 4-hour booking', 'No outside food or drinks'],
    userId: 'user2',
    status: 'active',
    earnings: 8900,
    bookingsCount: 32,
  },
  {
    id: 'studio3',
    name: 'Creative Arts Workshop',
    type: 'Art',
    location: 'Brooklyn, NY',
    address: '789 Atlantic Avenue, Brooklyn, NY',
    coordinates: { lat: 40.6892, lng: -73.9442 },
    hourlyRate: 75,
    dailyRate: 500,
    capacity: 15,
    equipment: ['Easels', 'Art Supplies', 'Pottery Wheels', 'Kiln Access'],
    features: ['Natural Light', 'Sink Access', 'Storage Space', 'Flexible Layout'],
    amenities: ['WiFi', 'Restrooms', 'Street Parking', 'Accessibility Compliant'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    availability: 'Available',
    rating: 4.6,
    total_reviews: 18,
    description: 'Spacious art studio perfect for painting, sculpting, and mixed media projects with all necessary amenities.',
    policies: ['Clean up required', 'Art supplies available for purchase', 'Insurance required for pottery'],
    userId: 'user3',
    status: 'active',
    earnings: 2800,
    bookingsCount: 12,
  },
  {
    id: 'studio4',
    name: 'Motion Picture Studios',
    type: 'Video Production',
    location: 'Burbank, CA',
    address: '321 Media Center Drive, Burbank, CA',
    coordinates: { lat: 34.1808, lng: -118.3090 },
    hourlyRate: 300,
    dailyRate: 2000,
    capacity: 25,
    equipment: ['4K Cameras', 'Lighting Rigs', 'Green Screen', 'Editing Suites'],
    features: ['Sound Stage', 'Production Office', 'Craft Services', 'Loading Dock'],
    amenities: ['WiFi', 'Security', 'Catering Kitchen', 'Multiple Parking Lots'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
    availability: 'Booked',
    rating: 4.7,
    total_reviews: 89,
    description: 'Full-service video production facility with everything needed for film, commercial, and content creation.',
    policies: ['Insurance required', 'Minimum crew of 5', 'Union rates apply'],
    userId: 'user4',
    status: 'active',
    earnings: 12400,
    bookingsCount: 45,
  },
];

export const useStudioData = () => {
  const fetchStudioProfiles = async (
    filters: Partial<StudioFilters> = {},
    context: StudioDataContext = { context: 'public' }
  ): Promise<Studio[]> => {
    try {
      // Try to fetch from API first
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        filters.category.forEach(cat => params.append('studio_type', cat));
      }
      if (Array.isArray(filters.subcategory) && filters.subcategory.length > 0) {
        filters.subcategory.forEach(sub => params.append('subcategory', sub));
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      if (filters.availability && filters.availability !== 'all') {
        params.append('availability', filters.availability);
      }
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `http://localhost:5001/api/studios?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return processFilteredData(data, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading studios from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for studio profiles');
    return processFilteredData([...baseStudioData], filters, context);
  };

  const processFilteredData = (
    data: any[],
    filters: Partial<StudioFilters>,
    context: StudioDataContext
  ): Studio[] => {
    let processedData = data.map((studio: any) => ({
      id: studio.id?.toString() || '',
      name: studio.title || studio.name || '',
      type: studio.studio_type || studio.type || '',
      location: `${studio.city || ''}, ${studio.state || ''}`.replace(/^,\s*|,\s*$/g, '') || studio.location || '',
      address: studio.address || '',
      coordinates: studio.coordinates,
      hourlyRate: studio.hourly_rate || studio.hourlyRate || 0,
      dailyRate: studio.daily_rate || studio.dailyRate,
      capacity: parseInt(studio.capacity) || 0,
      equipment: Array.isArray(studio.equipment) ? studio.equipment : [],
      features: Array.isArray(studio.amenities) ? studio.amenities : [],
      amenities: Array.isArray(studio.amenities) ? studio.amenities : [],
      images: Array.isArray(studio.images) ? studio.images : [],
      availability: studio.status === 'active' ? 'Available' : 'Limited',
      rating: studio.rating || 0,
      total_reviews: studio.total_reviews || 0,
      description: studio.description || '',
      policies: Array.isArray(studio.rules) ? studio.rules : [],
      owner_id: studio.owner_id?.toString(),
      userId: studio.owner_id?.toString(),
      isOwner: context.userId ? studio.owner_id?.toString() === context.userId : false,
      status: studio.status || 'active',
      earnings: studio.earnings || 0,
      bookingsCount: studio.bookingsCount || 0,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-studios':
        case 'my-listings':
          processedData = processedData.filter(studio => studio.isOwner);
          break;
        case 'active':
          processedData = processedData.filter(studio => studio.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(studio => studio.status === 'pending');
          break;
        case 'all-studios':
        default:
          // Show all for 'all-studios' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(studio =>
        studio.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        studio.description.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        studio.equipment.some(eq => eq.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(studio =>
        filters.category!.some(category =>
          studio.type.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (Array.isArray(filters.subcategory) && filters.subcategory.length > 0) {
      processedData = processedData.filter(studio =>
        filters.subcategory!.some(subcategory =>
          studio.description.toLowerCase().includes(subcategory.toLowerCase())
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      processedData = processedData.filter(studio =>
        studio.location.includes(filters.location!)
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      processedData = processedData.filter(studio =>
        studio.availability.toLowerCase() === filters.availability!.toLowerCase()
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(studio =>
        (studio.rating || 0) >= filters.minRating!
      );
    }

    if (filters.priceRange) {
      processedData = processedData.filter(studio =>
        studio.hourlyRate >= filters.priceRange![0] &&
        studio.hourlyRate <= filters.priceRange![1]
      );
    }

    if (filters.capacity && filters.capacity > 0) {
      processedData = processedData.filter(studio =>
        studio.capacity >= filters.capacity!
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
      case 'capacity':
        processedData.sort((a, b) => b.capacity - a.capacity);
        break;
      case 'newest':
      default:
        // Sort by creation date (mock - using id for now)
        processedData.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return processedData;
  };

  const fetchStudioStats = async (userId: string): Promise<any> => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/studios/stats/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error loading studio stats from API:', error);
    }

    // Fallback to mock stats
    return {
      total_studios: 0,
      active_studios: 0,
      inactive_studios: 0,
      average_hourly_rate: 0,
      min_hourly_rate: 0,
      max_hourly_rate: 0,
      average_daily_rate: 0,
      average_weekly_rate: 0
    };
  };

  return {
    fetchStudioProfiles,
    fetchStudioStats,
  };
};

// Filter configuration for studios
export const studioFilterConfig = {
  categories: [
    { value: 'photography', label: 'Photography Studios', icon: null },
    { value: 'recording', label: 'Recording Studios', icon: null },
    { value: 'art', label: 'Art Studios', icon: null },
    { value: 'video', label: 'Video Production', icon: null },
    { value: 'multipurpose', label: 'Multi-Purpose Spaces', icon: null },
  ],
  locations: [
    { value: 'Manhattan', label: 'Manhattan, NY' },
    { value: 'Brooklyn', label: 'Brooklyn, NY' },
    { value: 'Hollywood', label: 'Hollywood, CA' },
    { value: 'Burbank', label: 'Burbank, CA' },
    { value: 'Austin', label: 'Austin, TX' },
    { value: 'Chicago', label: 'Chicago, IL' },
  ],
  priceRange: { min: 50, max: 500 },
  availability: true,
  rating: true,
  customFilters: [
    {
      name: 'capacity',
      type: 'slider',
      range: { min: 1, max: 50 }
    }
  ],
  moduleType: 'studios',
};

