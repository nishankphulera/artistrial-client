import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock, Users, Star, Ticket, Plus, Eye, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { FavoritesButton } from '../shared/FavoritesButton';
import { TicketSearchFilters } from '../shared/TicketSearchFilters';
import { TicketCard } from '../shared/TicketCard';
import { UserProfileLink } from '../shared/UserProfileLink';
import { SearchFilters, FilterConfig, FilterState } from '../shared/SearchFilters';
import { useAuth } from '../providers/AuthProvider';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  useTicketData,
  TicketListing,
  TicketFilters,
  ticketFilterConfig
} from '../shared/data/TicketDataService';

interface Event {
  id: string;
  title: string;
  type: 'Workshop' | 'Exhibition' | 'Conference' | 'Concert' | 'Screening' | 'Festival';
  date: string;
  time: string;
  venue: string;
  location: string;
  price: number;
  capacity: number;
  tickets_sold: number;
  description: string;
  images: string[];
  organizer_name: string;
  organizer_id: string;
  rating?: number;
  tags: string[];
  featured: boolean;
  ticket_tiers?: TicketTier[];
  requirements?: string[];
  cancellation_policy?: string;
  age_restriction?: string;
  duration?: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  sold: number;
  benefits: string[];
}

interface TicketsPageProps {
  isDashboardDarkMode?: boolean;
}

export function TicketsPage({ isDashboardDarkMode = false }: TicketsPageProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    location: 'all',
    priceRange: [0, 500],
    availability: 'all',
    minRating: 0,
    sortBy: 'date'
  });

  // Ticket purchase state
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const filterConfig: FilterConfig = {
    categories: [
      { value: 'Workshop', label: 'Workshop' },
      { value: 'Exhibition', label: 'Exhibition' },
      { value: 'Conference', label: 'Conference' },
      { value: 'Concert', label: 'Concert' },
      { value: 'Screening', label: 'Screening' },
      { value: 'Festival', label: 'Festival' }
    ],
    locations: [
      { value: 'New York', label: 'New York' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'Chicago', label: 'Chicago' },
      { value: 'Austin', label: 'Austin' },
      { value: 'Portland', label: 'Portland' },
      { value: 'Miami', label: 'Miami' }
    ],
    priceRange: { min: 0, max: 500 },
    availability: true,
    customFilters: [
      {
        name: 'date_range',
        options: [
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'This Week' },
          { value: 'month', label: 'This Month' },
          { value: 'upcoming', label: 'All Upcoming' }
        ]
      }
    ]
  };

  useEffect(() => {
    loadEvents();
    loadSampleData();
  }, [filters]);

  const loadSampleData = () => {
    const sampleEvents = [
      {
        id: 'evt1',
        title: 'Digital Art Masterclass with Sarah Chen',
        type: 'Workshop',
        date: '2024-02-15',
        time: '2:00 PM - 5:00 PM',
        venue: 'Creative Arts Center',
        location: 'New York, NY',
        price: 150,
        capacity: 25,
        tickets_sold: 18,
        description: 'Learn advanced digital painting techniques and workflow optimization from renowned digital artist Sarah Chen.',
        images: ['/api/placeholder/400/250', '/api/placeholder/400/250'],
        organizer_name: 'Digital Arts Academy',
        organizer_id: 'org1',
        rating: 4.9,
        tags: ['Digital Art', 'Painting', 'Photoshop', 'Beginner Friendly'],
        featured: true,
        duration: '3 hours',
        age_restriction: '16+',
        requirements: ['Laptop with Photoshop', 'Basic computer skills'],
        cancellation_policy: '48-hour cancellation for full refund',
        ticket_tiers: [
          {
            id: 'tier1',
            name: 'General Admission',
            price: 150,
            description: 'Standard workshop access',
            quantity: 20,
            sold: 15,
            benefits: ['Workshop access', 'Digital materials', 'Certificate']
          },
          {
            id: 'tier2',
            name: 'VIP Experience',
            price: 250,
            description: 'Includes 1-on-1 feedback session',
            quantity: 5,
            sold: 3,
            benefits: ['Workshop access', 'Digital materials', 'Certificate', 'Personal feedback', 'Premium seating']
          }
        ]
      },
      {
        id: 'evt2',
        title: 'Modern Photography Exhibition',
        type: 'Exhibition',
        date: '2024-02-20',
        time: '6:00 PM - 9:00 PM',
        venue: 'Metropolitan Gallery',
        location: 'Los Angeles, CA',
        price: 25,
        capacity: 200,
        tickets_sold: 145,
        description: 'Contemporary photography showcase featuring works from emerging and established photographers worldwide.',
        images: ['/api/placeholder/400/250', '/api/placeholder/400/250'],
        organizer_name: 'Metro Gallery Foundation',
        organizer_id: 'org2',
        rating: 4.7,
        tags: ['Photography', 'Contemporary', 'Gallery Opening'],
        featured: false,
        duration: '3 hours',
        age_restriction: 'All ages',
        ticket_tiers: [
          {
            id: 'tier1',
            name: 'General Admission',
            price: 25,
            description: 'Exhibition access',
            quantity: 180,
            sold: 130,
            benefits: ['Exhibition access', 'Welcome drink']
          },
          {
            id: 'tier2',
            name: 'Opening Night Special',
            price: 45,
            description: 'Early access with artist meet & greet',
            quantity: 20,
            sold: 15,
            benefits: ['Early access', 'Meet the artists', 'Welcome drink', 'Exhibition catalog']
          }
        ]
      }
    ];

    setEvents(sampleEvents);
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.location !== 'all') params.append('location', filters.location);
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.events.length > 0) {
          setEvents(data.events);
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseTicket = async () => {
    if (!selectedEvent || !selectedTier || !user) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/purchase-ticket`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            event_id: selectedEvent.id,
            ticket_tier_id: selectedTier,
            quantity: ticketQuantity
          }),
        }
      );

      if (response.ok) {
        alert('Ticket purchased successfully!');
        setShowTicketDialog(false);
        setSelectedTier('');
        setTicketQuantity(1);
      } else {
        alert('Failed to purchase ticket');
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Failed to purchase ticket');
    }
  };

  const getEventIcon = (type: string) => {
    const icons = {
      'Workshop': '🎨',
      'Exhibition': '🖼️',
      'Conference': '🎤',
      'Concert': '🎵',
      'Screening': '🎬',
      'Festival': '🎪'
    };
    return icons[type] || '🎫';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAvailabilityStatus = (sold: number, capacity: number) => {
    const percentage = (sold / capacity) * 100;
    if (percentage >= 100) return { status: 'Sold Out', color: 'destructive' };
    if (percentage >= 90) return { status: 'Almost Full', color: 'secondary' };
    if (percentage >= 70) return { status: 'Filling Fast', color: 'default' };
    return { status: 'Available', color: 'default' };
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !filters.searchTerm || 
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    const matchesType = filters.category === 'all' || event.type === filters.category;
    const matchesLocation = filters.location === 'all' || event.location.includes(filters.location);
    const matchesPrice = event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1];
    
    // Date filtering
    const eventDate = new Date(event.date);
    const today = new Date();
    let matchesDate = true;
    
    if (filters.date_range) {
      switch (filters.date_range) {
        case 'today':
          matchesDate = eventDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = eventDate >= today && eventDate <= nextWeek;
          break;
        case 'month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          matchesDate = eventDate >= today && eventDate <= nextMonth;
          break;
        case 'upcoming':
          matchesDate = eventDate >= today;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesLocation && matchesPrice && matchesDate;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} py-4 sm:py-6 lg:py-8`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex-1">
            <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Events & Tickets</h1>
            <p className="text-muted-foreground">
              Discover and book tickets for art exhibitions, creative workshops, industry conferences, and cultural events.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 lg:mb-8">
          <SearchFilters
            config={filterConfig}
            filters={filters}
            onFiltersChange={setFilters}
            placeholder="Search events, venues, or topics..."
            resultCount={filteredEvents.length}
          />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredEvents.map((event) => {
            const availability = getAvailabilityStatus(event.tickets_sold, event.capacity);
            
            return (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback 
                    src={event.images[0]} 
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {event.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    <Badge variant="outline" className="bg-white/90">
                      {getEventIcon(event.type)} {event.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <FavoritesButton
                      entityId={event.id}
                      entityType="event"
                      size="sm"
                      variant="outline"
                    />
                    <Badge variant={availability.color as any}>
                      {availability.status}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    <UserProfileLink 
                      userId={event.organizer_id}
                      userName={event.organizer_name}
                      prefix=""
                    />
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)} • {event.time}</span>
                    </div>

                    {/* Venue and Location */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.venue}, {event.location}</span>
                    </div>

                    {/* Rating and Capacity */}
                    <div className="flex items-center justify-between text-sm">
                      {event.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{event.rating}</span>
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.tickets_sold}/{event.capacity}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress 
                      value={(event.tickets_sold / event.capacity) * 100} 
                      className="h-2"
                    />

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xl font-bold">
                          {event.ticket_tiers && event.ticket_tiers.length > 1 
                            ? `From $${Math.min(...event.ticket_tiers.map(t => t.price))}`
                            : `$${event.price}`
                          }
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          size="sm"
                          disabled={event.tickets_sold >= event.capacity}
                          onClick={() => {
                            if (!user) {
                              alert('Please sign in to purchase tickets');
                              return;
                            }
                            setSelectedEvent(event);
                            setShowTicketDialog(true);
                          }}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          {event.tickets_sold >= event.capacity ? 'Sold Out' : 'Book'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No events found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                searchTerm: '',
                category: 'all',
                location: 'all',
                priceRange: [0, 500],
                availability: 'all',
                minRating: 0,
                sortBy: 'date'
              })}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Event Details Dialog */}
        {selectedEvent && !showTicketDialog && (
          <Dialog 
            open={!!selectedEvent} 
            onOpenChange={() => setSelectedEvent(null)}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl">{getEventIcon(selectedEvent.type)}</span>
                  <div>
                    <h2>{selectedEvent.title}</h2>
                    <p className="text-muted-foreground">{selectedEvent.organizer_name}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Complete event details including schedule, venue information, ticket options, and policies.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Event Images */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedEvent.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <ImageWithFallback 
                        src={image} 
                        alt={`Event ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedEvent.venue}, {selectedEvent.location}</span>
                      </div>
                      {selectedEvent.duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Duration: {selectedEvent.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Capacity: {selectedEvent.capacity} people</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Additional Information</h3>
                    {selectedEvent.age_restriction && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Age Restriction</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.age_restriction}</p>
                      </div>
                    )}
                    
                    {selectedEvent.requirements && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Requirements</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {selectedEvent.requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.cancellation_policy && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Cancellation Policy</p>
                        <p className="text-sm text-muted-foreground">{selectedEvent.cancellation_policy}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ticket Tiers */}
                {selectedEvent.ticket_tiers && (
                  <div>
                    <h3 className="font-medium mb-3">Ticket Options</h3>
                    <div className="grid gap-4">
                      {selectedEvent.ticket_tiers.map((tier) => (
                        <Card key={tier.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{tier.name}</h4>
                                <p className="text-sm text-muted-foreground">{tier.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${tier.price}</p>
                                <p className="text-sm text-muted-foreground">
                                  {tier.quantity - tier.sold} left
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {tier.benefits.map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      if (!user) {
                        alert('Please sign in to purchase tickets');
                        return;
                      }
                      setShowTicketDialog(true);
                    }}
                    disabled={selectedEvent.tickets_sold >= selectedEvent.capacity}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    {selectedEvent.tickets_sold >= selectedEvent.capacity ? 'Sold Out' : 'Purchase Tickets'}
                  </Button>
                  <FavoritesButton
                    entityId={selectedEvent.id}
                    entityType="event"
                    size="lg"
                    variant="outline"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Ticket Purchase Dialog */}
        {showTicketDialog && selectedEvent && (
          <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Purchase Tickets - {selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Select your ticket type and quantity to complete your purchase.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Ticket Selection */}
                <div>
                  <Label>Select Ticket Type</Label>
                  {selectedEvent.ticket_tiers ? (
                    <div className="grid gap-3 mt-2">
                      {selectedEvent.ticket_tiers.map((tier) => (
                        <Card 
                          key={tier.id} 
                          className={`cursor-pointer border-2 transition-colors ${
                            selectedTier === tier.id ? 'border-primary' : 'border-muted'
                          }`}
                          onClick={() => setSelectedTier(tier.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{tier.name}</h4>
                                <p className="text-sm text-muted-foreground">{tier.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${tier.price}</p>
                                <p className="text-sm text-muted-foreground">
                                  {tier.quantity - tier.sold} left
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">General Admission</h4>
                            <p className="text-sm text-muted-foreground">Standard event access</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${selectedEvent.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Quantity Selection */}
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select value={ticketQuantity.toString()} onValueChange={(value) => setTicketQuantity(parseInt(value))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'ticket' : 'tickets'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-xl font-bold">
                      ${selectedEvent.ticket_tiers && selectedTier
                        ? (selectedEvent.ticket_tiers.find(t => t.id === selectedTier)?.price || 0) * ticketQuantity
                        : selectedEvent.price * ticketQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowTicketDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePurchaseTicket} 
                    className="flex-1"
                    disabled={selectedEvent.ticket_tiers && !selectedTier}
                  >
                    Purchase Tickets
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

