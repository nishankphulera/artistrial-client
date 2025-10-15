import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Plus, Building, Camera, Mic, Palette, Users, Star, Wifi, Car, Clock, Grid, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FilterSidebar, FilterConfig, FilterState } from '../shared/FilterSidebar';
import { StudioSearchFilters } from '../shared/StudioSearchFilters';
import { StudioCard } from '../shared/StudioCard';
import { FavoritesButton } from '../shared/FavoritesButton';
import { RatingSystem } from '../shared/RatingSystem';
import { UserProfileLink } from '../shared/UserProfileLink';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';
import {
  useStudioData,
  Studio,
  StudioFilters,
  studioFilterConfig
} from '../shared/data/StudioDataService';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface StudiosPageProps {
  isDashboardDarkMode?: boolean;
}

export function StudiosPage({ isDashboardDarkMode = false }: StudiosPageProps) {
  const { user } = useAuth();
  const { fetchStudioProfiles } = useStudioData();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [reviews, setReviews] = useState([]);
  
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
  const [bookingForm, setBookingForm] = useState({
    selectedDate: null,
    startTime: '',
    endTime: '',
    eventType: '',
    guestCount: '',
    additionalRequests: '',
    budget: ''
  });

  const filterConfig: FilterConfig = studioFilterConfig;

  useEffect(() => {
    loadStudios();
  }, [filters]);

  const loadStudios = async () => {
    try {
      setLoading(true);
      
      // Convert FilterState to StudioFilters
      const studioFilters: StudioFilters = {
        searchTerm: filters.searchTerm,
        category: Array.isArray(filters.category) ? filters.category : [],
        subcategory: Array.isArray(filters.subcategory) ? filters.subcategory : [],
        location: filters.location,
        priceRange: filters.priceRange,
        availability: filters.availability,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      };

      // Use the unified data service
      const data = await fetchStudioProfiles(studioFilters, {
        context: 'public',
        userId: user?.id,
      });

      setStudios(data);
    } catch (error) {
      console.error('Error loading studios:', error);
    } finally {
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
          selectedDate: null,
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Studios & Spaces</h1>
              <p className="text-muted-foreground">
                Find and book professional studios, creative spaces, and production facilities for your artistic projects.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMap(!showMap)}
                  className="w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? 'List View' : 'Map View'}
                </Button>
                {user && (
                  <Button onClick={() => setShowCreateListing(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your Studio
                  </Button>
                )}
              </div>
              {!showMap && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Search and Category Section */}
          <StudioSearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            isDarkMode={isDashboardDarkMode}
          />

          {/* Results and Grid */}
          <div className="space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredStudios.length} studio{filteredStudios.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Main Content Area with Map/List Split */}
            <div className={showMap ? "grid grid-cols-12 gap-6" : ""}>
              {/* Studios List/Grid */}
              <div className={showMap ? "col-span-6" : "w-full"}>
                {/* Studios Grid */}
                <div className={showMap 
                  ? "space-y-4" 
                  : viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {filteredStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onBook={handleBookStudio}
                      onCardClick={(studioId) => {
                        const selectedStudio = studios.find(s => s.id === studioId);
                        if (selectedStudio) {
                          setSelectedStudio(selectedStudio);
                          loadReviews(selectedStudio.id);
                        }
                      }}
                      viewMode={showMap ? 'list' : viewMode}
                    />
                  ))}
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading studios...</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && filteredStudios.length === 0 && (
                  <div className="text-center py-12">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No studios found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your filters or search criteria.
                    </p>
                    <Button 
                      variant="outline"
                      className="mt-4"
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
              </div>

              {/* Map View */}
              {showMap && (
                <div className="col-span-6">
                  <div className="sticky top-8">
                    <Card className="h-[calc(100vh-12rem)]">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Studio Locations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-full">
                        <div className="h-full bg-gray-100 rounded-b-lg flex items-center justify-center">
                          <div className="text-center p-8">
                            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-medium mb-2">Interactive Map View</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                              Map integration would show studio locations, availability, and pricing. 
                              Click on markers to view studio details and book directly from the map.
                            </p>
                            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                              <p>📍 {filteredStudios.length} studios in your search area</p>
                              {filteredStudios.length > 0 && (
                                <p>💰 Price range: ${Math.min(...filteredStudios.map(s => s.hourlyRate))} - ${Math.max(...filteredStudios.map(s => s.hourlyRate))}/hr</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Studio Details Dialog */}
      {selectedStudio && !showBookingDialog && (
        <Dialog 
          open={!!selectedStudio} 
          onOpenChange={() => setSelectedStudio(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getStudioIcon(selectedStudio.type)}
                <div>
                  <h2>{selectedStudio.name}</h2>
                  <p className="text-muted-foreground">{selectedStudio.type} Studio</p>
                </div>
              </DialogTitle>
              <DialogDescription>
                Detailed information about this studio including amenities, equipment, pricing, and booking options.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Image Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedStudio.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback 
                      src={image} 
                      alt={`Studio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Studio Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">About This Studio</h3>
                  <p className="text-muted-foreground mb-4">{selectedStudio.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedStudio.address}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      Capacity: {selectedStudio.capacity} people
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      ${selectedStudio.hourlyRate}/hour
                      {selectedStudio.dailyRate && ` • $${selectedStudio.dailyRate}/day`}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Equipment & Features</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Equipment</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedStudio.equipment.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedStudio.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedStudio.amenities && (
                      <div>
                        <p className="text-sm font-medium mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedStudio.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Policies */}
              {selectedStudio.policies && (
                <div>
                  <h3 className="font-medium mb-3">Policies</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedStudio.policies.map((policy, index) => (
                      <li key={index}>• {policy}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews */}
              <RatingSystem
                entityId={selectedStudio.id}
                entityType="studio"
                averageRating={selectedStudio.rating}
                totalReviews={selectedStudio.total_reviews || 0}
                reviews={reviews}
                canReview={!!user && user.id !== selectedStudio.owner_id}
              />

              <div className="flex gap-4 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => handleBookStudio(selectedStudio)}
                  disabled={selectedStudio.availability === 'Booked'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedStudio.availability === 'Booked' ? 'Unavailable' : 'Book This Studio'}
                </Button>
                <FavoritesButton
                  entityId={selectedStudio.id}
                  entityType="studio"
                  size="lg"
                  variant="outline"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book {selectedStudio?.name}</DialogTitle>
            <DialogDescription>
              Complete the booking form to reserve this studio for your event or project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select 
                  value={bookingForm.eventType} 
                  onValueChange={(value) => setBookingForm({...bookingForm, eventType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photoshoot">Photo Shoot</SelectItem>
                    <SelectItem value="recording">Recording Session</SelectItem>
                    <SelectItem value="video">Video Production</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="event">Private Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Guest Count</Label>
                <Input
                  type="number"
                  placeholder="Number of people"
                  value={bookingForm.guestCount}
                  onChange={(e) => setBookingForm({...bookingForm, guestCount: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={bookingForm.startTime}
                  onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={bookingForm.endTime}
                  onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Budget Range</Label>
              <Select 
                value={bookingForm.budget} 
                onValueChange={(value) => setBookingForm({...bookingForm, budget: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500">Under $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                  <SelectItem value="over-5000">Over $5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Requests</Label>
              <Textarea
                placeholder="Any special requirements or additional services needed..."
                value={bookingForm.additionalRequests}
                onChange={(e) => setBookingForm({...bookingForm, additionalRequests: e.target.value})}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitBooking}>
                Send Booking Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

