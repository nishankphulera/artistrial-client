import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, Share, Heart, Eye, Grid, User, MapPin, Star, Camera, 
  Palette, Plus, Check, Edit3, ExternalLink, Award, Users, 
  MessageSquare, Calendar, Instagram, Twitter, Linkedin, 
  Play, Download, BookOpen, Zap, Music, FileText, Image,
  Sparkles, TrendingUp, Clock, ChevronRight, X, Minimize2, 
  Video, Volume2, Pause
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { VideoExpansionModal } from '../shared/VideoExpansionModal';
import { useAuth } from '../providers/AuthProvider';
import { useAudioPlayer } from '../providers/AudioPlayerProvider';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface ArtistProfilePageProps {
  isDashboardDarkMode?: boolean;
}

export const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({ isDashboardDarkMode = false }) => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { playTrack } = useAudioPlayer();
  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [listings, setListings] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [selectedVideoData, setSelectedVideoData] = useState<any>(null);

  // Helper functions
  const safeArrayLength = (arr: any): number => Array.isArray(arr) ? arr.length : 0;
  const safeArray = (arr: any): any[] => Array.isArray(arr) ? arr : [];

  // Audio player handler
  const handlePlayAudio = () => {
    const audioTrack = {
      id: 'ambient-dreams',
      title: 'Ambient Dreams',
      artist: profileData.full_name || 'Artist',
      duration: '3:45',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', // Demo audio URL
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f'
    };
    playTrack(audioTrack);
  };

  // Video expansion handler
  const handleVideoClick = (videoData: any) => {
    setSelectedVideoData(videoData);
    setExpandedVideo(videoData.id);
  };

  const closeVideoModal = () => {
    setExpandedVideo(null);
    setSelectedVideoData(null);
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
        
        let response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/profiles/${targetUserId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.profile);
          setListings(data.listings || {});
          setReviews(safeArray(data.reviews));
        } else if (response.status === 404) {
          // Handle 404 case with default artist profile
          if (isOwnProfile && user) {
            const defaultProfile = {
              id: user.id,
              username: user.email?.split('@')[0] || 'artist',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Artist',
              bio: 'Creative professional passionate about visual storytelling',
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
              specialties: ['Digital Art', 'Illustration', 'Visual Design'],
              profile_type: 'Artist'
            };
            setProfileData(defaultProfile);
            setListings({ artworks: [], talents: [] });
            setReviews([]);
          } else {
            setProfileData(null);
          }
        } else {
          console.error('Error response:', response.status);
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
            isDashboardDarkMode ? "border-[#FF8D28]" : "border-[#FF8D28]"
          }`}></div>
          <p className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>Loading artist profile...</p>
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
          }`}>Artist Profile Not Found</h2>
          <p className={`mb-4 ${
            isDashboardDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>The artist profile you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock artwork data for demonstration
  const artworks = [
    {
      id: 1,
      title: "Abstract Dreams",
      image: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb",
      price: "$150",
      likes: 24,
      category: "Digital Art"
    },
    {
      id: 2,
      title: "Creative Workspace",
      image: "https://images.unsplash.com/photo-1756719164587-3dfcacc9a6e5",
      price: "$200",
      likes: 31,
      category: "Photography"
    },
    {
      id: 3,
      title: "Art Supplies Study",
      image: "https://images.unsplash.com/photo-1588014328208-de6c5973a014",
      price: "$120",
      likes: 18,
      category: "Still Life"
    }
  ];

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      {/* Hero Section with Cover */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-80 bg-gradient-to-br from-[#FF8D28]/20 via-purple-500/20 to-pink-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            {/* Artist Info */}
            <div className="flex items-end gap-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarImage src={profileData.avatar_url} alt={profileData.full_name || 'Artist'} />
                <AvatarFallback className="text-4xl bg-[#FF8D28] text-white">
                  {(profileData.full_name || 'A').charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-white pb-2">
                <h1 className="text-4xl font-title font-bold mb-2 flex items-center gap-3">
                  {profileData.full_name || 'Artist'}
                  {profileData.is_verified && (
                    <Badge className="bg-blue-500 text-white text-sm">
                      <Check className="w-4 h-4 mr-1" />
                      Verified Artist
                    </Badge>
                  )}
                </h1>
                <p className="text-xl text-white/90 mb-2">@{profileData.username || 'artist'}</p>
                <div className="flex items-center gap-4 text-white/80">
                  {profileData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {(profileData.overall_rating || 0).toFixed(1)} ({profileData.total_reviews || 0} reviews)
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {(profileData.followers_count || 0).toLocaleString()} followers
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 pb-2">
              {isOwnProfile ? (
                <Link href="/profile-settings">
                  <Button className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border border-white/30">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                    <User className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border border-white/30">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border border-white/30" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Artist Bio & Specialties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bio & About */}
          <div className="lg:col-span-2">
            <Card className={`${isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"} mb-6`}>
              <CardContent className="p-6">
                <h3 className={`font-title text-xl mb-4 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  About the Artist
                </h3>
                <p className={`text-lg leading-relaxed mb-6 ${
                  isDashboardDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {profileData.bio || 'A passionate artist creating unique visual experiences that inspire and captivate audiences worldwide.'}
                </p>
                
                {/* Specialties */}
                {safeArrayLength(profileData.specialties) > 0 && (
                  <div className="mb-6">
                    <h4 className={`font-title font-medium mb-3 ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {safeArray(profileData.specialties).map((specialty: string, index: number) => (
                        <Badge key={index} className="bg-[#FF8D28]/20 text-[#FF8D28] hover:bg-[#FF8D28]/30 border-[#FF8D28]/30">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Links */}
                <div className="flex gap-4">
                  {profileData.website && (
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#FF8D28] hover:text-[#FF8D28]/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  <a href="#" className="flex items-center gap-2 text-[#FF8D28] hover:text-[#FF8D28]/80">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[#FF8D28] hover:text-[#FF8D28]/80">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Quick Info */}
          <div className="space-y-6">
            {/* Artist Stats */}
            <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  <Award className="w-5 h-5 text-[#FF8D28]" />
                  Artist Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-title font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {artworks.length}
                    </div>
                    <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Artworks
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-title font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {artworks.reduce((sum, art) => sum + art.likes, 0)}
                    </div>
                    <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Total Likes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-title font-bold text-[#FF8D28]`}>
                      {profileData.response_rate || 98}%
                    </div>
                    <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Response Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-title font-bold text-[#FF8D28]`}>
                      {profileData.response_time || '< 1hr'}
                    </div>
                    <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Response Time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {!isOwnProfile && (
              <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    <Zap className="w-5 h-5 text-[#FF8D28]" />
                    Work With This Artist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                    <Palette className="w-4 h-4 mr-2" />
                    Commission Artwork
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Buy Digital Assets
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Portfolio Showcase with Tabs */}
        <Card className={isDashboardDarkMode ? "bg-[#212121] border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <Grid className="w-5 h-5 text-[#FF8D28]" />
              Featured Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="releases" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="releases" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Releases
                </TabsTrigger>
                <TabsTrigger value="assets" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Assets
                </TabsTrigger>
                <TabsTrigger value="talent" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Talent
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Events
                </TabsTrigger>
              </TabsList>

              {/* Releases Tab */}
              <TabsContent value="releases" className="mt-0">
                <div className="flex items-center justify-between mb-6">
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Latest original works and creative releases
                  </p>
                  <Button variant="outline" size="sm" onClick={() => window.open('/dashboard/my-ogs', '_blank')}>
                    View All Releases
                  </Button>
                </div>
                
                {/* Featured Release */}
                <div className="mb-8">
                  <Card className={`relative overflow-hidden ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-gradient-to-br from-[#FF8D28]/10 to-purple-500/10 border-[#FF8D28]/20"}`}>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                          <Badge className="bg-black text-white animate-pulse mb-4">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Latest Release
                          </Badge>
                         <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-[#FF8D28] rounded-full flex items-center justify-center">
                              <Music className="w-4 h-4 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                              Digital Art Collection
                            </span>
                          </div>
                          <h3 className={`font-title text-3xl font-bold mb-4 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                            "Metamorphosis Series"
                          </h3>
                          <p className={`text-lg mb-6 leading-relaxed ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            A groundbreaking collection of 12 digital artworks exploring themes of transformation, 
                            identity, and the intersection of technology with human emotion. Each piece represents 
                            a different stage of creative evolution.
                          </p>
                          
                          <div className="flex items-center gap-6 mb-6">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#FF8D28]" />
                              <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Released March 2024
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-[#FF8D28]" />
                              <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                2.5K Views
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                456 Likes
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                              <Play className="w-4 h-4 mr-2" />
                              View Collection
                            </Button>
                            <Button variant="outline">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#FF8D28] via-purple-500 to-pink-500 p-1">
                            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                              <ImageWithFallback
                                src="https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb"
                                alt="Metamorphosis Series Cover"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#FF8D28] rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-white font-title font-bold text-lg">12</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Previous Releases - Social Media Style */}
                <div>
                  <h4 className={`font-title text-xl mb-6 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    Previous Releases
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Photo Post - Single Image */}
                    <Card className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                      <div className="aspect-square relative overflow-hidden">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1541961017774-22349e4a1262"
                          alt="Abstract Minimalism"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                            <Camera className="w-3 h-3 mr-1" />
                            PHOTO
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-4 right-4">
                            <Button size="sm" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-none">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-title font-bold text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                              "Abstract Minimalism"
                            </h5>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              2 hours ago
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm mb-4 leading-relaxed ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Exploring the beauty of simplicity through geometric forms and negative space. Sometimes less truly is more. What do you see in this composition?
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-red-500" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                87
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-gray-400" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                23
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Share className="w-5 h-5 text-gray-400" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                12
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Video Post */}
                    <Card 
                      className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}
                      onClick={() => handleVideoClick({
                        id: 'creative-process-video',
                        title: 'Creative Process: Digital Painting',
                        description: 'A behind-the-scenes look at my digital painting process, from initial sketch to final masterpiece. This time-lapse captures 6 hours of work condensed into 3 minutes, showing the evolution of my latest piece "Urban Dreams".',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
                        artist: profileData.full_name || 'Artist',
                        timestamp: '1 day ago',
                        likes: 156,
                        comments: 42,
                        shares: 28
                      })}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1561070791-2526d30994b5"
                          alt="Creative Process Video"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-500 text-white text-xs px-2 py-1">
                            <Video className="w-3 h-3 mr-1" />
                            VIDEO
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute center inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button size="sm" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-none">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-black/50 text-white text-xs px-2 py-1 backdrop-blur-sm">
                              3:24
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-title font-bold text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                              "Creative Process: Digital Painting"
                            </h5>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              1 day ago
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm mb-4 leading-relaxed ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Behind-the-scenes of my latest digital painting "Urban Dreams". Watch as empty canvas transforms into a vibrant cityscape through layers of color and light. Full process from sketch to final details.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-red-500" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                156
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-gray-400" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                42
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Share className="w-5 h-5 text-gray-400" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                28
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-[#FF8D28] hover:text-[#FF8D28]/80">
                            <Play className="w-4 h-4 mr-1" />
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Audio Post */}
                    <Card className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`} onClick={handlePlayAudio}>
                      <div className="aspect-square relative overflow-hidden">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
                          alt="Ambient Dreams"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                            <Music className="w-3 h-3 mr-1" />
                            AUDIO
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute center inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button size="sm" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-none">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-black/50 text-white text-xs px-2 py-1 backdrop-blur-sm">
                              3:45
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-title font-bold text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                              "Ambient Dreams"
                            </h5>
                            <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              3 days ago
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm mb-4 leading-relaxed ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          An experimental ambient composition created during late night studio sessions. Layered synths and organic textures create a dreamlike soundscape that perfectly complements visual art.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5 text-red-500" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                124
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-gray-400" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                18
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Share className="w-5 h-5 text-gray-400" />
                              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                9
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-[#FF8D28] hover:text-[#FF8D28]/80">
                            <Play className="w-4 h-4 mr-1" />
                            Listen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Other Tabs */}
              <TabsContent value="assets">
                <div className="text-center py-12">
                  <p className={`text-gray-500 ${isDashboardDarkMode ? "text-gray-400" : ""}`}>Digital assets will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="talent">
                <div className="text-center py-12">
                  <p className={`text-gray-500 ${isDashboardDarkMode ? "text-gray-400" : ""}`}>Talent listings will be displayed here.</p>
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="text-center py-12">
                  <p className={`text-gray-500 ${isDashboardDarkMode ? "text-gray-400" : ""}`}>Events and exhibitions will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Video Expansion Modal */}
      <VideoExpansionModal
        isOpen={expandedVideo !== null}
        onClose={closeVideoModal}
        videoData={selectedVideoData}
        isDarkMode={isDashboardDarkMode}
      />
    </div>
  );
};

