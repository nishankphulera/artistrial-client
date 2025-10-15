import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MessageCircle,
  Calendar,
  TrendingUp,
  Award,
  Heart,
  Share2,
  Eye,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Plus,
  Filter,
  Search,
  Palette,
  Camera,
  Music,
  Video,
  Briefcase,
  BookOpen,
  Zap,
  Globe,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  author_avatar: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  created_at: string;
  featured_image?: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'in-person' | 'hybrid';
  attendees: number;
  max_attendees: number;
  image_url: string;
  organizer: string;
}

interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  specialties: string[];
  reputation_score: number;
  posts_count: number;
  location: string;
  joined_date: string;
  is_verified: boolean;
}

export const CommunityPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    // Mock data for now
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        title: 'Tips for Creating Stunning Digital Art Compositions',
        content: 'Just finished a new series exploring color harmony in digital landscapes. Here are 5 key techniques I\'ve learned that completely transformed my work...',
        author: 'Sarah Chen',
        author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b64c?w=100',
        category: 'Digital Art',
        likes: 127,
        comments: 23,
        views: 1250,
        created_at: '2024-01-15T10:30:00Z',
        featured_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'
      },
      {
        id: '2',
        title: 'Building a Sustainable Creative Practice',
        content: 'After 5 years of freelancing, I want to share what I\'ve learned about creating consistent income streams as an artist. The key is diversification...',
        author: 'Marcus Rivera',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        category: 'Career Advice',
        likes: 89,
        comments: 31,
        views: 890,
        created_at: '2024-01-14T14:20:00Z'
      },
      {
        id: '3',
        title: 'Collaboration Success Story: From Idea to Gallery',
        content: 'Want to share how an amazing collaboration through Artistrial led to my first gallery exhibition. It all started with a simple message...',
        author: 'Emma Thompson',
        author_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        category: 'Collaboration',
        likes: 156,
        comments: 42,
        views: 2100,
        created_at: '2024-01-13T09:15:00Z',
        featured_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'
      }
    ];

    const mockEvents: CommunityEvent[] = [
      {
        id: '1',
        title: 'Digital Art Workshop: Advanced Techniques',
        description: 'Join master digital artist Alex Rivera for an intensive workshop covering advanced composition and lighting techniques.',
        date: '2024-02-15',
        time: '2:00 PM EST',
        location: 'Online via Zoom',
        type: 'online',
        attendees: 45,
        max_attendees: 50,
        image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        organizer: 'Alex Rivera'
      },
      {
        id: '2',
        title: 'Creative Networking Mixer - NYC',
        description: 'Connect with fellow artists, photographers, and creative professionals in the heart of Manhattan.',
        date: '2024-02-18',
        time: '6:00 PM EST',
        location: 'Gallery 23, Brooklyn, NY',
        type: 'in-person',
        attendees: 23,
        max_attendees: 30,
        image_url: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600',
        organizer: 'Gallery 23'
      }
    ];

    const mockMembers: CommunityMember[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        username: '@sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b64c?w=100',
        bio: 'Digital artist specializing in surreal landscapes and color theory. 5+ years experience.',
        specialties: ['Digital Art', 'Color Theory', 'Landscape'],
        reputation_score: 4.9,
        posts_count: 127,
        location: 'San Francisco, CA',
        joined_date: '2023-03-15',
        is_verified: true
      },
      {
        id: '2',
        name: 'Marcus Rivera',
        username: '@marcusrivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        bio: 'Photographer and visual storyteller. Love capturing authentic moments and emotions.',
        specialties: ['Photography', 'Storytelling', 'Portraiture'],
        reputation_score: 4.8,
        posts_count: 89,
        location: 'Los Angeles, CA',
        joined_date: '2023-01-20',
        is_verified: true
      },
      {
        id: '3',
        name: 'Emma Thompson',
        username: '@emmathompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        bio: 'Multimedia artist exploring the intersection of technology and traditional art forms.',
        specialties: ['Multimedia', 'Installation', 'Technology'],
        reputation_score: 4.7,
        posts_count: 156,
        location: 'New York, NY',
        joined_date: '2022-11-10',
        is_verified: false
      }
    ];

    setPosts(mockPosts);
    setEvents(mockEvents);
    setMembers(mockMembers);
    setLoading(false);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            🌟 Join the Creative Revolution
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-title leading-tight">
            Welcome to the
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Artistrial Community
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto mb-8 leading-relaxed">
            Connect with 50,000+ passionate creators, share your journey, collaborate on groundbreaking projects, 
            and turn your creative dreams into reality together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Post
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                onClick={() => router.push('/auth')}
              >
                Join Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Explore Events
            </Button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">50K+</div>
              <p className="text-purple-200">Active Creators</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">125K+</div>
              <p className="text-purple-200">Posts Shared</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">15K+</div>
              <p className="text-purple-200">Collaborations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">2.8K+</div>
              <p className="text-purple-200">Events Hosted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-4 lg:grid-cols-4 h-12">
                <TabsTrigger value="feed" className="flex items-center gap-2 px-6">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Feed</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2 px-6">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2 px-6">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Members</span>
                </TabsTrigger>
                <TabsTrigger value="showcase" className="flex items-center gap-2 px-6">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Showcase</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search community..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Community Feed */}
            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden">
                            <ImageWithFallback
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author_avatar} alt={post.author} />
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold font-title">{post.author}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{timeAgo(post.created_at)}</span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {post.category}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold mb-3 font-title hover:text-purple-600 cursor-pointer transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-6 leading-relaxed">{post.content}</p>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
                                <Heart className="h-4 w-4" />
                                {post.likes}
                              </button>
                              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                {post.comments}
                              </button>
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                {post.views.toLocaleString()}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold font-title">Quick Actions</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        Host Event
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Find Collaborators
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Trending Topics */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold font-title">Trending Topics</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Digital Art Techniques',
                          'Portfolio Reviews', 
                          'Creative Collaborations',
                          'Art Challenges',
                          'Career Growth'
                        ].map((topic) => (
                          <div key={topic} className="flex items-center justify-between group cursor-pointer">
                            <span className="text-sm hover:text-purple-600 transition-colors">{topic}</span>
                            <TrendingUp className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge 
                          variant={event.type === 'online' ? 'secondary' : event.type === 'in-person' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {event.type === 'online' ? 'Online' : event.type === 'in-person' ? 'In Person' : 'Hybrid'}
                        </Badge>
                        <span className="text-sm text-gray-600">{formatEventDate(event.date)}</span>
                      </div>

                      <h3 className="font-semibold mb-2 font-title hover:text-purple-600 cursor-pointer transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {event.attendees}/{event.max_attendees} attending
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        Join Event
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-lg">{member.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="font-semibold font-title">{member.name}</h3>
                        {member.is_verified && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-2">{member.username}</p>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>

                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {member.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          {member.reputation_score}
                        </div>
                        <div>{member.posts_count} posts</div>
                      </div>

                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Showcase Tab */}
            <TabsContent value="showcase" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { type: 'Digital Art', color: 'from-purple-500 to-indigo-600', icon: Palette, count: '2.5K' },
                  { type: 'Photography', color: 'from-blue-500 to-cyan-600', icon: Camera, count: '1.8K' },
                  { type: 'Music', color: 'from-green-500 to-emerald-600', icon: Music, count: '950' },
                  { type: 'Video', color: 'from-red-500 to-pink-600', icon: Video, count: '720' }
                ].map((category) => (
                  <Card key={category.type} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold font-title mb-2 group-hover:text-purple-600 transition-colors">{category.type}</h3>
                      <p className="text-sm text-gray-600 mb-2">{category.count} artworks</p>
                      <Button variant="ghost" size="sm" className="group-hover:bg-purple-50 transition-colors">
                        View Gallery
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

