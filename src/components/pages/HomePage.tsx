import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Palette,
  Play,
  Briefcase,
  Search,
  ShoppingCart,
  Building,
  DollarSign,
  Calendar,
  Scale,
  Package,
  GraduationCap,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiUrl } from '@/utils/api';

interface FeaturedArtwork {
  id: string;
  title: string;
  artist_name: string;
  thumbnail_url: string;
  media_type: string;
  price?: number;
  currency: string;
}

interface FeaturedTalent {
  id: string;
  title: string;
  name: string;
  skills: string[];
  rate: number;
  image_url: string;
  location: string;
  rating: number;
}

interface FeaturedStudio {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  features: string[];
  image_url: string;
  rating: number;
  type: string;
}

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [featuredArtworks, setFeaturedArtworks] = useState<
    FeaturedArtwork[]
  >([]);
  const [featuredTalent, setFeaturedTalent] = useState<
    FeaturedTalent[]
  >([]);
  const [featuredStudios, setFeaturedStudios] = useState<
    FeaturedStudio[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    communityMembers: '50K+',
    projectsCompleted: '25K+',
    revenueGenerated: '$10M+'
  });

  useEffect(() => {
    fetchFeaturedArtworks();
    fetchFeaturedTalent();
    fetchFeaturedStudios();
    fetchPlatformStats();
    seedDemoData();
  }, []);

  const seedDemoData = async () => {
    // Seed demo data is not needed with local server
    // Data is managed directly through the API
    console.log("Using local server API - no seed needed");
  };

  const fetchPlatformStats = async () => {
    try {
      const response = await fetch(
        apiUrl('stats'),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPlatformStats({
            communityMembers: data.data.community_members_formatted || '50K+',
            projectsCompleted: data.data.projects_completed_formatted || '25K+',
            revenueGenerated: data.data.revenue_generated_formatted || '$10M+'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Keep default values if API call fails
    }
  };

  const fetchFeaturedArtworks = async () => {
    try {
      // Try to fetch real artworks from the local server
      try {
        const response = await fetch(
          `${apiUrl('assets')}?limit=6&status=active`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          // Handle both array response and object with data property
          const assets = Array.isArray(data) ? data : (data.data || data.assets || []);
          
          if (assets && assets.length > 0) {
            const featuredArtworks: FeaturedArtwork[] =
              assets.slice(0, 6).map((asset: any) => ({
                id: asset.id?.toString() || asset.id,
                title: asset.title,
                artist_name: asset.artist_name || 'Unknown Artist',
                thumbnail_url: asset.preview_images?.[0] || asset.image_url || '',
                media_type: asset.file_format || asset.category || "image",
                price: parseFloat(asset.price || 0),
                currency: "USD",
              }));
            setFeaturedArtworks(featuredArtworks);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log(
          "Failed to fetch real artworks, using fallback",
          error,
        );
      }

      // No fallback - show empty state if API fails
      setFeaturedArtworks([]);
    } catch (error) {
      console.error("Error fetching featured artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedTalent = async () => {
    try {
      // Try to fetch real talent from the local server
      try {
        const response = await fetch(
          `${apiUrl('talents')}?limit=3&status=active`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          // Handle both array response and object with data property
          const talents = Array.isArray(data) ? data : (data.data || data.talent || []);
          
          if (talents && talents.length > 0) {
            const featuredTalent: FeaturedTalent[] =
              talents.slice(0, 3).map((talent: any) => ({
                id: talent.id?.toString() || talent.id,
                title: talent.title,
                name: talent.title || 'Talent',
                skills: talent.skills || [],
                rate: parseFloat(talent.hourly_rate || talent.rate || 0),
                image_url: talent.avatar_url || talent.image_url || '',
                location: talent.location || '',
                rating: parseFloat(talent.rating || talent.average_rating || 4.5),
              }));
            setFeaturedTalent(featuredTalent);
            return;
          }
        }
      } catch (error) {
        console.log(
          "Failed to fetch real talent, using fallback",
        );
      }

      // No fallback - show empty state if API fails
      setFeaturedTalent([]);
    } catch (error) {
      console.error("Error fetching featured talent:", error);
    }
  };

  const fetchFeaturedStudios = async () => {
    try {
      // Try to fetch real studios from the local server
      try {
        const response = await fetch(
          `${apiUrl('studios')}?limit=3`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          // Handle both array response and object with studios property
          const studios = Array.isArray(data) ? data : (data.studios || data.data || []);
          
          if (studios && studios.length > 0) {
            const featuredStudios: FeaturedStudio[] =
              studios.slice(0, 3).map((studio: any) => ({
                id: studio.id?.toString() || studio.id,
                name: studio.name,
                location: studio.location || studio.address || '',
                price_per_hour: parseFloat(studio.hourly_rate || studio.price_per_hour || 0),
                features: studio.features || studio.amenities || [],
                image_url: studio.image_url || studio.images?.[0] || '',
                rating: parseFloat(studio.rating || studio.average_rating || 4.5),
                type: studio.studio_type || studio.type || 'Studio',
              }));
            setFeaturedStudios(featuredStudios);
            return;
          }
        }
      } catch (error) {
        console.log(
          "Failed to fetch real studios, using fallback",
          error,
        );
      }

      // No fallback - show empty state if API fails
      setFeaturedStudios([]);
    } catch (error) {
      console.error("Error fetching featured studios:", error);
    }
  };

  const modules = [
    {
      name: "Find Talent",
      description: "Hire creative professionals",
      icon: Search,
      route: "/marketplace/talent",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      name: "Buy/Sell Assets",
      description: "Trade digital artwork & assets",
      icon: ShoppingCart,
      route: "/marketplace",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      name: "Book Studios",
      description: "Rent creative workspaces",
      icon: Building,
      route: "/marketplace/studios",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "Find Investors",
      description: "Connect with funding sources",
      icon: DollarSign,
      route: "/marketplace/investors",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      name: "Event Tickets",
      description: "Discover creative events",
      icon: Calendar,
      route: "/marketplace/tickets",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      name: "Legal Services",
      description: "Get professional legal help",
      icon: Scale,
      route: "/marketplace/legal",
      color: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
    {
      name: "Product Services",
      description: "Creative business solutions",
      icon: Package,
      route: "/marketplace/products",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      name: "Education",
      description: "Learn new creative skills",
      icon: GraduationCap,
      route: "/education",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  🎨 One-Stop Creative Ecosystem
                </Badge>

                <h1 className="lg:text-6xl bg-[#171717] bg-clip-text text-transparent leading-tight font-title text-[64px] font-black">
                  Where Creative Dreams Meet Reality
                </h1>

                <p className="text-xl text-gray-600 max-w-lg">
                  Connect, collaborate, and monetize your
                  creativity. From finding talent to booking
                  studios, from legal support to investor
                  connections - everything you need in one
                  platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="group"
                  onClick={() => router.push("/marketplace")}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group"
                  onClick={()=>{
                    localStorage.clear();
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Clear storage
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 font-title">
                    {platformStats.communityMembers}
                  </div>
                  <div className="text-sm text-gray-600">
                    Community Members
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 font-title">
                    {platformStats.projectsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 font-title">
                    {platformStats.revenueGenerated}
                  </div>
                  <div className="text-sm text-gray-600">
                    Revenue Generated
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1651748791079-89eb11100906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydGlzdCUyMG11c2ljJTIwc3R1ZGlvfGVufDF8fHx8MTc1Njg4MzM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Creative artists working in studio"
                  className="w-full h-[500px] object-cover"
                />

                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      1.2K Online
                    </div>
                    <div className="text-xs text-gray-500">
                      Artists Active
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      350 Gigs
                    </div>
                    <div className="text-xs text-gray-500">
                      Available Today
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-8 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Palette className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      $2.5M
                    </div>
                    <div className="text-xs text-gray-500">
                      Monthly Revenue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Modules Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-title">
              Explore Our Ecosystem
            </h2>
            <p className="text-base text-gray-600">
              Discover all the tools and services available to
              grow your creative career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100"
                onClick={() => router.push(module.route)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 ${module.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <module.icon
                      className={`w-7 h-7 ${module.iconColor}`}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-title group-hover:text-purple-600 transition-colors">
                    {module.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-center text-purple-600 group-hover:text-purple-700 transition-colors">
                    <span className="text-sm font-medium">
                      Explore
                    </span>
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-title">
              What You Can Do Here
            </h2>
            <p className="text-lg text-gray-600">
              Three powerful ways to grow your creative career
            </p>
          </div>

          {/* Simple Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "Create & Showcase",
                description:
                  "Upload and sell your digital artwork",
                color: "from-purple-500 to-indigo-600",
              },
              {
                icon: Users,
                title: "Collaborate & Connect",
                description:
                  "Find partners for creative projects",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: TrendingUp,
                title: "Grow & Monetize",
                description:
                  "Access funding and professional services",
                color: "from-green-500 to-emerald-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-title">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artistrial Community Highlight Section */}
      <section className="relative py-24 bg-[#171717] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 w-fit">
                  🌟 Community-Powered Innovation
                </Badge>
                
                <h2 className="text-4xl lg:text-6xl font-bold leading-tight font-title">
                  Join the Creative
                  <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                    Revolution
                  </span>
                </h2>
                
                <p className="text-xl text-white leading-relaxed max-w-lg">
                  Connect with 50,000+ passionate creators worldwide. Share your journey, collaborate on groundbreaking projects, get expert feedback, and turn your creative dreams into reality together.
                </p>
              </div>

              {/* Community Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold font-title">Global Network</h4>
                    <p className="text-white text-sm">Connect with creators from 150+ countries</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold font-title">Real Collaborations</h4>
                    <p className="text-white text-sm">15,000+ successful project partnerships</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold font-title">Weekly Events</h4>
                    <p className="text-white text-sm">Workshops, challenges, and networking sessions</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4"
                  onClick={() => router.push("/community")}
                >
                  Explore Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-black hover:bg-gray-200 font-semibold px-8 py-4"
                  onClick={() => router.push("/community")}
                >
                  Join Discussions
                  <Users className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white font-title">50K+</div>
                  <p className="text-white text-sm">Active Members</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white font-title">125K+</div>
                  <p className="text-white text-sm">Posts Shared</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white font-title">2.8K+</div>
                  <p className="text-white text-sm">Events Hosted</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6 rotate-3 hover:rotate-0 transition-transform duration-700">
                {/* Top Row */}
                <div className="space-y-4">
                  <Card className="p-4 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1590099453132-312adcca5d77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGNvbW11bml0eSUyMGFydGlzdHMlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc1NjkxNjA5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Creative collaboration"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <Palette className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">Sarah M.</span>
                        </div>
                        <p className="text-xs text-gray-600">"Found my dream collaboration partner here!"</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Next Event</p>
                          <p className="text-xs text-gray-600">Digital Art Masterclass</p>
                        </div>
                      </div>
                      <p className="text-xs text-green-600 font-medium">Starting in 2 hours</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Row */}
                <div className="space-y-4 mt-8">
                  <Card className="p-4 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Trending</p>
                          <p className="text-xs text-gray-600">#DigitalArtChallenge</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">2.3K participants</p>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div className="bg-blue-600 h-1 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1537861295351-76bb831ece99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMG5ldHdvcmtpbmclMjBldmVudCUyMG1lZXRpbmd8ZW58MXx8fHwxNzU2OTE2MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Creative networking"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-800">Weekly Mixer</span>
                          <span className="text-xs text-purple-600">Join Now</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>234 online</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Floating Action Card */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-0 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">1,247 online now</p>
                    <p className="text-xs text-gray-600">Join the conversation</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Digital Assets Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-title">
                Featured Digital Assets
              </h2>
              <p className="text-lg text-gray-600">
                Discover high-quality digital artwork from
                talented creators
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/marketplace")}
              className="group"
            >
              View All Assets
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArtworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => router.push("/marketplace")}
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={artwork.thumbnail_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 font-title group-hover:text-purple-600 transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    by {artwork.artist_name}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      {artwork.media_type}
                    </Badge>
                    {artwork.price && (
                      <span className="font-semibold text-gray-900">
                        ${artwork.price}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talent Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-title">
                Top Creative Talent
              </h2>
              <p className="text-lg text-gray-600">
                Connect with skilled professionals for your next
                project
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/marketplace/talent")}
              className="group"
            >
              Browse Talent
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTalent.map((talent) => (
              <Card
                key={talent.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/marketplace/talent")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                    <ImageWithFallback
                      src={talent.image_url}
                      alt={talent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-title group-hover:text-purple-600 transition-colors">
                    {talent.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {talent.title}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {talent.skills.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(talent.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {talent.rating}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${talent.rate}/hr
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Studios Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-title">
                Premium Creative Studios
              </h2>
              <p className="text-lg text-gray-600">
                Book professional workspaces for your
                creative projects
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/marketplace/studios")}
              className="group"
            >
              Explore Studios
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStudios.map((studio) => (
              <Card
                key={studio.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => router.push("/marketplace/studios")}
              >
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={studio.image_url}
                    alt={studio.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 font-title group-hover:text-purple-600 transition-colors">
                    {studio.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {studio.location}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {studio.features.slice(0, 3).map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(studio.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {studio.rating}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${studio.price_per_hour}/hr
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

