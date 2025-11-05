'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Settings, Share, Heart, Eye, Grid, User, MapPin, Star, Camera, Mic, Palette, Building, DollarSign, Calendar, Briefcase, Plus, Check, Edit3, ExternalLink, MessageSquare } from 'lucide-react';
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
  const [assets, setAssets] = useState<any[]>([]);
  const [talents, setTalents] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

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

        const apiBaseUrl = 'http://localhost:5001/api';
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Add auth token if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch user data
        const userResponse = await fetch(`${apiBaseUrl}/users/${targetUserId}`, { headers });
        let userData = null;
        if (userResponse.ok) {
          userData = await userResponse.json();
        }

        // Fetch user profile data (if exists)
        let profileInfo = null;
        if (user && token) {
          try {
            const profileResponse = await fetch(`${apiBaseUrl}/user-profiles/user/${targetUserId}`, { headers });
            if (profileResponse.ok) {
              profileInfo = await profileResponse.json();
            }
          } catch (e) {
            console.log('Profile not found, using user data');
          }
        }

        // Combine user and profile data
        const combinedData = {
          id: userData?.id || targetUserId,
          display_name: userData?.display_name || userData?.username || 'User',
          bio: profileInfo?.bio || userData?.bio || '',
          location: profileInfo?.location || '',
          website: profileInfo?.website || '',
          avatar_url: userData?.avatar_url || '',
          email: isOwnProfile ? (userData?.email || '') : '',
          phone: profileInfo?.phone || '',
          skills: profileInfo?.skills || [],
          portfolio_items: [],
          ...userData,
          ...profileInfo
        };

        // Fetch assets
        const assetsResponse = await fetch(`${apiBaseUrl}/assets/user/${targetUserId}`, { headers });
        let assetsData = [];
        if (assetsResponse.ok) {
          assetsData = await assetsResponse.json();
          combinedData.portfolio_items = assetsData.map((asset: any) => ({
            id: asset.id,
            title: asset.name,
            description: asset.description,
            image_url: asset.url || asset.thumbnail_url,
            created_at: asset.created_at
          }));
        }

        // Fetch talent listings (all talents, will filter by user_id in the response)
        const talentsResponse = await fetch(`${apiBaseUrl}/talents/search`, { headers });
        let talentsData = [];
        if (talentsResponse.ok) {
          const allTalents = await talentsResponse.json();
          // Filter talents by user_id
          talentsData = allTalents.filter((talent: any) => talent.user_id?.toString() === targetUserId?.toString());
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`${apiBaseUrl}/user-reviews/user/${targetUserId}`, { headers });
        let reviewsData = [];
        if (reviewsResponse.ok) {
          reviewsData = await reviewsResponse.json();
        }

        // Fetch review stats
        const statsResponse = await fetch(`${apiBaseUrl}/user-reviews/user/${targetUserId}/stats`, { headers });
        let statsData = null;
        if (statsResponse.ok) {
          statsData = await statsResponse.json();
        }

        // Check if current user is following this user
        if (user && token && !isOwnProfile) {
          try {
            const followCheckResponse = await fetch(`${apiBaseUrl}/user-follows/${targetUserId}/check`, { headers });
            if (followCheckResponse.ok) {
              const followData = await followCheckResponse.json();
              setIsFollowing(followData.is_following || false);
            }
          } catch (e) {
            console.log('Could not check follow status');
          }
        }

        setProfileData(combinedData);
        setAssets(assetsData);
        setTalents(talentsData);
        setReviews(reviewsData);
        setReviewStats(statsData);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setProfileData({
          id: targetUserId,
          display_name: 'User Profile',
          bio: '',
          location: '',
          website: '',
          avatar_url: '',
          email: '',
          phone: '',
          skills: [],
          portfolio_items: [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) {
      fetchProfileData();
    }
  }, [targetUserId, isOwnProfile, user?.id]);

  // Button handlers
  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${targetUserId}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      alert('Profile link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleConnect = async () => {
    if (!user) {
      window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (isOwnProfile) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    try {
      const apiBaseUrl = 'http://localhost:5001/api';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      if (isFollowing) {
        // Unfollow
        const response = await fetch(`${apiBaseUrl}/user-follows/${targetUserId}/follow`, {
          method: 'DELETE',
          headers,
        });
        if (response.ok) {
          setIsFollowing(false);
          alert('Unfollowed successfully');
        }
      } else {
        // Follow
        const response = await fetch(`${apiBaseUrl}/user-follows/${targetUserId}/follow`, {
          method: 'POST',
          headers,
        });
        if (response.ok) {
          setIsFollowing(true);
          alert('Followed successfully');
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to connect. Please try again.');
    }
  };

  const handleContactEmail = () => {
    if (profileData?.email) {
      window.location.href = `mailto:${profileData.email}`;
    } else {
      alert('Email not available');
    }
  };

  const handleContactPhone = () => {
    if (profileData?.phone) {
      window.location.href = `tel:${profileData.phone}`;
    } else {
      alert('Phone number not available');
    }
  };

  const handleContactChat = () => {
    if (!user) {
      window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    window.location.href = `/dashboard/chat?userId=${targetUserId}`;
  };

  const handleSaveProfile = async (updatedData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        alert('Please log in to save your profile');
        return;
      }

      const apiBaseUrl = 'http://localhost:5001/api';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Update user profile
      const response = await fetch(`${apiBaseUrl}/user-profiles/user/${user.id}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          bio: updatedData.bio,
          location: updatedData.location,
          website: updatedData.website,
          phone: updatedData.phone,
          skills: updatedData.skills,
        }),
      });

      if (response.ok) {
        const savedProfile = await response.json();
        setProfileData({ ...profileData, ...savedProfile });
        setShowEditDialog(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
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
                <Button variant="outline" size="sm" onClick={handleShare}>
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
                  <Button onClick={handleConnect}>
                    {isFollowing ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
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
                  {!isOwnProfile && (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full mb-2"
                        onClick={handleContactChat}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      {profileData?.email && (
                        <Button 
                          variant="outline" 
                          className="w-full mb-2"
                          onClick={handleContactEmail}
                        >
                          Contact via Email
                        </Button>
                      )}
                      {profileData?.phone && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleContactPhone}
                        >
                          Contact via Phone
                        </Button>
                      )}
                    </>
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
                              {safeArrayLength(profileData?.portfolio_items) || assets.length}
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
                              {reviewStats?.average_rating ? reviewStats.average_rating.toFixed(1) : '0.0'}
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
                                <AvatarFallback>{(review.reviewer_name || review.reviewer_username || 'U')?.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {review.reviewer_name || review.reviewer_username || 'Anonymous'}
                                  </h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : isDashboardDarkMode ? 'text-gray-600' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className={`mt-2 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {review.review_text || review.comment || 'No comment'}
                                </p>
                                <p className={`mt-2 text-sm ${isDashboardDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
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