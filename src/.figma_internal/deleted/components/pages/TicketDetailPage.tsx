import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  Share2, 
  Heart, 
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  Users,
  Ticket,
  CheckCircle,
  Music,
  Palette,
  Camera,
  Mic,
  Trophy,
  Zap,
  Info,
  ShoppingCart
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';

export interface EventTicket {
  id: string;
  title: string;
  type: 'Concert' | 'Art Exhibition' | 'Workshop' | 'Conference' | 'Performance' | 'Festival';
  organizer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  venue: {
    name: string;
    address: string;
    capacity: number;
  };
  date: string;
  time: string;
  endDate?: string;
  description: string;
  images: string[];
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    available: number;
    total: number;
    benefits: string[];
  }[];
  totalTickets: number;
  soldTickets: number;
  rating: number;
  totalReviews: number;
  tags: string[];
  ageRestriction?: string;
  dresscode?: string;
  policies: string[];
  refundPolicy: string;
}

interface TicketDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const TicketDetailPage: React.FC<TicketDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventTicket | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleEvent: EventTicket = {
        id: id || 'event1',
        title: 'Digital Art Showcase 2024',
        type: 'Art Exhibition',
        organizer: {
          id: 'organizer1',
          name: 'Modern Art Collective',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          verified: true
        },
        venue: {
          name: 'Gallery District NYC',
          address: '456 Art Avenue, New York, NY 10001',
          capacity: 200
        },
        date: '2024-03-15',
        time: '18:00',
        endDate: '2024-03-17',
        description: 'Experience the future of art at our exclusive digital art showcase featuring works from emerging and established digital artists. This three-day event will feature interactive installations, VR art experiences, and live digital painting demonstrations.',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop'
        ],
        ticketTypes: [
          {
            id: 'general',
            name: 'General Admission',
            price: 25,
            available: 120,
            total: 150,
            benefits: ['Access to all exhibits', 'Welcome drink', 'Event program']
          },
          {
            id: 'premium',
            name: 'Premium Pass',
            price: 50,
            available: 35,
            total: 40,
            benefits: ['Priority entry', 'VIP lounge access', 'Artist meet & greet', 'Complimentary refreshments', 'Exclusive merchandise']
          },
          {
            id: 'vip',
            name: 'VIP Experience',
            price: 100,
            available: 8,
            total: 10,
            benefits: ['All premium benefits', 'Private curator tour', 'Signed artwork print', 'After-party invitation', 'Personal concierge']
          }
        ],
        totalTickets: 200,
        soldTickets: 47,
        rating: 4.6,
        totalReviews: 128,
        tags: [
          'Digital Art',
          'Contemporary',
          'Interactive',
          'VR Experience',
          'Emerging Artists',
          'NYC'
        ],
        ageRestriction: '18+',
        dresscode: 'Smart Casual',
        policies: [
          'No photography of artworks without permission',
          'Food and drinks not allowed in exhibition areas',
          'Tickets are non-transferable',
          'Valid ID required for entry'
        ],
        refundPolicy: 'Full refund available up to 48 hours before event'
      };

      setEvent(sampleEvent);
      if (sampleEvent.ticketTypes.length > 0) {
        setSelectedTicketType(sampleEvent.ticketTypes[0].id);
      }
    } catch (error) {
      console.error('Error loading event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Concert': return <Music className="h-5 w-5" />;
      case 'Art Exhibition': return <Palette className="h-5 w-5" />;
      case 'Workshop': return <Users className="h-5 w-5" />;
      case 'Conference': return <Mic className="h-5 w-5" />;
      case 'Performance': return <Trophy className="h-5 w-5" />;
      case 'Festival': return <Zap className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const handlePurchaseTickets = () => {
    if (!user) {
      alert('Please sign in to purchase tickets');
      return;
    }
    if (!selectedTicketType) {
      alert('Please select a ticket type');
      return;
    }
    console.log('Purchasing tickets:', { event, ticketType: selectedTicketType, quantity });
    // Handle ticket purchase logic here
  };

  const selectedTicket = event?.ticketTypes.find(t => t.id === selectedTicketType);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Event not found</h2>
          <Button onClick={() => router.push('/tickets')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      
      {/* Header - Only show if not in dashboard context */}
      {!isInDashboard && (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${isInDashboard ? 'p-4 sm:p-6 lg:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {/* Dashboard Back Button */}
        {isInDashboard && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/tickets')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            <Card className="overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={event.images[0]}
                  alt={event.title}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#FF8D28] text-white">
                    {event.type}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded">
                  <div className="text-sm">
                    {event.soldTickets} / {event.totalTickets} tickets sold
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF8D28]/10 rounded-lg">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h2 className="font-title text-xl">About This Event</h2>
                    <p className="text-muted-foreground">{event.type}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {event.time}
                    </div>
                    <div className="text-sm text-muted-foreground">Start Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {event.venue.capacity}
                    </div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {event.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-title text-lg mb-3">Event Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString()} 
                          {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.venue.name}</span>
                      </div>
                      {event.ageRestriction && (
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Age: {event.ageRestriction}</span>
                        </div>
                      )}
                      {event.dresscode && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Dress Code: {event.dresscode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-title text-lg mb-3">Event Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Gallery */}
            {event.images.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-title text-xl mb-4">Event Gallery</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={image}
                          alt={`Event image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Policies */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Event Policies</h2>
                <div className="space-y-3 mb-4">
                  {event.policies.map((policy, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{policy}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900 text-sm">Refund Policy</div>
                      <div className="text-blue-700 text-sm">{event.refundPolicy}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Purchase Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="font-title text-xl mb-2">{event.title}</h1>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                      <AvatarFallback>
                        {event.organizer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{event.organizer.name}</div>
                      {event.organizer.verified && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          Verified Organizer
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{event.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({event.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MapPin className="h-3 w-3" />
                      {event.venue.address}
                    </div>
                  </div>
                </div>

                {/* Ticket Selection */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-title text-lg">Select Ticket Type</h3>
                  {event.ticketTypes.map((ticketType) => (
                    <div 
                      key={ticketType.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTicketType === ticketType.id 
                          ? 'border-[#FF8D28] bg-[#FF8D28]/5' 
                          : 'border-gray-200 hover:border-[#FF8D28]/50'
                      }`}
                      onClick={() => setSelectedTicketType(ticketType.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedTicketType === ticketType.id 
                              ? 'border-[#FF8D28] bg-[#FF8D28]' 
                              : 'border-gray-300'
                          }`}>
                            {selectedTicketType === ticketType.id && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="font-medium">{ticketType.name}</span>
                        </div>
                        <span className="font-title text-lg text-[#FF8D28]">${ticketType.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {ticketType.available} of {ticketType.total} available
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ticketType.benefits.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity Selection */}
                {selectedTicket && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quantity</span>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuantity(Math.min(selectedTicket.available, quantity + 1))}
                          disabled={quantity >= selectedTicket.available}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">Total Price</span>
                      <span className="font-title text-xl text-[#FF8D28]">${totalPrice}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handlePurchaseTickets}
                    disabled={!selectedTicket || selectedTicket.available === 0}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    {selectedTicket && selectedTicket.available === 0 ? 'Sold Out' : 'Buy Tickets'}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Organizer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

