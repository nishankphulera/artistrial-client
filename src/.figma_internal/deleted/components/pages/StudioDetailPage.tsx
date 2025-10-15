import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  MessageSquare, 
  Share2, 
  Heart, 
  Clock,
  DollarSign,
  Users,
  Camera,
  Mic,
  Palette,
  Building,
  Film,
  Calendar,
  Wifi,
  Car,
  Shield,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';
import { Studio } from '../shared/StudioCard';

interface StudioDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const StudioDetailPage: React.FC<StudioDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadStudioDetails();
  }, [id]);

  const loadStudioDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleStudio: Studio = {
        id: id || 'studio1',
        name: 'Creative Light Studios',
        type: 'Photography',
        location: 'Brooklyn, NY',
        address: '123 Art Street, Brooklyn, NY 11201',
        hourlyRate: 75,
        dailyRate: 450,
        capacity: 15,
        equipment: [
          'Professional Lighting Kit',
          'Canon EOS R5',
          'Sony A7R IV', 
          'Profoto B10 Plus',
          'Seamless Backdrop',
          'Reflectors & Diffusers',
          'Tripods & Stands',
          'Props Collection'
        ],
        features: [
          'Natural Light Windows',
          'Blackout Capability',
          'Makeup Station',
          'Wardrobe Area',
          'Client Lounge'
        ],
        images: [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586227740582-e7b4b767f011?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586227740577-8ca50c1c20c5?w=800&h=600&fit=crop'
        ],
        availability: 'Available',
        rating: 4.8,
        total_reviews: 34,
        description: 'Professional photography studio in the heart of Brooklyn featuring state-of-the-art equipment, flexible lighting setups, and a comfortable environment for all your creative projects. Perfect for fashion shoots, portraits, product photography, and video production.',
        owner_id: 'owner123',
        amenities: ['WiFi', 'Parking', 'Air Conditioning', 'Security System'],
        policies: [
          'No smoking inside the studio',
          '24-hour advance booking required',
          'Additional cleaning fee for messy shoots',
          'Equipment damage deposit required'
        ]
      };

      setStudio(sampleStudio);
    } catch (error) {
      console.error('Error loading studio details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudioIcon = (type: string) => {
    switch (type) {
      case 'Photography': return <Camera className="h-5 w-5" />;
      case 'Recording': return <Mic className="h-5 w-5" />;
      case 'Art': return <Palette className="h-5 w-5" />;
      case 'Video Production': return <Film className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const handleBookStudio = () => {
    if (!user) {
      alert('Please sign in to book this studio');
      return;
    }
    console.log('Booking studio:', studio);
    // Handle booking logic here
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading studio details...</div>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Studio not found</h2>
          <Button onClick={() => router.push('/studios')}>
            Back to Studios
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
              onClick={() => router.push('/dashboard/studios')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Studios
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            <Card className="overflow-hidden">
              <ImageWithFallback
                src={studio.images[0]}
                alt={`${studio.name} main view`}
                className="w-full h-64 lg:h-80 object-cover"
              />
            </Card>

            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF8D28]/10 rounded-lg">
                    {getStudioIcon(studio.type)}
                  </div>
                  <div>
                    <h2 className="font-title text-xl">About {studio.name}</h2>
                    <p className="text-muted-foreground">{studio.type} Studio</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {studio.description}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {studio.capacity}
                    </div>
                    <div className="text-sm text-muted-foreground">Max Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {studio.equipment.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Equipment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {studio.total_reviews}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      24/7
                    </div>
                    <div className="text-sm text-muted-foreground">Access</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-title text-lg mb-3">Equipment Available</h3>
                    <div className="space-y-2">
                      {studio.equipment.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-title text-lg mb-3">Studio Features</h3>
                    <div className="space-y-2">
                      {studio.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Studio Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Studio Gallery</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {studio.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={image}
                        alt={`Studio view ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Studio Policies</h2>
                <div className="space-y-2">
                  {studio.policies?.map((policy, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{policy}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="font-title text-2xl mb-2">{studio.name}</h1>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{studio.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{studio.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({studio.total_reviews} reviews)
                    </span>
                  </div>

                  <Badge
                    variant={
                      studio.availability === "Available"
                        ? "default"
                        : studio.availability === "Limited"
                        ? "secondary"
                        : "outline"
                    }
                    className="mb-6"
                  >
                    {studio.availability}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Hourly Rate</span>
                    </div>
                    <span className="font-title text-lg text-[#FF8D28]">${studio.hourlyRate}</span>
                  </div>
                  
                  {studio.dailyRate && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Daily Rate</span>
                      </div>
                      <span className="font-title text-lg text-[#FF8D28]">${studio.dailyRate}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Capacity</span>
                    </div>
                    <span className="font-medium">{studio.capacity} people</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-title text-lg">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {studio.amenities?.includes('WiFi') && (
                      <div className="flex items-center gap-2 text-sm">
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span>WiFi</span>
                      </div>
                    )}
                    {studio.amenities?.includes('Parking') && (
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-green-500" />
                        <span>Parking</span>
                      </div>
                    )}
                    {studio.amenities?.includes('Air Conditioning') && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span>A/C</span>
                      </div>
                    )}
                    {studio.amenities?.includes('Security System') && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>Security</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handleBookStudio}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Studio
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Owner
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

