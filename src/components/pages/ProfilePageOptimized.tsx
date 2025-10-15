import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Settings, Share, Heart, Eye, Grid, User, MapPin, Star, Camera, Mic, Palette, Building, DollarSign, Calendar, Briefcase, Plus, Check, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

interface ServiceModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description?: string;
  portfolio?: any[];
}

interface ProfilePageOptimizedProps {
  isDashboardDarkMode?: boolean;
}

export const ProfilePageOptimized: React.FC<ProfilePageOptimizedProps> = ({ isDashboardDarkMode = false }) => {
  const { userId } = useParams();
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [listings, setListings] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // Helper function to safely access array length
  const safeArrayLength = (arr: any): number => {
    return Array.isArray(arr) ? arr.length : 0;
  };

  // Helper function to safely access arrays
  const safeArray = (arr: any): any[] => {
    return Array.isArray(arr) ? arr : [];
  };

  // Fetch complete profile data using the optimized endpoint
  useEffect(() => {
    const fetchCompleteProfileData = async () => {
      try {
        setLoading(true);
        
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        // Get token from localStorage or use public anon key
        const token = localStorage.getItem('access_token') || publicAnonKey;
        
        console.log('Fetching complete profile for user:', targetUserId);
        console.log('Using token type:', localStorage.getItem('access_token') ? 'access_token' : 'publicAnonKey');
        
        // Use the optimized complete profile endpoint
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/profiles/${targetUserId}/complete`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Complete profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Complete profile data received:', data);
          setProfileData(data.profile);
          setListings(data.listings || {});
          setReviews(safeArray(data.reviews));
        } else if (response.status === 404) {
          // Profile not found - try to find user data from artworks/listings as fallback
          console.log('Profile not found (404), checking for user in artworks...');
          
          // Fetch artworks to see if we can find user info
          const artworksResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/artworks`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          let foundUserInfo = null;
          let artworksData = null;
          if (artworksResponse.ok) {
            artworksData = await artworksResponse.json();
            const userArtwork = safeArray(artworksData?.artworks).find(
              (artwork: any) => artwork?.artist_id === targetUserId
            );
            
            if (userArtwork) {
              foundUserInfo = {
                id: userArtwork.artist_id,
                username: userArtwork.artist_name?.toLowerCase().replace(/\s+/g, '') || 'user',
                full_name: userArtwork.artist_name || 'Unknown User',
                bio: '',
                avatar_url: '',
                website: '',
                location: '',
                phone: '',
                email: '',
                followers_count: 0,
                following_count: 0,
                is_verified: false,
                joined_date: new Date().toISOString().split('T')[0],
                overall_rating: 0,
                total_reviews: 0,
                total_listings: safeArrayLength(artworksData?.artworks?.filter((a: any) => a?.artist_id === targetUserId)),
                response_rate: 100,
                response_time: '< 2 hours',
                specialties: []
              };
            }
          }

          // If it's the current user's own profile and no data found, create default
          if (isOwnProfile && user && !foundUserInfo) {
            foundUserInfo = {
              id: user.id,
              username: user.email?.split('@')[0] || 'user',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              bio: '',
              avatar_url: user.user_metadata?.avatar_url || '',
              website: '',
              location: '',
              phone: '',
              email: user.email || '',
              followers_count: 0,
              following_count: 0,
              is_verified: false,
              joined_date: new Date().toISOString().split('T')[0],
              overall_rating: 0,
              total_reviews: 0,
              total_listings: 0,
              response_rate: 100,
              response_time: '< 2 hours',
              specialties: []
            };
          }

          if (foundUserInfo) {
            setProfileData(foundUserInfo);
            // Set empty listings for now - could be enhanced to fetch actual user listings
            setListings({
              artworks: artworksResponse.ok && artworksData?.artworks ? 
                safeArray(artworksData.artworks).filter((artwork: any) => artwork?.artist_id === targetUserId) : [],
              talents: [],
              studios: [],
              events: [],
              investments: [],
              legalServices: [],
              products: [],
              education: []
            });
            setReviews([]);
          } else {
            // User not found anywhere
            setProfileData(null);
          }
        } else {
          const errorText = await response.text();
          console.error('Error response:', response.status, errorText);
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching complete profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleteProfileData();
  }, [targetUserId, isOwnProfile, user?.id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4 ${
            isDashboardDarkMode ? "border-white" : "border-gray-900"
          }`}></div>
          <p className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-title mb-4 ${
            isDashboardDarkMode ? "text-white" : "text-gray-900"
          }`}>Profile Not Found</h2>
          <p className={`mb-4 ${
            isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>The profile you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate service modules based on profile type and actual listings
  const generateServiceModules = () => {
    if (!listings || !profileData) return [];

    const profileType = profileData.profile_type || 'Artist';
    let modules = [];

    // Show different services based on profile type
    switch (profileType) {
      case 'Artist':
        modules = [
          {
            id: 'artworks',
            name: 'Asset Marketplace',
            icon: <Grid className="h-4 w-4" />,
            enabled: safeArrayLength(listings.artworks) > 0,
            description: 'Digital assets, artwork, and design resources',
            portfolio: safeArray(listings.artworks).map((artwork: any) => ({
              id: artwork?.id,
              title: artwork?.title,
              image: artwork?.image_url,
              price: artwork?.price
            }))
          },
          {
            id: 'talents',
            name: 'Custom Commissions',
            icon: <Palette className="h-4 w-4" />,
            enabled: safeArrayLength(listings.talents) > 0,
            description: 'Custom artwork and design services',
            portfolio: safeArray(listings.talents).map((talent: any) => ({
              id: talent?.id,
              title: talent?.profession || talent?.name,
              image: talent?.image_url || safeArray(talent?.portfolio_images)[0],
              hourlyRate: talent?.hourlyRate
            }))
          }
        ];
        break;

      case 'Venue':
        modules = [
          {
            id: 'studios',
            name: 'Studio Rental',
            icon: <Building className="h-4 w-4" />,
            enabled: safeArrayLength(listings.studios) > 0,
            description: 'Professional studio spaces for rent',
            portfolio: safeArray(listings.studios).map((studio: any) => ({
              id: studio?.id,
              title: studio?.name,
              image: safeArray(studio?.images)[0] || studio?.image_url,
              hourlyRate: studio?.hourly_rate
            }))
          },
          {
            id: 'events',
            name: 'Events & Workshops',
            icon: <Calendar className="h-4 w-4" />,
            enabled: safeArrayLength(listings.events) > 0,
            description: 'Hosted workshops, events, and experiences',
            portfolio: safeArray(listings.events).map((event: any) => ({
              id: event?.id,
              title: event?.title,
              image: event?.image_url,
              date: event?.date,
              price: event?.price
            }))
          }
        ];
        break;

      case 'Investor':
        modules = [
          {
            id: 'investments',
            name: 'Investment Opportunities',
            icon: <DollarSign className="h-4 w-4" />,
            enabled: safeArrayLength(listings.investments) > 0,
            description: 'Investment and funding opportunities',
            portfolio: safeArray(listings.investments).map((investment: any) => ({
              id: investment?.id,
              title: investment?.title,
              image: investment?.image_url,
              amount: investment?.target_amount
            }))
          }
        ];
        break;

      case 'Legal':
        modules = [
          {
            id: 'legalServices',
            name: 'Legal Services',
            icon: <Briefcase className="h-4 w-4" />,
            enabled: safeArrayLength(listings.legalServices) > 0,
            description: 'Legal consultation and services',
            portfolio: safeArray(listings.legalServices).map((service: any) => ({
              id: service?.id,
              title: service?.service_type,
              description: service?.description,
              hourlyRate: service?.hourly_rate
            }))
          }
        ];
        break;

      default:
        // Show all for backward compatibility
        modules = [
          {
            id: 'artworks',
            name: 'Asset Marketplace',
            icon: <Grid className="h-4 w-4" />,
            enabled: safeArrayLength(listings.artworks) > 0,
            description: 'Digital assets, artwork, and design resources',
            portfolio: safeArray(listings.artworks).map((artwork: any) => ({
              id: artwork?.id,
              title: artwork?.title,
              image: artwork?.image_url,
              price: artwork?.price
            }))
          }
        ];
    }

    return modules;
  };

  const serviceModules = generateServiceModules();
  const enabledServices = serviceModules.filter(service => service.enabled);

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className={`mb-8 ${isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}`}>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column - Avatar and Basic Info */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profileData.avatar_url} alt={profileData.full_name || 'User'} />
                  <AvatarFallback className="text-3xl">
                    {(profileData.full_name || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Service Badges */}
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${
                    isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>Active Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {enabledServices.length > 0 ? enabledServices.map((service) => (
                      <Badge key={service.id} variant="secondary" className="text-xs">
                        <span className="mr-1">{service.icon}</span>
                        {service.name.split(' ')[0]}
                      </Badge>
                    )) : (
                      <Badge variant="outline" className="text-xs">No services yet</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Center Column - Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className={`text-3xl font-title flex items-center gap-3 mb-2 ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {profileData.full_name || 'Unknown User'}
                      {profileData.is_verified && (
                        <Badge variant="default" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </h1>
                    <p className={`mb-2 ${
                      isDashboardDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>@{profileData.username || 'user'}</p>
                    
                    <div className={`flex items-center gap-4 text-sm mb-4 ${
                      isDashboardDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {profileData.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profileData.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {(profileData.overall_rating || 0).toFixed(1)} ({profileData.total_reviews || 0} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <Link href="/dashboard/profile-settings">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button size="sm">
                          <User className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className={`mb-4 ${
                  isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>{profileData.bio || 'No bio available yet.'}</p>
                
                {/* Profile Type Specific Info */}
                {profileData.profile_type && (
                  <div className={`rounded-lg p-4 mb-6 ${
                    isDashboardDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}>
                    <h4 className={`font-semibold mb-2 font-title ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>{profileData.profile_type} Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {profileData.profile_type === 'Artist' && safeArrayLength(profileData.specialties) > 0 && (
                        <div>
                          <span className={`font-medium ${
                            isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}>Specialties:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {safeArray(profileData.specialties).map((specialty: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className={`text-center p-3 rounded-lg ${
                    isDashboardDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}>
                    <div className={`font-semibold ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>{profileData.response_rate || 0}%</div>
                    <div className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>Response Rate</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    isDashboardDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}>
                    <div className={`font-semibold ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>{profileData.response_time || 'N/A'}</div>
                    <div className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>Response Time</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    isDashboardDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}>
                    <div className={`font-semibold ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>{(profileData.followers_count || 0).toLocaleString()}</div>
                    <div className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>Followers</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    isDashboardDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}>
                    <div className={`font-semibold ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>{profileData.total_listings || 0}</div>
                    <div className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>Total Listings</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Services Summary */}
              <div className="lg:col-span-2">
                <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                  <CardHeader>
                    <CardTitle className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Active Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {enabledServices.length > 0 ? (
                      <div className="space-y-4">
                        {enabledServices.map((service) => (
                          <div key={service.id} className={`flex items-start space-x-3 p-3 border rounded-lg ${
                            isDashboardDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-gray-50"
                          }`}>
                            <div className={`p-2 rounded-lg ${
                              isDashboardDarkMode ? "bg-gray-700" : "bg-white"
                            }`}>
                              {service.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${
                                isDashboardDarkMode ? "text-white" : "text-gray-900"
                              }`}>{service.name}</h3>
                              <p className={`text-sm ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}>{service.description}</p>
                              <p className={`text-xs mt-1 ${
                                isDashboardDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {service.portfolio?.length || 0} listings
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className={`text-gray-400 mb-4`}>
                          <Grid className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className={`font-semibold mb-2 ${
                          isDashboardDarkMode ? "text-white" : "text-gray-900"
                        }`}>No Active Services</h3>
                        <p className={`text-sm ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                          {isOwnProfile ? "Start by adding your first listing" : "This user hasn't added any services yet"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Profile Stats */}
              <div>
                <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                  <CardHeader>
                    <CardTitle className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Profile Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className={isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}>Member Since</span>
                      <span className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>
                        {new Date(profileData.joined_date).getFullYear()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}>Profile Views</span>
                      <span className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>
                        {Math.floor(Math.random() * 1000) + 100}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}>Total Listings</span>
                      <span className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>
                        {profileData.total_listings}
                      </span>
                    </div>
                    {profileData.website && (
                      <div className="pt-4 border-t border-gray-200">
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>All Services</CardTitle>
              </CardHeader>
              <CardContent>
                {serviceModules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {serviceModules.map((service) => (
                      <div key={service.id} className={`p-4 rounded-lg border ${
                        service.enabled 
                          ? isDashboardDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-gray-50"
                          : isDashboardDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-gray-25"
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            service.enabled 
                              ? isDashboardDarkMode ? "bg-gray-700" : "bg-white"
                              : isDashboardDarkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}>
                            {service.icon}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${
                              isDashboardDarkMode ? "text-white" : "text-gray-900"
                            }`}>{service.name}</h3>
                            <p className={`text-xs ${
                              isDashboardDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {service.enabled ? `${service.portfolio?.length || 0} listings` : 'No listings yet'}
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>{service.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`text-gray-400 mb-4`}>
                      <Briefcase className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className={`font-semibold mb-2 ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>No Services Available</h3>
                    <p className={`text-sm ${
                      isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {isOwnProfile ? "Add your first service to get started" : "This user hasn't added any services yet"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            <div className="space-y-6">
              {enabledServices.map((service) => (
                <Card key={service.id} className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {service.icon}
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {service.portfolio && service.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {service.portfolio.slice(0, 6).map((item: any, index: number) => (
                          <div key={item.id || index} className={`rounded-lg border overflow-hidden ${
                            isDashboardDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-gray-50"
                          }`}>
                            {item.image && (
                              <ImageWithFallback
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <h4 className={`font-semibold mb-2 ${
                                isDashboardDarkMode ? "text-white" : "text-gray-900"
                              }`}>{item.title}</h4>
                              {item.price && (
                                <p className={`text-sm ${
                                  isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}>${item.price}</p>
                              )}
                              {item.hourlyRate && (
                                <p className={`text-sm ${
                                  isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}>${item.hourlyRate}/hour</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className={`text-sm ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>No items to display</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {enabledServices.length === 0 && (
                <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                  <CardContent className="text-center py-12">
                    <div className={`text-gray-400 mb-4`}>
                      <Grid className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>No Portfolio Items</h3>
                    <p className={`text-sm ${
                      isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {isOwnProfile ? "Add your first listing to showcase your work" : "This user hasn't shared any work yet"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any, index: number) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        isDashboardDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
                            <AvatarFallback>{review.reviewer_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={`font-semibold text-sm ${
                              isDashboardDarkMode ? "text-white" : "text-gray-900"
                            }`}>{review.reviewer_name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className={`text-sm ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className={`text-gray-400 mb-4`}>
                      <Star className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>No Reviews Yet</h3>
                    <p className={`text-sm ${
                      isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {isOwnProfile ? "Reviews from clients will appear here" : "This user hasn't received any reviews yet"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

