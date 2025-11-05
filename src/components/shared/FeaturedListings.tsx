import React, { useState, useEffect } from 'react';
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
import { useTalentData, TalentProfile } from './data/TalentDataService';


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
  const [featuredListings, setFeaturedListings] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchTalentProfiles } = useTalentData();

  // Fetch featured talent data from API
  useEffect(() => {
    const loadFeaturedTalents = async () => {
      try {
        setLoading(true);
        console.log('Loading featured talents...');
        // Fetch all active talents and take the first 8 as featured
        const talents = await fetchTalentProfiles(
          { 
            sortBy: 'newest' // Get newest talents as featured
          },
          { context: 'public' }
        );
        
        console.log('Fetched talents:', talents);
        // Take first 8 talents as featured listings
        const featured = talents.slice(0, 8);
        console.log('Featured listings:', featured);
        setFeaturedListings(featured);
      } catch (error) {
        console.error('Error loading featured talents:', error);
        // Fallback to empty array if API fails
        setFeaturedListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTalents();
  }, []); // Remove fetchTalentProfiles from dependencies to avoid infinite re-renders

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8D28] mx-auto mb-4"></div>
              <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading featured talents...
              </p>
            </div>
          </div>
        ) : featuredListings.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No featured talents available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

