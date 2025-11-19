import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { Studio } from '../shared/StudioCard';
import { formatPriceINR } from '@/utils/currency';
import { toast } from 'sonner';
import { apiUrl } from '@/utils/api';

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
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(apiUrl(`studios/${id}`), {
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          setStudio(null);
          return;
        }
        throw new Error(`Failed to fetch studio: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map API response to Studio interface
      const mappedStudio: Studio = {
        id: data.id.toString(),
        name: data.title || data.name || 'Untitled Studio',
        type: data.studio_type || 'Multi-Purpose',
        location: data.city && data.state 
          ? `${data.city}, ${data.state}` 
          : data.city || data.state || data.country || 'Location not specified',
        address: data.address || '',
        hourlyRate: parseFloat(data.hourly_rate) || 0,
        dailyRate: data.daily_rate ? parseFloat(data.daily_rate) : undefined,
        capacity: data.capacity || 0,
        equipment: Array.isArray(data.equipment) ? data.equipment : [],
        features: [
          data.has_natural_light && 'Natural Light',
          data.has_air_conditioning && 'Air Conditioning',
          data.has_kitchen && 'Kitchen',
          data.has_wifi && 'WiFi',
          data.has_parking && 'Parking',
          data.is_accessible && 'Accessible',
        ].filter(Boolean) as string[],
        images: Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'],
        availability: data.availability === 'available' || data.status === 'active' 
          ? 'Available' 
          : data.availability === 'booked' || data.status === 'inactive'
          ? 'Booked'
          : 'Limited',
        rating: data.rating || 0,
        total_reviews: data.total_reviews || 0,
        description: data.description || '',
        owner_id: data.owner_id?.toString() || '',
        amenities: [
          data.has_wifi && 'WiFi',
          data.has_parking && 'Parking',
          data.has_air_conditioning && 'Air Conditioning',
          data.has_kitchen && 'Kitchen',
          data.is_accessible && 'Accessible',
          data.allows_events && 'Events Allowed',
          data.allows_commercial && 'Commercial Use',
        ].filter(Boolean) as string[],
        policies: Array.isArray(data.rules) ? data.rules : data.rules 
          ? [data.rules] 
          : data.cancellation_policy 
          ? [data.cancellation_policy]
          : [],
      };

      setStudio(mappedStudio);
    } catch (error) {
      console.error('Error loading studio details:', error);
      setStudio(null);
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
      toast.error('Sign In Required', {
        description: 'Please sign in to book this studio.',
        duration: 3000,
      });
      router.push('/auth');
      return;
    }
    // Handle booking logic here - redirect to booking page or show booking modal
    toast.info('Booking Feature', {
      description: 'Booking functionality will be available soon.',
      duration: 3000,
    });
  };

  const handleContactOwner = () => {
    if (!user) {
      toast.error('Sign In Required', {
        description: 'Please sign in to contact the owner.',
        duration: 3000,
      });
      router.push('/auth');
      return;
    }
    // Handle contact logic here
    toast.info('Contact Feature', {
      description: 'Contact functionality will be available soon.',
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8D28] mx-auto"></div>
          <p className="text-sm text-gray-600">Loading studio details...</p>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="font-title text-2xl text-gray-900">Studio not found</h2>
          <p className="text-gray-600">The studio you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => router.push('/dashboard/marketplace/studios')}
            className="bg-[#FF8D28] hover:bg-[#FF8D28]/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
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
              onClick={() => router.push('/dashboard/marketplace/studios')}
              className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Studios
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image - Modern Hero Section */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-[#FF8D28]/20 to-[#FF8D28]/5">
                <ImageWithFallback
                  src={studio.images[0]}
                  alt={`${studio.name} main view`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Studio Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    {getStudioIcon(studio.type)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{studio.name}</h1>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{studio.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-medium">{studio.rating.toFixed(1)}</span>
                    <span className="text-white/70 text-sm">({studio.total_reviews})</span>
                  </div>
                  <Badge 
                    className={`${
                      studio.availability === "Available"
                        ? "bg-green-500/90 text-white"
                        : studio.availability === "Limited"
                        ? "bg-yellow-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    } backdrop-blur-md`}
                  >
                    {studio.availability}
                  </Badge>
                </div>
              </div>
            </div>

            {/* About Section - Modernized */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    About This Studio
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {studio.description || 'No description available.'}
                  </p>
                </div>
                
                {/* Stats Grid - Modern Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#FF8D28]/10 to-[#FF8D28]/5 border border-[#FF8D28]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-[#FF8D28]" />
                      <span className="text-2xl font-bold text-gray-900">
                        {studio.capacity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Max Capacity</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {studio.equipment.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Equipment</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {studio.total_reviews}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Reviews</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        24/7
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Access</div>
                  </div>
                </div>

                {/* Equipment & Features - Modern Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">
                      Equipment Available
                    </h3>
                    <div className="space-y-2">
                      {studio.equipment.length > 0 ? (
                        studio.equipment.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No equipment listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">
                      Studio Features
                    </h3>
                    <div className="space-y-2">
                      {studio.features.length > 0 ? (
                        studio.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No features listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Studio Gallery - Modernized */}
            {studio.images.length > 1 && (
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Studio Gallery
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {studio.images.slice(1).map((image, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`Studio view ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Policies - Modernized */}
            {studio.policies && studio.policies.length > 0 && (
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Shield className="h-5 w-5 text-gray-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Studio Policies
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {studio.policies.map((policy, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-600" />
                        <span className="text-sm text-gray-700">{policy}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Book Studio & Contact Card (Keep as requested) */}
          <div className="space-y-6">
            {/* Booking Card - Modernized but keeping the same layout */}
            <Card className="sticky top-24 bg-white shadow-xl border border-gray-200">
              <CardContent className="p-6">
                {/* Header Section */}
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <h1 className="font-bold text-2xl mb-3 text-gray-900">
                    {studio.name}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-sm mb-4 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-center">{studio.address || studio.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">
                        {studio.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({studio.total_reviews} {studio.total_reviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  <Badge
                    className={`${
                      studio.availability === "Available"
                        ? "bg-green-500 text-white"
                        : studio.availability === "Limited"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    } px-3 py-1`}
                  >
                    {studio.availability}
                  </Badge>
                </div>

                {/* Pricing Section - Modern Cards */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#FF8D28]/10 to-[#FF8D28]/5 border border-[#FF8D28]/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <DollarSign className="h-4 w-4 text-[#FF8D28]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Hourly Rate
                      </span>
                    </div>
                    <span className="font-bold text-xl text-[#FF8D28]">
                      {formatPriceINR(studio.hourlyRate, true)}
                    </span>
                  </div>
                  
                  {studio.dailyRate && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Daily Rate
                        </span>
                      </div>
                      <span className="font-bold text-xl text-blue-600">
                        {formatPriceINR(studio.dailyRate, true)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <Users className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Capacity
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {studio.capacity} {studio.capacity === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                </div>

                {/* Amenities Section */}
                {studio.amenities && studio.amenities.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {studio.amenities.map((amenity, index) => {
                        const getIcon = () => {
                          if (amenity.includes('WiFi') || amenity.includes('Wifi')) return <Wifi className="h-4 w-4 text-green-500" />;
                          if (amenity.includes('Parking')) return <Car className="h-4 w-4 text-green-500" />;
                          if (amenity.includes('Air Conditioning') || amenity.includes('A/C')) return <Clock className="h-4 w-4 text-green-500" />;
                          if (amenity.includes('Security')) return <Shield className="h-4 w-4 text-green-500" />;
                          return <CheckCircle className="h-4 w-4 text-green-500" />;
                        };
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {getIcon()}
                            <span className="text-gray-700">
                              {amenity.replace('Air Conditioning', 'A/C')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Enhanced */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
                    onClick={handleBookStudio}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Studio
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-6 text-base border-2 border-gray-300 hover:bg-gray-50"
                    onClick={handleContactOwner}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
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

