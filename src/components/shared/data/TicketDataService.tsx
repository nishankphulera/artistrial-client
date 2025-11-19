import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { apiUrl } from '@/utils/api';

export interface TicketListing {
  id: string;
  title: string;
  organizer: string;
  organizerAvatar: string;
  category: string;
  subcategory: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  location: string;
  price: number;
  currency: string;
  totalTickets: number;
  availableTickets: number;
  description: string;
  features: string[];
  images: string[];
  rating?: number;
  totalReviews?: number;
  tags: string[];
  ageRestriction?: string;
  dresscode?: string;
  policies: string[];
  status?: 'active' | 'pending' | 'sold-out' | 'cancelled';
  isOwner?: boolean;
  userId?: string;
  sales?: number;
  earnings?: number;
}

export interface TicketFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
  dateRange?: { start: string; end: string };
}

export interface TicketDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

// Unified ticket data - single source of truth
const baseTicketData: TicketListing[] = [
  {
    id: 'ticket1',
    title: 'Digital Art Exhibition Opening',
    organizer: 'Sarah Johnson',
    organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    category: 'Art Exhibition',
    subcategory: 'Digital Art',
    eventDate: '2024-03-15',
    eventTime: '19:00',
    venue: 'Modern Art Gallery',
    location: 'New York, NY',
    price: 25,
    currency: 'USD',
    totalTickets: 150,
    availableTickets: 89,
    description: 'Join us for the opening night of our revolutionary digital art exhibition featuring works from emerging artists.',
    features: [
      'Opening night reception',
      'Artist meet & greet',
      'Complimentary drinks',
      'Exclusive preview access',
      'Digital catalog included',
    ],
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    ],
    rating: 4.8,
    totalReviews: 67,
    tags: ['digital art', 'exhibition', 'opening night', 'networking'],
    ageRestriction: '18+',
    dresscode: 'Smart casual',
    policies: ['No refunds 48 hours before event', 'Valid ID required', 'No outside food or drinks'],
    userId: 'user1',
    status: 'active',
    sales: 61,
    earnings: 1525,
  },
  {
    id: 'ticket2',
    title: 'Music Production Workshop',
    organizer: 'Marcus Chen',
    organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    category: 'Workshop',
    subcategory: 'Music Production',
    eventDate: '2024-03-22',
    eventTime: '14:00',
    venue: 'SoundWave Studios',
    location: 'Los Angeles, CA',
    price: 75,
    currency: 'USD',
    totalTickets: 25,
    availableTickets: 8,
    description: 'Hands-on music production workshop covering beat making, mixing, and mastering techniques.',
    features: [
      '4-hour intensive workshop',
      'Professional studio access',
      'Individual workstation',
      'Take home your tracks',
      'Industry networking',
    ],
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop',
    ],
    rating: 4.9,
    totalReviews: 34,
    tags: ['music production', 'workshop', 'hands-on', 'studio access'],
    ageRestriction: 'All ages',
    policies: ['Materials provided', 'Bring headphones', 'Recording allowed'],
    userId: 'user2',
    status: 'active',
    sales: 17,
    earnings: 1275,
  },
  {
    id: 'ticket3',
    title: 'Photography Portfolio Review',
    organizer: 'Elena Rodriguez',
    organizerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    category: 'Professional Development',
    subcategory: 'Portfolio Review',
    eventDate: '2024-03-28',
    eventTime: '10:00',
    venue: 'Creative Hub Austin',
    location: 'Austin, TX',
    price: 45,
    currency: 'USD',
    totalTickets: 20,
    availableTickets: 12,
    description: 'Get professional feedback on your photography portfolio from industry experts and established photographers.',
    features: [
      'One-on-one review sessions',
      'Industry professional feedback',
      'Portfolio improvement tips',
      'Networking opportunities',
      'Follow-up recommendations',
    ],
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop',
    ],
    rating: 4.7,
    totalReviews: 23,
    tags: ['photography', 'portfolio review', 'professional development', 'feedback'],
    ageRestriction: 'All ages',
    policies: ['Bring printed portfolio', '30-minute sessions', 'Digital portfolio backup recommended'],
    userId: 'user3',
    status: 'active',
    sales: 8,
    earnings: 360,
  },
  {
    id: 'ticket4',
    title: 'Art Business Networking Event',
    organizer: 'David Kim',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    category: 'Networking',
    subcategory: 'Business Development',
    eventDate: '2024-04-05',
    eventTime: '18:30',
    venue: 'Gallery District',
    location: 'Chicago, IL',
    price: 35,
    currency: 'USD',
    totalTickets: 100,
    availableTickets: 67,
    description: 'Connect with art collectors, gallery owners, and fellow artists in this exclusive networking event.',
    features: [
      'Curated guest list',
      'Gallery showcase',
      'Industry speakers',
      'Cocktail reception',
      'Business card exchange',
    ],
    images: [
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&h=300&fit=crop',
    ],
    rating: 4.6,
    totalReviews: 89,
    tags: ['networking', 'art business', 'collectors', 'gallery'],
    ageRestriction: '21+',
    dresscode: 'Business casual',
    policies: ['RSVP required', 'Professional attire recommended', 'Business cards encouraged'],
    userId: 'user4',
    status: 'active',
    sales: 33,
    earnings: 1155,
  },
];

export const useTicketData = () => {
  const fetchTicketListings = async (
    filters: Partial<TicketFilters> = {},
    context: TicketDataContext = { context: 'public' }
  ): Promise<TicketListing[]> => {
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
        `${apiUrl('tickets')}?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          return processFilteredData(data.data, filters, context);
        }
      }
    } catch (error) {
      console.error('Error loading ticket listings from API:', error);
    }

    // Fallback to mock data
    console.log('Using mock data for ticket listings');
    return processFilteredData([...baseTicketData], filters, context);
  };

  const processFilteredData = (
    data: any[],
    filters: Partial<TicketFilters>,
    context: TicketDataContext
  ): TicketListing[] => {
    let processedData = data.map((ticket: any) => ({
      id: ticket.id?.toString() || '',
      title: ticket.title || '',
      organizer: ticket.organizer || ticket.display_name || ticket.username || '',
      organizerAvatar: ticket.avatar_url || '',
      category: ticket.event_type || ticket.category?.[0] || 'Event',
      subcategory: ticket.category?.[1] || '',
      eventDate: ticket.event_date || '',
      eventTime: ticket.event_time || '',
      venue: ticket.venue || '',
      location: `${ticket.city || ''}, ${ticket.state || ''}`.replace(/^,\s*|,\s*$/g, '') || ticket.location || '',
      price: ticket.ticket_types?.[0]?.price || 0,
      currency: 'USD',
      totalTickets: ticket.total_capacity || 0,
      availableTickets: ticket.total_capacity || 0,
      description: ticket.description || '',
      features: Array.isArray(ticket.ticket_types) ? ticket.ticket_types.map((tt: any) => tt.name) : [],
      images: Array.isArray(ticket.images) ? ticket.images : [],
      rating: ticket.rating || 0,
      totalReviews: ticket.total_reviews || 0,
      tags: Array.isArray(ticket.tags) ? ticket.tags : [],
      ageRestriction: ticket.age_restriction || '',
      dresscode: ticket.dresscode || '',
      policies: ticket.policies || [],
      status: ticket.status || 'active',
      isOwner: context.userId ? ticket.user_id?.toString() === context.userId : false,
      userId: ticket.user_id?.toString(),
      sales: ticket.sales || 0,
      earnings: ticket.earnings || 0,
    }));

    // Apply admin tab filtering first
    if (context.context === 'admin' && context.activeTab) {
      switch (context.activeTab) {
        case 'my-events':
          processedData = processedData.filter(ticket => ticket.isOwner);
          break;
        case 'active':
          processedData = processedData.filter(ticket => ticket.status === 'active');
          break;
        case 'pending':
          processedData = processedData.filter(ticket => ticket.status === 'pending');
          break;
        case 'sold-out':
          processedData = processedData.filter(ticket => ticket.status === 'sold-out');
          break;
        case 'all-events':
        default:
          // Show all for 'all-events' tab
          break;
      }
    }

    // Apply search and filter criteria
    if (filters.searchTerm) {
      processedData = processedData.filter(ticket =>
        ticket.title.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        ticket.venue.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        ticket.tags.some((tag: string) => tag.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
      );
    }

    if (Array.isArray(filters.category) && filters.category.length > 0) {
      processedData = processedData.filter(ticket =>
        filters.category!.some(category =>
          ticket.category.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (filters.location && filters.location !== 'all') {
      processedData = processedData.filter(ticket =>
        ticket.location.includes(filters.location!)
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      switch (filters.availability) {
        case 'available':
          processedData = processedData.filter(ticket => ticket.availableTickets > 0);
          break;
        case 'limited':
          processedData = processedData.filter(ticket => 
            ticket.availableTickets > 0 && ticket.availableTickets <= ticket.totalTickets * 0.2
          );
          break;
        case 'sold-out':
          processedData = processedData.filter(ticket => ticket.availableTickets === 0);
          break;
      }
    }

    if (filters.priceRange) {
      processedData = processedData.filter(ticket =>
        ticket.price >= filters.priceRange![0] &&
        ticket.price <= filters.priceRange![1]
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      processedData = processedData.filter(ticket =>
        (ticket.rating || 0) >= filters.minRating!
      );
    }

    if (filters.dateRange) {
      processedData = processedData.filter(ticket => {
        const eventDate = new Date(ticket.eventDate);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        processedData.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        processedData.sort((a, b) => b.price - a.price);
        break;
      case 'date-soon':
        processedData.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        break;
      case 'date-later':
        processedData.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
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

  const fetchTicketStats = async (userId: string): Promise<any> => {
    try {
      const response = await fetch(
        apiUrl(`tickets/user/${userId}`),
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
      console.error('Error loading ticket stats from API:', error);
    }

    // Fallback to mock stats
    return {
      total_events: 0,
      active_events: 0,
      total_tickets_sold: 0,
      total_revenue: 0,
      upcoming_events: 0
    };
  };

  return {
    fetchTicketListings,
    fetchTicketStats,
  };
};

// Filter configuration for tickets
export const ticketFilterConfig = {
  categories: [
    { value: 'art-exhibition', label: 'Art Exhibitions', icon: null },
    { value: 'workshop', label: 'Workshops', icon: null },
    { value: 'networking', label: 'Networking Events', icon: null },
    { value: 'professional-development', label: 'Professional Development', icon: null },
    { value: 'performance', label: 'Performances', icon: null },
    { value: 'conference', label: 'Conferences', icon: null },
  ],
  locations: [
    { value: 'New York', label: 'New York, NY' },
    { value: 'Los Angeles', label: 'Los Angeles, CA' },
    { value: 'Austin', label: 'Austin, TX' },
    { value: 'Chicago', label: 'Chicago, IL' },
    { value: 'San Francisco', label: 'San Francisco, CA' },
    { value: 'Nashville', label: 'Nashville, TN' },
  ],
  priceRange: { min: 0, max: 200 },
  availability: true,
  rating: true,
  customFilters: [
    {
      name: 'dateRange',
      type: 'daterange',
      options: [],
    },
  ],
  moduleType: 'tickets',
};

