import { projectId, publicAnonKey } from '@/utils/supabase/info';

export interface ProductService {
  id: string;
  title: string;
  vendor: string;
  vendorAvatar: string;
  category: string;
  subcategory: string;
  type: 'product' | 'service';
  price: number;
  currency: string;
  location?: string;
  description: string;
  features: string[];
  images: string[];
  rating: number;
  totalReviews: number;
  deliveryTime?: string;
  availability: 'Available' | 'Limited' | 'Out of Stock';
  tags: string[];
  specifications?: { [key: string]: string };
  policies: string[];
  status?: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  userId?: string;
  sales?: number;
  earnings?: number;
}

export interface ProductFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  type?: string;
}

export interface ProductDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified product/service data - single source of truth
const baseProductData: ProductService[] = [
  {
    id: 'product1',
    title: 'Professional Photo Editing Service',
    vendor: 'Sarah Johnson',
    vendorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    category: 'Photo Editing',
    subcategory: 'Retouching',
    type: 'service',
    price: 25,
    currency: 'USD',
    description: 'Professional photo retouching and editing service for portraits, events, and commercial photography.',
    features: [
      'Color correction and grading',
      'Skin retouching and blemish removal',
      'Background removal/replacement',
      'Exposure and lighting adjustments',
      '24-48 hour turnaround',
    ],
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop',
    ],
    rating: 4.9,
    totalReviews: 156,
    deliveryTime: '24-48 hours',
    availability: 'Available',
    tags: ['photo editing', 'retouching', 'professional', 'fast delivery'],
    policies: ['Unlimited revisions', 'Money-back guarantee', 'High resolution delivery'],
    userId: 'user1',
    status: 'active',
    sales: 234,
    earnings: 5850,
  },
  {
    id: 'product2',
    title: 'Digital Art Print Collection',
    vendor: 'Marcus Chen',
    vendorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    category: 'Digital Art',
    subcategory: 'Prints',
    type: 'product',
    price: 35,
    currency: 'USD',
    location: 'Los Angeles, CA',
    description: 'High-quality digital art prints featuring abstract and contemporary designs. Perfect for home or office decoration.',
    features: [
      'Premium archival paper',
      'Fade-resistant inks',
      'Multiple size options',
      'Ready to frame',
      'Limited edition series',
    ],
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    ],
    rating: 4.8,
    totalReviews: 89,
    deliveryTime: '3-5 business days',
    availability: 'Available',
    tags: ['digital art', 'prints', 'wall art', 'contemporary'],
    specifications: {
      'Paper Type': 'Archival Matte',
      'Print Sizes': '8x10, 11x14, 16x20, 24x36',
      'Ink Type': 'Pigment-based',
      'Frame': 'Not included',
    },
    policies: ['30-day return policy', 'Careful packaging', 'Tracked shipping'],
    userId: 'user2',
    status: 'active',
    sales: 145,
    earnings: 5075,
  },
  {
    id: 'product3',
    title: 'Custom Logo Design Package',
    vendor: 'Elena Rodriguez',
    vendorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    category: 'Graphic Design',
    subcategory: 'Logo Design',
    type: 'service',
    price: 150,
    currency: 'USD',
    description: 'Complete logo design package including initial concepts, revisions, and final files in multiple formats.',
    features: [
      '3 initial concept designs',
      'Unlimited revisions',
      'Vector and raster files',
      'Brand guideline document',
      'Commercial usage rights',
    ],
    images: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&h=300&fit=crop',
    ],
    rating: 4.7,
    totalReviews: 67,
    deliveryTime: '5-7 business days',
    availability: 'Limited',
    tags: ['logo design', 'branding', 'custom design', 'professional'],
    policies: ['Copyright transfer included', 'Source files provided', 'Rush delivery available'],
    userId: 'user3',
    status: 'active',
    sales: 78,
    earnings: 11700,
  },
  {
    id: 'product4',
    title: 'Photography Equipment Rental',
    vendor: 'David Kim',
    vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    category: 'Equipment',
    subcategory: 'Camera Gear',
    type: 'service',
    price: 75,
    currency: 'USD',
    location: 'New York, NY',
    description: 'Professional camera and lighting equipment rental for photographers and videographers.',
    features: [
      'DSLR and mirrorless cameras',
      'Professional lenses',
      'Lighting equipment',
      'Tripods and stabilizers',
      'Insurance included',
    ],
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    ],
    rating: 4.6,
    totalReviews: 124,
    deliveryTime: 'Same day pickup',
    availability: 'Available',
    tags: ['equipment rental', 'photography', 'professional gear', 'insured'],
    specifications: {
      'Rental Period': 'Daily, Weekly, Monthly',
      'Pickup Location': 'Manhattan Studio',
      'Delivery': 'Available for additional fee',
      'Insurance': 'Included in rental price',
    },
    policies: ['Damage deposit required', 'Professional use only', '24/7 support'],
    userId: 'user4',
    status: 'active',
    sales: 198,
    earnings: 14850,
  },
];

export const useProductData = () => {
  const fetchProductServices = async (
    filters: Partial<ProductFilters> = {},
    context: ProductDataContext = { context: 'public' }
  ): Promise<ProductService[]> => {
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
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/products?${params}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          return processFilteredData(data.products, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading products/services from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for products/services');
    return processFilteredData([...baseProductData], filters, context);
  };

  const processFilteredData = (
    data: ProductService[],
    filters: Partial<ProductFilters>,
    context: ProductDataContext
  ): ProductService[] => {
    let processedData = data.map(product => ({
      ...product,
      isOwner: context.userId ? product.userId === context.userId : false,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-listings':
          processedData = processedData.filter(product => product.isOwner);
          break;
        case 'products':
          processedData = processedData.filter(product => product.type === 'product');
          break;
        case 'services':
          processedData = processedData.filter(product => product.type === 'service');
          break;
        case 'active':
          processedData = processedData.filter(product => product.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(product => product.status === 'pending');
          break;
        case 'all-listings':
        default:
          // Show all for 'all-listings' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(product =>
        product.title.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(product =>
        filters.category!.some(category =>
          product.category.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      processedData = processedData.filter(product =>
        product.location && product.location.includes(filters.location!)
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      processedData = processedData.filter(product =>
        product.availability.toLowerCase() === filters.availability!.toLowerCase()
      );
    }

    if (filters.type && filters.type !== 'all') {
      processedData = processedData.filter(product =>
        product.type === filters.type
      );
    }

    if (filters.priceRange) {
      processedData = processedData.filter(product =>
        product.price >= filters.priceRange![0] &&
        product.price <= filters.priceRange![1]
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(product =>
        (product.rating || 0) >= filters.minRating!
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
      case 'popular':
        processedData.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case 'newest':
      default:
        processedData.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return processedData;
  };

  return {
    fetchProductServices,
  };
};

// Filter configuration for products/services
export const productFilterConfig = {
  categories: [
    { value: 'photo-editing', label: 'Photo Editing', icon: null },
    { value: 'digital-art', label: 'Digital Art', icon: null },
    { value: 'graphic-design', label: 'Graphic Design', icon: null },
    { value: 'equipment', label: 'Equipment', icon: null },
    { value: 'software', label: 'Software', icon: null },
    { value: 'consulting', label: 'Consulting', icon: null },
  ],
  locations: [
    { value: 'New York', label: 'New York, NY' },
    { value: 'Los Angeles', label: 'Los Angeles, CA' },
    { value: 'Austin', label: 'Austin, TX' },
    { value: 'Chicago', label: 'Chicago, IL' },
    { value: 'San Francisco', label: 'San Francisco, CA' },
    { value: 'Remote', label: 'Remote/Digital' },
  ],
  priceRange: { min: 0, max: 500 },
  availability: true,
  rating: true,
  customFilters: [
    {
      name: 'type',
      type: 'select',
      options: [
        { value: 'product', label: 'Products' },
        { value: 'service', label: 'Services' },
      ],
    },
  ],
  moduleType: 'products',
};

