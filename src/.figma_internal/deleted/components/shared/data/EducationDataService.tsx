import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export interface EducationListing {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  subcategory: string;
  format: 'online' | 'in-person' | 'hybrid';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
  currency: string;
  location?: string;
  maxStudents: number;
  currentStudents: number;
  rating: number;
  totalReviews: number;
  description: string;
  curriculum: string[];
  materials: string[];
  requirements: string[];
  thumbnail: string;
  schedule: {
    startDate: string;
    endDate: string;
    sessions: { day: string; time: string }[];
  };
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
  isOwner?: boolean;
  userId?: string;
  enrollments?: number;
  earnings?: number;
}

export interface EducationFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  format?: string;
  level?: string;
}

export interface EducationDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified education data - single source of truth
const baseEducationData: EducationListing[] = [
  {
    id: 'course1',
    title: 'Digital Photography Masterclass',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    category: 'Photography',
    subcategory: 'Digital Photography',
    format: 'online',
    level: 'intermediate',
    duration: '8 weeks',
    price: 299,
    currency: 'USD',
    maxStudents: 25,
    currentStudents: 18,
    rating: 4.8,
    totalReviews: 42,
    description: 'Comprehensive course covering advanced digital photography techniques, composition, and post-processing.',
    curriculum: [
      'Camera Settings and Manual Mode',
      'Composition and Lighting',
      'Portrait Photography',
      'Landscape Photography',
      'Post-Processing in Lightroom',
      'Portfolio Development',
    ],
    materials: ['Camera (DSLR or Mirrorless)', 'Adobe Lightroom', 'Tripod (recommended)'],
    requirements: ['Basic photography knowledge', 'Own camera equipment'],
    thumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    schedule: {
      startDate: '2024-02-01',
      endDate: '2024-03-28',
      sessions: [
        { day: 'Tuesday', time: '7:00 PM' },
        { day: 'Thursday', time: '7:00 PM' },
      ],
    },
    userId: 'user1',
    status: 'active',
    enrollments: 18,
    earnings: 5382,
  },
  {
    id: 'course2',
    title: 'Character Design for Animation',
    instructor: 'Marcus Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    category: 'Digital Art',
    subcategory: 'Character Design',
    format: 'hybrid',
    level: 'beginner',
    duration: '6 weeks',
    price: 249,
    currency: 'USD',
    location: 'Los Angeles, CA',
    maxStudents: 15,
    currentStudents: 12,
    rating: 4.9,
    totalReviews: 28,
    description: 'Learn the fundamentals of character design for animation, from concept to final render.',
    curriculum: [
      'Character Anatomy Basics',
      'Shape Language and Silhouettes',
      'Color Theory for Characters',
      'Digital Painting Techniques',
      'Character Sheets and Turnarounds',
      'Animation-Ready Design',
    ],
    materials: ['Drawing tablet', 'Procreate or Photoshop', 'Sketchbook'],
    requirements: ['Basic drawing skills', 'Digital art software'],
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    schedule: {
      startDate: '2024-02-15',
      endDate: '2024-03-29',
      sessions: [
        { day: 'Saturday', time: '10:00 AM' },
      ],
    },
    userId: 'user2',
    status: 'active',
    enrollments: 12,
    earnings: 2988,
  },
  {
    id: 'course3',
    title: 'Music Production Fundamentals',
    instructor: 'Elena Rodriguez',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    category: 'Music',
    subcategory: 'Production',
    format: 'in-person',
    level: 'beginner',
    duration: '10 weeks',
    price: 399,
    currency: 'USD',
    location: 'Nashville, TN',
    maxStudents: 12,
    currentStudents: 8,
    rating: 4.7,
    totalReviews: 35,
    description: 'Complete introduction to music production using professional DAW software and studio equipment.',
    curriculum: [
      'DAW Basics (Pro Tools/Logic)',
      'Recording Techniques',
      'MIDI and Virtual Instruments',
      'Mixing Fundamentals',
      'EQ and Compression',
      'Mastering Basics',
      'Song Arrangement',
      'Final Project',
    ],
    materials: ['Headphones', 'USB Drive', 'Notebook'],
    requirements: ['Basic computer skills', 'Musical interest (no prior experience needed)'],
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    schedule: {
      startDate: '2024-02-05',
      endDate: '2024-04-15',
      sessions: [
        { day: 'Monday', time: '6:00 PM' },
        { day: 'Wednesday', time: '6:00 PM' },
      ],
    },
    userId: 'user3',
    status: 'active',
    enrollments: 8,
    earnings: 3192,
  },
];

export const useEducationData = () => {
  const fetchEducationListings = async (
    filters: Partial<EducationFilters> = {},
    context: EducationDataContext = { context: 'public' }
  ): Promise<EducationListing[]> => {
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
      if (filters.format) params.append('format', filters.format);
      if (filters.level) params.append('level', filters.level);
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/education?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.courses && data.courses.length > 0) {
          return processFilteredData(data.courses, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading education listings from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for education listings');
    return processFilteredData([...baseEducationData], filters, context);
  };

  const processFilteredData = (
    data: EducationListing[],
    filters: Partial<EducationFilters>,
    context: EducationDataContext
  ): EducationListing[] => {
    let processedData = data.map(course => ({
      ...course,
      isOwner: context.userId ? course.userId === context.userId : false,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-courses':
          processedData = processedData.filter(course => course.isOwner);
          break;
        case 'active':
          processedData = processedData.filter(course => course.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(course => course.status === 'pending');
          break;
        case 'completed':
          processedData = processedData.filter(course => course.status === 'completed');
          break;
        case 'all-courses':
        default:
          // Show all for 'all-courses' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(course =>
        course.title.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(course =>
        filters.category!.some(category =>
          course.category.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (filters.location && filters.location !== 'all' && filters.location !== 'online') {
      processedData = processedData.filter(course =>
        course.location && course.location.includes(filters.location!)
      );
    } else if (filters.location === 'online') {
      processedData = processedData.filter(course =>
        course.format === 'online'
      );
    }

    if (filters.format && filters.format !== 'all') {
      processedData = processedData.filter(course =>
        course.format === filters.format
      );
    }

    if (filters.level && filters.level !== 'all') {
      processedData = processedData.filter(course =>
        course.level === filters.level
      );
    }

    if (filters.priceRange) {
      processedData = processedData.filter(course =>
        course.price >= filters.priceRange![0] &&
        course.price <= filters.priceRange![1]
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(course =>
        (course.rating || 0) >= filters.minRating!
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        processedData.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        processedData.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        processedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popularity':
        processedData.sort((a, b) => b.currentStudents - a.currentStudents);
        break;
      case 'start-date':
        processedData.sort((a, b) => new Date(a.schedule.startDate).getTime() - new Date(b.schedule.startDate).getTime());
        break;
      case 'newest':
      default:
        processedData.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return processedData;
  };

  return {
    fetchEducationListings,
  };
};

// Filter configuration for education
export const educationFilterConfig = {
  categories: [
    { value: 'photography', label: 'Photography', icon: null },
    { value: 'digital-art', label: 'Digital Art', icon: null },
    { value: 'music', label: 'Music', icon: null },
    { value: 'video', label: 'Video Production', icon: null },
    { value: 'design', label: 'Graphic Design', icon: null },
    { value: 'writing', label: 'Creative Writing', icon: null },
  ],
  locations: [
    { value: 'online', label: 'Online' },
    { value: 'New York', label: 'New York, NY' },
    { value: 'Los Angeles', label: 'Los Angeles, CA' },
    { value: 'Nashville', label: 'Nashville, TN' },
    { value: 'Austin', label: 'Austin, TX' },
    { value: 'Chicago', label: 'Chicago, IL' },
  ],
  priceRange: { min: 0, max: 1000 },
  availability: false,
  rating: true,
  customFilters: [
    {
      name: 'format',
      type: 'select',
      options: [
        { value: 'online', label: 'Online' },
        { value: 'in-person', label: 'In-Person' },
        { value: 'hybrid', label: 'Hybrid' },
      ],
    },
    {
      name: 'level',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ],
    },
  ],
  moduleType: 'education',
};

