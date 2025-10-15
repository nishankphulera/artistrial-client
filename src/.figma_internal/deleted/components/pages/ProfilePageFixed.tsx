import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Settings, Share, Heart, Eye, Grid, User, MapPin, Star, Camera, Mic, Palette, Building, DollarSign, Calendar, Briefcase, Plus, Check, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ArtistProfilePage } from './ArtistProfilePage';

interface ServiceModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description?: string;
  portfolio?: any[];
}

interface ProfilePageProps {
  isDashboardDarkMode?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ isDashboardDarkMode = false }) => {
  const { userId } = useParams();
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;
  const [showEditDialog, setShowEditDialog] = useState(false);
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('access_token') || publicAnonKey;
        
        // First try to get the profile from the backend
        console.log('Fetching profile for user:', targetUserId);
        console.log('Current user:', user?.id);
        console.log('Is own profile:', isOwnProfile);
        
        let response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/profiles/${targetUserId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        console.log('Profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Profile data received:', data);
          setProfileData(data.profile);
          setListings(data.listings || {});
          setReviews(safeArray(data.reviews));
        } else if (response.status === 404) {
          // Profile not found - try to find user data from artworks/listings
          console.log('Profile not found (404), checking for user in artworks...');
          const errorText = await response.text();
          console.log('404 response text:', errorText);
          
          // Fetch artworks to see if we can find user info
          const artworksResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/artworks`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
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
              legalServices: []
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
        console.error('Error fetching profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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

  // If this is an Artist profile, use the specialized Artist profile layout
  if (profileData.profile_type === 'Artist' || (!profileData.profile_type && safeArrayLength(listings?.artworks) > 0)) {
    return <ArtistProfilePage isDashboardDarkMode={isDashboardDarkMode} />;
  }

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
                      <Link href="/profile-settings">
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
                      
                      {profileData.profile_type === 'Venue' && (
                        <>
                          {profileData.venue_capacity && (
                            <div>
                              <span className={`font-medium ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>Capacity:</span>
                              <span className={`ml-2 ${
                                isDashboardDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}>{profileData.venue_capacity} people</span>
                            </div>
                          )}
                          {safeArrayLength(profileData.venue_amenities) > 0 && (
                            <div>
                              <span className={`font-medium ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>Amenities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {safeArray(profileData.venue_amenities).map((amenity: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {profileData.profile_type === 'Investor' && (
                        <>
                          {profileData.investment_range && (
                            <div>
                              <span className={`font-medium ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>Investment Range:</span>
                              <span className={`ml-2 ${
                                isDashboardDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}>
                                ${(profileData.investment_range.min || 0).toLocaleString()} - ${(profileData.investment_range.max || 0).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {safeArrayLength(profileData.investment_focus) > 0 && (
                            <div>
                              <span className={`font-medium ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>Focus Areas:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {safeArray(profileData.investment_focus).map((focus: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">{focus}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {profileData.profile_type === 'Legal' && (
                        <>
                          {safeArrayLength(profileData.legal_specialization) > 0 && (
                            <div>
                              <span className={`font-medium ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>Specialization:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {safeArray(profileData.legal_specialization).map((spec: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {safeArrayLength(profileData.bar_admission) > 0 && (
                            <div>
                              <span className={`font-medium ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>Bar Admission:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {safeArray(profileData.bar_admission).map((bar: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">{bar}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
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
                            isDashboardDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"
                          }`}>
                            <div className="flex-shrink-0 mt-1">
                              {service.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-medium ${
                                isDashboardDarkMode ? "text-white" : "text-gray-900"
                              }`}>{service.name}</h4>
                              <p className={`text-sm ${
                                isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}>{service.description}</p>
                              <div className={`mt-2 text-sm ${
                                isDashboardDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {safeArrayLength(service.portfolio)} items available
                              </div>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${
                        isDashboardDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No active services yet</p>
                        {isOwnProfile && (
                          <p className="text-sm mt-2">Start by uploading content or creating listings</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Quick Actions */}
              <div className="space-y-6">
                <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                  <CardHeader>
                    <CardTitle className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profileData.email && !isOwnProfile && (
                      <div className="text-sm">
                        <span className={`font-medium ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>Email:</span>
                        <br />
                        <a href={`mailto:${profileData.email}`} className="text-blue-600 hover:underline">
                          {profileData.email}
                        </a>
                      </div>
                    )}
                    {profileData.phone && !isOwnProfile && (
                      <div className="text-sm">
                        <span className={`font-medium ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>Phone:</span>
                        <br />
                        <a href={`tel:${profileData.phone}`} className="text-blue-600 hover:underline">
                          {profileData.phone}
                        </a>
                      </div>
                    )}
                    {profileData.website && (
                      <div className="text-sm">
                        <span className={`font-medium ${
                          isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>Website:</span>
                        <br />
                        <a 
                          href={profileData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {profileData.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {(!profileData.email && !profileData.phone && !profileData.website) && (
                      <div className={`text-sm ${
                        isDashboardDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        No contact information available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {!isOwnProfile && enabledServices.length > 0 && (
                  <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                    <CardHeader>
                      <CardTitle className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full">Send Message</Button>
                      <Button variant="outline" className="w-full">Book Service</Button>
                      <Button variant="outline" className="w-full">Request Quote</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            {enabledServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enabledServices.map((service) => (
                  <Card key={service.id} className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${
                        isDashboardDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {service.icon}
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-sm mb-4 ${
                        isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}>{service.description}</p>
                      <div className={`text-sm font-medium mb-2 ${
                        isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        {safeArrayLength(service.portfolio)} items available
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                <CardContent className="p-8 text-center">
                  <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className={`font-title text-lg mb-2 ${
                    isDashboardDarkMode ? "text-white" : "text-gray-900"
                  }`}>No Services Available</h3>
                  <p className={`mb-4 ${
                    isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {isOwnProfile 
                      ? "You haven't created any service listings yet."
                      : "This user doesn't have any services available."
                    }
                  </p>
                  {isOwnProfile && (
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Service
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
              <CardContent className="p-8 text-center">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className={`font-title text-lg mb-2 ${
                  isDashboardDarkMode ? "text-white" : "text-gray-900"
                }`}>Portfolio Coming Soon</h3>
                <p className={isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Portfolio showcase will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
              <CardContent className="p-8 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className={`font-title text-lg mb-2 ${
                  isDashboardDarkMode ? "text-white" : "text-gray-900"
                }`}>No Reviews Yet</h3>
                <p className={isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}>
                  {isOwnProfile 
                    ? "Reviews from your clients will appear here."
                    : "This user hasn't received any reviews yet."
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

