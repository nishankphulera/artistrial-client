'use client'

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Plus, Building, Camera, Mic, Palette, Users, Star, Wifi, Car, Clock, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterSidebar, FilterConfig, FilterState } from '@/components/shared/FilterSidebar';
import { StudioSearchFilters } from '@/components/shared/StudioSearchFilters';
import { StudioCard, Studio } from '@/components/shared/StudioCard';
import { FavoritesButton } from '@/components/shared/FavoritesButton';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { UserProfileLink } from '@/components/shared/UserProfileLink';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

interface StudiosPageProps {
  isDashboardDarkMode?: boolean;
}

// Mock data and functions to replace StudioDataService
const mockStudios: Studio[] = [
    {
        id: 'studio1',
        name: 'Creative Photo Studio',
        type: 'Photography',
        location: 'New York, NY',
        address: '123 Main St, New York, NY',
        hourlyRate: 150,
        capacity: 10,
        equipment: ['Camera', 'Lighting'],
        features: ['Wi-Fi', 'Parking'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        availability: 'Available',
        rating: 4.8,
        total_reviews: 25,
        description: 'A beautiful and spacious photography studio.',
        owner_id: 'user1'
    },
    {
        id: 'studio2',
        name: 'Pro Sound Recordings',
        type: 'Recording',
        location: 'Los Angeles, CA',
        address: '456 Music Ave, Los Angeles, CA',
        hourlyRate: 250,
        capacity: 5,
        equipment: ['Microphone', 'Mixing Board'],
        features: ['Soundproof'],
        images: ['/api/placeholder/400/300'],
        availability: 'Limited',
        rating: 4.9,
        total_reviews: 42,
        description: 'State-of-the-art recording studio for all your audio needs.',
        owner_id: 'user2'
    }
];

const studioFilterConfig: FilterConfig = {
    moduleType: 'studios',
    categories: [
        { value: 'Photography', label: 'Photography' },
        { value: 'Recording', label: 'Recording' },
        { value: 'Art', label: 'Art' },
        { value: 'Video Production', label: 'Video Production' },
        { value: 'Multi-Purpose', label: 'Multi-Purpose' },
    ],
    locations: [
        { value: 'New York', label: 'New York' },
        { value: 'Los Angeles', label: 'Los Angeles' },
    ],
    priceRange: { min: 50, max: 500 },
    availability: true,
    rating: true,
};


export default function StudiosPage({ isDashboardDarkMode = false }: StudiosPageProps) {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [50, 500],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState<{
    selectedDate: Date | undefined;
    startTime: string;
    endTime: string;
    eventType: string;
    guestCount: string;
    additionalRequests: string;
    budget: string;
  }>({
    selectedDate: undefined,
    startTime: '',
    endTime: '',
    eventType: '',
    guestCount: '',
    additionalRequests: '',
    budget: ''
  });

  const filterConfig: FilterConfig = studioFilterConfig as any;

  useEffect(() => {
    loadStudios();
  }, [filters]);

  const loadStudios = async () => {
    try {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        setStudios(mockStudios);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading studios:', error);
      setLoading(false);
    }
  };

  const loadReviews = async (studioId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/reviews/studio/${studioId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleBookStudio = (studio: Studio) => {
    if (!user) {
      alert('Please sign in to book studios');
      return;
    }
    setSelectedStudio(studio);
    setShowBookingDialog(true);
    loadReviews(studio.id);
  };

  const handleSubmitBooking = async () => {
    if (!selectedStudio || !user) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/studio-bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            studio_id: selectedStudio.id,
            user_id: user.id,
            ...bookingForm
          }),
        }
      );

      if (response.ok) {
        alert('Booking request sent successfully!');
        setShowBookingDialog(false);
        setBookingForm({
          selectedDate: undefined,
          startTime: '',
          endTime: '',
          eventType: '',
          guestCount: '',
          additionalRequests: '',
          budget: ''
        });
      } else {
        alert('Failed to send booking request');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to send booking request');
    }
  };

  const getStudioIcon = (type: string) => {
    switch (type) {
      case 'Photography': return <Camera className="h-5 w-5" />;
      case 'Recording': return <Mic className="h-5 w-5" />;
      case 'Art': return <Palette className="h-5 w-5" />;
      case 'Video Production': return <Camera className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  // Studios are already filtered by the data service
  const filteredStudios = studios;

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          config={filterConfig}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredStudios.length}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Studios</h1>
              <p className="text-muted-foreground">Find and book creative spaces.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowMap(!showMap)}>
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
              <Button onClick={() => setShowCreateListing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                List Your Studio
              </Button>
              <div className="flex items-center rounded-md border bg-background">
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                  <Grid className="h-5 w-5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search Filters */}
          <StudioSearchFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Map View (Conditional) */}
          {showMap && (
            <div className="mb-6 h-96 rounded-lg bg-gray-200 dark:bg-gray-800">
              {/* Map component would go here */}
              <p className="text-center p-4">Map view is not yet implemented.</p>
            </div>
          )}

          {/* Studios Grid/List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading studios...</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio}
                      onBook={() => handleBookStudio(studio)}
                      isDashboardDarkMode={isDashboardDarkMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio}
                      onBook={() => handleBookStudio(studio)}
                      isDashboardDarkMode={isDashboardDarkMode}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}

              {!loading && filteredStudios.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No studios found matching your search.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      searchTerm: '',
                      category: [],
                      subcategory: [],
                      location: 'all',
                      priceRange: [50, 500],
                      availability: 'all',
                      minRating: 0,
                      sortBy: 'newest'
                    })}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      {selectedStudio && (
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Book {selectedStudio.name}</DialogTitle>
              <DialogDescription>
                Complete the form below to request a booking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* Left side: Studio Info & Reviews */}
              <div>
                <Card>
                  <CardHeader>
                    <ImageWithFallback
                      src={selectedStudio.images[0]}
                      alt={selectedStudio.name}
                      width={400}
                      height={250}
                      className="rounded-lg object-cover"
                    />
                    <CardTitle className="pt-4">{selectedStudio.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {selectedStudio.location}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{selectedStudio.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg">${selectedStudio.hourlyRate}/hr</div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{selectedStudio.rating?.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({selectedStudio.total_reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Reviews</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {reviews.length > 0 ? (
                          reviews.map((review: any) => (
                            <div key={review.id} className="text-sm">
                              <div className="flex items-center justify-between">
                                <UserProfileLink userId={review.user_id} userName={review.user_name} />
                                <RatingSystem readOnly initialRating={review.rating} />
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No reviews yet.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right side: Booking Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <CalendarComponent
                    mode="single"
                    selected={bookingForm.selectedDate}
                    onSelect={(date) => setBookingForm({ ...bookingForm, selectedDate: date as Date })}
                    className="rounded-md border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time" 
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      id="endTime" 
                      type="time" 
                      value={bookingForm.endTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select onValueChange={(value) => setBookingForm({ ...bookingForm, eventType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photoshoot">Photoshoot</SelectItem>
                      <SelectItem value="video-shoot">Video Shoot</SelectItem>
                      <SelectItem value="recording-session">Recording Session</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestCount">Guest Count</Label>
                    <Input 
                      id="guestCount" 
                      type="number" 
                      placeholder="e.g., 5"
                      value={bookingForm.guestCount}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (optional)</Label>
                    <Input 
                      id="budget" 
                      type="number" 
                      placeholder="$"
                      value={bookingForm.budget}
                      onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalRequests">Additional Requests</Label>
                  <Textarea 
                    id="additionalRequests" 
                    placeholder="Any special requirements?"
                    value={bookingForm.additionalRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, additionalRequests: e.target.value })}
                  />
                </div>
                <Button onClick={handleSubmitBooking} className="w-full">
                  Send Booking Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Listing Dialog */}
      <Dialog open={showCreateListing} onOpenChange={setShowCreateListing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Your Studio</DialogTitle>
            <DialogDescription>
              Reach a wider audience by listing your creative space on our platform.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              A form for creating a new studio listing would be implemented here, likely reusing or adapting the `StudioListingForm`.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}