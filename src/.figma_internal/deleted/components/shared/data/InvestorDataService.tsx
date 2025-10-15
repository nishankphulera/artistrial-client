import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export interface InvestorProfile {
  id: string;
  name: string;
  type: string;
  focus: string[];
  location: string;
  avatar: string;
  minimumInvestment: number;
  maximumInvestment: number;
  investmentStage: string[];
  portfolio: string[];
  bio: string;
  experience: string;
  totalInvestments: number;
  successfulExits: number;
  responseTime: string;
  investmentCount?: number;
  status?: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  userId?: string;
  rating?: number;
  totalReviews?: number;
}

export interface InvestorFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  investmentStage?: string[];
}

export interface InvestorDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified investor data - single source of truth
const baseInvestorData: InvestorProfile[] = [
  {
    id: 'investor1',
    name: 'Sarah Chen',
    type: 'Angel Investor',
    focus: ['Digital Art', 'NFTs', 'Art Tech'],
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    minimumInvestment: 10000,
    maximumInvestment: 100000,
    investmentStage: ['Seed', 'Series A'],
    portfolio: ['ArtBlock', 'CreativeDAO', 'PixelCraft'],
    bio: 'Former tech executive turned art investor. Passionate about the intersection of technology and creativity.',
    experience: '8 years',
    totalInvestments: 45,
    successfulExits: 12,
    responseTime: '24 hours',
    userId: 'user1',
    status: 'active',
    investmentCount: 45,
    rating: 4.8,
    totalReviews: 23,
  },
  {
    id: 'investor2',
    name: 'Marcus Williams',
    type: 'Venture Capital',
    focus: ['Music Tech', 'Audio Innovation', 'Creator Economy'],
    location: 'Nashville, TN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    minimumInvestment: 50000,
    maximumInvestment: 500000,
    investmentStage: ['Series A', 'Series B'],
    portfolio: ['SoundWave', 'MusicDAO', 'CreatorSpace'],
    bio: 'Music industry veteran with extensive experience in artist development and music technology.',
    experience: '12 years',
    totalInvestments: 67,
    successfulExits: 18,
    responseTime: '48 hours',
    userId: 'user2',
    status: 'active',
    investmentCount: 67,
    rating: 4.7,
    totalReviews: 34,
  },
  {
    id: 'investor3',
    name: 'Elena Rodriguez',
    type: 'Art Fund',
    focus: ['Traditional Art', 'Photography', 'Collectibles'],
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    minimumInvestment: 25000,
    maximumInvestment: 250000,
    investmentStage: ['Growth', 'Late Stage'],
    portfolio: ['GallerySpace', 'ArtMarket', 'CollectiveArt'],
    bio: 'Art curator and investment advisor specializing in emerging artists and traditional art markets.',
    experience: '15 years',
    totalInvestments: 89,
    successfulExits: 25,
    responseTime: '12 hours',
    userId: 'user3',
    status: 'active',
    investmentCount: 89,
    rating: 4.9,
    totalReviews: 45,
  },
];

export const useInvestorData = () => {
  const fetchInvestorProfiles = async (
    filters: Partial<InvestorFilters> = {},
    context: InvestorDataContext = { context: 'public' }
  ): Promise<InvestorProfile[]> => {
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
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/investors?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.investors && data.investors.length > 0) {
          return processFilteredData(data.investors, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading investors from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for investor profiles');
    return processFilteredData([...baseInvestorData], filters, context);
  };

  const processFilteredData = (
    data: InvestorProfile[],
    filters: Partial<InvestorFilters>,
    context: InvestorDataContext
  ): InvestorProfile[] => {
    let processedData = data.map(investor => ({
      ...investor,
      isOwner: context.userId ? investor.userId === context.userId : false,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-profile':
        case 'my-profiles':
          processedData = processedData.filter(investor => investor.isOwner);
          break;
        case 'active':
          processedData = processedData.filter(investor => investor.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(investor => investor.status === 'pending');
          break;
        case 'all-investors':
        default:
          // Show all for 'all-investors' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(investor =>
        investor.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        investor.bio.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        investor.focus.some(focus => focus.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(investor =>
        filters.category!.some(category =>
          investor.focus.some(focus => focus.toLowerCase().includes(category.toLowerCase()))
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      processedData = processedData.filter(investor =>
        investor.location.includes(filters.location!)
      );
    }

    if (filters.priceRange) {
      processedData = processedData.filter(investor =>
        investor.minimumInvestment >= filters.priceRange![0] &&
        investor.minimumInvestment <= filters.priceRange![1]
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(investor =>
        (investor.rating || 0) >= filters.minRating!
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'investment-low':
        processedData.sort((a, b) => a.minimumInvestment - b.minimumInvestment);
        break;
      case 'investment-high':
        processedData.sort((a, b) => b.minimumInvestment - a.minimumInvestment);
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
      case 'newest':
      default:
        processedData.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return processedData;
  };

  return {
    fetchInvestorProfiles,
  };
};

// Filter configuration for investors
export const investorFilterConfig = {
  categories: [
    { value: 'angel', label: 'Angel Investors', icon: null },
    { value: 'vc', label: 'Venture Capital', icon: null },
    { value: 'artfund', label: 'Art Funds', icon: null },
    { value: 'private', label: 'Private Equity', icon: null },
    { value: 'grant', label: 'Grant Providers', icon: null },
  ],
  locations: [
    { value: 'San Francisco', label: 'San Francisco, CA' },
    { value: 'New York', label: 'New York, NY' },
    { value: 'Los Angeles', label: 'Los Angeles, CA' },
    { value: 'Austin', label: 'Austin, TX' },
    { value: 'Nashville', label: 'Nashville, TN' },
    { value: 'Chicago', label: 'Chicago, IL' },
  ],
  priceRange: { min: 1000, max: 1000000 },
  availability: false,
  rating: true,
  customFilters: [
    {
      name: 'investmentStage',
      type: 'multiselect',
      options: [
        { value: 'pre-seed', label: 'Pre-Seed' },
        { value: 'seed', label: 'Seed' },
        { value: 'series-a', label: 'Series A' },
        { value: 'series-b', label: 'Series B' },
        { value: 'growth', label: 'Growth' },
        { value: 'late-stage', label: 'Late Stage' },
      ],
    },
  ],
  moduleType: 'investors',
};

