import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Eye, 
  MessageSquare
} from 'lucide-react';
import { FavoritesButton } from './FavoritesButton';
import { UserProfileLink } from './UserProfileLink';
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
  earnings?: number;
  status?: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  featuredImage?: string;
  userId?: string;
  user_id?: number | string; // Support both formats from API
}

interface TalentCardProps {
  talent: TalentProfile;
  isDashboardDarkMode?: boolean;
  onBookTalent?: (talent: TalentProfile) => void;
  onCardClick?: (talentId: string) => void;
  viewMode?: 'grid' | 'list';
  hideContactButton?: boolean;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  isDashboardDarkMode = false,
  onBookTalent,
  onCardClick,
  viewMode = 'grid',
  hideContactButton = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Check if the current user owns this talent post
  const isOwnPost = React.useMemo(() => {
    if (!user || !user.id) return false;
    
    // Normalize user ID to string for comparison
    const currentUserId = String(user.id);
    
    // Check both userId (string) and user_id (number/string) from talent object
    const talentUserId = talent.userId 
      ? String(talent.userId) 
      : talent.user_id 
        ? String(talent.user_id) 
        : null;
    
    return talentUserId === currentUserId;
  }, [user, talent]);

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

  const handleCardClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (onCardClick) {
      onCardClick(talent.id);
      return;
    }
    
    // Navigate to user profile page if userId is available
    const targetUserId = talent.userId || talent.id;
    
    if (targetUserId) {
      try {
        const profilePath = `/profile/${targetUserId}`;
        console.log('Navigating to profile:', profilePath, 'talent:', talent);
        router.push(profilePath);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.warn('No userId or id available for talent:', talent);
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // Redirect to auth page if not logged in
      router.push('/auth?redirect=' + encodeURIComponent(pathname || '/marketplace/talent'));
      return;
    }
    if (onBookTalent) {
      onBookTalent(talent);
    } else {
      // Navigate to chat page if userId is available
      if (talent.userId) {
        router.push(`/dashboard/chat?userId=${talent.userId}`);
      } else {
        // Fallback: navigate to general chat
        router.push(`/dashboard/chat`);
      }
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg cursor-pointer h-full flex flex-col overflow-hidden ${
        isDashboardDarkMode ? 'bg-gray-800 border-gray-700 hover:shadow-lg' : 'bg-white border-gray-200 hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col h-full overflow-hidden">
        {/* Featured Image */}
        {talent.featuredImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
            <ImageWithFallback
              src={talent.featuredImage}
              alt={`${talent.name}'s featured work`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <FavoritesButton
                entityId={talent.id}
                entityType="talent"
              />
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4 flex-shrink-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-border flex-shrink-0">
              <AvatarImage src={talent.avatar} alt={talent.name} />
              <AvatarFallback>
                {talent.name
                  ? talent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="mb-1">
                <h3 className="font-title font-semibold truncate text-sm sm:text-base">{talent.profession}</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">by {talent.name}</p>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{talent.location}</span>
              </div>
            </div>
          </div>

          {/* Rating and Availability Badge */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-1 min-w-0">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{talent.rating}</span>
              <span className="text-xs sm:text-sm text-muted-foreground truncate">
                ({talent.totalReviews || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Badge
                variant={
                  talent.availability === "Available"
                    ? "default"
                    : talent.availability === "Busy"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs px-1.5 sm:px-2 py-0.5"
              >
                {talent.availability}
              </Badge>
              {talent.status && (
                <Badge className={`text-xs px-1.5 sm:px-2 py-0.5 ${getStatusColor(talent.status)}`}>
                  {talent.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Profession and Experience */}
          <div className="mb-3 sm:mb-4 flex-shrink-0">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {talent.experience} experience • {talent.totalProjects || 0} projects
            </p>
          </div>

          {/* Bio */}
          <div className="mb-3 sm:mb-4 flex-shrink-0 min-h-[2.5rem] overflow-hidden">
            {talent.bio && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">
                {talent.bio}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="mb-3 sm:mb-4 flex-shrink-0 min-h-[1.5rem] overflow-hidden">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {talent.skills?.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 sm:px-2 py-0.5 truncate max-w-full">
                  {skill}
                </Badge>
              ))}
              {talent.skills && talent.skills.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5">
                  +{talent.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4 text-center flex-shrink-0">
            <div className="min-w-0">
              <div className={`text-sm sm:text-lg font-semibold truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${talent.hourlyRate}
              </div>
              <div className="text-xs text-muted-foreground truncate">Per Hour</div>
            </div>
            <div className="min-w-0">
              <div className={`text-sm sm:text-lg font-semibold truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {talent.responseTime || '< 1h'}
              </div>
              <div className="text-xs text-muted-foreground truncate">Response</div>
            </div>
            <div className="min-w-0">
              <div className={`text-sm sm:text-lg font-semibold truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {talent.totalProjects || 0}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Projects
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 mt-auto flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className={`${hideContactButton || isOwnPost ? 'w-full' : 'flex-1'} min-w-0 text-xs sm:text-sm`}
              type="button"
              asChild
            >
              <Link 
                href={`/profile/${talent.userId || talent.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('View Profile clicked - navigating to:', `/profile/${talent.userId || talent.id}`, 'talent:', talent);
                }}
                className="flex items-center justify-center gap-1 sm:gap-2"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">View Profile</span>
              </Link>
            </Button>
            {!hideContactButton && !isOwnPost && (
              <Button
                size="sm"
                className="flex-1 min-w-0 bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white text-xs sm:text-sm"
                onClick={handleContact}
              >
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Contact</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

