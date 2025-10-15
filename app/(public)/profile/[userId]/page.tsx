'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Settings, Share, Heart, Eye, Grid, User, MapPin, Star, Camera, Mic, Palette, Building, DollarSign, Calendar, Briefcase, Plus, Check, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { ArtistProfilePage } from '@/components/pages/ArtistProfilePage';

interface ServiceModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description?: string;
  portfolio?: any[];
}

export default function ProfilePage() {
  const isDashboardDarkMode = false; // Could be managed via context or settings in the future
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

  const serviceModules: ServiceModule[] = [
    { id: 'asset', name: 'Asset Creation', icon: <Palette className="h-5 w-5" />, enabled: true },
    { id: 'talent', name: 'Talent Services', icon: <User className="h-5 w-5" />, enabled: true },
    { id: 'studios', name: 'Studio Rental', icon: <Building className="h-5 w-5" />, enabled: false },
    { id: 'investor', name: 'Investment', icon: <DollarSign className="h-5 w-5" />, enabled: false },
    { id: 'events', name: 'Event Hosting', icon: <Calendar className="h-5 w-5" />, enabled: false },
    { id: 'legal', name: 'Legal Services', icon: <Briefcase className="h-5 w-5" />, enabled: false },
  ];

  const getEnabledServices = () => {
    return serviceModules.filter(service => service.enabled);
  };

  const enabledServices = getEnabledServices();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        console.log('Fetching profile for user ID:', targetUserId);
        console.log('Is own profile:', isOwnProfile);

        const baseUrl = `https://${projectId}.supabase.co/rest/v1`;
        const headers = {
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        };

        // Fetch user profile data
        const userResponse = await fetch(`${baseUrl}/user_info?select=*&id=eq.${targetUserId}`, {
          headers
        });
        
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
        }
        
        const userData = await userResponse.json();
        console.log('User data fetched:', userData);

        // Initialize with found user or create default for own profile
        let foundUserInfo = userData.length > 0 ? userData[0] : null;
        
        // If this is our own profile and no data exists, create default data
        if (!foundUserInfo) {
          console.log('No user data found');
          if (isOwnProfile && user && !foundUserInfo) {
            foundUserInfo = {
              id: user.id,
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              bio: 'Welcome to my profile!',
              location: '',
              website: '',
              avatar_url: user.user_metadata?.avatar_url || '',
              email: user.email || '',
              phone: '',
              social_links: {},
              skills: [],
              portfolio_items: [],
              reviews_received: [],
              services_offered: []
            };
            console.log('Created default profile for own user:', foundUserInfo);
          }
        }

        // Fetch listings data (assets, talent, etc.)
        const listingsResponse = await fetch(`${baseUrl}/listings?select=*&user_id=eq.${targetUserId}`, {
          headers
        });
        
        let listingsData = [];
        if (listingsResponse.ok) {
          listingsData = await listingsResponse.json();
          console.log('Listings data fetched:', listingsData);
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`${baseUrl}/reviews?select=*&target_user_id=eq.${targetUserId}&order=created_at.desc&limit=10`, {
          headers
        });
        
        let reviewsData = [];
        if (reviewsResponse.ok) {
          reviewsData = await reviewsResponse.json();
          console.log('Reviews data fetched:', reviewsData);
        }

        setProfileData(foundUserInfo);
        setListings(listingsData);
        setReviews(reviewsData);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Set some default data for demo purposes
        setProfileData({
          id: targetUserId,
          display_name: isOwnProfile ? (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User') : 'User Profile',
          bio: 'Welcome to this profile!',
          location: '',
          website: '',
          avatar_url: isOwnProfile ? (user?.user_metadata?.avatar_url || '') : '',
          email: isOwnProfile ? (user?.email || '') : '',
          phone: '',
          social_links: {},
          skills: [],
          portfolio_items: [],
          reviews_received: [],
          services_offered: []
        });
        setListings([]);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) {
      fetchProfileData();
    }
  }, [targetUserId, isOwnProfile, user?.id]);

  const handleSaveProfile = async (updatedData: any) => {
    try {
      console.log('Saving profile data:', updatedData);
      
      const baseUrl = `https://${projectId}.supabase.co/rest/v1`;
      const headers = {
        'apikey': publicAnonKey,
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      };

      // Try to update existing record first
      const updateResponse = await fetch(`${baseUrl}/user_info?id=eq.${user?.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updatedData)
      });

      if (updateResponse.ok) {
        const updatedRecord = await updateResponse.json();
        if (updatedRecord.length > 0) {
          setProfileData(updatedRecord[0]);
          setShowEditDialog(false);
          return;
        }
      }

      // If update didn't work, try to insert new record
      const insertResponse = await fetch(`${baseUrl}/user_info`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...updatedData, id: user?.id })
      });

      if (insertResponse.ok) {
        const newRecord = await insertResponse.json();
        if (newRecord.length > 0) {
          setProfileData(newRecord[0]);
        } else {
          // Just update local state if database operations fail
          setProfileData({ ...profileData, ...updatedData });
        }
      } else {
        // Fallback to local state update
        setProfileData({ ...profileData, ...updatedData });
      }
      
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Fallback to local state update
      setProfileData({ ...profileData, ...updatedData });
      setShowEditDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  // Check if this is an artist profile type
  const isArtistProfile = profileData?.profile_type === 'artist' || 
                         profileData?.account_type === 'artist' ||
                         safeArray(profileData?.services_offered).some((service: any) => 
                           service?.category === 'art' || service?.type === 'artwork'
                         );

  // If it's an artist profile, render the specialized artist profile page
  if (isArtistProfile) {
    return <ArtistProfilePage isDashboardDarkMode={isDashboardDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDashboardDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData?.avatar_url} alt={profileData?.display_name} />
                  <AvatarFallback>
                    {profileData?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className={`text-3xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profileData?.display_name || 'User Profile'}
                  </h1>
                  <p className={`text-lg ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profileData?.bio || 'No bio available'}
                  </p>
                  {profileData?.location && (
                    <div className={`flex items-center mt-1 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {isOwnProfile ? (
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <EditProfileForm 
                        profileData={profileData} 
                        onSave={handleSaveProfile}
                        onCancel={() => setShowEditDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center ${isDashboardDarkMode ? 'text-white' : ''}`}>
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData?.website && (
                    <div className="flex items-center">
                      <ExternalLink className={`h-4 w-4 mr-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Link 
                        href={profileData.website} 
                        className="text-purple-600 hover:text-purple-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </Link>
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <>
                      {profileData?.email && (
                        <div className={`flex items-center ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="font-medium mr-2">Email:</span>
                          <span>{profileData.email}</span>
                        </div>
                      )}
                      
                      {profileData?.phone && (
                        <div className={`flex items-center ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="font-medium mr-2">Phone:</span>
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Public contact options for non-own profiles */}
                  {profileData.email && !isOwnProfile && (
                    <Button variant="outline" className="w-full">
                      Contact via Email
                    </Button>
                  )}
                  
                  {profileData.phone && !isOwnProfile && (
                    <Button variant="outline" className="w-full">
                      Contact via Phone
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              {safeArray(profileData?.skills).length > 0 && (
                <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isDashboardDarkMode ? 'text-white' : ''}`}>
                      <Star className="h-5 w-5 mr-2" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {safeArray(profileData.skills).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services Offered */}
              {!isOwnProfile && enabledServices.length > 0 && (
                <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isDashboardDarkMode ? 'text-white' : ''}`}>
                      <Briefcase className="h-5 w-5 mr-2" />
                      Services Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {enabledServices.map((service) => (
                        <div key={service.id} className={`flex items-center p-3 rounded-lg border ${isDashboardDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                          <div className={`p-2 rounded-lg mr-3 ${isDashboardDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            {service.icon}
                          </div>
                          <div>
                            <h4 className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {service.name}
                            </h4>
                            {service.description && (
                              <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className={`grid w-full ${isDashboardDarkMode ? 'bg-gray-800' : ''}`} style={{ gridTemplateColumns: `repeat(${isOwnProfile ? 4 : 3}, 1fr)` }}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                {isOwnProfile && (
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Grid className={`h-8 w-8 ${isDashboardDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          <div className="ml-4">
                            <p className={`text-sm font-medium ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Portfolio Items
                            </p>
                            <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {safeArrayLength(profileData?.portfolio_items)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Star className={`h-8 w-8 ${isDashboardDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                          <div className="ml-4">
                            <p className={`text-sm font-medium ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Average Rating
                            </p>
                            <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              4.8
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Eye className={`h-8 w-8 ${isDashboardDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <div className="ml-4">
                            <p className={`text-sm font-medium ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Profile Views
                            </p>
                            <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              1,234
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader>
                      <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>
                        {isOwnProfile 
                          ? 'Your Recent Activity' 
                          : `${profileData?.display_name}'s Recent Activity`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Updated portfolio with new artwork',
                          'Completed collaboration with Studio XYZ',
                          'Posted new service offering',
                          'Received 5-star review from client'
                        ].map((activity, index) => (
                          <div key={index} className={`flex items-center p-3 rounded-lg ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className={`w-2 h-2 rounded-full mr-3 ${isDashboardDarkMode ? 'bg-purple-400' : 'bg-purple-600'}`}></div>
                            <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {safeArray(profileData?.portfolio_items).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {safeArray(profileData.portfolio_items).map((item: any, index: number) => (
                          <div key={index} className={`group cursor-pointer rounded-lg overflow-hidden ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="aspect-square bg-gray-100 relative">
                              {item.image_url ? (
                                <ImageWithFallback 
                                  src={item.image_url} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Camera className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className={`font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.title || 'Untitled'}
                              </h3>
                              <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                {item.description || 'No description'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Camera className={`h-12 w-12 mx-auto ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <h3 className={`mt-4 text-lg font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          No portfolio items yet
                        </h3>
                        <p className={`mt-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {isOwnProfile 
                            ? 'Start building your portfolio by adding your work.' 
                            : 'This user hasn\'t added any portfolio items yet.'}
                        </p>
                        {isOwnProfile && (
                          <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Portfolio Item
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader>
                    <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review: any, index: number) => (
                          <div key={index} className={`border-b last:border-b-0 pb-6 last:pb-0 ${isDashboardDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage src={review.reviewer_avatar} />
                                <AvatarFallback>{review.reviewer_name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {review.reviewer_name || 'Anonymous'}
                                  </h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : isDashboardDarkMode ? 'text-gray-600' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className={`mt-2 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {review.comment}
                                </p>
                                <p className={`mt-2 text-sm ${isDashboardDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star className={`h-12 w-12 mx-auto ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <h3 className={`mt-4 text-lg font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          No reviews yet
                        </h3>
                        <p className={`mt-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {isOwnProfile 
                            ? 'Reviews from your clients will appear here.' 
                            : 'This user hasn\'t received any reviews yet.'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="settings">
                  <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader>
                      <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className={`text-lg font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Service Modules
                          </h3>
                          <div className="space-y-3">
                            {serviceModules.map((service) => (
                              <div key={service.id} className={`flex items-center justify-between p-4 rounded-lg border ${isDashboardDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-center">
                                  <div className={`p-2 rounded-lg mr-3 ${service.enabled ? (isDashboardDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600') : (isDashboardDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500')}`}>
                                    {service.icon}
                                  </div>
                                  <div>
                                    <h4 className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {service.name}
                                    </h4>
                                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {service.enabled ? 'Active service module' : 'Inactive service module'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {service.enabled && (
                                    <Check className={`h-5 w-5 mr-2 ${isDashboardDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                  )}
                                  <Button variant="outline" size="sm">
                                    {service.enabled ? 'Configure' : 'Enable'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Profile Form Component
function EditProfileForm({ 
  profileData, 
  onSave, 
  onCancel 
}: { 
  profileData: any; 
  onSave: (data: any) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    display_name: profileData?.display_name || '',
    bio: profileData?.bio || '',
    location: profileData?.location || '',
    website: profileData?.website || '',
    phone: profileData?.phone || '',
    skills: (profileData?.skills || []).join(', ')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          placeholder="Your display name"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Your location"
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Your phone number"
        />
      </div>

      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, Design, Photography, etc."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}