import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export interface LegalService {
  id: string;
  name: string;
  firm: string;
  specialization: string[];
  location: string;
  avatar: string;
  hourlyRate: number;
  experience: string;
  education: string[];
  barAdmissions: string[];
  languages: string[];
  rating: number;
  totalReviews: number;
  totalCases: number;
  successRate: number;
  responseTime: string;
  description: string;
  services: string[];
  availability: 'Available' | 'Busy' | 'Unavailable';
  status?: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  userId?: string;
  caseLoad?: number;
  earnings?: number;
}

export interface LegalFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  specialization?: string[];
}

export interface LegalDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified legal data - single source of truth
const baseLegalData: LegalService[] = [
  {
    id: 'legal1',
    name: 'Sarah Mitchell',
    firm: 'Creative Rights Law',
    specialization: ['Intellectual Property', 'Copyright Law', 'Artist Rights'],
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    hourlyRate: 350,
    experience: '12 years',
    education: ['Harvard Law School', 'Yale University (Art History)'],
    barAdmissions: ['New York', 'California'],
    languages: ['English', 'Spanish'],
    rating: 4.9,
    totalReviews: 67,
    totalCases: 245,
    successRate: 94,
    responseTime: '2 hours',
    description: 'Specializing in protecting artists rights and intellectual property. Extensive experience with copyright, trademark, and licensing agreements.',
    services: [
      'Copyright Registration',
      'Trademark Filing',
      'Licensing Agreements',
      'Contract Review',
      'DMCA Takedowns',
      'Gallery Agreements',
    ],
    availability: 'Available',
    userId: 'user1',
    status: 'active',
    caseLoad: 15,
    earnings: 89600,
  },
  {
    id: 'legal2',
    name: 'Marcus Thompson',
    firm: 'Entertainment Law Partners',
    specialization: ['Entertainment Law', 'Music Law', 'Media Rights'],
    location: 'Los Angeles, CA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    hourlyRate: 425,
    experience: '15 years',
    education: ['UCLA Law', 'Berkeley (Music Business)'],
    barAdmissions: ['California', 'New York'],
    languages: ['English'],
    rating: 4.8,
    totalReviews: 89,
    totalCases: 389,
    successRate: 92,
    responseTime: '4 hours',
    description: 'Entertainment attorney with deep experience in music, film, and digital media. Representing artists, producers, and content creators.',
    services: [
      'Record Label Contracts',
      'Publishing Agreements',
      'Film/TV Licensing',
      'Artist Management Contracts',
      'Distribution Deals',
      'Royalty Disputes',
    ],
    availability: 'Busy',
    userId: 'user2',
    status: 'active',
    caseLoad: 22,
    earnings: 156800,
  },
  {
    id: 'legal3',
    name: 'Elena Rodriguez',
    firm: 'Digital Arts Legal',
    specialization: ['Digital Rights', 'NFT Law', 'Blockchain Legal'],
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    hourlyRate: 300,
    experience: '8 years',
    education: ['Stanford Law School', 'MIT (Computer Science)'],
    barAdmissions: ['Texas', 'Delaware'],
    languages: ['English', 'Portuguese'],
    rating: 4.7,
    totalReviews: 43,
    totalCases: 156,
    successRate: 96,
    responseTime: '1 hour',
    description: 'Technology-focused attorney specializing in emerging digital art technologies, NFTs, and blockchain legal issues.',
    services: [
      'NFT Legal Framework',
      'Smart Contract Review',
      'Platform Terms of Service',
      'GDPR Compliance',
      'Digital Asset Protection',
      'DAO Legal Structure',
    ],
    availability: 'Available',
    userId: 'user3',
    status: 'active',
    caseLoad: 12,
    earnings: 67200,
  },
];

export const useLegalData = () => {
  const fetchLegalServices = async (
    filters: Partial<LegalFilters> = {},
    context: LegalDataContext = { context: 'public' }
  ): Promise<LegalService[]> => {
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
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/legal?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.lawyers && data.lawyers.length > 0) {
          return processFilteredData(data.lawyers, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading legal services from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for legal services');
    return processFilteredData([...baseLegalData], filters, context);
  };

  const processFilteredData = (
    data: LegalService[],
    filters: Partial<LegalFilters>,
    context: LegalDataContext
  ): LegalService[] => {
    let processedData = data.map(lawyer => ({
      ...lawyer,
      isOwner: context.userId ? lawyer.userId === context.userId : false,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-profile':
        case 'my-profiles':
          processedData = processedData.filter(lawyer => lawyer.isOwner);
          break;
        case 'active':
          processedData = processedData.filter(lawyer => lawyer.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(lawyer => lawyer.status === 'pending');
          break;
        case 'all-lawyers':
        default:
          // Show all for 'all-lawyers' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(lawyer =>
        lawyer.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        lawyer.description.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        lawyer.specialization.some(spec => spec.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(lawyer =>
        filters.category!.some(category =>
          lawyer.specialization.some(spec => spec.toLowerCase().includes(category.toLowerCase()))
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      processedData = processedData.filter(lawyer =>
        lawyer.location.includes(filters.location!)
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      processedData = processedData.filter(lawyer =>
        lawyer.availability.toLowerCase() === filters.availability!.toLowerCase()
      );
    }

    if (filters.priceRange) {
      processedData = processedData.filter(lawyer =>
        lawyer.hourlyRate >= filters.priceRange![0] &&
        lawyer.hourlyRate <= filters.priceRange![1]
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(lawyer =>
        (lawyer.rating || 0) >= filters.minRating!
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
        processedData.sort((a, b) => {
          const aYears = parseInt(a.experience.split(' ')[0]) || 0;
          const bYears = parseInt(b.experience.split(' ')[0]) || 0;
          return bYears - aYears;
        });
        break;
      case 'success-rate':
        processedData.sort((a, b) => b.successRate - a.successRate);
        break;
      case 'newest':
      default:
        processedData.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return processedData;
  };

  return {
    fetchLegalServices,
  };
};

// Filter configuration for legal services
export const legalFilterConfig = {
  categories: [
    { value: 'intellectual-property', label: 'Intellectual Property', icon: null },
    { value: 'entertainment', label: 'Entertainment Law', icon: null },
    { value: 'digital-rights', label: 'Digital Rights', icon: null },
    { value: 'contract', label: 'Contract Law', icon: null },
    { value: 'business', label: 'Business Law', icon: null },
    { value: 'employment', label: 'Employment Law', icon: null },
  ],
  locations: [
    { value: 'New York', label: 'New York, NY' },
    { value: 'Los Angeles', label: 'Los Angeles, CA' },
    { value: 'Austin', label: 'Austin, TX' },
    { value: 'Chicago', label: 'Chicago, IL' },
    { value: 'San Francisco', label: 'San Francisco, CA' },
    { value: 'Nashville', label: 'Nashville, TN' },
  ],
  priceRange: { min: 200, max: 800 },
  availability: true,
  rating: true,
  customFilters: [
    {
      name: 'experience',
      type: 'select',
      options: [
        { value: '0-5', label: '0-5 years' },
        { value: '6-10', label: '6-10 years' },
        { value: '11-15', label: '11-15 years' },
        { value: '15+', label: '15+ years' },
      ],
    },
  ],
  moduleType: 'legal',
};

