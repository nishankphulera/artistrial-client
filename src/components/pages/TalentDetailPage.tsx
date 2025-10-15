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
  Briefcase,
  Users
} from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';

interface TalentProfile {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
  experience: string;
  avatar: string;
  availability: 'Available' | 'Busy' | 'Booked';
  portfolio: string[];
  bio: string;
  totalReviews: number;
  totalProjects: number;
  responseTime: string;
  featuredImage?: string;
}

interface TalentDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const TalentDetailPage: React.FC<TalentDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadTalentDetails();
  }, [id]);

  const loadTalentDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleTalent: TalentProfile = {
        id: id || 'talent1',
        name: 'Sarah Johnson',
        profession: 'Portrait Photographer',
        location: 'New York, NY',
        rating: 4.9,
        hourlyRate: 85,
        skills: [
          'Portrait Photography',
          'Studio Lighting',
          'Adobe Lightroom',
          'Professional Headshots',
          'Wedding Photography',
          'Event Photography'
        ],
        experience: '8 years',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        availability: 'Available',
        portfolio: [
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=300&fit=crop'
        ],
        bio: 'Professional portrait photographer with 8 years of experience specializing in executive headshots and artistic portraits. I bring creativity and technical expertise to every shoot, ensuring you get stunning results that capture your unique personality and professional image.',
        totalReviews: 23,
        totalProjects: 156,
        responseTime: '2 hours',
        featuredImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=400&fit=crop',
      };

      setTalent(sampleTalent);
    } catch (error) {
      console.error('Error loading talent details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTalent = () => {
    if (!user) {
      alert('Please sign in to book talent');
      return;
    }
    console.log('Booking talent:', talent);
    // Handle booking logic here
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading talent profile...</div>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Talent not found</h2>
          <Button onClick={() => router.push('/talent-marketplace')}>
            Back to Talent Marketplace
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
              onClick={() => router.push('/dashboard/talent-marketplace')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Talent Marketplace
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            {talent.featuredImage && (
              <Card className="overflow-hidden">
                <ImageWithFallback
                  src={talent.featuredImage}
                  alt={`${talent.name}'s featured work`}
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </Card>
            )}

            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">About {talent.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {talent.bio}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {talent.experience}
                    </div>
                    <div className="text-sm text-muted-foreground">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {talent.totalProjects}
                    </div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {talent.totalReviews}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {talent.responseTime}
                    </div>
                    <div className="text-sm text-muted-foreground">Response</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-title text-lg mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {talent.portfolio.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={image}
                        alt={`Portfolio piece ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-border">
                    <AvatarImage src={talent.avatar} alt={talent.name} />
                    <AvatarFallback>
                      {talent.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="font-title text-2xl mb-1">{talent.name}</h1>
                  <p className="text-muted-foreground mb-2">{talent.profession}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{talent.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{talent.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({talent.totalReviews} reviews)
                    </span>
                  </div>

                  <Badge
                    variant={
                      talent.availability === "Available"
                        ? "default"
                        : talent.availability === "Busy"
                        ? "secondary"
                        : "outline"
                    }
                    className="mb-6"
                  >
                    {talent.availability}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Hourly Rate</span>
                    </div>
                    <span className="font-title text-lg text-[#FF8D28]">${talent.hourlyRate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Response Time</span>
                    </div>
                    <span className="font-medium">{talent.responseTime}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handleBookTalent}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact {talent.name}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Hire for Project
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

