import { projectId, publicAnonKey } from '../../utils/supabase/info';

export interface Asset {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  tags: string[];
  artist: {
    id: string;
    name: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  status?: 'active' | 'pending' | 'sold' | 'expired';
  sales?: number;
  revenue?: number;
}

export interface MarketplaceStats {
  totalAssets: number;
  totalArtists: number;
  totalSales: number;
  averagePrice: number;
}

export const fetchMarketplaceAssets = async (
  filters?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    sortBy?: string;
  },
  isAdminView = false,
  userId?: string
): Promise<Asset[]> => {
  // For now, return mock data immediately to avoid API errors
  // TODO: Enable API calls when backend is implemented
  console.log('Using mock data for marketplace assets');
  
  let filteredAssets = [...mockAssets];
  
  // Apply client-side filtering
  if (filters) {
    if (filters.search) {
      filteredAssets = filteredAssets.filter(asset =>
        asset.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        asset.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(filters.search!.toLowerCase()))
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredAssets = filteredAssets.filter(asset =>
        asset.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    if (filters.minPrice !== undefined) {
      filteredAssets = filteredAssets.filter(asset => asset.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredAssets = filteredAssets.filter(asset => asset.price <= filters.maxPrice!);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredAssets = filteredAssets.filter(asset =>
        filters.tags!.some(tag => asset.tags.includes(tag))
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filteredAssets.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredAssets.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filteredAssets.sort((a, b) => b.views - a.views);
        break;
      case 'oldest':
        filteredAssets.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
      default:
        filteredAssets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }
  
  return filteredAssets;
};

export const fetchMarketplaceStats = async (): Promise<MarketplaceStats> => {
  // For now, return mock data immediately to avoid API errors
  // TODO: Enable API calls when backend is implemented
  console.log('Using mock data for marketplace stats');
  return mockStats;
};

// Mock data for fallback
const mockAssets: Asset[] = [
  {
    id: '1',
    title: 'Abstract Digital Composition',
    description: 'A vibrant abstract piece exploring digital art techniques with bold colors and geometric forms.',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    category: 'Digital Art',
    tags: ['abstract', 'digital', 'colorful', 'modern'],
    artist: {
      id: 'artist1',
      name: 'Elena Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    views: 1240,
    likes: 89,
    createdAt: '2024-01-15T10:30:00Z',
    status: 'active',
    sales: 5,
    revenue: 1495,
  },
  {
    id: '2',
    title: 'Urban Photography Series',
    description: 'A collection of street photography capturing the essence of modern city life.',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    category: 'Photography',
    tags: ['urban', 'street', 'black-white', 'documentary'],
    artist: {
      id: 'artist2',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    views: 856,
    likes: 67,
    createdAt: '2024-01-12T14:15:00Z',
    status: 'active',
    sales: 3,
    revenue: 1350,
  },
  {
    id: '3',
    title: 'Minimalist Logo Pack',
    description: 'Clean and modern logo designs perfect for contemporary branding projects.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    category: 'Design',
    tags: ['logo', 'minimalist', 'branding', 'clean'],
    artist: {
      id: 'artist3',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    views: 2100,
    likes: 156,
    createdAt: '2024-01-10T09:45:00Z',
    status: 'active',
    sales: 12,
    revenue: 1800,
  },
  {
    id: '4',
    title: 'Nature Illustration Set',
    description: 'Hand-drawn botanical illustrations featuring various plants and flowers.',
    price: 199,
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    category: 'Illustration',
    tags: ['nature', 'botanical', 'hand-drawn', 'organic'],
    artist: {
      id: 'artist4',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    views: 945,
    likes: 78,
    createdAt: '2024-01-08T16:20:00Z',
    status: 'active',
    sales: 8,
    revenue: 1592,
  },
  {
    id: '5',
    title: '3D Character Models',
    description: 'Professional 3D character models ready for animation and gaming projects.',
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    category: '3D Art',
    tags: ['3d', 'character', 'animation', 'gaming'],
    artist: {
      id: 'artist5',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    views: 678,
    likes: 45,
    createdAt: '2024-01-05T11:10:00Z',
    status: 'active',
    sales: 2,
    revenue: 1500,
  },
  {
    id: '6',
    title: 'Watercolor Landscapes',
    description: 'Beautiful watercolor paintings of serene landscapes and natural scenery.',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'Painting',
    tags: ['watercolor', 'landscape', 'traditional', 'serene'],
    artist: {
      id: 'artist6',
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    },
    views: 1350,
    likes: 103,
    createdAt: '2024-01-03T13:55:00Z',
    status: 'active',
    sales: 6,
    revenue: 2280,
  },
];

const mockStats: MarketplaceStats = {
  totalAssets: 1250,
  totalArtists: 342,
  totalSales: 2890,
  averagePrice: 325,
};

export const mockCategories = [
  'Digital Art',
  'Photography',
  'Design',
  'Illustration',
  '3D Art',
  'Painting',
  'Animation',
  'Typography',
  'Icons',
  'Templates',
];

export const mockTags = [
  'abstract',
  'digital',
  'colorful',
  'modern',
  'urban',
  'street',
  'black-white',
  'documentary',
  'logo',
  'minimalist',
  'branding',
  'clean',
  'nature',
  'botanical',
  'hand-drawn',
  'organic',
  '3d',
  'character',
  'animation',
  'gaming',
  'watercolor',
  'landscape',
  'traditional',
  'serene',
];

