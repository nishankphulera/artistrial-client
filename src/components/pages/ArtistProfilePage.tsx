import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Settings, Share, Heart, Eye, Grid, User, MapPin, Star, Camera, 
  Palette, Plus, Check, Edit3, ExternalLink, Award, Users, 
  MessageSquare, Calendar, Instagram, Twitter, Linkedin, 
  Play, Download, BookOpen, Zap, Music, FileText, Image,
  Sparkles, TrendingUp, Clock, ChevronRight, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { useAudioPlayer } from '@/components/providers/AudioPlayerProvider';

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
  const [ogReleases, setOgReleases] = useState<any[]>([]);
  const [portfolioPosts, setPortfolioPosts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [talents, setTalents] = useState<any[]>([]);
  const [followStats, setFollowStats] = useState<any>({ followers_count: 0, following_count: 0 });
  const [reviewStats, setReviewStats] = useState<any>({ total_reviews: 0, average_rating: 0 });

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('access_token');
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch user profile from server
        let userProfileResponse = await fetch(
          `http://localhost:5001/api/users/${targetUserId}`,
          { headers }
        );
        
        // Fetch user's assets
        const assetsResponse = await fetch(
          `http://localhost:5001/api/assets/user/${targetUserId}`,
          { headers }
        );
        
        // Fetch user's talents
        const talentsResponse = await fetch(
          `http://localhost:5001/api/talents/user/${targetUserId}`,
          { headers }
        );
        
        // Fetch user's tickets/events
        const ticketsResponse = await fetch(
          `http://localhost:5001/api/tickets/user/${targetUserId}`,
          { headers }
        );
        
        // Fetch user's original releases (OGs)
        const ogReleasesResponse = await fetch(
          `http://localhost:5001/api/original-releases/user/${targetUserId}`,
          { headers, cache: 'no-store' }
        );
        
        // Fetch user's portfolio posts
        const portfolioPostsResponse = await fetch(
          `http://localhost:5001/api/portfolio-posts/user/${targetUserId}`,
          { headers, cache: 'no-store' }
        );
        
        // Fetch user's reviews
        const reviewsResponse = await fetch(
          `http://localhost:5001/api/user-reviews/user/${targetUserId}`,
          { headers, cache: 'no-store' }
        );
        
        // Fetch review statistics
        const reviewStatsResponse = await fetch(
          `http://localhost:5001/api/user-reviews/user/${targetUserId}/stats`,
          { headers, cache: 'no-store' }
        );
        
        // Fetch follow statistics
        const followStatsResponse = await fetch(
          `http://localhost:5001/api/user-follows/${targetUserId}/stats`,
          { headers, cache: 'no-store' }
        );
        
        let assetsData = [];
        let talentsData = [];
        let ticketsData = [];
        let releasesData = [];
        let postsData = [];
        let reviewsData = [];
        let statsData = { total_reviews: 0, average_rating: 0 };
        let followData = { followers_count: 0, following_count: 0 };
        
        if (assetsResponse.ok) {
          const assetsResult = await assetsResponse.json();
          assetsData = Array.isArray(assetsResult) ? assetsResult : [];
        }
        
        if (talentsResponse.ok) {
          const talentsResult = await talentsResponse.json();
          talentsData = Array.isArray(talentsResult) ? talentsResult : [];
          setTalents(talentsData);
        }
        
        if (ticketsResponse.ok) {
          const ticketsResult = await ticketsResponse.json();
          ticketsData = Array.isArray(ticketsResult.data) ? ticketsResult.data : (Array.isArray(ticketsResult) ? ticketsResult : []);
          setTickets(ticketsData);
        }
        
        if (ogReleasesResponse.ok) {
          const releasesResult = await ogReleasesResponse.json();
          releasesData = Array.isArray(releasesResult) ? releasesResult : [];
        }
        
        if (portfolioPostsResponse.ok) {
          const postsResult = await portfolioPostsResponse.json();
          postsData = Array.isArray(postsResult) ? postsResult : [];
        }
        
        if (reviewsResponse.ok) {
          const reviewsResult = await reviewsResponse.json();
          reviewsData = Array.isArray(reviewsResult) ? reviewsResult : [];
        }
        
        if (reviewStatsResponse.ok) {
          const statsResult = await reviewStatsResponse.json();
          statsData = statsResult;
        }
        
        if (followStatsResponse.ok) {
          const followResult = await followStatsResponse.json();
          followData = followResult;
        }
        
        if (userProfileResponse.ok) {
          const userData = await userProfileResponse.json();
          
          // Format profile data to match expected structure
          const formattedProfile = {
            id: userData.id,
            username: userData.username || userData.email?.split('@')[0] || 'user',
            full_name: userData.display_name || userData.username || 'User',
            bio: userData.bio || '',
            avatar_url: userData.avatar_url || '',
            website: '',
            location: '',
            profile_type: userData.role || 'Artist',
            specialties: [],
            social_links: {},
            stats: {
              artworks: assetsData.length,
              followers: followData.followers_count || 0,
              following: followData.following_count || 0,
              likes: 0
            },
            followers_count: followData.followers_count || 0,
            following_count: followData.following_count || 0,
            overall_rating: statsData.average_rating || 0,
            total_reviews: statsData.total_reviews || 0,
            response_rate: 100,
            response_time: '< 2 hours'
          };
          
          const formattedListings = {
            artworks: assetsData.map((asset: any) => ({
              id: asset.id,
              title: asset.title,
              description: asset.description,
              price: parseFloat(asset.price) || 0,
              category: asset.category,
              tags: asset.tags || [],
              preview_images: asset.preview_images || [],
              created_at: asset.created_at,
              status: asset.status
            })),
            talents: talentsData.map((talent: any) => ({
              id: talent.id,
              title: talent.title,
              description: talent.description,
              hourly_rate: parseFloat(talent.hourly_rate) || 0,
              skills: talent.skills || [],
              portfolio_urls: talent.portfolio_urls || [],
              created_at: talent.created_at,
              status: talent.status
            }))
          };
          
          const response = {
            ok: true,
            json: () => Promise.resolve({
              profile: formattedProfile,
              listings: formattedListings,
              reviews: []
            })
          };

          const data = await response.json();
          setProfileData(data.profile);
          setListings(data.listings || {});
          setReviews(reviewsData);
          
          // Set OG releases
          const transformedReleases = releasesData.map((release: any) => ({
            id: release.id.toString(),
            title: release.title,
            type: release.type,
            description: release.description || '',
            coverImage: release.cover_image || '',
            releaseDate: release.release_date || release.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            status: release.status,
            pieceCount: release.piece_count,
            category: release.category || '',
            tags: Array.isArray(release.tags) ? release.tags : [],
            views: release.views || 0,
            likes: release.likes || 0,
            downloads: release.downloads || 0,
            shares: release.shares || 0,
            isPublic: release.is_public || false,
            isFeatured: release.is_featured || false,
            priceRange: release.price_range || undefined,
            collaborators: Array.isArray(release.collaborators) ? release.collaborators : [],
            venues: Array.isArray(release.venues) ? release.venues : [],
            links: typeof release.links === 'string' ? 
              (release.links ? JSON.parse(release.links) : []) : 
              (Array.isArray(release.links) ? release.links : [])
          }));
          setOgReleases(transformedReleases);
          
          // Set portfolio posts
          const transformedPosts = postsData.map((post: any) => ({
            id: post.id.toString(),
            type: post.type,
            title: post.title || '',
            description: post.description || '',
            image: post.image || '',
            images: Array.isArray(post.images) ? post.images : [],
            video_url: post.video_url || '',
            audio_url: post.audio_url || '',
            duration: post.duration || '',
            badge: post.badge || '',
            time: formatTimeAgo(post.created_at),
            stats: {
              likes: post.likes || 0,
              plays: post.plays || 0,
              comments: post.comments || 0,
              shares: post.shares || 0
            },
            count: post.type === 'photo-multiple' && post.images?.length ? `${post.images.length} PHOTOS` : undefined,
            currentTime: post.type === 'audio' ? '1:23' : undefined // This could be calculated from audio player state
          }));
          setPortfolioPosts(transformedPosts);
          
          // Set stats
          setFollowStats(followData);
          setReviewStats(statsData);
        } else if (userProfileResponse.status === 404) {
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
            setOgReleases([]);
            setPortfolioPosts([]);
            setFollowStats({ followers_count: 0, following_count: 0 });
            setReviewStats({ total_reviews: 0, average_rating: 0 });
            
            // Still set OG releases even if profile not found
            const transformedReleases = releasesData.map((release: any) => ({
              id: release.id.toString(),
              title: release.title,
              type: release.type,
              description: release.description || '',
              coverImage: release.cover_image || '',
              releaseDate: release.release_date || release.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              status: release.status,
              pieceCount: release.piece_count,
              category: release.category || '',
              tags: Array.isArray(release.tags) ? release.tags : [],
              views: release.views || 0,
              likes: release.likes || 0,
              downloads: release.downloads || 0,
              shares: release.shares || 0,
              isPublic: release.is_public || false,
              isFeatured: release.is_featured || false,
              priceRange: release.price_range || undefined,
              collaborators: Array.isArray(release.collaborators) ? release.collaborators : [],
              venues: Array.isArray(release.venues) ? release.venues : [],
              links: typeof release.links === 'string' ? 
                (release.links ? JSON.parse(release.links) : []) : 
                (Array.isArray(release.links) ? release.links : [])
            }));
            setOgReleases(transformedReleases);
            
            // Set portfolio posts
            const transformedPosts = postsData.map((post: any) => ({
              id: post.id.toString(),
              type: post.type,
              title: post.title || '',
              description: post.description || '',
              image: post.image || '',
              images: Array.isArray(post.images) ? post.images : [],
              video_url: post.video_url || '',
              audio_url: post.audio_url || '',
              duration: post.duration || '',
              badge: post.badge || '',
              time: formatTimeAgo(post.created_at),
              stats: {
                likes: post.likes || 0,
                plays: post.plays || 0,
                comments: post.comments || 0,
                shares: post.shares || 0
              },
              count: post.type === 'photo-multiple' && post.images?.length ? `${post.images.length} PHOTOS` : undefined,
              currentTime: post.type === 'audio' ? '1:23' : undefined
            }));
            setPortfolioPosts(transformedPosts);
            
            // Set stats
            setFollowStats(followData);
            setReviewStats(statsData);
          } else {
            setProfileData(null);
            setOgReleases([]);
            setPortfolioPosts([]);
            setFollowStats({ followers_count: 0, following_count: 0 });
            setReviewStats({ total_reviews: 0, average_rating: 0 });
          }
        } else {
          console.error('Error response:', userProfileResponse.status);
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

  // Use real artworks from assets API instead of mock data
  const artworks = (listings?.artworks || []).map((asset: any) => ({
    id: asset.id,
    title: asset.title || 'Untitled',
    image: asset.preview_images?.[0] || asset.avatar_url || '',
    price: `$${parseFloat(asset.price || 0).toFixed(0)}`,
    likes: 0, // Could be calculated from likes table if exists
    category: asset.category || 'Digital Art'
  }));

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
                      {artworks.reduce((sum: number, art: any) => sum + art.likes, 0)}
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
                
                {/* Featured Release - Show latest release from API */}
                {ogReleases.length > 0 && ogReleases[0] && (() => {
                  const latestRelease = ogReleases[0];
                  const releaseDate = latestRelease.releaseDate ? new Date(latestRelease.releaseDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
                  
                  return (
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
                                  {latestRelease.category || 'Creative Release'}
                                </span>
                              </div>
                              <h3 className={`font-title text-3xl font-bold mb-4 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                "{latestRelease.title}"
                              </h3>
                              <p className={`text-lg mb-6 leading-relaxed ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {latestRelease.description || 'No description available.'}
                              </p>
                              
                              <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-[#FF8D28]" />
                                  <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    Released {releaseDate}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-[#FF8D28]" />
                                  <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {latestRelease.views.toLocaleString()} Views
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {latestRelease.likes} Likes
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white" onClick={() => window.open('/dashboard/my-ogs', '_blank')}>
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
                                    src={latestRelease.coverImage || "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb"}
                                    alt={`${latestRelease.title} Cover`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                              </div>
                              {latestRelease.pieceCount && (
                                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#FF8D28] rounded-full flex items-center justify-center shadow-xl">
                                  <span className="text-white font-title font-bold text-lg">{latestRelease.pieceCount}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
                
                {/* Empty State */}
                {ogReleases.length === 0 && (
                  <div className="text-center py-12">
                    <Star className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      No releases yet
                    </h3>
                    <p className={`mb-4 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Share your creative journey by publishing your first original work.
                    </p>
                    {isOwnProfile && (
                      <Button 
                        className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                        onClick={() => window.open('/dashboard/my-ogs', '_blank')}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Release
                      </Button>
                    )}
                  </div>
                )}

                {/* Previous Releases - Use portfolio posts from API */}
                {portfolioPosts.length > 0 && (
                  <div>
                    <h4 className={`font-title text-xl mb-6 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      Portfolio Posts
                    </h4>
                    {(() => {
                      // Arrange posts (using same logic as before but with real data)
                      const videoPosts = portfolioPosts.filter((post: any) => post.type === 'video');
                      const otherPosts = portfolioPosts.filter((post: any) => post.type !== 'video');
                      const totalOtherPosts = otherPosts.length;
                      
                      let arrangedPosts: any[] = [];
                      
                      if (totalOtherPosts % 2 === 1) {
                        arrangedPosts = [
                          ...otherPosts.slice(0, 2),
                          ...videoPosts,
                          ...otherPosts.slice(2)
                        ];
                      } else {
                        arrangedPosts = [
                          ...videoPosts,
                          ...otherPosts
                        ];
                      }

                      // Render the arranged posts
                      const renderPost = (post: any, index: number) => {
                        if (post.type === 'video') {
                          return (
                            <Card key={post.id} className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"} col-span-full`}>
                              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                <ImageWithFallback
                                  src={post.image || post.video_url || ''}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                                  </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-black/70 text-white">{post.badge || 'Video'}</Badge>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                  <Badge variant="secondary" className="bg-black/70 text-white">{post.duration || ''}</Badge>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h4 className={`font-title font-bold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {post.title}
                                </h4>
                                <p className={`text-sm mb-3 line-clamp-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {post.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className={isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}>{post.time}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {post.stats.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Play className="w-4 h-4" />
                                      {post.stats.plays > 0 ? (post.stats.plays > 1000 ? `${(post.stats.plays / 1000).toFixed(1)}K` : post.stats.plays.toString()) : '0'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      {post.stats.comments}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Share className="w-4 h-4" />
                                      {post.stats.shares}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        } else if (post.type === 'photo-single') {
                          return (
                            <Card key={post.id} className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                <ImageWithFallback
                                  src={post.image || ''}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-black/70 text-white">{post.badge || 'Photo'}</Badge>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h4 className={`font-title font-bold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {post.title}
                                </h4>
                                <p className={`text-sm mb-3 line-clamp-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {post.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className={isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}>{post.time}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {post.stats.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      {post.stats.comments}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Share className="w-4 h-4" />
                                      {post.stats.shares}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        } else if (post.type === 'photo-multiple') {
                          return (
                            <Card key={post.id} className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"} col-span-full`}>
                              <div className="grid grid-cols-2 gap-1 p-1 rounded-t-lg bg-gray-100">
                                {post.images.slice(0, 4).map((img: string, idx: number) => (
                                  <div key={idx} className="aspect-square relative overflow-hidden">
                                    <ImageWithFallback
                                      src={img}
                                      alt={`${post.title} ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className="bg-black/70 text-white">{post.badge || 'Photo Series'}</Badge>
                                  {post.count && <Badge variant="secondary">{post.count}</Badge>}
                                </div>
                                <h4 className={`font-title font-bold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {post.title}
                                </h4>
                                <p className={`text-sm mb-3 line-clamp-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {post.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className={isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}>{post.time}</span>
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {post.stats.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      {post.stats.comments}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Share className="w-4 h-4" />
                                      {post.stats.shares}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        } else if (post.type === 'audio') {
                          return (
                            <Card key={post.id} className={`group cursor-pointer transition-all hover:shadow-xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF8D28] to-purple-500 rounded-lg flex items-center justify-center">
                                    <Music className="w-8 h-8 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className={`font-title font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                        {post.title}
                                      </h4>
                                      <Badge variant="secondary">{post.badge || post.duration}</Badge>
                                    </div>
                                    <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      {post.time}
                                    </p>
                                  </div>
                                </div>
                                <p className={`text-sm mb-3 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {post.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {post.stats.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Play className="w-4 h-4" />
                                      {post.stats.plays > 0 ? (post.stats.plays > 1000 ? `${(post.stats.plays / 1000).toFixed(1)}K` : post.stats.plays.toString()) : '0'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      {post.stats.comments}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        }
                        return null;
                      };

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {arrangedPosts.map((post, index) => renderPost(post, index))}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {/* Empty State for Portfolio Posts */}
                {portfolioPosts.length === 0 && (
                  <div className="text-center py-12">
                    <Camera className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      No portfolio posts yet
                    </h3>
                    <p className={`mb-4 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Share your creative process and behind-the-scenes content.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Assets Tab */}
              <TabsContent value="assets" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Digital artworks and design resources
                  </p>
                  <Button variant="outline" size="sm">
                    View All ({artworks.length})
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artworks.map((artwork: any) => (
                    <div key={artwork.id} className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      <ImageWithFallback
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="font-title text-white font-bold mb-1">{artwork.title}</h4>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-[#FF8D28] text-white">{artwork.category}</Badge>
                            <div className="flex items-center gap-3 text-white text-sm">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {artwork.likes}
                              </div>
                              <span className="font-bold">{artwork.price}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button size="sm" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State for Assets */}
                {artworks.length === 0 && (
                  <div className="text-center py-12">
                    <Palette className={`w-16 h-16 mx-auto mb-4 ${
                      isDashboardDarkMode ? "text-gray-600" : "text-gray-400"
                    }`} />
                    <h3 className={`font-title text-lg mb-2 ${
                      isDashboardDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      No Assets Yet
                    </h3>
                    <p className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>
                      {isOwnProfile 
                        ? "Start building your portfolio by uploading your first digital asset."
                        : "This artist hasn't uploaded any digital assets yet."
                      }
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4 bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload First Asset
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Talent Tab */}
              <TabsContent value="talent" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom services and commission work
                  </p>
                  <Button variant="outline" size="sm">
                    View All Services ({talents.length})
                  </Button>
                </div>
                
                {talents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {talents.map((talent: any) => (
                      <Card key={talent.id} className={isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#FF8D28]/20 rounded-lg flex items-center justify-center">
                              <Palette className="w-6 h-6 text-[#FF8D28]" />
                            </div>
                            <div>
                              <h4 className={`font-title font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                {talent.title}
                              </h4>
                              <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {talent.pricing_type === 'hourly' && talent.hourly_rate
                                  ? `Starting at $${parseFloat(talent.hourly_rate).toFixed(0)}/hr`
                                  : talent.pricing_type === 'fixed' && talent.fixed_price
                                  ? `Starting at $${parseFloat(talent.fixed_price).toFixed(0)}/project`
                                  : talent.hourly_rate && talent.fixed_price
                                  ? `From $${parseFloat(talent.hourly_rate).toFixed(0)}/hr or $${parseFloat(talent.fixed_price).toFixed(0)}/project`
                                  : 'Price on request'}
                              </p>
                            </div>
                          </div>
                          <p className={`text-sm mb-4 ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {talent.description || 'No description available.'}
                          </p>
                          {talent.skills && talent.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {talent.skills.slice(0, 5).map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          )}
                          <Button className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white" size="sm">
                            Request Quote
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <h3 className={`font-title text-lg mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      No Talent Services Yet
                    </h3>
                    <p className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>
                      {isOwnProfile 
                        ? "Add your services to showcase your talents to potential clients."
                        : "This artist hasn't created any talent services yet."
                      }
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4 bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Service
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Workshops, exhibitions, and creative events
                  </p>
                  <Button variant="outline" size="sm">
                    View All Events ({tickets.length})
                  </Button>
                </div>
                
                {tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket: any) => {
                      const eventDate = ticket.event_date ? new Date(ticket.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
                      const eventTime = ticket.event_time || '';
                      const location = ticket.is_online ? 'Online Event' : (ticket.venue || `${ticket.city || ''}${ticket.state ? ', ' + ticket.state : ''}${ticket.country ? ', ' + ticket.country : ''}`).trim();
                      const minPrice = ticket.ticket_types && ticket.ticket_types.length > 0 
                        ? Math.min(...ticket.ticket_types.map((tt: any) => parseFloat(tt.price || 0)))
                        : parseFloat(ticket.price || 0);
                      const totalCapacity = ticket.total_capacity || 0;
                      const ticketsSold = ticket.sales_count || 0;
                      const ticketsAvailable = totalCapacity - ticketsSold;
                      const isUpcoming = ticket.event_date ? new Date(ticket.event_date) > new Date() : false;
                      
                      return (
                        <Card key={ticket.id} className={isDashboardDarkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#FF8D28] to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`font-title font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                    {ticket.title}
                                  </h4>
                                  <Badge className={isUpcoming ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                                    {isUpcoming ? 'Upcoming' : 'Past Event'}
                                  </Badge>
                                </div>
                                <p className={`text-sm mb-2 ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {ticket.description || 'No description available.'}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                  {eventDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {eventDate} {eventTime && `at ${eventTime}`}
                                    </div>
                                  )}
                                  {location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {location}
                                    </div>
                                  )}
                                  {ticketsAvailable > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {ticketsAvailable} spots available
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className={`font-bold text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                    {minPrice > 0 ? `From $${minPrice.toFixed(0)}` : 'Free'}
                                  </span>
                                  {isUpcoming && (
                                    <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white" size="sm">
                                      Reserve Spot
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                    <h3 className={`font-title text-lg mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      No Events Yet
                    </h3>
                    <p className={isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}>
                      {isOwnProfile 
                        ? "Create workshops, exhibitions, or other creative events to engage with your audience."
                        : "This artist hasn't created any events yet."
                      }
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4 bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Event
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

