'use client'

import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock, Users, Star, Ticket, Plus, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FavoritesButton } from '@/components/shared/FavoritesButton';
import { TicketSearchFilters } from '@/components/shared/TicketSearchFilters';
import { TicketCard } from '@/components/shared/TicketCard';
import { UserProfileLink } from '@/components/shared/UserProfileLink';
import { SearchFilters, FilterConfig, FilterState } from '@/components/shared/SearchFilters';
import { useAuth } from '@/components/providers/AuthProvider';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import {
  useTicketData,
  TicketListing,
  TicketFilters,
  ticketFilterConfig
} from '@/components/shared/data/TicketDataService';

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

export default function TicketsPage({ isDashboardDarkMode = false }: TicketsPageProps) {
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
    moduleType: 'tickets',
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
        type: 'select',
        options: [
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'This Week' },
          { value: 'month', 'label': 'This Month' },
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
            name: 'VIP Admission',
            price: 75,
            description: 'Includes private tour and artist meet & greet',
            quantity: 20,
            sold: 15,
            benefits: ['Exhibition access', 'Private tour', 'Artist meet & greet', 'Signed print']
          }
        ]
      }
    ];
    setEvents(sampleEvents as any);
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (filters.category !== 'all') params.append('category', filters.category as string);
      if (filters.location !== 'all') params.append('location', filters.location);
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `http://localhost:5001/api/tickets?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle both array response and object with data property
        const tickets = Array.isArray(data) ? data : (data.data || data.tickets || []);
        
        if (tickets && tickets.length > 0) {
          // Map tickets to events format
          const mappedEvents: Event[] = tickets.map((ticket: any) => ({
            id: ticket.id?.toString() || ticket.id,
            title: ticket.title || '',
            type: (ticket.event_type || 'Workshop') as Event['type'],
            date: ticket.event_date || '',
            time: ticket.event_time || '',
            venue: ticket.venue || '',
            location: ticket.address ? `${ticket.address}, ${ticket.city || ''}, ${ticket.state || ''}`.trim() : (ticket.city || ticket.location || ''),
            price: ticket.ticket_types && Array.isArray(ticket.ticket_types) && ticket.ticket_types.length > 0
              ? parseFloat(ticket.ticket_types[0].price || 0)
              : parseFloat(ticket.price || 0),
            capacity: ticket.total_capacity || 0,
            tickets_sold: ticket.sales_count || 0,
            description: ticket.description || ticket.short_description || '',
            images: Array.isArray(ticket.images) && ticket.images.length > 0 
              ? ticket.images 
              : ticket.image_url 
                ? [ticket.image_url]
                : ['/api/placeholder/400/250'],
            organizer_name: ticket.display_name || ticket.username || ticket.organizer || 'Unknown',
            organizer_id: ticket.user_id?.toString() || ticket.user_id || '',
            rating: ticket.rating,
            tags: Array.isArray(ticket.tags) ? ticket.tags : (ticket.category ? (Array.isArray(ticket.category) ? ticket.category : [ticket.category]) : []),
            featured: ticket.featured || false,
            ticket_tiers: ticket.ticket_types ? ticket.ticket_types.map((tier: any) => ({
              id: tier.id || tier.name,
              name: tier.name || 'General Admission',
              price: parseFloat(tier.price || 0),
              description: tier.description || '',
              quantity: tier.quantity || 0,
              sold: tier.sold || 0,
              benefits: Array.isArray(tier.features) ? tier.features : []
            })) : [],
            requirements: ticket.additional_info ? [ticket.additional_info] : [],
            cancellation_policy: ticket.refund_policy || '',
            age_restriction: ticket.age_restriction || '',
            duration: ticket.duration || '',
          }));
          setEvents(mappedEvents);
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowTicketDialog(true);
  };

  const handlePurchaseTickets = async () => {
    if (!selectedEvent || !user || !selectedTier) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:5001/api/tickets/purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticket_id: selectedEvent.id,
            user_id: user.id,
            tier_id: selectedTier,
            quantity: ticketQuantity
          }),
        }
      );

      if (response.ok) {
        alert('Tickets purchased successfully!');
        setShowTicketDialog(false);
        loadEvents(); // Refresh events to show updated ticket counts
      } else {
        alert('Failed to purchase tickets');
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      alert('Failed to purchase tickets');
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'Workshop': return <Users className="h-4 w-4" />;
      case 'Exhibition': return <Eye className="h-4 w-4" />;
      case 'Conference': return <Users className="h-4 w-4" />;
      case 'Concert': return <Ticket className="h-4 w-4" />;
      case 'Screening': return <Ticket className="h-4 w-4" />;
      case 'Festival': return <Ticket className="h-4 w-4" />;
      default: return <Ticket className="h-4 w-4" />;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !filters.searchTerm || 
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.tags.some(t => t.toLowerCase().includes(filters.searchTerm!.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || event.type === filters.category;
    const matchesLocation = filters.location === 'all' || event.location.includes(filters.location);
    const matchesPrice = event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} py-4 sm:py-6 lg:py-8`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Event Tickets</h1>
            <p className="text-muted-foreground">
              Discover and purchase tickets for exclusive workshops, exhibitions, concerts, and creative events.
            </p>
          </div>
          {user && (
            <Button onClick={() => console.log('Create event')} className="flex items-center gap-2 w-full lg:w-auto">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <SearchFilters
          config={filterConfig as any}
          filters={filters}
          onFiltersChange={setFilters}
          placeholder="Search events, venues, or tags..."
          resultCount={filteredEvents.length}
        />

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 relative">
                <ImageWithFallback
                  src={event.images && event.images.length > 0 ? event.images[0] : '/api/placeholder/400/250'}
                  alt={event.title}
                  width={400}
                  height={250}
                  className="rounded-t-lg object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1 bg-white/90">
                    {getEventTypeIcon(event.type)}
                    {event.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <FavoritesButton
                    entityId={event.id}
                    entityType="event"
                    size="sm"
                    variant="outline"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}, {event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2">
                    {event.rating && (
                      <>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{event.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                  <div className="font-semibold text-lg">
                    ${event.price}
                  </div>
                </div>
                <Progress value={(event.tickets_sold / event.capacity) * 100} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {event.tickets_sold} / {event.capacity} tickets sold
                </p>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleViewDetails(event)}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  Get Tickets
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No events found matching your search.</p>
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        )}

        {/* Ticket Purchase Dialog */}
        {selectedEvent && (
          <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.type} at {selectedEvent.venue}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={selectedEvent.images && selectedEvent.images.length > 0 ? selectedEvent.images[0] : '/api/placeholder/400/250'}
                    alt={selectedEvent.title}
                    width={400}
                    height={250}
                    className="rounded-lg object-cover mb-4"
                  />
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <h4 className="font-semibold">Event Details</h4>
                    <p><span className="font-medium">Date:</span> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Time:</span> {selectedEvent.time}</p>
                    <p><span className="font-medium">Duration:</span> {selectedEvent.duration}</p>
                    <p><span className="font-medium">Location:</span> {selectedEvent.location}</p>
                    <p><span className="font-medium">Age:</span> {selectedEvent.age_restriction}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Select Tickets</h4>
                  <div className="space-y-4">
                    {selectedEvent.ticket_tiers?.map(tier => (
                      <Card 
                        key={tier.id} 
                        className={`cursor-pointer ${selectedTier === tier.id ? 'border-blue-500' : ''}`}
                        onClick={() => setSelectedTier(tier.id)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{tier.name}</p>
                              <p className="text-sm text-muted-foreground">${tier.price}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{tier.sold} / {tier.quantity} sold</p>
                            </div>
                          </div>
                          <ul className="list-disc list-inside text-xs text-muted-foreground mt-2">
                            {tier.benefits.map(b => <li key={b}>{b}</li>)}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1" 
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <Button 
                    onClick={handlePurchaseTickets} 
                    className="w-full mt-6"
                    disabled={!selectedTier}
                  >
                    Purchase for ${selectedEvent.ticket_tiers?.find(t => t.id === selectedTier)?.price! * ticketQuantity || 0}
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