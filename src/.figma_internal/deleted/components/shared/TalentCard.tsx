import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Star, 
  MapPin, 
  Eye, 
  MessageSquare
} from 'lucide-react';
import { FavoritesButton } from './FavoritesButton';
import { UserProfileLink } from './UserProfileLink';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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
  earnings?: number;
  status?: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  featuredImage?: string;
}

interface TalentCardProps {
  talent: TalentProfile;
  isDashboardDarkMode?: boolean;
  onBookTalent?: (talent: TalentProfile) => void;
  onCardClick?: (talentId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  isDashboardDarkMode = false,
  onBookTalent,
  onCardClick,
  viewMode = 'grid'
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(talent.id);
    } else {
      // Navigate to public talent detail page
      router.push(`/talent/${talent.id}`);
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isDashboardDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-lg' : 'bg-white border-gray-200 hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Featured Image */}
        {talent.featuredImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <ImageWithFallback
              src={talent.featuredImage}
              alt={`${talent.name}'s featured work`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <FavoritesButton 
                itemId={talent.id}
                itemType="talent"
                className="bg-white/90 hover:bg-white"
              />
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12 ring-2 ring-border">
              <AvatarImage src={talent.avatar} alt={talent.name} />
              <AvatarFallback>
                {talent.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <h3 className="font-title font-semibold truncate">{talent.profession}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-1">by {talent.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{talent.location}</span>
              </div>
            </div>
          </div>

          {/* Rating and Availability Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{talent.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({talent.totalReviews || 0} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  talent.availability === "Available"
                    ? "default"
                    : talent.availability === "Busy"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs"
              >
                {talent.availability}
              </Badge>
              {talent.status && (
                <Badge className={`text-xs ${getStatusColor(talent.status)}`}>
                  {talent.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Profession and Experience */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {talent.experience} experience • {talent.totalProjects || 0} projects completed
            </p>
          </div>

          {/* Bio */}
          {talent.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {talent.bio}
            </p>
          )}

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {talent.skills?.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {talent.skills && talent.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{talent.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className={`text-lg font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${talent.hourlyRate}
              </div>
              <div className="text-xs text-muted-foreground">Per Hour</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {talent.responseTime || '< 1h'}
              </div>
              <div className="text-xs text-muted-foreground">Response</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {talent.totalProjects || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Projects
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                if (onBookTalent) onBookTalent(talent);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

