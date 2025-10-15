import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Star, Wifi, Car, Eye, Camera, Mic, Palette, Building, Film } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { FavoritesButton } from './FavoritesButton';
import { UserProfileLink } from './UserProfileLink';


export interface Studio {
  id: string;
  name: string;
  type: 'Photography' | 'Recording' | 'Art' | 'Video Production' | 'Multi-Purpose';
  location: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  hourlyRate: number;
  dailyRate?: number;
  capacity: number;
  equipment: string[];
  features: string[];
  images: string[];
  availability: 'Available' | 'Booked' | 'Limited';
  rating: number;
  total_reviews?: number;
  description: string;
  owner_id?: string;
  amenities?: string[];
  policies?: string[];
}

export interface StudioCardProps {
  studio: Studio;
  isDashboardDarkMode?: boolean;
  onBook?: (studio: Studio) => void;
  onCardClick?: (studioId: string) => void;
  viewMode?: 'grid' | 'list';
}

export function StudioCard({
  studio,
  isDashboardDarkMode = false,
  onBook,
  onCardClick,
  viewMode = 'grid'
}: StudioCardProps) {

  const getStudioIcon = (type: string) => {
    switch (type) {
      case 'Photography': return <Camera className="h-4 w-4" />;
      case 'Recording': return <Mic className="h-4 w-4" />;
      case 'Art': return <Palette className="h-4 w-4" />;
      case 'Video Production': return <Film className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-50';
      case 'Limited': return 'text-yellow-600 bg-yellow-50';
      case 'Booked': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(studio.id);
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${
      viewMode === 'list' ? 'flex flex-row' : ''
    } ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      
      {/* Image Section */}
      <div 
        className={`${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'} relative cursor-pointer`}
        onClick={handleCardClick}
      >
        <ImageWithFallback
          src={studio.images[0] || '/api/placeholder/400/300'}
          alt={studio.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={getAvailabilityColor(studio.availability)}>
            {studio.availability}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 bg-white/90">
            {getStudioIcon(studio.type)}
            {studio.type}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <FavoritesButton
            entityId={studio.id}
            entityType="studio"
            size="sm"
            variant="outline"
          />
        </div>

        {/* Pricing overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/80 text-white">
            ${studio.hourlyRate}/hr
            {studio.dailyRate && ` • $${studio.dailyRate}/day`}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-4`}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 
              className={`font-semibold mb-1 cursor-pointer hover:text-[#FF8D28] ${
                isDashboardDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              onClick={handleCardClick}
            >
              {studio.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span>{studio.location}</span>
            </div>
            
            {studio.rating && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{studio.rating.toFixed(1)}</span>
                {studio.total_reviews && (
                  <span className="text-gray-500">({studio.total_reviews} reviews)</span>
                )}
              </div>
            )}
          </div>


        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {studio.description}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-500" />
            <span>{studio.capacity} people</span>
          </div>
          
          {studio.amenities?.includes('WiFi') && (
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3 text-gray-500" />
              <span>WiFi</span>
            </div>
          )}
          
          {studio.amenities?.includes('Parking') && (
            <div className="flex items-center gap-1">
              <Car className="h-3 w-3 text-gray-500" />
              <span>Parking</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-500" />
            <span>24/7 Available</span>
          </div>
        </div>

        {/* Equipment/Features Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {studio.equipment.slice(0, 3).map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
          {studio.equipment.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{studio.equipment.length - 3} more
            </Badge>
          )}
        </div>

        {/* Owner Info */}
        {studio.owner_id && (
          <div className="text-sm text-gray-600 mb-3">
            Managed by{' '}
            <UserProfileLink
              userId={studio.owner_id}
              userName="Studio Owner"
              className="text-[#FF8D28] hover:underline"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCardClick}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          {onBook && studio.availability !== 'Booked' && (
            <Button 
              className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
              onClick={() => onBook(studio)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

