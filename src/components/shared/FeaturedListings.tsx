import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { TalentCard } from './TalentCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';

interface FeaturedListing {
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
  featuredImage: string;
}

interface FeaturedListingsProps {
  isDashboardDarkMode?: boolean;
  onListingClick?: (listingId: string) => void;
  onViewAll?: () => void;
}

export function FeaturedListings({ 
  isDashboardDarkMode = false,
  onListingClick,
  onViewAll
}: FeaturedListingsProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  // Expanded featured listings data with more items for carousel
  const featuredListings: FeaturedListing[] = [
    {
      id: 'featured-1',
      name: 'Sarah Johnson',
      profession: 'Portrait & Fashion Photographer',
      location: 'Los Angeles, CA',
      rating: 4.9,
      hourlyRate: 75,
      skills: ['Studio Photography', 'Natural Light', 'Retouching', 'Fashion'],
      experience: '8+ years',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Specializing in professional portrait and fashion photography with a focus on capturing authentic moments and creating stunning visual narratives.',
      totalReviews: 127,
      totalProjects: 89,
      responseTime: '2h',
      featuredImage: 'https://images.unsplash.com/photo-1554048612-b6a482b95469?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-2',
      name: 'Marcus Chen',
      profession: 'Brand Designer & Strategist',
      location: 'New York, NY',
      rating: 5.0,
      hourlyRate: 120,
      skills: ['Brand Strategy', 'Visual Identity', 'Print Design', 'Digital'],
      experience: '10+ years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Creating compelling brand identities and strategic design solutions that help businesses stand out in competitive markets.',
      totalReviews: 89,
      totalProjects: 156,
      responseTime: '1h',
      featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-3',
      name: 'Elena Rodriguez',
      profession: 'Wedding & Event Videographer',
      location: 'Miami, FL',
      rating: 4.8,
      hourlyRate: 95,
      skills: ['Cinematic Storytelling', 'Drone Videography', 'Same Day Edit', 'Wedding'],
      experience: '6+ years',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      availability: 'Busy',
      portfolio: [],
      bio: 'Capturing the magic of special moments through cinematic storytelling and creative videography techniques.',
      totalReviews: 203,
      totalProjects: 134,
      responseTime: '3h',
      featuredImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-4',
      name: 'Alex Kim',
      profession: 'Digital Artist & Illustrator',
      location: 'Seattle, WA',
      rating: 4.9,
      hourlyRate: 85,
      skills: ['Character Design', 'Fantasy Art', 'Game Art', 'Digital Painting'],
      experience: '7+ years',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Creating imaginative digital artwork and character designs for games, books, and entertainment media.',
      totalReviews: 156,
      totalProjects: 78,
      responseTime: '4h',
      featuredImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-5',
      name: 'David Thompson',
      profession: 'Motion Graphics Designer',
      location: 'Austin, TX',
      rating: 4.7,
      hourlyRate: 100,
      skills: ['After Effects', '3D Animation', 'Motion Graphics', 'VFX'],
      experience: '9+ years',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Bringing ideas to life through dynamic motion graphics and visual effects for commercials and digital media.',
      totalReviews: 94,
      totalProjects: 67,
      responseTime: '6h',
      featuredImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-6',
      name: 'Maya Patel',
      profession: 'UI/UX Designer',
      location: 'San Francisco, CA',
      rating: 4.8,
      hourlyRate: 110,
      skills: ['User Experience', 'Interface Design', 'Prototyping', 'Research'],
      experience: '6+ years',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Designing intuitive user experiences and beautiful interfaces that solve real-world problems.',
      totalReviews: 132,
      totalProjects: 98,
      responseTime: '2h',
      featuredImage: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-7',
      name: 'James Wilson',
      profession: 'Commercial Photographer',
      location: 'Chicago, IL',
      rating: 4.9,
      hourlyRate: 90,
      skills: ['Product Photography', 'Commercial', 'Lifestyle', 'Architecture'],
      experience: '12+ years',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Professional commercial photographer specializing in product and lifestyle photography for brands.',
      totalReviews: 189,
      totalProjects: 234,
      responseTime: '1h',
      featuredImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e732c877?w=400&h=300&fit=crop'
    },
    {
      id: 'featured-8',
      name: 'Sophia Lee',
      profession: 'Creative Writer & Copywriter',
      location: 'Portland, OR',
      rating: 4.6,
      hourlyRate: 65,
      skills: ['Creative Writing', 'Copywriting', 'Content Strategy', 'Brand Voice'],
      experience: '5+ years',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      availability: 'Available',
      portfolio: [],
      bio: 'Crafting compelling stories and persuasive copy that connects brands with their audiences.',
      totalReviews: 76,
      totalProjects: 112,
      responseTime: '3h',
      featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'
    }
  ];

  const handleListingClick = (listingId: string) => {
    if (onListingClick) {
      onListingClick(listingId);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View all featured listings');
    }
  };

  const scrollToPrevious = () => {
    api?.scrollPrev();
  };

  const scrollToNext = () => {
    api?.scrollNext();
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="font-title text-2xl mb-2">Featured Listings</h2>
          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Handpicked exceptional talent showcasing outstanding work
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FF8D28]" />
            <Badge variant="secondary" className="bg-[#FF8D28]/10 text-[#FF8D28] border-[#FF8D28]/20">
              Featured
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToPrevious}
                className={`p-2 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToNext}
                className={`p-2 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAll}
              className="gap-2"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Listings Carousel */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredListings.map((listing) => (
              <CarouselItem key={listing.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <TalentCard
                  talent={listing}
                  isDashboardDarkMode={isDashboardDarkMode}
                  onCardClick={handleListingClick}
                  viewMode="grid"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

