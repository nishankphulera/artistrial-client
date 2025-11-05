'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FavoritesButton } from '@/components/shared/FavoritesButton';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { FilterSidebar, FilterConfig, FilterState } from '@/components/shared/FilterSidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { TicketListingForm } from '@/components/forms/TicketListingForm';
import { Ticket, Star, Users, Wrench, Palette } from 'lucide-react';
import { CREATE_ROUTES } from '@/utils/routes';

interface TicketData {
  id: string;
  title: string;
  description: string;
  type: 'concert' | 'workshop' | 'conference' | 'exhibition';
  venue: string;
  venueAvatar?: string;
  userId?: string;
  price: number;
  currency: string;
  rating: number;
  totalReviews: number;
  images: string[];
  availability?: string;
  location?: string;
  eventDate?: string;
  eventTime?: string;
}

interface TicketFilters extends FilterState {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
}

const ticketFilterConfig: FilterConfig = {
  categories: [
    { value: 'concert', label: 'Concerts', icon: <Star className="h-4 w-4" /> },
    { value: 'workshop', label: 'Workshops', icon: <Wrench className="h-4 w-4" /> },
    { value: 'conference', label: 'Conferences', icon: <Users className="h-4 w-4" /> },
    { value: 'exhibition', label: 'Exhibitions', icon: <Palette className="h-4 w-4" /> },
    { value: 'festival', label: 'Festivals', icon: <Star className="h-4 w-4" /> },
  ],
  locations: [
    { value: 'all', label: 'All Locations' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'remote', label: 'Virtual Events' },
  ],
  priceRange: { min: 0, max: 1000 },
  availability: true,
  rating: true,
  moduleType: 'tickets',
};

interface TicketsMarketplacePageProps {
  isDashboardDarkMode?: boolean;
}

export function TicketsMarketplacePage({
  isDashboardDarkMode = false,
}: TicketsMarketplacePageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  const [filters, setFilters] = useState<TicketFilters>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 1000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        filters.category.forEach(cat => params.append('category', cat));
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      if (filters.priceRange) {
        params.append('min_price', filters.priceRange[0].toString());
        params.append('max_price', filters.priceRange[1].toString());
      }
      if (filters.sortBy) params.append('sort', filters.sortBy);
      
      const response = await fetch(`http://localhost:5001/api/tickets?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await response.json();
      // Ensure tickets is always an array
      const ticketsArray = Array.isArray(data) ? data : (data.tickets || data.data || []);
      setTickets(ticketsArray);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseTicket = (ticket: TicketData) => {
    if (!user) {
      alert('Please sign in to purchase tickets');
      return;
    }
    setSelectedTicket(ticket);
    setShowPurchaseDialog(true);
  };

  const handleSubmitPurchase = async () => {
    if (!selectedTicket) return;
    
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          quantity: 1,
          totalAmount: selectedTicket.price,
        }),
      });

      if (response.ok) {
        alert('Purchase successful!');
        setShowPurchaseDialog(false);
        setSelectedTicket(null);
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting purchase:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concert':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'workshop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'conference':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'exhibition':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getAvailabilityColor = (availability?: string) => {
    if (!availability) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sold out':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Event Tickets</h1>
            <p className="text-gray-600">Browse and discover amazing events and tickets from our community</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          config={ticketFilterConfig}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={tickets.length}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Event Tickets</h1>
              <p className="text-muted-foreground">
                Discover amazing events, concerts, workshops, and conferences. 
                From live performances to educational experiences.
              </p>
            </div>
            {user && (
              <Button onClick={() => router.push(CREATE_ROUTES.EVENT)} className="flex items-center gap-2 w-full lg:w-auto">
                <Plus className="h-4 w-4" />
                List Event
              </Button>
            )}
          </div>

          {/* Search and Quick Filters */}
          <div className={`${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 lg:mb-8 space-y-4`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events, venues, or organizers..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className={`pl-10 ${isDashboardDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {loading ? 'Loading...' : `${tickets.length} results found`}
              </span>
            </div>

            {/* Tickets Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className={`text-center py-12 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className={`text-lg font-semibold mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>No events found</h3>
                <p className={`mb-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filters.searchTerm || filters.category.length > 0 || filters.location !== 'all' || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 
                    ? "No events match your current filters." 
                    : "No events are available at the moment."}
                </p>
                {(filters.searchTerm || filters.category.length > 0 || filters.location !== 'all' || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <Button 
                    onClick={() => setFilters({
                      searchTerm: '',
                      category: [],
                      subcategory: [],
                      location: 'all',
                      priceRange: [0, 1000],
                      availability: 'all',
                      minRating: 0,
                      sortBy: 'newest'
                    })} 
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {Array.isArray(tickets) && tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={ticket.images?.[0] || '/placeholder-ticket.jpg'}
                        alt={ticket.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={getTypeColor(ticket.type)}>
                          <Ticket className="h-3 w-3 mr-1" />
                          {ticket.type}
                        </Badge>
                        <Badge className={getAvailabilityColor(ticket.availability)}>
                          {ticket.availability || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <FavoritesButton entityId={ticket.id} entityType="ticket" />
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h3 className={`font-semibold text-lg line-clamp-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>{ticket.title}</h3>
                        
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.venueAvatar} alt={ticket.venue || 'Venue'} />
                            <AvatarFallback>{ticket.venue?.charAt(0) || 'V'}</AvatarFallback>
                          </Avatar>
                          <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{ticket.venue || 'Unknown Venue'}</span>
                        </div>

                        <p className={`text-sm line-clamp-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {ticket.description}
                        </p>

                        <div className={`flex items-center gap-2 text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {ticket.location && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {ticket.location}
                            </div>
                          )}
                          {ticket.eventDate && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {ticket.eventDate}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className={`text-xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${ticket.price}
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                            onClick={() => handlePurchaseTicket(ticket)}
                          >
                            <Ticket className="h-4 w-4 mr-1" />
                            Buy Ticket
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <RatingSystem rating={ticket.rating} totalReviews={ticket.totalReviews} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase {selectedTicket?.title}</DialogTitle>
            <DialogDescription>
              Complete your purchase by filling out the details below.
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={selectedTicket.images[0]}
                  alt={selectedTicket.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{selectedTicket.title}</h4>
                  <p className="text-sm text-gray-600">{selectedTicket.venue}</p>
                  <p className="text-lg font-bold text-[#FF8D28]">${selectedTicket.price}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" min="1" defaultValue="1" />
                </div>
                
                <div>
                  <Label htmlFor="notes">Special Requirements (Optional)</Label>
                  <Textarea id="notes" placeholder="Any special requirements or notes..." />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitPurchase} className="bg-[#FF8D28] hover:bg-[#FF8D28]/90">
                  Complete Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

